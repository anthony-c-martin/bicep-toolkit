#!/usr/bin/env node

import yargs from 'yargs';
import { markdownCommand } from './markdown';
import { buildCommand } from './build';

yargs
  .strict()
  .command(
    'markdown',
    'Generate markdown documentation for bicep files',
    yargs => yargs
      .option('bicep-binary', { type: 'string', desc: 'Path to the bicep binary', })
      .option('bicep-files', { type: 'string', demandOption: true, desc: 'Path or glob string for the bicep file(s)' }),
    args => markdownCommand(args))
    .command(
      'build',
      'Build bicep files',
      yargs => yargs
        .option('bicep-binary', { type: 'string', desc: 'Path to the bicep binary', })
        .option('bicep-files', { type: 'string', demandOption: true, desc: 'Path or glob string for the bicep file(s)' }),
      args => buildCommand(args))
  .help()
  .demandCommand(1)
  .parse();