
// Function to execute and run arbitrary JavaScript/TypeScript code
export const executeCode = (code: string) => {
  const logs: string[] = [];
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;
  const errors: string[] = [];
  
  try {
    // Create functions to capture console output
    const captureConsoleLog = (...args: any[]) => {
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(`[LOG] ${logMessage}`);
      originalConsoleLog(...args); // Pass through to real console for debugging
    };
    
    const captureConsoleError = (...args: any[]) => {
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(`[ERROR] ${logMessage}`);
      originalConsoleError(...args); // Pass through to real console for debugging
    };
    
    const captureConsoleWarn = (...args: any[]) => {
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(`[WARN] ${logMessage}`);
      originalConsoleWarn(...args); // Pass through to real console for debugging
    };
    
    const captureConsoleInfo = (...args: any[]) => {
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      logs.push(`[INFO] ${logMessage}`);
      originalConsoleInfo(...args); // Pass through to real console for debugging
    };
    
    // Temporarily replace console methods
    console.log = captureConsoleLog;
    console.error = captureConsoleError;
    console.warn = captureConsoleWarn;
    console.info = captureConsoleInfo;
    
    // Check for syntax errors by trying to parse the code
    new Function(code);
    
    // Create a safe execution environment with common utilities
    const module: { exports: any } = { exports: {} };
    
    // Define a context with useful utilities
    const context = {
      console: { 
        log: captureConsoleLog,
        error: captureConsoleError,
        warn: captureConsoleWarn,
        info: captureConsoleInfo
      },
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
      module: module,
      exports: module.exports,
      require: (moduleName: string) => {
        // Mock some common modules
        if (moduleName === 'lodash') {
          return {
            // Fixed typings for lodash methods
            map: <T, U>(arr: T[], fn: (value: T, index: number, array: T[]) => U): U[] => 
              arr.map(fn),
            filter: <T>(arr: T[], fn: (value: T, index: number, array: T[]) => boolean): T[] => 
              arr.filter(fn),
            reduce: <T, U>(arr: T[], fn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initial: U): U => 
              arr.reduce(fn, initial),
            // Add more lodash functions as needed
          };
        }
        
        // For requiring local files like './calculator'
        if (moduleName === './calculator') {
          // Return the module.exports from the current execution
          return module.exports;
        }
        
        // Return empty object for unknown modules
        logs.push(`[WARN] Mock require: '${moduleName}' is not available in this environment`);
        return {};
      }
    };
    
    // Build function arguments and values for execution
    const contextKeys = Object.keys(context);
    const contextValues = contextKeys.map(key => context[key as keyof typeof context]);
    
    // Create and execute the function with our context
    const executionFunction = new Function(...contextKeys, code);
    const result = executionFunction(...contextValues);
    
    // Log the result if it's not undefined
    if (result !== undefined) {
      logs.push(`[RESULT] ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
    }
    
    // Extract the exported values
    const exportedValues = module.exports;
    
    // If there are exports, log information about them
    if (Object.keys(exportedValues).length > 0) {
      logs.push(`[EXPORTS] ${Object.keys(exportedValues).join(', ')}`);
      
      // Log additional info about exported functions/values
      Object.entries(exportedValues).forEach(([key, value]) => {
        if (typeof value === 'function') {
          logs.push(`[EXPORT] ${key}: [Function]`);
        } else {
          logs.push(`[EXPORT] ${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`);
        }
      });
    }
    
    return { logs, success: true, exportedValues };
  } catch (error) {
    // Capture and format any errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);
    logs.push(`[ERROR] ${errorMessage}`);
    
    if (error instanceof Error && error.stack) {
      // Format stack trace to be more readable
      const formattedStack = error.stack
        .split('\n')
        .slice(1)
        .map(line => line.trim())
        .join('\n');
      logs.push(`[STACK]\n${formattedStack}`);
    }
    
    return { logs, success: false, errors };
  } finally {
    // Restore the original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
  }
};
