import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const MenuItem = ({ icon, label, onClick, highlight = false }: any) => (
    <button 
      onClick={() => { onClick(); setIsOpen(false); }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors rounded-lg",
        highlight 
          ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
      )}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full transition-colors flex items-center justify-center",
          isOpen ? "bg-gray-200 dark:bg-slate-700 text-primary" : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
        )}
        aria-label="Settings menu"
      >
        <span className={cn("text-xl leading-none", isOpen && "animate-spin-slow")}>⚙️</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="px-2 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
            <MenuItem 
              icon="👤" 
              label="Perfil" 
              onClick={() => alert("Modal de Perfil: Usuario de laboratorio, Plan Gratuito, Experimentos: 3")} 
            />
            <MenuItem 
              icon="🕒" 
              label="Historial" 
              onClick={() => alert("Modal de Historial: Aquí se verían las simulaciones guardadas en localStorage.")} 
            />
          </div>
          
          <div className="px-2 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
            <MenuItem 
              icon="🎛️" 
              label="Preferencias" 
              onClick={() => alert("Modal de Preferencias: Tema, unidades, etc.")} 
            />
          </div>
          
          <div className="px-2">
            <MenuItem 
              icon="⭐" 
              label="Mejorar plan" 
              highlight 
              onClick={() => alert("Función demostrativa — no se realizarán cargos.")} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
