import { init, useLaunchParams } from "@telegram-apps/sdk-react";
import { config } from "../config.ts";
import { useState } from "react";
import { useEffect } from "react";
import { encrypt } from "../utils/crypto.tsx";

export const redirectToTg = (location: string, name: string) => {
  window.location.replace(
    `tg://resolve?domain=${config.botName}&start=${btoa(
      JSON.stringify({ fwd: location, page: name })
    )}`
  );
};

export const useLaunchParamsSilent = () => {
  try {
    init();
    return useLaunchParams();
  } catch {
    // skip error
  }
};

export const useEncryptedUserId = () => {
  const launchParams = useLaunchParamsSilent();

  const [encryptedUserId, setEncryptedUserId] = useState<Buffer | undefined>();

  useEffect(() => {
    if (!launchParams) return;
    const userId = launchParams.tgWebAppData!.user!.id;
    let hexString = userId.toString(16);
    // NOTE: AES gsm requires message to be multiple of 2 bytes. Thus pad with zero
    if (hexString.length % 2 === 1) {
      hexString = `0${hexString}`;
    }
    const buffer = Buffer.from(hexString, "hex");

    encrypt(buffer).then((result) => {
      setEncryptedUserId(result);
    });
  }, [launchParams]);

  return encryptedUserId;
};
