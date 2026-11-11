export interface GuideSection {
  title: string;
  content: string;
  images: { url: string; caption?: string }[];
}

export interface Guide {
  _id: string;
  id?: string;
  title: string;
  category: string;
  sub_title?: string;
  description?: string;
  status: boolean;
  sections: GuideSection[];
  created_at: string;
  updated_at: string;
}

export interface GuideResponse {
  success: boolean;
  message: string;
  data: Guide[];
}
