import * as React from "react";
import { motion, useTime, useTransform } from "motion/react";
import { periodic, perc, blur, around } from "../utils";

export const Background = () => {
  const t = useTime();
  const nonLinT = periodic(t, 1000, [0.3, 7.2]);
  const tw = useTransform(() => t.get() + nonLinT.get());

  return (
    <div className="absolute bg-black w-full h-full z-1 overflow-hidden">
      <motion.div
        className="absolute w-30 h-30 bg-[#F09] rounded-full"
        style={{
          left: perc(around(t, 30, 10, 24000)),
          top: perc(around(tw, 70, 10, 27000)),
          scale: around(tw, 0.8, 0.2, 10000),
          filter: blur(around(tw, 40, 12, 20000)),
        }}
      ></motion.div>
      <motion.div
        // style={{ left: "20%", top: "30%" }}
        className="absolute w-30 h-10 bg-[#F09] blur-2xl rounded-full"
        style={{
          left: perc(around(t, 20, 2, 18000)),
          top: perc(around(tw, 30, 2, 41000)),
          scale: around(tw, 4, 1.3, 13000),
          filter: blur(around(t, 20, 2, 21000)),
        }}
      />
      <motion.div
        className="absolute w-10 h-10 bg-[#F09] blur-2xl rounded-full"
        style={{
          left: perc(around(t, 30, 10, 18000)),
          top: perc(around(tw, 37, 10, 41000)),
          scale: around(tw, 3, 1.3, 13000),
          filter: blur(around(t, 20, 2, 21000)),
        }}
      />
      <div
        className="absolute w-10 h-60 bg-[#F09] blur-2xl"
        style={{ left: "80%", top: "80%" }}
      ></div>
      <div
        className="absolute w-20 h-20 bg-[#F09] blur-2xl"
        style={{ left: "30%", top: "20%" }}
      ></div>
      <motion.div
        className="absolute w-60 h-10 bg-[#F09] blur-2xl"
        style={{
          left: "60%",
          top: "0%",
          scale: around(tw, 1.3, 0.6, 12000),
          filter: blur(around(tw, 40, 6, 7000)),
        }}
      />
    </div>
  );
};
