import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Search, X } from 'lucide-react';
import { useLanguage, LANGUAGES, SupportedLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorButtonProps {
  variant?: 'navbar' | 'floating' | 'inline';
}

export const LanguageSelectorButton: React.FC<LanguageSelectorButtonProps> = ({ variant = 'navbar' }) => {
  const { currentLanguage, setLanguage, languageInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredLanguages = LANGUAGES.filter((lang) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q) ||
      (lang.region && lang.region.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {variant === 'navbar' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-indigo-500/50 text-xs font-bold transition-all shadow-sm cursor-pointer"
          title="تغيير اللغة / Change Language"
          aria-label="Change Language"
        >
          <span className="text-sm leading-none">{languageInfo.flag}</span>
          <span className="text-xs font-semibold">{languageInfo.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : variant === 'floating' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-36 z-40 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl border border-indigo-500/40 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
          title="تغيير اللغة / Change Language"
        >
          <Globe className="w-4 h-4 text-indigo-400" />
          <span className="text-base">{languageInfo.flag}</span>
          <span>{languageInfo.nativeName}</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>{languageInfo.flag} {languageInfo.nativeName}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      )}

      {/* Language Selector Dropdown with Search */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-2">
          <div className="px-1.5 py-1 flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>World Languages</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {LANGUAGES.length} Languages
            </span>
          </div>

          {/* Quick Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 rtl:left-auto rtl:right-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language / ابحث عن لغة..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-7 rtl:pl-7 rtl:pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 rtl:right-auto rtl:left-2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Languages List */}
          <div className="py-1 space-y-0.5 max-h-64 overflow-y-auto no-scrollbar">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div className="text-left rtl:text-right">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{lang.nativeName}</span>
                          {lang.dir === 'rtl' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              RTL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {lang.name} • {lang.region}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-500">
                No matching language found
              </div>
            )}
          </div>

          <div className="px-2 pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Instant direction (RTL / LTR)</span>
            <span className="text-indigo-400 font-bold">OmniCraft Global</span>
          </div>
        </div>
      )}
    </div>
  );
};
