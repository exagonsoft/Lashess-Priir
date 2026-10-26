const { createPrivateKey } = require("node:crypto");

const raw = process.env.FIREBASE_PRIVATE_KEY ?? "";

const normalized = raw
  .trim()
  .replace(/^["']|["']$/g, "")
  .replace(/\\r\\n/g, "\n")
  .replace(/\\n/g, "\n")
  .replace(/\r\n/g, "\n")
  .trim();

const result = {
  present: raw.length > 0,
  hasHeader: normalized.startsWith("-----BEGIN PRIVATE KEY-----"),
  hasFooter: normalized.endsWith("-----END PRIVATE KEY-----"),
  containsRealNewlines: normalized.includes("\n"),
  validPEM: false,
};

try {
  createPrivateKey(normalized);
  result.validPEM = true;
} catch {
  // Never print the key or the original error.
}

console.log("Firebase Admin key validation:", result);

if (!result.validPEM) process.exitCode = 1;