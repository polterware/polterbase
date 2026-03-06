import { homedir } from "node:os";
import { join } from "node:path";

export function getOpsBootstrapPayloadPath(): string {
  const home = homedir();

  if (process.platform === "darwin") {
    return join(
      home,
      "Library",
      "Application Support",
      "ops",
      "bootstrap",
      "supabase.json",
    );
  }

  if (process.platform === "win32") {
    const appData = process.env.APPDATA ?? join(home, "AppData", "Roaming");
    return join(appData, "ops", "bootstrap", "supabase.json");
  }

  return join(home, ".config", "ops", "bootstrap", "supabase.json");
}
