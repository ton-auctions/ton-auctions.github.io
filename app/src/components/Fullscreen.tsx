import * as React from "react";

export const Fullscreen: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="absolute w-full h-full">
      <div className="flex flex-col grow items-center h-full">{children}</div>
    </div>
  );
};
