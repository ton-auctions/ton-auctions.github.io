import React, { useCallback, useRef } from "react";
import { Link } from "react-router";

export const Drawer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLInputElement>(null);
  const closeDrawer = useCallback(() => {
    if (ref.current) {
      ref.current.checked = !ref.current.checked;
    }
  }, []);

  return (
    <div className="drawer h-full">
      <input
        id="my-drawer"
        ref={ref}
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content h-full">{children}</div>
      <div className="drawer-side z-100">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu min-w-xs bg-base-200 text-base-content min-h-full w-80 p-4">
          <li>
            <Link to={"/app/account/profile"} onClick={closeDrawer}>
              Profile
            </Link>
          </li>
          <li>
            <Link to={"/app/account/auctions"} onClick={closeDrawer}>
              Auctions
            </Link>
          </li>
          <li>
            <Link to={"/app/account/create"} onClick={closeDrawer}>
              Create auction
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
