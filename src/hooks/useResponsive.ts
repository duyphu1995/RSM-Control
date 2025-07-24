import { useState, useEffect } from "react";

interface ResponsiveState {
  isMobile: boolean;
  width: number;
  height: number;
}

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState<ResponsiveState>({
    isMobile: window.innerWidth < 768,
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      // Only update state if isMobile changes
      if (newIsMobile !== dimensions.isMobile) {
        setDimensions({
          isMobile: newIsMobile,
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // Only depend on dimensions.isMobile to avoid unnecessary updates
  }, [dimensions.isMobile]);

  return dimensions;
};
