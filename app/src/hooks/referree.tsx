import { Address } from "@ton/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const useParamsReferree = () => {
  const params = useParams();
  const [referree, setReferree] = useState<Address | undefined>();

  useEffect(() => {
    if (referree !== null) return;

    let referreeAddress: Address | null = null;
    try {
      referreeAddress = Address.parse(params.ref || "");
      setReferree(referreeAddress);
    } catch (e) {
      // TODO: Do smth
    }
  }, [params]);

  return referree;
};
