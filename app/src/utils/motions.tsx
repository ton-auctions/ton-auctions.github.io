import { motion, MotionValue, useTime, useTransform } from "motion/react";

// import { periodic, perc, blur, around } from "../old/utils/motions";

export const perc = (value) => {
  return useTransform(value, (value) => {
    return `${value}%`;
  });
};

export const blur = (value) => {
  return useTransform(value, (value) => {
    return `blur(${value}px)`;
  });
};

export const periodic = (
  value: MotionValue,
  duration: number,
  range: [number, number]
) => {
  const offset = Math.random();

  const sin = useTransform(value, (value) => {
    return Math.sin((2 * Math.PI * (value + offset * duration)) / duration);
  });

  return useTransform(sin, [-1, 1], range);
};

export const periodic_modulus = (
  value: MotionValue,
  duration: number,
  range: [number, number]
) => {
  const offset = Math.random();

  const sin = useTransform(value, (value) => {
    return Math.sin((value + offset * duration) / duration);
  });

  return useTransform(sin, [-1, 1], range);
};

export const around = (
  t: MotionValue,
  value: number,
  dispersion: number,
  duration: number
) => {
  return periodic(t, duration, [value - dispersion, value + dispersion]);
};
