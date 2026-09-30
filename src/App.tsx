import React, { useEffect } from 'react';
import { useSimulationStore } from './store/simulationStore';
import Header from './components/layout/Header';
import Dashboard from './components/layout/Dashboard';

function App() {
  const { theme } = useSimulationStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="max-w-[1680px] mx-auto flex flex-col gap-4">
      <Header />
      <Dashboard />
    </div>
  );
}

export default App;
