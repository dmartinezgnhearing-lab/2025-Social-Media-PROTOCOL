import React, { useState, useEffect, useRef } from 'react';
import { AppState, Language, CountryId, BrandId, BrandMarketData } from './types';
import { INITIAL_STATE, TRANSLATIONS, BRANDS } from './constants';
import Dashboard from './components/Dashboard';
import CountryAudit from './components/CountryAudit';
import { Save, Trash2, Download, LayoutDashboard, Globe, Lightbulb, Upload } from 'lucide-react';

function App() {
  const [state, setState] = useState<AppState>(() => {
    // Basic migration check: if old data structure exists (detect by checking if es is CountryData directly or map)
    const saved = localStorage.getItem('audit-protocol-v2-2'); // Increment version to avoid stale data conflicts
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'es' | 'br' | 'it' | 'recommendations'>('dashboard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('audit-protocol-v2-2', JSON.stringify(state));
  }, [state]);

  const t = TRANSLATIONS[state.language];

  const handleUpdateBrandData = (countryId: CountryId, brandId: BrandId, data: BrandMarketData) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [countryId]: {
          ...prev.data[countryId],
          [brandId]: data
        }
      }
    }));
  };

  const copyEsTo = (target: 'br' | 'it') => {
    if (confirm(t.copyFromEs + '?')) {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [target]: {
            ...prev.data[target],
            resound: { ...prev.data.es.resound! },
            beltone: { ...prev.data.es.beltone! }
          }
        }
      }));
    }
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setState(INITIAL_STATE);
      // Force reload to clear state properly if needed, but setState is enough usually
      window.location.reload();
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-protocol-resound-beltone-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Simple validation check (check for key structure)
        if (parsedData.data && parsedData.generalInfo) {
           setState(parsedData);
           alert(t.importSuccess);
        } else {
           alert(t.importError);
        }
      } catch (err) {
        console.error(err);
        alert(t.importError);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  // Recommendations Logic
  const [newRec, setNewRec] = useState({ 
    area: '', 
    problem: '', 
    action: '', 
    priority: 'medium' as const, 
    brandId: 'resound' as BrandId,
    countryId: 'general' as CountryId | 'general'
  });

  const addRecommendation = () => {
    if (!newRec.area || !newRec.action) return;
    const id = Date.now().toString();
    setState(prev => ({
      ...prev,
      recommendations: [...prev.recommendations, { ...newRec, id }]
    }));
    setNewRec({ area: '', problem: '', action: '', priority: 'medium', brandId: 'resound', countryId: 'general' });
  };

  const removeRec = (id: string) => {
    setState(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(r => r.id !== id)
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block overflow-y-auto">
        <div className={`p-6 border-b border-gray-100 bg-gradient-to-br from-gray-900 to-gray-800 text-white`}>
          <h1 className="text-xl font-bold leading-tight">{t.appTitle}</h1>
          <p className="text-xs opacity-70 mt-1">Multi-Brand Protocol</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={20} />
            {t.dashboard}
          </button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.general}</div>
          
          <button 
            onClick={() => setActiveTab('es')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'es' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Globe size={20} />
            {t.spain}
          </button>
          <button 
            onClick={() => setActiveTab('br')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'br' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Globe size={20} />
            {t.brazil}
          </button>
          <button 
            onClick={() => setActiveTab('it')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'it' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Globe size={20} />
            {t.italy}
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Analysis</div>

          <button 
            onClick={() => setActiveTab('recommendations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'recommendations' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Lightbulb size={20} />
            {t.recommendations}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && t.dashboard}
              {activeTab === 'es' && t.spain}
              {activeTab === 'br' && t.brazil}
              {activeTab === 'it' && t.italy}
              {activeTab === 'recommendations' && t.recommendations}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Protocol: {state.generalInfo.date} • ReSound & Beltone
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
             {/* Selectors */}
            <select 
              value={state.language}
              onChange={(e) => setState(s => ({ ...s, language: e.target.value as Language }))}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
            </select>

            <div className="h-8 w-px bg-gray-300 mx-2 hidden md:block"></div>
            
            {/* Import / Export Controls */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".json" 
              className="hidden" 
            />
            
            <button onClick={triggerImport} className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title={t.import}>
              <Upload size={20} />
            </button>

            <button onClick={exportData} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={t.export}>
              <Download size={20} />
            </button>
            <button onClick={clearData} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t.clear}>
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Content Render */}
        {activeTab === 'dashboard' && (
          <Dashboard state={state} t={t} />
        )}

        {activeTab === 'es' && (
          <CountryAudit 
            countryId="es" 
            data={state.data.es} 
            language={state.language} 
            onUpdate={(brandId, d) => handleUpdateBrandData('es', brandId, d)}
          />
        )}

        {activeTab === 'br' && (
          <CountryAudit 
            countryId="br" 
            data={state.data.br} 
            language={state.language} 
            onUpdate={(brandId, d) => handleUpdateBrandData('br', brandId, d)}
            onCopyFromEs={() => copyEsTo('br')}
          />
        )}

        {activeTab === 'it' && (
          <CountryAudit 
            countryId="it" 
            data={state.data.it} 
            language={state.language} 
            onUpdate={(brandId, d) => handleUpdateBrandData('it', brandId, d)}
            onCopyFromEs={() => copyEsTo('it')}
          />
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.addRec}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Brand Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-gray-500">{t.brand}</label>
                  <select
                    className="px-3 py-2 border rounded-lg"
                    value={newRec.brandId}
                    // @ts-ignore
                    onChange={e => setNewRec({...newRec, brandId: e.target.value})}
                  >
                    <option value="resound">ReSound</option>
                    <option value="beltone">Beltone</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Country Selector - NEW */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-gray-500">{t.country}</label>
                  <select
                    className="px-3 py-2 border rounded-lg"
                    value={newRec.countryId}
                    // @ts-ignore
                    onChange={e => setNewRec({...newRec, countryId: e.target.value})}
                  >
                    <option value="general">{t.global}</option>
                    <option value="es">{t.spain}</option>
                    <option value="br">{t.brazil}</option>
                    <option value="it">{t.italy}</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <input 
                    placeholder={t.area}
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newRec.area}
                    onChange={e => setNewRec({...newRec, area: e.target.value})}
                  />
                </div>
                
                 <input 
                  placeholder={t.problem}
                  className="px-3 py-2 border rounded-lg"
                  value={newRec.problem}
                  onChange={e => setNewRec({...newRec, problem: e.target.value})}
                />
                 <input 
                  placeholder={t.action}
                  className="px-3 py-2 border rounded-lg"
                  value={newRec.action}
                  onChange={e => setNewRec({...newRec, action: e.target.value})}
                />
                
                <div className="md:col-span-2">
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newRec.priority}
                    // @ts-ignore
                    onChange={e => setNewRec({...newRec, priority: e.target.value})}
                  >
                    <option value="high">{t.high}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="low">{t.low}</option>
                  </select>
                </div>

                <button 
                  onClick={addRecommendation}
                  className={`px-4 py-2 rounded-lg text-white font-medium bg-gray-900 hover:opacity-90 transition-opacity md:col-span-2 mt-2`}
                >
                  {t.addRec}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {state.recommendations.map(rec => (
                <div key={rec.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded font-bold uppercase text-white ${rec.brandId === 'resound' ? 'bg-red-700' : rec.brandId === 'beltone' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        {rec.brandId}
                      </span>
                      {/* Country Badge */}
                      <span className="text-xs px-2 py-1 rounded font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                        {rec.countryId === 'general' ? 'GLOBAL' : rec.countryId.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' : 
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {t[rec.priority]}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-bold text-gray-800 text-lg">{rec.area}</h4>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold text-gray-500 uppercase text-xs block mb-0.5">{t.problem}</span> 
                        {rec.problem}
                      </p>
                      <p className="text-gray-800 text-sm">
                         <span className="font-semibold text-blue-600 uppercase text-xs block mb-0.5">{t.action}</span>
                        {rec.action}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeRec(rec.id)} className="text-gray-400 hover:text-red-500 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {state.recommendations.length === 0 && (
                <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                  No recommendations yet.
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;