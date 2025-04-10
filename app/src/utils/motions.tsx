import {
  EasingFunction,
  motion,
  MotionValue,
  TransformProperties,
  useTime,
  useTransform,
} from "motion/react";

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

type TransformOptions = {
  ease?: EasingFunction | EasingFunction[];
};

export const periodic_modulus = (
  value: MotionValue,
  duration: number,
  range: [number, number],
  options?: TransformOptions
) => {
  const offset = Math.random();

  const saw = useTransform(value, (value) => {
    return value % duration;
  });

  return useTransform(saw, [0, duration], range, options);
};

export const inverse_periodic_modulus_shifted = (
  value: MotionValue,
  duration: number,
  range: [number, number],
  shift?: number,
  options?: TransformOptions
) => {
  const maxVal = duration * (1 - 1 / (1 + (shift || 9999)));

  const saw = useTransform(value, (value) => {
    return maxVal - (value % duration);
  });

  return useTransform(saw, [0, maxVal], range, options);
};

export const around = (
  t: MotionValue,
  value: number,
  dispersion: number,
  duration: number
) => {
  return periodic(t, duration, [value - dispersion, value + dispersion]);
};
