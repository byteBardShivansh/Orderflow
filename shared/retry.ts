export async function retry<T>(
    fn: () => Promise<T>,
    retries: number
  ): Promise<T> {
    let attempt = 0;
  
    while (attempt < retries) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt >= retries) throw err;
      }
    }
  
    throw new Error("Retry failed");
  }  