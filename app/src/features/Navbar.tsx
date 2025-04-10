import React from "react";

export const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <label htmlFor="my-drawer" className="pl-2 pt-0">
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 12 12"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <rect fill="#FFF" height="1" width="11" x="0.5" y="5.5" />
            <rect fill="#FFF" height="1" width="11" x="0.5" y="2.5" />
            <rect fill="#FFF" height="1" width="11" x="0.5" y="8.5" />
          </g>
        </svg>
      </label>
      <a className="btn btn-ghost text-xl">BidTon</a>
    </div>
  );
};
