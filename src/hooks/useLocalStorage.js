import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue, ttl = 3600000) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp < ttl) {
          setStoredValue(parsed.data);
        } else {
          localStorage.removeItem(key);
        }
      } catch (e) {}
    }
  }, [key, ttl]);

  const setValue = (value) => {
    const data = { data: value, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(data));
    setStoredValue(value);
  };

  return [storedValue, setValue];
}