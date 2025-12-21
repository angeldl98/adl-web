import fs from "fs";

function readSecret(envKey: string, fileKey: string) {
  const direct = process.env[envKey];
  if (direct && direct.trim()) return direct.trim();
  const filePath = process.env[fileKey];
  if (filePath) {
    try {
      return fs.readFileSync(filePath, "utf8").trim();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function getGatewayConfig() {
  const baseUrl = process.env.GATEWAY_INTERNAL_URL || "http://adl-gateway:4000";
  const apiKey = readSecret("GATEWAY_API_KEY", "GATEWAY_API_KEY_FILE") || "dev-key";
  return { baseUrl, apiKey };
}

