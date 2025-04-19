import { useState } from "react";
import { useTonContext } from "../contexts/tonClient";
import { useEffect } from "react";
import {
  PYTH_CONTRACT_ADDRESS_TESTNET,
  PythContract,
} from "@pythnetwork/pyth-ton-js";
import { Address } from "@ton/core";
import { useLoaderContext } from "../contexts/loader";

export const useTonPriceOracle = () => {
  const loader = useLoaderContext();
  const [tonUsdPrice, setTonUsdPrice] = useState<number>(1);
  const ton = useTonContext();

  useEffect(() => {
    loader.show("Loading TON prices.");
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
      })
      .catch(() => {
        // TODO: log
      })
      .finally(() => {
        loader.hide();
      });
  }, [ton]);

  return tonUsdPrice;
};
