import React from "react";

import { useParamsReferree } from "../hooks/referree";

import { RegisterButton } from "./RegisterButton";

export const RegistrationPage: React.FC<unknown> = () => {
  const referree = useParamsReferree();

  return (
    <div className="max-h-dvh min-w-xs mx-auto text-gray-100 w-xs">
      <div className="flex flex-none h-25 justify-center"></div>

      <div className="flex flex-col mx-auto list bg-base-100 rounded-box shadow-md w-80">
        <h1 className="p-4 mx-auto">No account found for wallet</h1>
        <div className="divider p-0 m-0 h-0"></div>
        <div className="join p-5 wrap-pretty">
          It might’ve been deleted… or maybe it never existed in the first
          place. Either way, you’ll need to create a new one. Just hit the
          Register button—it’s easy. Then, well… pray.
          <br />
          <br />
          If you think you're in the wrong wallet, try switching it using the
          Disconnect button up in the navigation bar (top right).
        </div>
        <div className="px-5 pb-5">
          <RegisterButton referree={referree}></RegisterButton>
        </div>

        {/* <CleanButton></CleanButton> */}
      </div>
    </div>
  );
};
