
export interface PercentageSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export interface SidebarSummaryProps {
  platform: "facebook" | "instagram";
  mediaType: "post" | "story" | "reel";
  mediaUrl: string;
  permalink: string;
  caption: string;
  keywords: string[];
  matchingMethod: string;
  partialPercentage: number;
  selectedReplyId: string;
  activeTypeConfig: any;
  selectedMaterial: any;
  autoLikeComment: boolean;
  autoHideComment: boolean;
  requiresFollowing?: boolean;
  delaySeconds: number;
}

export interface ReelPreviewProps {
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: string;
  childrenData?: any[];
}


export interface Step1KeywordsOptionsProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  keywordInput: string;
  setKeywordInput: (v: string) => void;
  suggestedKeywords: string[];
  matchingMethod: string;
  setMatchingMethod: (v: string) => void;
  partialPercentage: number;
  setPartialPercentage: (v: number) => void;
  autoLikeComment: boolean;
  setAutoLikeComment: (v: boolean) => void;
  autoHideComment: boolean;
  setAutoHideComment: (v: boolean) => void;
  autoReplyText: string;
  setAutoReplyText: (v: string) => void;
  hideConditionType: "keywords" | "aimodel";
  setHideConditionType: (v: "keywords" | "aimodel") => void;
  hideKeywords: string[];
  setHideKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  hideKeywordInput: string;
  setHideKeywordInput: (v: string) => void;
  delaySeconds: number;
  setDelaySeconds: (v: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  addKeyword: () => void;
  mediaType: "post" | "story" | "reel";
  requiresFollowing: boolean;
  setRequiresFollowing: (v: boolean) => void;
  followGateMessage: string;
  setFollowGateMessage: (v: string) => void;
  followGateButtonYes: string;
  setFollowGateButtonYes: (v: string) => void;
  followGateButtonNo: string;
  setFollowGateButtonNo: (v: string) => void;
  followGateRejectionMessage: string;
  setFollowGateRejectionMessage: (v: string) => void;
}

export interface Step2ReplyMaterialProps {
  filteredReplyTypes: any[];
  activeTypeIndex: number;
  handleTypeChange: (index: number) => void;
  materialSearch: string;
  setMaterialSearch: (v: string) => void;
  loadingMaterials: boolean;
  filteredItems: any[];
  selectedReplyId: string;
  handleMaterialSelect: (id: string) => void;
  handlePreview: (e: React.MouseEvent, item: any) => void;
  activeTypeConfig: any;
  platform: "facebook" | "instagram";
}

export interface StepIndicatorProps {
  current: number;
  total: number;
  labels: string[];
  onStepClick: (index: number) => void;
}