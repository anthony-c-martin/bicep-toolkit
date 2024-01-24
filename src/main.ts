#!/usr/bin/env node

import { Bicep, GetDeploymentGraphResponse, GetMetadataResponse, ParamDefinition, Range } from 'bicep-node';
import os from 'os';
import path from 'path';
import yargs from 'yargs';
import { writeFile } from 'fs/promises';

async function main() {
  const args = await yargs
    .strict()
    .option('bicep-binary', { type: 'string', desc: 'Path to the bicep binary', })
    .option('bicep-file', { type: 'string', demandOption: true, desc: 'Path to the bicep file' })
    .option('output-file', { type: 'string', desc: 'Path to write the template file to' })
    .parseAsync();

  const bicepFilePath = path.resolve(args.bicepFile);
  const mdFilePath = args.outputFile ? path.resolve(args.outputFile) : bicepFilePath.replace(/\.bicep$/, '.md');

  const bicepPath = args.bicepBinary || await Bicep.install(os.tmpdir());
  const bicep = await Bicep.initialize(bicepPath);

  try {
    const bicepFilePath = path.resolve(args.bicepFile);
    const metadata = await bicep.getMetadata({ path: bicepFilePath });
    const graph = await bicep.getDeploymentGraph({ path: bicepFilePath });
    const markdown = formatMarkdown(metadata, graph, path.basename(bicepFilePath));
  
    await writeFile(mdFilePath, markdown, 'utf-8')
  } finally {
    bicep.dispose();
  }
}

function formatMarkdown(metadata: GetMetadataResponse, graph: GetDeploymentGraphResponse, fileName: string) {
  const description = metadata.metadata.find(x => x.name === 'description')?.value;

  const descriptionSection = description ? `
## Description

${description}

` : '';

  const graphSection = graph.nodes.length > 0 ? `
## Graph

\`\`\`mermaid
flowchart LR;
${graph.nodes.map(x =>
    `    ${x.name}["${x.name} ${x.isExisting ? '(existing)' : ''}
    ${x.type}"]
`).join('')}
${graph.edges.map(x =>
      `    ${x.source}-->${x.target};
`).join('')}
\`\`\`

` : '';

  const parametersSection = metadata.parameters.length > 0 ? `
## Parameters

| Name | Type | Description |
| -- | -- | -- |
${metadata.parameters.map(x => {
    const { name, type, description } = getFormattedRow(x);

    return `| ${name} | ${type} | ${description} |
`;
  }).join('')}

` : '';

  const outputsSection = metadata.outputs.length > 0 ? `
## Outputs

| Name | Type | Description |
| -- | -- | -- |
${metadata.outputs.map(x => {
    const { name, type, description } = getFormattedRow(x);

    return `| ${name} | ${type} | ${description} |
`;
  }).join('')}

` : '';

  return descriptionSection +
    graphSection +
    parametersSection +
    outputsSection;

  function getFormattedRow(param: ParamDefinition) {
    return {
      name: formatCodeLink(param.name, param.range),
      type: param.type ? formatCodeLink(param.type?.name, param.type?.range) : '',
      description: param.description ?? '',
    }
  }

  function formatCodeLink(contents: string, range?: Range) {
    if (!range) {
      return `\`${contents}\``;
    }

    return `[\`${contents}\`](./${fileName}#L${range.start.line + 1}C${range.start.char + 1}-L${range.end.line + 1}C${range.end.char + 1})`;
  }
}

main();