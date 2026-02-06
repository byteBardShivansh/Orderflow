const flags: Record<string, boolean> = {
    enableNotifications: true,
    enableOrderMetrics: true
  };
  
  export const isEnabled = (flag: string): boolean => {
    return flags[flag] === true;
  };
  
  export const setFlag = (flag: string, value: boolean): void => {
    flags[flag] = value;
  };  