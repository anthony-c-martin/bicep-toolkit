import path from "path";
import { readFile } from "fs/promises";
import { spawnSync } from 'child_process';

const rootPath = path.join(__dirname, "..");

describe("CLI tests", () => {
  it("can be used to construct documentation", async () => {
    const options = {
      '--bicep-files': path.join(__dirname, "files/sample.bicep"),
      ...(process.env.BICEP_CLI_EXECUTABLE ? { '--bicep-binary': process.env.BICEP_CLI_EXECUTABLE } : {}),
    };
    const expectedPath = path.join(__dirname, "files/sample.md");
    const expected = await readFile(expectedPath, 'utf-8');

    const result = spawnSync('npx', [rootPath, 'markdown', ...Object.entries(options).flat()], { encoding: 'utf-8' });
    expect(result.stderr).toEqual('');
    expect(result.status).toEqual(0);

    const actual = await readFile(expectedPath, 'utf-8');
    expect(actual).toEqual(expected);
  }, 60000);

  it("can be used to compile files", async () => {
    const options = {
      '--bicep-files': path.join(__dirname, "files/sample.bicep"),
      ...(process.env.BICEP_CLI_EXECUTABLE ? { '--bicep-binary': process.env.BICEP_CLI_EXECUTABLE } : {}),
    };
    const expectedPath = path.join(__dirname, "files/sample.json");
    const expected = await readFile(expectedPath, 'utf-8');

    const result = spawnSync('npx', [rootPath, 'build', ...Object.entries(options).flat()], { encoding: 'utf-8' });
    expect(result.stderr).toEqual('');
    expect(result.status).toEqual(0);

    const actual = await readFile(expectedPath, 'utf-8');
    expect(replaceMetadata(actual)).toEqual(replaceMetadata(expected));
  }, 60000);
});

function replaceMetadata(template: string) {
  return template
  .replace(/"version": "[^"]+"/, `"version": "REMOVED"`)
  .replace(/"templateHash": "[^"]+"/, `"templateHash": "REMOVED"`);
}
