export type Language = 'es' | 'en' | 'it' | 'pt';
export type BrandId = 'resound' | 'beltone' | 'other';
export type CountryId = 'es' | 'br' | 'it';

export interface OrganicMetrics {
  followers: number;
  engagementRate: number;
  // Content Mix / Frequency breakdown
  posts: number;   // Static images, carousels
  reels: number;   // Vertical short form
  videos: number;  // Landscape / Long form
  stories: number; // Ephemeral content
  reach: number;
  videoViews: number; // Added: Critical for current social media landscape
}

export interface PaidMetrics {
  budget: number;
  cpc: number; // Cost Per Click
  ctr: number; // Click Through Rate
  conversions: number;
  cpl: number; // Added: Cost Per Lead (Business Metric)
}

export interface PlatformData {
  organic: OrganicMetrics;
  paid: PaidMetrics;
}

export interface BrandMarketData {
  manager: string;
  hasCalendar: 'yes' | 'no' | 'partial';
  strategy: string;
  metrics: {
    instagram: PlatformData;
    facebook: PlatformData;
    linkedin: PlatformData;
    youtube: PlatformData;
  };
}

// Country now holds a map of brands available in that country
export type CountryData = {
  [key in BrandId]?: BrandMarketData;
};

export interface AppState {
  language: Language;
  generalInfo: {
    projectName: string;
    date: string;
    objectives: string;
  };
  data: {
    es: CountryData;
    br: CountryData;
    it: CountryData;
  };
  recommendations: Array<{
    id: string;
    brandId: BrandId;
    countryId: CountryId | 'general';
    area: string;
    problem: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};