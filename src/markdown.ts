#!/usr/bin/env node

import { Bicep, GetDeploymentGraphResponse, GetMetadataResponse, SymbolDefinition, Range } from 'bicep-node';
import os from 'os';
import path from 'path';
import { writeFile } from 'fs/promises';
import { glob } from 'glob';

export async function markdownCommand(args: {
  bicepBinary: string | undefined,
  bicepFiles: string
}) {
  const bicepFiles = await glob(args.bicepFiles);

  const bicepPath = args.bicepBinary || await Bicep.install(os.tmpdir());
  const bicep = await Bicep.initialize(bicepPath);

  try {
    for (const bicepFile of bicepFiles.map(x => path.resolve(x))) {
      console.log(`Generating markdown for ${bicepFile}`);

      const mdFile = bicepFile.replace(/\.bicep$/, '.md');
  
      const metadata = await bicep.getMetadata({ path: bicepFile });
      const graph = await bicep.getDeploymentGraph({ path: bicepFile });
      const markdown = formatMarkdown(metadata, graph, path.basename(bicepFile));
  
      await writeFile(mdFile, markdown, 'utf-8');
    }
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

  function getFormattedRow(param: SymbolDefinition) {
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