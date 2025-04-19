export const wrapWithRetry = async <T,>(
  wrapped: () => Promise<T>,
  retryCount?: number,
  timeout?: number
) => {
  // TODO: finish retry logic
  while (true) {
    try {
      return await wrapped();
    } catch {
      // if (e instanceof Error) {

      // }
      // TODO: logging
      await new Promise((resolve) => setTimeout(resolve, timeout || 1000));
    }
  }
};
