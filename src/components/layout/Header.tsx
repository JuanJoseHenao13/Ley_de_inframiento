import { useSimulationStore } from '../../store/simulationStore';
import SettingsMenu from './SettingsMenu';

const Header = () => {
  const { theme, setTheme, activeTab, setActiveTab } = useSimulationStore();

  return (
    <header className="bg-[#EDF3F9] dark:bg-slate-800 shadow-neu-card dark:shadow-none rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Title & Icon */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#EDF3F9] dark:bg-slate-700 shadow-neu-flat dark:shadow-none flex items-center justify-center text-blue-600 dark:text-blue-400">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
            <path d="M8.5 2h7"></path>
            <path d="M7 16h10"></path>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight">Laboratorio Virtual</h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ley de Enfriamiento de Newton</p>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <nav className="flex items-center bg-[#E4ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none p-1.5 rounded-2xl gap-1">
        <button 
          onClick={() => setActiveTab('Simulación')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'Simulación' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          Simulación
        </button>
        <button 
          onClick={() => setActiveTab('Comparar')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'Comparar' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Comparar
        </button>
        <button 
          onClick={() => setActiveTab('Resultados')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'Resultados' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Resultados
        </button>
        <button 
          onClick={() => setActiveTab('Modelo matemático')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'Modelo matemático' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
        >
          <span className="italic font-serif font-bold text-xs">fx</span>
          Modelo matemático
        </button>
        <button 
          onClick={() => setActiveTab('Experimentos')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'Experimentos' ? 'bg-blue-600 text-white shadow-neu-accent' : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          Experimentos
        </button>
      </nav>

      {/* Right Action Tools */}
      <div className="flex items-center gap-3">
        {/* Sun/Moon toggle button */}
        <div className="flex items-center bg-[#E5ECF4] dark:bg-slate-900 shadow-neu-pressed dark:shadow-none p-1 rounded-xl">
          <button 
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-lg transition-colors ${theme === 'light' ? 'text-blue-600 bg-[#EDF3F9] shadow-neu-btn' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-600 bg-slate-700 shadow-neu-btn' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
          </button>
        </div>
        
        {/* Settings button */}
        <SettingsMenu />
      </div>
    </header>
  );
};

export default Header;
