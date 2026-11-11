import React from "react";
import Can from "@/src/components/shared/Can";
import { SocialAvatar } from "./SocialAvatar";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Youtube, Linkedin, Link2, Lock, Link2Off, Loader2, ArrowRight } from "lucide-react";
import { ThreadsIcon, TwitterXIcon } from "./SocialMediaIcons";

export const PLATFORMS_METADATA: Record<
  string,
  {
    name: string;
    icon: any;
    iconSize?: number;
    brandColorClass: string;
    brandBgClass: string;
    glowBgClass?: string;
    borderHoverClass: string;
    shadowHoverClass: string;
    cardBgGradient: string;
    btnGradient: string;
  }
> = {
  youtube: {
    name: "YouTube Channel",
    icon: Youtube,
    brandColorClass: "text-[#FF0000]",
    brandBgClass: "bg-[#FF0000]/10",
    glowBgClass: "bg-[#FF0000]/10",
    borderHoverClass: "hover:border-[#FF0000]/30",
    shadowHoverClass: "hover:shadow-xl hover:shadow-[#FF0000]/8",
    cardBgGradient: "from-[#FF0000]/5 via-white/5 to-[#FF0000]/2 dark:from-[#FF0000]/8 dark:via-[#FF0000]/2 dark:to-(--card-color)",
    btnGradient: "from-red-600 via-red-500 to-rose-500 shadow-red-500/20",
  },
  linkedin: {
    name: "LinkedIn Profile",
    icon: Linkedin,
    brandColorClass: "text-[#0A66C2]",
    brandBgClass: "bg-[#0A66C2]/10",
    glowBgClass: "bg-[#0A66C2]/10",
    borderHoverClass: "hover:border-[#0A66C2]/30",
    shadowHoverClass: "hover:shadow-xl hover:shadow-[#0A66C2]/8",
    cardBgGradient: "from-[#0A66C2]/5 via-white/5 to-[#0A66C2]/2 dark:from-[#0A66C2]/8 dark:via-[#0A66C2]/2 dark:to-(--card-color)",
    btnGradient: "from-[#0A66C2] via-[#0077B5] to-[#3B92E3] shadow-blue-500/20",
  },
  twitter: {
    name: "Twitter / X Account",
    icon: TwitterXIcon,
    iconSize: 22,
    brandColorClass: "text-white dark:text-white",
    brandBgClass: "bg-black dark:bg-[#1c1c1c] border border-slate-950/20 dark:border-slate-800/50",
    glowBgClass: "bg-slate-900/10 dark:bg-white/10",
    borderHoverClass: "hover:border-black/30 dark:hover:border-(--card-border-color)",
    shadowHoverClass: "hover:shadow-xl hover:shadow-black/20",
    cardBgGradient: "from-slate-900/5 via-transparent to-transparent dark:from-slate-800/5",
    btnGradient: "from-black to-slate-900 dark:from-white dark:to-slate-100 dark:text-black shadow-slate-900/20",
  },
  threads: {
    name: "Threads Account",
    icon: ThreadsIcon,
    iconSize: 26,
    brandColorClass: "text-white dark:text-white",
    brandBgClass: "bg-black dark:bg-[#1c1c1c] border border-slate-950/20 dark:border-slate-800/50",
    glowBgClass: "bg-slate-900/10 dark:bg-white/10",
    borderHoverClass: "hover:border-black/30 dark:hover:border-(--card-border-color)",
    shadowHoverClass: "hover:shadow-xl hover:shadow-black/20",
    cardBgGradient: "from-slate-900/5 via-transparent to-transparent dark:from-slate-800/5",
    btnGradient: "from-black to-slate-900 dark:from-white dark:to-slate-100 dark:text-black shadow-slate-900/20",
  },
};

