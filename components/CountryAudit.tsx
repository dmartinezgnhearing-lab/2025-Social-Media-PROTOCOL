import React, { useState } from 'react';
import { CountryData, Language, BrandId, BrandMarketData } from '../types';
import { TRANSLATIONS, BRANDS } from '../constants';
import { Copy, Users, Euro } from 'lucide-react';

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
  const t = TRANSLATIONS[language];
  // Default to Organic view
  const [viewMode, setViewMode] = useState<'organic' | 'paid'>('organic');

  const platforms = ['instagram', 'facebook', 'linkedin', 'youtube'] as const;
  
  // Get list of brands available in this country's data
  const availableBrands = Object.keys(data) as BrandId[];

  // Helper for "Traffic Light" colors
  const getInputColor = (type: string, value: number) => {
    if (!value) return '';

    if (type === 'engagementRate') {
      if (value < 1.0) return 'border-red-300 bg-red-50 text-red-900';
      if (value >= 1.0 && value < 3.5) return 'border-yellow-300 bg-yellow-50 text-yellow-900';
      if (value >= 3.5) return 'border-green-300 bg-green-50 text-green-900';
    }
    if (type === 'ctr') {
      if (value < 0.5) return 'border-red-300 bg-red-50 text-red-900';
      if (value >= 0.5 && value < 1.5) return 'border-yellow-300 bg-yellow-50 text-yellow-900';
      if (value >= 1.5) return 'border-green-300 bg-green-50 text-green-900';
    }
    // Default styling
    return 'border-gray-200 bg-transparent focus:border-blue-500';
  };

  // Helper to update a specific brand's metrics
  const handleMetricChange = (brandId: BrandId, platform: keyof BrandMarketData['metrics'], type: 'organic' | 'paid', field: string, value: string) => {
    const brandData = data[brandId];
    if (!brandData) return;

    const numValue = parseFloat(value) || 0;
    
    const updatedBrandData = {
      ...brandData,
      metrics: {
        ...brandData.metrics,
        [platform]: {
          ...brandData.metrics[platform],
          [type]: {
            ...brandData.metrics[platform][type],
            [field]: numValue
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
      
      {/* View Mode Switcher (Stickyish) */}
      <div className="flex justify-center mb-6 sticky top-4 z-10">
        <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-200 flex gap-2">
          <button 
            onClick={() => setViewMode('organic')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'organic' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={16} /> {t.organic}
          </button>
          <button 
            onClick={() => setViewMode('paid')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'paid' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
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
            {/* Header for the Brand Section */}
            <div className={`rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden mb-6`}>
              <div className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center ${brandConfig.bg} bg-opacity-10`}>
                <h2 className={`text-2xl font-bold ${brandConfig.color}`}>
                  {brandConfig.name} <span className="text-gray-400 text-base font-normal">| {t.spain === 'España' && countryId === 'es' ? 'España' : countryId.toUpperCase()}</span>
                </h2>
                {brandId === 'resound' && countryId !== 'es' && onCopyFromEs && (
                  <button 
                    onClick={onCopyFromEs}
                    className="text-xs flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded border border-gray-200 transition-colors shadow-sm"
                  >
                    <Copy size={14} />
                    {t.copyFromEs}
                  </button>
                )}
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">{t.manager}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-colors"
                    value={brandData.manager}
                    onChange={(e) => handleGeneralChange(brandId, 'manager', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">{t.hasCalendar}</label>
                  <select 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-colors"
                    value={brandData.hasCalendar}
                    onChange={(e) => handleGeneralChange(brandId, 'hasCalendar', e.target.value)}
                  >
                    <option value="no">{t.no}</option>
                    <option value="yes">{t.yes}</option> 
                    <option value="partial">{t.partial}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">{t.strategy}</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-colors"
                    value={brandData.strategy}
                    onChange={(e) => handleGeneralChange(brandId, 'strategy', e.target.value)}
                    placeholder="..."
                  />
                </div>
              </div>
            </div>

            {/* Metrics Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden">
               <div className={`px-6 py-3 border-b border-gray-100 ${viewMode === 'organic' ? 'bg-green-50' : 'bg-blue-50'}`}>
                 <h3 className={`font-bold flex items-center gap-2 ${viewMode === 'organic' ? 'text-green-800' : 'text-blue-800'}`}>
                   {viewMode === 'organic' ? <Users size={18} /> : <Euro size={18} />}
                   {t.metrics} - {viewMode === 'organic' ? t.organic : t.paid}
                 </h3>
               </div>

               <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="text-left py-3 px-6 font-semibold text-gray-500 text-sm w-32">Platform</th>
                      
                      {viewMode === 'organic' ? (
                        <>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.followers}</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.engagement}</th>
                          
                          {/* Granular Content Mix */}
                          <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-16">{t.lbl_posts}</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-16">{t.lbl_reels}</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-16">{t.lbl_videos}</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-500 text-xs w-16 bg-yellow-50/50">{t.lbl_stories}</th>
                          
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.reach}</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm bg-green-50/30">{t.videoViews}</th>
                        </>
                      ) : (
                         <>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.budget}</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.cpc}</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.ctr}</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm">{t.conversions}</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-500 text-sm bg-blue-50/30">{t.cpl}</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {platforms.map(platform => (
                      <tr key={platform} className="hover:bg-gray-50 transition-colors group">
                        <td className="py-3 px-6 capitalize font-medium text-gray-700 flex items-center gap-2">
                           {/* Icon Placeholder */}
                           <div className={`w-2 h-2 rounded-full ${
                             platform === 'instagram' ? 'bg-pink-500' :
                             platform === 'facebook' ? 'bg-blue-600' :
                             platform === 'linkedin' ? 'bg-blue-700' : 'bg-red-600'
                           }`}></div>
                           {t[platform]}
                        </td>
                        
                        {viewMode === 'organic' ? (
                          <>
                            <td className="p-2">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent border-gray-200 focus:border-blue-500"
                                value={brandData.metrics[platform].organic.followers || ''} placeholder="0"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'followers', e.target.value)} />
                            </td>
                            <td className="p-2">
                              <input type="number" step="0.01" className={`w-full text-right border-b focus:outline-none px-2 py-1 ${getInputColor('engagementRate', brandData.metrics[platform].organic.engagementRate)}`}
                                value={brandData.metrics[platform].organic.engagementRate || ''} placeholder="0.00"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'engagementRate', e.target.value)} />
                            </td>
                            
                            {/* NEW: Granular Inputs */}
                            <td className="p-2">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 bg-transparent border-gray-200 focus:border-blue-500 text-xs"
                                value={brandData.metrics[platform].organic.posts || ''} placeholder="-"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'posts', e.target.value)} />
                            </td>
                            <td className="p-2">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 bg-transparent border-gray-200 focus:border-blue-500 text-xs"
                                value={brandData.metrics[platform].organic.reels || ''} placeholder="-"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'reels', e.target.value)} />
                            </td>
                            <td className="p-2">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 bg-transparent border-gray-200 focus:border-blue-500 text-xs"
                                value={brandData.metrics[platform].organic.videos || ''} placeholder="-"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'videos', e.target.value)} />
                            </td>
                            <td className="p-2 bg-yellow-50/30">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-1 py-1 bg-transparent border-gray-200 focus:border-blue-500 text-xs"
                                value={brandData.metrics[platform].organic.stories || ''} placeholder="-"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'stories', e.target.value)} />
                            </td>

                            <td className="p-2">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent border-gray-200 focus:border-blue-500"
                                value={brandData.metrics[platform].organic.reach || ''} placeholder="0"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'reach', e.target.value)} />
                            </td>
                            <td className="p-2 bg-green-50/10">
                              <input type="number" className="w-full text-right bg-transparent border-b border-transparent focus:border-green-500 focus:outline-none px-2 py-1 font-medium text-green-700"
                                value={brandData.metrics[platform].organic.videoViews || ''} placeholder="0"
                                onChange={(e) => handleMetricChange(brandId, platform, 'organic', 'videoViews', e.target.value)} />
                            </td>
                          </>
                        ) : (
                          <>
                             <td className="p-2">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent border-gray-200 focus:border-blue-500"
                                value={brandData.metrics[platform].paid.budget || ''} placeholder="0"
                                onChange={(e) => handleMetricChange(brandId, platform, 'paid', 'budget', e.target.value)} />
                            </td>
                            <td className="p-2">
                              <input type="number" step="0.01" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent border-gray-200 focus:border-blue-500"
                                value={brandData.metrics[platform].paid.cpc || ''} placeholder="0.00"
                                onChange={(e) => handleMetricChange(brandId, platform, 'paid', 'cpc', e.target.value)} />
                            </td>
                            <td className="p-2">
                              <input type="number" step="0.01" className={`w-full text-right border-b focus:outline-none px-2 py-1 ${getInputColor('ctr', brandData.metrics[platform].paid.ctr)}`}
                                value={brandData.metrics[platform].paid.ctr || ''} placeholder="0.00"
                                onChange={(e) => handleMetricChange(brandId, platform, 'paid', 'ctr', e.target.value)} />
                            </td>
                            <td className="p-2">
                              <input type="number" className="w-full text-right border-b focus:outline-none px-2 py-1 bg-transparent border-gray-200 focus:border-blue-500"
                                value={brandData.metrics[platform].paid.conversions || ''} placeholder="0"
                                onChange={(e) => handleMetricChange(brandId, platform, 'paid', 'conversions', e.target.value)} />
                            </td>
                            <td className="p-2 bg-blue-50/10">
                              <input type="number" step="0.01" className="w-full text-right bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none px-2 py-1 font-medium text-blue-700"
                                value={brandData.metrics[platform].paid.cpl || ''} placeholder="0.00"
                                onChange={(e) => handleMetricChange(brandId, platform, 'paid', 'cpl', e.target.value)} />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CountryAudit;