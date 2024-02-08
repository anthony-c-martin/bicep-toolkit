import os from "os";
import path from "path";
import { mkdtemp } from "fs/promises";
import { Bicep } from "bicep-node";

export async function executeWithBicep<T>(bicepPath: string | undefined, action: (bicep: Bicep) => Promise<T>) {
  if (!bicepPath) {
    const basePath = await mkdtemp(path.join(os.tmpdir(), 'biceptk-'));
    bicepPath = await Bicep.install(basePath);
  }

  const bicep = await Bicep.initialize(bicepPath);
  try {
    return await action(bicep);
  } finally {
    bicep.dispose();
  }
}