import { INFOMODALDATE } from "../data/common";

export interface InfoContent {
  label: string;
  value: string;
  subContent?: InfoContent[];
}

export interface InfoModalItem {
  title: string;
  description: string;
  content: InfoContent[];
  externalLink?: {
    label: string;
    url: string;
    description: string;
  };
}

export interface InfoModalProps {
  dataKey: keyof typeof INFOMODALDATE;
  className?: string;
  iconSize?: number;
}