"use client";

import React from "react";
import { BookOpen, KeyRound, ChevronRight, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/src/elements/ui/card";
import { permissionScope } from "@/src/data/shopify";

/** Single info card component */
const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden">
    <CardContent className="p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">{icon}</div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
        {children}
      </div>
    </CardContent>
  </Card>
);

/** Numbered step for the how-to guide */
const Step = ({ n, text }: { n: number; text: string }) => (
  <div className="flex items-start gap-2.5">
    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
      {n}
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400">{text}</p>
  </div>
);

export const ShopifyInstructions: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* How to get credentials */}
      <InfoCard
        icon={<BookOpen size={14} className="text-primary" />}
        title="How to get credentials"
      >
        <div className="space-y-2.5 mt-1">
          <Step n={1} text="Log in to your Shopify Admin and go to Settings → Apps and sales channels." />
          <Step n={2} text="Click Develop apps → Create an app. Give it a name and click Create app." />
          <Step n={3} text="In the API credentials tab, click Install app to generate the Admin API Access Token (shown once)." />
          <Step n={4} text="Copy the API key (Client ID) and API secret key (Client Secret) from the same page." />
          <Step n={5} text="Enter your shop domain in the form (e.g. my-store.myshopify.com)." />
        </div>
        <a
          href="https://help.shopify.com/en/manual/apps/app-types/custom-apps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary font-semibold mt-3 hover:underline"
        >
          Official Shopify docs <ExternalLink size={11} />
        </a>
      </InfoCard>

      {/* Required permissions */}
      <InfoCard
        icon={<KeyRound size={14} className="text-primary" />}
        title="Required API Scopes"
      >
        <p className="mb-2">Grant the following scopes when configuring your custom app:</p>
        {permissionScope.map(({ scope, desc }) => (
          <div key={scope} className="flex items-center gap-2 py-1.5 border-b border-slate-100 dark:border-(--card-border-color) last:border-0">
            <ChevronRight size={11} className="text-primary shrink-0" />
            <code className="text-xs bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded font-mono">{scope}</code>
            <span className="text-slate-400">— {desc}</span>
          </div>
        ))}
      </InfoCard>

      {/* Security note */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Security Notice</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400/80 leading-relaxed">
              Your API token grants full Admin API access to your store. It is encrypted and stored securely — never share it publicly or commit it to source control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
