"use client";

import { PageContentProps } from "@/src/types/landingPage";
import React from "react";

const PageContent: React.FC<PageContentProps> = ({ content }) => {
  return (
    <div
      className="dynamic-content max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default PageContent;
