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
          Your account could not be found. It was either deleted or never
          existed. In any case you'll have to create it. It's as easy as push
          the register button. And then pray.
          <br />
          <br />
          Or you might need to change the wallet (use disconnect button to the
          right in navigation bar).
        </div>
        <div className="px-5 pb-5">
          <RegisterButton referree={referree}></RegisterButton>
        </div>

        {/* <CleanButton></CleanButton> */}
      </div>
    </div>
  );
};
