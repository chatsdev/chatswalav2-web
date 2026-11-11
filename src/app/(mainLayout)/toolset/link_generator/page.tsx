"use client";

import { useState } from "react";
import CommonHeader from "@/src/shared/CommonHeader";
import ShortLinkForm from "@/src/components/tools/short-links/ShortLinkForm";
import ShortLinkSuccess from "@/src/components/tools/short-links/ShortLinkSuccess";
import { ShortLinkData } from "@/src/types/shortLink";

const Page = () => {
  const [generatedData, setGeneratedData] = useState<ShortLinkData | null>(null);

  return (
    <div className="p-4 sm:p-8 space-y-8 pt-0!">
      {!generatedData && (
        <>
          <CommonHeader backBtn title="Create WhatsApp Link" description="Create a chat link with a pre-filled message" />
          <div className="mx-auto">
            <ShortLinkForm onSuccess={setGeneratedData} />
          </div>
        </>
      )}

      {generatedData && <ShortLinkSuccess data={generatedData} onReset={() => setGeneratedData(null)} />}
    </div>
  );
};

export default Page;
