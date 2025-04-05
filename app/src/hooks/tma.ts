import { useEffect, useState } from "react";
import { useLoader } from "../features/loader";
import { isTMA as sdkIsTMA } from "@telegram-apps/sdk";

export const useTMA = () => {
  const loader = useLoader();
  const [isTMA, setTMA] = useState<boolean | undefined>(undefined);

  if (isTMA == undefined) {
    loader.show("Initializing");
  }

  useEffect(() => {
    setTMA(sdkIsTMA());
    loader.hide();
  }, []);

  return isTMA;
};
