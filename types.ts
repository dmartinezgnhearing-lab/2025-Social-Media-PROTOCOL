export type Language = 'es' | 'en' | 'it' | 'pt';
export type BrandId = 'resound' | 'beltone' | 'other';
export type CountryId = 'es' | 'br' | 'it';
export type AlignmentType = 'yes' | 'no' | 'partial';
export type TargetType = 'B2B' | 'B2C' | 'B2B2C';

export interface OrganicMetrics {
  followers: number;
  avgMonthlyPosts: number; // NEW
  
  // Funnel - Awareness
  reach: number;       
  impressions: number; 
  
  // Funnel - Engagement
  interactions: number; 
  engagementRate: number; 
  
  // Funnel - Conversion / Profile Activity
  profileVisits: number; 
  clicks: number;        

  // Content Mix
  posts: number;   
  reels: number;   
  videos: number;  
  stories: number; 
  
  videoViews: number;
}

export interface PaidMetrics {
  advertisingEnabled: boolean; // NEW
  budget: number;
  avgMonthlyBudget: number; // NEW
  cpc: number; 
  ctr: number; 
  conversions: number;
  cpl: number; 
}

export interface AuditChecklist {
  profilePic: boolean;
  clearBio: boolean;
  linkFunctional: boolean;
  visualCoherence: boolean;
}

export interface BrandAlignment {
  colors: AlignmentType;
  typography: AlignmentType;
  tone: AlignmentType;
}

export interface PlatformData {
  username: string; // NEW
  isActive: boolean; // NEW
  target: TargetType; // NEW
  currentContentStyle: string; // NEW
  desiredContentStyle: string; // NEW
  organic: OrganicMetrics;
  paid: PaidMetrics;
  checklist: AuditChecklist; // NEW
  alignment: BrandAlignment; // NEW
}

export interface BrandMarketData {
  manager: string;
  hasCalendar: 'yes' | 'no' | 'partial';
  strategy: string;
  analysisPeriod: string;
  metrics: {
    instagram: PlatformData;
    facebook: PlatformData;
    linkedin: PlatformData;
    youtube: PlatformData;
  };
}

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