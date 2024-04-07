"use client";

/* eslint-disable */
import type { FC } from "react";
import { useEffect } from "react";

const ErrorHandler: FC = () => {
  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args: readonly any[]): void => {
      if ("string" === typeof args[0] && args[0].includes("defaultProps")) {
        return;
      }

      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
};

export default ErrorHandler;
/* eslint-enable */
