import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
const useGrid = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const mobile = useMediaQuery({ maxWidth: 780 });
  const tablet = useMediaQuery({ minWidth: 781, maxWidth: 1023 });
  const desktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    setIsMobile(mobile);
    setIsTablet(tablet);
    setIsDesktop(desktop);
  }, [mobile, tablet, desktop]);

  return { isMobile, isTablet, isDesktop };
};
export { useGrid };
