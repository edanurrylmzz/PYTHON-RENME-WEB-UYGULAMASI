import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

export const usePyodide = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const initPyodide = async () => {
      try {
        if (!window.loadPyodide) {
           // Wait for script to load if called too early
           setTimeout(initPyodide, 500);
           return;
        }

        if (!pyodideRef.current) {
          pyodideRef.current = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
          });
          setIsReady(true);
        }
      } catch (err) {
        console.error("Pyodide init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initPyodide();
  }, []);

  const runPython = async (code: string, onOutput: (text: string) => void) => {
    if (!pyodideRef.current) return;

    try {
      // Setup stdout capture
      pyodideRef.current.setStdout({ batched: (msg: string) => onOutput(msg + "\n") });
      pyodideRef.current.setStderr({ batched: (msg: string) => onOutput("Error: " + msg + "\n") });

      await pyodideRef.current.runPythonAsync(code);
    } catch (error: any) {
      onOutput(`⚠️ Hata:\n${error.message}`);
    }
  };

  return { isReady, isLoading, runPython };
};