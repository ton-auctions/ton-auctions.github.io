import { encrypt as libEncrypt, ECIES_CONFIG } from "eciesjs";

ECIES_CONFIG.ellipticCurve = "ed25519";

// Move into protocol controller
const PUBLIC_KEY_HEX =
  "1ee50914b36c950f29db8030a74d31bf1704c615080d392480e6f667a0d2444d";

ECIES_CONFIG.symmetricAlgorithm = "aes-256-gcm";

export const encrypt = async (data: Uint8Array) => {
  return libEncrypt(PUBLIC_KEY_HEX, data);
};
