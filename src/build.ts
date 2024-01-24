#!/usr/bin/env node

import { Bicep } from 'bicep-node';
import os from 'os';
import path from 'path';
import { writeFile } from 'fs/promises';
import { glob } from 'glob';

export async function buildCommand(args: {
  bicepBinary: string | undefined,
  bicepFiles: string
}) {
  const bicepFiles = await glob(args.bicepFiles);

  const bicepPath = args.bicepBinary || await Bicep.install(os.tmpdir());
  const bicep = await Bicep.initialize(bicepPath);

  try {
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
  } finally {
    bicep.dispose();
  }
}