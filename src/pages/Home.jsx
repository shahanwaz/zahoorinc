import React, { useState, useEffect } from "react";
import WebHome from "./WebHome";
import MobileHome from "./MobileHome";

export default function Home() {
  const [isWeb, setIsWeb] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsWeb(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isWeb ? <WebHome /> : <MobileHome />;
}