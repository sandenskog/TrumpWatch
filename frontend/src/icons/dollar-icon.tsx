import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const DollarIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".dollar-sign",
        {
          y: [0, -3, 0],
          scale: [1, 1.15, 1],
        },
        { duration: 0.5, ease: "easeInOut" },
      );
      await animate(
        ".dollar-coin",
        {
          rotate: [0, -10, 10, -5, 0],
        },
        { duration: 0.6, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".dollar-sign, .dollar-coin",
        { y: 0, scale: 1, rotate: 0 },
        { duration: 0.2, ease: "easeInOut" },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        onHoverStart={start}
        onHoverEnd={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
      >
        <motion.circle
          className="dollar-coin"
          cx="12"
          cy="12"
          r="9"
          style={{ transformOrigin: "12px 12px" }}
        />
        <motion.g
          className="dollar-sign"
          style={{ transformOrigin: "12px 12px" }}
        >
          <path d="M12 7v10" />
          <path d="M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5" />
        </motion.g>
      </motion.svg>
    );
  },
);

DollarIcon.displayName = "DollarIcon";
export default DollarIcon;
