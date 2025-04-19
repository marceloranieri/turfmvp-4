
import React, { useEffect } from 'react';
import { useTurf } from '@/contexts/TurfContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTurf();
  
  // Apply dark mode class to document initially
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleDarkMode}
      className="rounded-full"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
