/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncEventHandler = <A extends any[]>(
  eventHandler: (...args: A) => Promise<void>,
): ((...args: A) => void) => {
  return (...args: A) => {
    try {
      eventHandler(...args).catch((error: unknown) => {
        console.error("Async event handler error", error);
      });
    } catch (error) {
      console.error("Async event handler error", error);
    }
  };
};
/* eslint-enable */
