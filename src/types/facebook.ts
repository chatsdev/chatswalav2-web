export interface AdListProps {
  adsetId: string;
  rightContent?: React.ReactNode;
  backBtn?: boolean;
}

export interface AdSetListProps {
  campaignId: string;
  rightContent?: React.ReactNode;
  backBtn?: boolean;
}

export interface CampaignListProps {
  accountId: string;
  rightContent?: React.ReactNode;
  backBtn?: boolean;
}

export interface CampaignStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string) => void;
  isLoading?: boolean;
  currentStatus?: string;
}

export interface CreativePerformance {
  ad_id: string;
  name: string;
  image: string | null;
  spend: number;
  results: number;
  cost_per_result: number;
}

export interface CreativePerformanceTableProps {
  data?: CreativePerformance[];
  isLoading: boolean;
}

export interface DemographicData {
  age: string;
  gender: string;
  spend: number;
  reach: number;
  results: number;
  cpr: number;
}

export interface InsightsDemographicsChartProps {
  data?: DemographicData[];
  isLoading: boolean;
}

export interface PlatformData {
  platform: string;
  spend: number;
  reach: number;
  results: number;
}

export interface InsightsPlatformsChartProps {
  data?: PlatformData[];
  isLoading: boolean;
}

export interface InsightsSummary {
  total_spend: number;
  total_impressions: number;
  total_reach: number;
  total_clicks: number;
  total_conversions: number;
  cost_per_result: number;
}

export interface InsightsStatsGridProps {
  summary?: InsightsSummary;
  isLoading: boolean;
}

export interface ChartDataPoint {
  date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  conversions: number;
}

export interface InsightsTrendChartProps {
  data?: ChartDataPoint[];
  isLoading: boolean;
}

export interface FacebookFeedPreviewProps {
  ad: any;
  videoUrl: string;
  imageUrl: string;
  isVideo: boolean;
}

export interface FacebookNotificationPreviewProps {
  ad: any;
}

export interface InstagramFeedPreviewProps {
  ad: any;
  videoUrl: string;
  imageUrl: string;
  isVideo: boolean;
}

export interface InstagramStoryPreviewProps {
  ad: any;
  videoUrl: string;
  imageUrl: string;
  isVideo: boolean;
}

export interface AdPreviewProps {
  ad: any;
  platform?: string[];
}

export interface AdCampaignWizardProps {
  adAccountId: string;
  campaignId?: string;
  adsetId?: string;
  initialData?: any;
}

export interface GeoLocationSelectorProps {
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
}

