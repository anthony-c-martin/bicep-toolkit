import path from 'path';
import { writeFile } from 'fs/promises';
import { glob } from 'glob';
import { executeWithBicep } from './utils';

export async function buildCommand(args: {
  bicepBinary: string | undefined,
  bicepFiles: string
}) {
  await executeWithBicep(args.bicepBinary, async (bicep) => {
    const bicepFiles = await glob(args.bicepFiles);

    for (const bicepFile of bicepFiles.map(x => path.resolve(x))) {
      console.log(`Building ${bicepFile}`);
      
      if (bicepFile.endsWith('.bicep')) {
        const mdFilePath = bicepFile.replace(/\.bicep$/, '.json');

        const result = await bicep.compile({ path: bicepFile });
        if (result.contents) {
          await writeFile(mdFilePath, result.contents, 'utf-8');
        }
      }

      if (bicepFile.endsWith('.bicepparam')) {
        const mdFilePath = bicepFile.replace(/\.bicepparam$/, '.parameters.json');

        const result = await bicep.compileParams({ path: bicepFile, parameterOverrides: {} });
        if (result.parameters) {
          await writeFile(mdFilePath, result.parameters, 'utf-8');
        }
      }
    }
  });
}