import { decrypt as libDecrypt, ECIES_CONFIG } from "eciesjs";
import { encodeHex } from "jsr:@std/encoding/hex";

ECIES_CONFIG.ellipticCurve = "ed25519";
ECIES_CONFIG.symmetricAlgorithm = "aes-256-gcm";

export const decrypt = (data: Uint8Array, sk: string) => {
  return libDecrypt(sk, data);
};

export const sha256 = async (input: number | string) => {
  // ADD salt
  const strValue: string = typeof input == "number" ? `${input}` : input;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(strValue)
  );
  return encodeHex(digest);
};