interface PlatformCardProps {
  platform: string;
  isGloballyEnabled: boolean;
  connection: any;
  activePlatformConnecting: string | null;
  onConnect: (platform: string) => void;
  onDisconnect: (connection: any) => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isGloballyEnabled,
  connection,
  activePlatformConnecting,
  onConnect,
  onDisconnect,
}) => {
  const meta = PLATFORMS_METADATA[platform] || {
    name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Platform`,
    icon: Link2,
    iconSize: 24,
    brandColorClass: "text-slate-500",
    brandBgClass: "bg-slate-100",
    glowBgClass: "bg-slate-100",
    borderHoverClass: "hover:border-slate-300",
    shadowHoverClass: "hover:shadow-md",
    cardBgGradient: "from-slate-50/10 to-transparent",
    btnGradient: "from-slate-800 to-slate-700",
  };

  const Icon = meta.icon;
  const isConnected = !!connection;

  return (
    <Card
      key={platform}
      className={`relative overflow-hidden border transition-all duration-300 rounded-xl flex flex-col justify-between h-full group shadow-sm ${
        !isGloballyEnabled
          ? "opacity-55 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10"
          : `border-slate-200/60 dark:border-(--card-border-color) bg-gradient-to-br ${meta.cardBgGradient} ${meta.borderHoverClass}`
      }`}
    >
      <CardContent className="sm:p-6 p-4 flex flex-col h-full justify-between gap-6 sm:pt-6 pt-4">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            {/* Branding glow container */}
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl transition-transform duration-300 hover:scale-105">
              <div
                className={`absolute inset-0 ${meta.glowBgClass || meta.brandBgClass} blur-md rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className={`relative flex items-center justify-center w-14 h-14 rounded-lg ${meta.brandBgClass}`}>
                <Icon size={meta.iconSize || 24} className={meta.brandColorClass} />
              </div>
            </div>

            {!isGloballyEnabled ? (
              <Badge
                variant="secondary"
                className="px-3.5 py-1.5 flex items-center gap-1.5 rounded-full text-[11px] font-bold tracking-wider capitalize"
              >
                <Lock size={11} />
                disable
              </Badge>
            ) : isConnected ? (
              <Badge className="px-3.5 py-1.5 capitalize flex items-center gap-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 font-bold text-xs tracking-wider rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                connected
              </Badge>
            ) : (
              <Badge className="px-3.5 py-1.5 capitalize flex items-center text-[11px] font-bold tracking-wider rounded-full bg-slate-50 text-slate-500 dark:bg-slate-900/40 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/80">
                not connected
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{meta.name}</h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {!isGloballyEnabled
                ? "This platform is disabled by system administrators. Enable it in system preferences to connect."
                : isConnected
                ? `Authorized credentials for ${connection.account_name}.`
                : `Connect your ${meta.name
                    .replace(" Profile", "")
                    .replace(" Channel", "")
                    .replace(" Account", "")} to manage posts, schedules and analytics.`}
            </p>
          </div>

          {/* Profile Detail if Connected */}
          {isConnected && (
            <div className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-300 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) space-y-0 shadow-xs">
              <SocialAvatar
                src={connection.profile_picture}
                name={connection.account_name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-150 dark:ring-slate-800"
                fallbackClassName="w-10 h-10 rounded-full bg-slate-150 dark:bg-slate-850 text-slate-600 dark:text-slate-50 flex items-center justify-center font-bold text-sm shadow border"
              />
              <div className="min-w-0 flex-1">
                <p className="text-md font-bold text-slate-800 dark:text-slate-50 truncate">
                  {connection.account_name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-600">
                  Connected on{" "}
                  {new Date(connection.connected_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-end gap-3 mt-auto pt-2">
          {!isGloballyEnabled ? (
            <Button disabled className="w-full h-11 rounded-lg font-bold text-xs" variant="outline">
              Unavailable
            </Button>
          ) : (
            <>
              {isConnected ? (
                <>
                  <Can permission="disconnect.social_media_connections">
                    <Button
                      onClick={() => onDisconnect(connection)}
                      variant="outline"
                      className="h-11 w-11 flex items-center justify-center rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-sm shrink-0"
                      title="Disconnect Account"
                    >
                      <Link2Off className="w-4 h-4" />
                    </Button>
                  </Can>
                  <Button
                    disabled
                    className="h-11 px-4.5 py-5 font-bold shadow-lg transition-all rounded-lg text-white opacity-85 shadow-emerald-500/10 bg-emerald-600/90 cursor-default flex items-center gap-2"
                  >
                    Connected
                  </Button>
                </>
              ) : (
                <Can permission="connect.social_media_connections">
                  <Button
                    onClick={() => onConnect(platform)}
                    disabled={activePlatformConnecting === platform}
                    className={`h-11 px-4.5 py-5 font-bold shadow-lg transition-all rounded-lg text-white active:scale-95 group flex items-center gap-2 bg-gradient-to-r ${meta.btnGradient} hover:opacity-90`}
                  >
                    {activePlatformConnecting === platform ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>
                        Connect <ArrowRight size={15} />
                      </>
                    )}
                  </Button>
                </Can>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformCard;
