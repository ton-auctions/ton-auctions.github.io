import { useTon } from "../contexts/tonClient";
import { useConnection } from "../hooks/ton";
import { useLoader } from "../contexts/loader";
import { useUserAccount } from "../contexts/account";
import { useServiceController } from "../contexts/serviceController";
import { useAlerts } from "../contexts/alerts";
import { useCallback } from "react";
import { toNano } from "@ton/core";
import { loadTest } from "../protocol/tact_Account";
import React from "react";

export const Test = () => {
  const ton = useTon();
  const conn = useConnection();
  const loader = useLoader();
  const account = useUserAccount();
  const controller = useServiceController();
  const alerts = useAlerts();

  const runTest = useCallback(async () => {
    if (!controller.loaded) return;
    if (!account.account) return;

    ton
      .signSendAndWait({
        checkAddress: controller.contract.address,
        checkTransactionFrom: account.account.address,
        checkTimeout: 10000,
        send: async () => {
          await controller.contract.send(
            conn.sender,
            {
              value: toNano("0.05"),
            },
            {
              $$type: "Test",
              address: account.account!.address,
            }
          );
        },
        updateLoader: (text) => loader.show(`Testing. ${text}`),
        testMessage: (cell) => loadTest(cell.asSlice()),
      })
      .catch((e) => {
        alerts.addAlert("Error", `Something went wrong. ${e}.`, 5000);
      })
      .finally(() => {
        loader.hide();
      });
  }, []);

  return (
    <button className="btn btn-primary m-5 mx-auto" onClick={runTest}>
      TEST
    </button>
  );
};
