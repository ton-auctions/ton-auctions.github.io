import { useEffect, useState } from "react";

import { isTMA as sdkIsTMA } from "@telegram-apps/sdk";
import { useLoader } from "../contexts/loader";

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
