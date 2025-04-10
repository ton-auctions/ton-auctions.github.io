import { useState } from "react";
import { useTon } from "../contexts/tonClient";
import { useEffect } from "react";
import {
  PYTH_CONTRACT_ADDRESS_TESTNET,
  PythContract,
} from "@pythnetwork/pyth-ton-js";
import { Address } from "@ton/core";

export const useTonPriceOracle = () => {
  const [tonUsdPrice, setTonUsdPrice] = useState<number | undefined>(undefined);
  const ton = useTon();

  useEffect(() => {
    const contract = ton.cachedOpenContract(
      PythContract.createFromAddress(
        Address.parse(PYTH_CONTRACT_ADDRESS_TESTNET)
      )
    );

    contract
      .getPriceUnsafe(
        "0x8963217838ab4cf5cadc172203c1f0b763fbaa45f346d8ee50ba994bbcac3026"
      )
      .then(({ price }) => {
        setTonUsdPrice(price);
      });
  }, [ton]);

  return tonUsdPrice;
};
