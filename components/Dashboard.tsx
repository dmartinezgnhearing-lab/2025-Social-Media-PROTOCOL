import React, { useState } from 'react';
import { AppState, Translations, BrandId, BrandMarketData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Euro, Users, CheckCircle, Target, TrendingUp, ClipboardCopy } from 'lucide-react';
import { BRANDS } from '../constants';

interface DashboardProps {
  state: AppState;
  t: Translations[keyof Translations];
}

const BrandSection = ({ brandId, state, t }: { brandId: BrandId, state: AppState, t: any }) => {
  const brandConfig = BRANDS.find(b => b.id === brandId);
  if (!brandConfig) return null;
  
  // Aggregate data for this brand across all countries
  const countries: { id: keyof AppState['data']; name: string }[] = [
    { id: 'es', name: t.spain },
    { id: 'br', name: t.brazil },
    { id: 'it', name: t.italy }
  ];

  let totalBudget = 0;
  let totalFollowers = 0;
  let totalEngagement = 0;
  let engagementCount = 0;

  const budgetByCountry: any[] = [];
  const budgetByPlatform: any[] = [];
  const platformTotals: Record<string, number> = { instagram: 0, facebook: 0, linkedin: 0, youtube: 0 };

  countries.forEach(c => {
    // Check if this country has data for this brand
    const countryData = state.data[c.id];
    // @ts-ignore
    const brandData = countryData ? countryData[brandId] as BrandMarketData : null;

    if (brandData) {
      // Calculate Budget
      const countryBudget = Object.values(brandData.metrics).reduce((acc, curr) => acc + (curr.paid.budget || 0), 0);
      totalBudget += countryBudget;
      budgetByCountry.push({ name: c.name, amount: countryBudget });

      // Calculate Followers & Engagement
      Object.entries(brandData.metrics).forEach(([platform, data]) => {
        totalFollowers += (data.organic.followers || 0);
        if (data.organic.engagementRate > 0) {
          totalEngagement += data.organic.engagementRate;
          engagementCount++;
        }
        // Platform budget
        platformTotals[platform] += (data.paid.budget || 0);
      });
    }
  });

  const avgEngagement = engagementCount > 0 ? (totalEngagement / engagementCount).toFixed(2) : 0;
  
  Object.entries(platformTotals).forEach(([key, val]) => {
    if (val > 0) budgetByPlatform.push({ name: t[key], value: val });
  });

  const COLORS = ['#E1306C', '#1877F2', '#0077B5', '#FF0000'];

  const [copied, setCopied] = useState(false);

  const copyExecutiveSummary = () => {
    const activeRecs = state.recommendations.filter(r => r.brandId === brandId).length;
    
    let text = `📢 *EXECUTIVE SUMMARY: ${brandConfig.name.toUpperCase()}*\n`;
    text += `📅 Date: ${new Date().toISOString().split('T')[0]}\n\n`;
    text += `💰 *Total Budget (Global):* €${totalBudget.toLocaleString()}\n`;
    text += `👥 *Total Followers:* ${totalFollowers.toLocaleString()}\n`;
    text += `📈 *Avg Engagement Rate:* ${avgEngagement}%\n\n`;
    text += `🌍 *Market Breakdown (Paid Budget):*\n`;
    budgetByCountry.forEach(b => {
        text += `   - ${b.name}: €${b.amount.toLocaleString()}\n`;
    });
    text += `\n🎯 *Action Plan:* ${activeRecs} active recommendations identified.\n`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-12 border-b-2 border-dashed border-gray-200 pb-12 last:border-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className={`text-2xl font-bold flex items-center gap-2 ${brandConfig.color}`}>
            <span className={`w-3 h-8 rounded-full ${brandConfig.bg}`}></span>
            {brandConfig.name} {t.dashboard}
        </h3>
        <button 
            onClick={copyExecutiveSummary}
            className="flex items-center gap-2 text-sm bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm mt-4 md:mt-0"
        >
            {copied ? <CheckCircle size={16} className="text-green-500"/> : <ClipboardCopy size={16} />}
            {copied ? t.summaryCopied : t.copySummary}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{t.totalBudget}</p>
              <h3 className={`text-2xl font-bold text-gray-800 mt-1`}>€{totalBudget.toLocaleString()}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-blue-50 text-blue-600`}>
              <Euro size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{t.totalFollowers}</p>
              <h3 className={`text-2xl font-bold text-gray-800 mt-1`}>{totalFollowers.toLocaleString()}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-green-50 text-green-600`}>
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{t.avgEngagement}</p>
              <h3 className={`text-2xl font-bold text-gray-800 mt-1`}>{avgEngagement}%</h3>
            </div>
            <div className={`p-2 rounded-lg bg-purple-50 text-purple-600`}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Recommendations</p>
              <h3 className={`text-2xl font-bold text-gray-800 mt-1`}>
                {state.recommendations.filter(r => r.brandId === brandId).length}
              </h3>
            </div>
            <div className={`p-2 rounded-lg bg-orange-50 text-orange-600`}>
              <Target size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
          <h4 className="text-sm font-bold uppercase text-gray-500 mb-4">Paid Media Budget (Market)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={budgetByCountry}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#9CA3AF', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `€${value}`} />
              <Tooltip formatter={(value) => `€${value.toLocaleString()}`} cursor={{fill: 'transparent'}} />
              <Bar dataKey="amount" fill={brandConfig.id === 'resound' ? '#b91c1c' : '#2563eb'} radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
          <h4 className="text-sm font-bold uppercase text-gray-500 mb-4">Paid Media Budget (Platform)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgetByPlatform}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {budgetByPlatform.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ state, t }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <BrandSection brandId="resound" state={state} t={t} />
      <BrandSection brandId="beltone" state={state} t={t} />
    </div>
  );
};

export default Dashboard;