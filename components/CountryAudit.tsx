import React, { useState } from 'react';
import { CountryData, Language, BrandId, BrandMarketData, PlatformData } from '../types';
import { TRANSLATIONS, BRANDS } from '../constants';
import { Copy, Users, Euro, Calendar, CheckSquare, Search, ShieldCheck } from 'lucide-react';

interface CountryAuditProps {
  countryId: string;
  data: CountryData;
  language: Language;
  onUpdate: (brandId: BrandId, data: BrandMarketData) => void;
  onCopyFromEs?: () => void;
}

const CountryAudit: React.FC<CountryAuditProps> = ({ 
  countryId, 
  data, 
  language, 
  onUpdate, 
  onCopyFromEs
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['es'];
  const [viewMode, setViewMode] = useState<'organic' | 'paid' | 'audit'>('audit');

  const platforms = ['instagram', 'facebook', 'linkedin', 'youtube'] as const;
  const availableBrands = Object.keys(data) as BrandId[];

  const handleMetricChange = (brandId: BrandId, platform: keyof BrandMarketData['metrics'], type: 'organic' | 'paid', field: string, value: any) => {
    const brandData = data[brandId];
    if (!brandData) return;

    const val = typeof value === 'boolean' ? value : (parseFloat(value) || 0);
    
    const updatedBrandData = {
      ...brandData,
      metrics: {
        ...brandData.metrics,
        [platform]: {
          ...brandData.metrics[platform],
          [type]: {
            ...brandData.metrics[platform][type],
            [field]: val
          }
        }
      }
    };
    onUpdate(brandId, updatedBrandData);
  };

  const handlePlatformMetaChange = (brandId: BrandId, platform: keyof BrandMarketData['metrics'], field: string, value: any) => {
    const brandData = data[brandId];
    if (!brandData) return;
    
    const updatedBrandData = {
      ...brandData,
      metrics: {
        ...brandData.metrics,
        [platform]: {
          ...brandData.metrics[platform],
          [field]: value
        }
      }
    };
    onUpdate(brandId, updatedBrandData);
  };

  const handleAuditChange = (brandId: BrandId, platform: keyof BrandMarketData['metrics'], section: 'checklist' | 'alignment', field: string, value: any) => {
    const brandData = data[brandId];
    if (!brandData) return;
    
    const updatedBrandData = {
      ...brandData,
      metrics: {
        ...brandData.metrics,
        [platform]: {
          ...brandData.metrics[platform],
          [section]: {
            ...(brandData.metrics[platform][section] || {}),
            [field]: value
          }
        }
      }
    };
    onUpdate(brandId, updatedBrandData);
  };

  const handleGeneralChange = (brandId: BrandId, field: keyof BrandMarketData, value: any) => {
    const brandData = data[brandId];
    if (!brandData) return;
    onUpdate(brandId, { ...brandData, [field]: value });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Navigation Switcher */}
      <div className="flex justify-center mb-6 sticky top-4 z-10">
        <div className="bg-white p-1.5 rounded-full shadow-lg border border-gray-200 flex gap-2">
          <button 
            onClick={() => setViewMode('audit')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'audit' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShieldCheck size={16} /> {t.healthAudit}
          </button>
          <button 
            onClick={() => setViewMode('organic')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'organic' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={16} /> {t.organic}
          </button>
          <button 
            onClick={() => setViewMode('paid')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'paid' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Euro size={16} /> {t.paid}
          </button>
        </div>
      </div>

      {availableBrands.map((brandId) => {
        const brandConfig = BRANDS.find(b => b.id === brandId);
        const brandData = data[brandId];
        if (!brandData || !brandConfig) return null;

        return (
          <div key={brandId} className="border-l-4 border-gray-300 pl-0 md:pl-4">
            <div className="rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden mb-6">
              <div className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center ${brandConfig.bg} bg-opacity-10`}>
                <h2 className={`text-2xl font-bold ${brandConfig.color}`}>
                  {brandConfig.name} <span className="text-gray-400 text-base font-normal">| {t.spain === 'España' && countryId === 'es' ? 'España' : countryId.toUpperCase()}</span>
                </h2>
                <div className="flex gap-2">
                  <select 
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={brandData.analysisPeriod || '90_days'}
                      onChange={(e) => handleGeneralChange(brandId, 'analysisPeriod', e.target.value)}
                    >
                      <option value="7_days">{t.p_7}</option>
                      <option value="28_days">{t.p_28}</option>
                      <option value="30_days">{t.p_30}</option>
                      <option value="90_days">{t.p_90}</option>
                      <option value="ytd">{t.p_ytd}</option>
                  </select>
                  {brandId === 'resound' && countryId !== 'es' && onCopyFromEs && (
                    <button onClick={onCopyFromEs} className="text-xs flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 shadow-sm">
                      <Copy size={14} /> {t.copyFromEs}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30">
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t.manager}</label>
                   <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={brandData.manager} onChange={(e) => handleGeneralChange(brandId, 'manager', e.target.value)} />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t.strategy}</label>
                   <textarea className="w-full px-3 py-2 border rounded-lg text-sm h-10" value={brandData.strategy} onChange={(e) => handleGeneralChange(brandId, 'strategy', e.target.value)} />
                </div>
              </div>
            </div>

            {viewMode === 'audit' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {platforms.map(platform => {
                  const pData = brandData.metrics[platform];
                  if (!pData) return null;
                  
                  return (
                    <div key={platform} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                         <h3 className="font-bold flex items-center gap-2 capitalize">
                            <span className={`w-3 h-3 rounded-full ${platform === 'instagram' ? 'bg-pink-500' : platform === 'facebook' ? 'bg-blue-600' : platform === 'linkedin' ? 'bg-blue-700' : 'bg-red-600'}`}></span>
                            {t[platform]}
                         </h3>
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-bold text-gray-400 uppercase">{t.isActive}</span>
                           <input type="checkbox" checked={pData.isActive ?? true} onChange={e => handlePlatformMetaChange(brandId, platform, 'isActive', e.target.checked)} className="h-4 w-4 text-indigo-600 rounded" />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">{t.username}</label>
                            <input type="text" className="w-full p-1.5 border-b text-sm focus:outline-none bg-transparent" value={pData.username || ''} onChange={e => handlePlatformMetaChange(brandId, platform, 'username', e.target.value)} placeholder="@username" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">{t.target}</label>
                            <select className="w-full p-1.5 border-b text-sm focus:outline-none bg-transparent" value={pData.target || 'B2C'} onChange={e => handlePlatformMetaChange(brandId, platform, 'target', e.target.value)}>
                               <option value="B2B">B2B</option>
                               <option value="B2C">B2C</option>
                               <option value="B2B2C">B2B2C</option>
                            </select>
                         </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{t.brandAlignment}</label>
                           <div className="flex gap-2 text-[11px]">
                              {['colors', 'typography', 'tone'].map(f => (
                                <div key={f} className="flex-1">
                                   <span className="block text-gray-500 mb-1">{t[`lbl_${f.slice(0,4)}`]}</span>
                                   <select className="w-full border rounded p-1" value={(pData.alignment?.[f as keyof typeof pData.alignment]) || 'partial'} onChange={e => handleAuditChange(brandId, platform, 'alignment', f, e.target.value)}>
                                      <option value="yes">{t.yes}</option>
                                      <option value="partial">{t.partial}</option>
                                      <option value="no">{t.no}</option>
                                   </select>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2 border-t border-b bg-gray-50/50 p-3 rounded-lg">
                           {Object.keys(pData.checklist || {}).map(k => (
                             <label key={k} className="flex items-center gap-2 text-[11px] font-medium cursor-pointer">
                               <input type="checkbox" checked={(pData.checklist?.[k as keyof typeof pData.checklist]) || false} onChange={e => handleAuditChange(brandId, platform, 'checklist', k, e.target.checked)} className="rounded" />
                               {t[`chk_${k}`] || k}
                             </label>
                           ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{t.currentContent}</label>
                             <textarea className="w-full p-2 border rounded text-xs h-16" value={pData.currentContentStyle || ''} onChange={e => handlePlatformMetaChange(brandId, platform, 'currentContentStyle', e.target.value)} />
                           </div>
                           <div>
                             <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{t.desiredContent}</label>
                             <textarea className="w-full p-2 border rounded text-xs h-16" value={pData.desiredContentStyle || ''} onChange={e => handlePlatformMetaChange(brandId, platform, 'desiredContentStyle', e.target.value)} />
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px]">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="text-left py-3 px-6 font-semibold text-gray-500 text-sm w-32 sticky left-0 bg-gray-50 z-20">Platform</th>
                        {viewMode === 'organic' ? (
                          <>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.followers}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm bg-indigo-50/30">{t.avgMonthlyPosts}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.reach}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.impressions}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.interactions}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.engagement}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.profileVisits}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.clicks}</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-14 bg-yellow-50/20">{t.lbl_posts}</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-14 bg-yellow-50/20">{t.lbl_reels}</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-14 bg-yellow-50/20">{t.lbl_videos}</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-14 bg-yellow-50/40">{t.lbl_stories}</th>
                          </>
                        ) : (
                          <>
                            <th className="text-left py-3 px-4 font-semibold text-gray-500 text-sm">{t.advertising}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.budget}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm bg-indigo-50/30">{t.avgMonthlyBudget}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.cpc}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.ctr}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.conversions}</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.cpl}</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {platforms.map(platform => {
                        const pData = brandData.metrics[platform];
                        if (!pData) return null;

                        return (
                          <tr key={platform} className="hover:bg-gray-50 transition-colors group">
                            <td className="py-3 px-6 capitalize font-medium text-gray-700 flex items-center gap-2 sticky left-0 bg-white z-10 group-hover:bg-gray-50">
                               <div className={`w-2.5 h-2.5 rounded-full ${platform === 'instagram' ? 'bg-pink-500' : platform === 'facebook' ? 'bg-blue-600' : platform === 'linkedin' ? 'bg-blue-700' : 'bg-red-600'}`}></div>
                               {t[platform]}
                            </td>
                            {viewMode === 'organic' ? (
                              <>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent" value={pData.organic.followers || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'followers', e.target.value)} /></td>
                                <td className="p-2 bg-indigo-50/20"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent font-semibold" value={pData.organic.avgMonthlyPosts || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'avgMonthlyPosts', e.target.value)} /></td>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent" value={pData.organic.reach || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'reach', e.target.value)} /></td>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent" value={pData.organic.impressions || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'impressions', e.target.value)} /></td>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent" value={pData.organic.interactions || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'interactions', e.target.value)} /></td>
                                <td className="p-2"><input type="number" step="0.01" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent" value={pData.organic.engagementRate || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'engagementRate', e.target.value)} /></td>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent" value={pData.organic.profileVisits || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'profileVisits', e.target.value)} /></td>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent" value={pData.organic.clicks || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'clicks', e.target.value)} /></td>
                                <td className="p-1 bg-yellow-50/10"><input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 text-xs" value={pData.organic.posts || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'posts', e.target.value)} /></td>
                                <td className="p-1 bg-yellow-50/10"><input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 text-xs" value={pData.organic.reels || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'reels', e.target.value)} /></td>
                                <td className="p-1 bg-yellow-50/10"><input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 text-xs" value={pData.organic.videos || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'videos', e.target.value)} /></td>
                                <td className="p-1 bg-yellow-50/30"><input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 text-xs" value={pData.organic.stories || ''} onChange={e => handleMetricChange(brandId, platform, 'organic', 'stories', e.target.value)} /></td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-2"><input type="checkbox" checked={pData.paid.advertisingEnabled || false} onChange={e => handleMetricChange(brandId, platform, 'paid', 'advertisingEnabled', e.target.checked)} className="h-4 w-4" /></td>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1" value={pData.paid.budget || ''} onChange={e => handleMetricChange(brandId, platform, 'paid', 'budget', e.target.value)} /></td>
                                <td className="p-2 bg-indigo-50/20"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 font-semibold" value={pData.paid.avgMonthlyBudget || ''} onChange={e => handleMetricChange(brandId, platform, 'paid', 'avgMonthlyBudget', e.target.value)} /></td>
                                <td className="p-2"><input type="number" step="0.01" className="w-full text-right border-b focus:outline-none px-2 py-1" value={pData.paid.cpc || ''} onChange={e => handleMetricChange(brandId, platform, 'paid', 'cpc', e.target.value)} /></td>
                                <td className="p-2"><input type="number" step="0.01" className="w-full text-right border-b focus:outline-none px-2 py-1" value={pData.paid.ctr || ''} onChange={e => handleMetricChange(brandId, platform, 'paid', 'ctr', e.target.value)} /></td>
                                <td className="p-2"><input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1" value={pData.paid.conversions || ''} onChange={e => handleMetricChange(brandId, platform, 'paid', 'conversions', e.target.value)} /></td>
                                <td className="p-2"><input type="number" step="0.01" className="w-full text-right border-b focus:outline-none px-2 py-1" value={pData.paid.cpl || ''} onChange={e => handleMetricChange(brandId, platform, 'paid', 'cpl', e.target.value)} /></td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CountryAudit;