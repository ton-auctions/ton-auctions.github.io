import * as React from "react";
import { useCallback } from "react";
import { easeOut, motion, useTime, useTransform } from "motion/react";
import {
  periodic,
  perc,
  blur,
  around,
  periodic_modulus,
  inverse_periodic_modulus_shifted,
} from "../utils";

type LoaderProps = { hidden: boolean; caption: string };

export const Loader: React.FC<LoaderProps> = ({ hidden, caption }) => {
  const t = useCallback(useTime, [])();

  const pulseDuration = 14000;

  const scale = periodic_modulus(t, pulseDuration, [0, 7], { ease: easeOut });
  const opacity = periodic_modulus(t, pulseDuration, [0.5, 0], {
    ease: easeOut,
  });
  const rotate = useTransform(t, (value) => value / 100);
  const pulse = inverse_periodic_modulus_shifted(
    t,
    pulseDuration,
    [1, 1.05],
    0.025
  );

  return (
    <>
      <div
        hidden={hidden}
        className="flex flex-col items-center h-full w-full overflow-hidden"
      >
        <div className="flex grow"></div>
        <div className="relative flex h-30 w-30 flex-col justify-center items-center z-20 text-center">
          <motion.div
            className="absolute h-full w-full top-0 left-0 border-5 border-red-100 rounded-full opacity-60"
            style={{
              scale,
              opacity,
            }}
          />

          <motion.div
            className="relative h-full w-full top-0 left-0"
            style={{
              rotate,
              scale: pulse,
            }}
          >
            <div className="relative w-1/1 h-1/2 rounded-t-full bg-white">
              <div className="absolute rounded-full w-1/2 h-1/1 bg-white right-0 top-1/2 z-20" />
              <div className="absolute rounded-full w-1/6 h-1/3 bg-black right-1/6 top-5/6 z-20" />
            </div>
            <div className="relative w-1/1 h-1/2 rounded-b-full bg-black">
              <div className="absolute rounded-full w-1/2 h-1/1 bg-black left-0 bottom-1/2 z-20" />
              <div className="absolute rounded-full w-1/6 h-1/3 bg-white left-1/6 bottom-5/6 z-20" />
            </div>
          </motion.div>
        </div>
        <div className="text-gray-100 z-20 p-5">{caption}</div>
        <div className="flex grow"></div>
      </div>
    </>
  );
};

export default Loader;
