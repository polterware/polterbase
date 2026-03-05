import { homedir } from "node:os";
import { join } from "node:path";

export function getUruBootstrapPayloadPath(): string {
  const home = homedir();

  if (process.platform === "darwin") {
    return join(
      home,
      "Library",
      "Application Support",
      "uru",
      "bootstrap",
      "supabase.json",
    );
  }

  if (process.platform === "win32") {
    const appData = process.env.APPDATA ?? join(home, "AppData", "Roaming");
    return join(appData, "uru", "bootstrap", "supabase.json");
  }

  return join(home, ".config", "uru", "bootstrap", "supabase.json");
}
