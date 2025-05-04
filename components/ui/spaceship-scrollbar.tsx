"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export const SpaceshipScrollbar = () => {
  const { scrollYProgress } = useScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  const yProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      setLastScrollY(currentScrollY);
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [lastScrollY]);

  return (
    <>
      <style jsx global>{`
        body::-webkit-scrollbar {
          display: none;
        }
        body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {/* Track */}
      <motion.div className="fixed right-6 top-[10%] bottom-[10%] w-[2px] z-50 dark:bg-[rgba(255,255,255,0.03)] bg-[rgba(0,0,0,0.1)] dark:border-radius-[1px] border-radius-[1px] dark:backdrop-filter-blur-[8px] backdrop-filter-blur-[8px]">
        {/* Progress line */}
        <motion.div
          className="absolute top-0 right-0 w-full"
          style={{
            height: "100%",
            scaleY: yProgress,
            transformOrigin: "top",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        />

        {/* Spaceship */}
        <motion.div
          className="absolute -left-[12px] w-[26px] h-[26px]"
          style={{
            top: useTransform(yProgress, [0, 1], ["0%", "100%"]),
            rotate: scrollDirection === "down" ? 0 : 180,
          }}
        >
          {/* Spaceship body */}
          <motion.div
            className="relative w-full h-full"
            animate={{
              scale: isScrolling ? [1, 1.05, 1] : 1,
              rotate: isScrolling
                ? [0, scrollDirection === "down" ? 5 : -5, 0]
                : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Main body - glass effect */}
            <div className="absolute inset-0 rounded-full dark:bg-gradient-to-br dark:from-white/20 dark:to-white/5 bg-gradient-to-br from-black/20 to-black/5 dark:backdrop-blur-sm backdrop-blur-sm dark:border dark:border-white/10 border border-black/10 shadow-lg" />

            {/* Inner glow */}
            <div className="absolute inset-1 rounded-full dark:bg-gradient-to-br dark:from-white/40 dark:to-transparent bg-gradient-to-br from-black/40 to-transparent blur-[1px]" />

            {/* Center core */}
            <div className="absolute inset-[30%] rounded-full dark:bg-white/80 bg-black/70 blur-[0.5px]" />

            {/* Thruster effects */}
            <motion.div
              className="absolute inset-x-0 -bottom-4"
              animate={
                isScrolling
                  ? {
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1, 0.8],
                    }
                  : { opacity: 0.3, scale: 0.8 }
              }
              transition={{
                duration: 0.5,
                repeat: isScrolling ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              {/* Main thruster */}
              <div className="w-[2px] h-6 mx-auto dark:bg-gradient-to-b dark:from-white dark:to-transparent bg-gradient-to-b from-black to-transparent blur-[2px]" />

              {/* Side thrusters */}
              <div className="absolute top-1 left-[45%] w-[1px] h-4 dark:bg-gradient-to-b dark:from-white/50 dark:to-transparent bg-gradient-to-b from-black/50 to-transparent blur-[1px] rotate-[-15deg]" />
              <div className="absolute top-1 right-[45%] w-[1px] h-4 dark:bg-gradient-to-b dark:from-white/50 dark:to-transparent bg-gradient-to-b from-black/50 to-transparent blur-[1px] rotate-[15deg]" />
            </motion.div>

            {/* Particle effects */}
            {isScrolling && (
              <motion.div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`particle-${Math.random().toString(36).substr(2, 9)}`}
                    className="absolute w-[2px] h-[2px] dark:bg-white/60 bg-black/60 rounded-full blur-[0.5px]"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0.8,
                    }}
                    animate={{
                      x: Math.random() * 40 - 20,
                      y: scrollDirection === "down" ? 20 : -20,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: Math.random() * 0.2,
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};
