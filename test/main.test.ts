import path from "path";
import os from 'os';
import { readFile } from "fs/promises";
import { spawnSync } from 'child_process';

const rootPath = path.join(__dirname, "..");

describe("CLI tests", () => {
  it("can be used to construct documentation", async () => {
    const options = {
      '--bicep-file': path.join(__dirname, "files/sample.bicep"),
      '--output-file': os.tmpdir() + "/sample.md",
      ...(process.env.BICEP_CLI_EXECUTABLE ? { '--bicep-binary': process.env.BICEP_CLI_EXECUTABLE } : {}),
    };

    console.log(options);
    const result = spawnSync('npx', [rootPath, ...Object.entries(options).flat()], { encoding: 'utf-8' });
    expect(result.stderr).toEqual('');
    expect(result.status).toEqual(0);

    const expected = await readFile(path.join(__dirname, "files/sample.md"), 'utf-8');
    const actual = await readFile(options['--output-file'], 'utf-8');
    expect(actual).toEqual(expected);
  });
});

