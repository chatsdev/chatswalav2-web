import { MATCHING_METHODS } from "@/src/data/KeywordActionData";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { Step1KeywordsOptionsProps } from "@/src/types/socialAutomation";
import {
  Check,
  Clock,
  EyeOff,
  Heart,
  MessageCircle,
  Settings,
  UserCheck,
  X
} from "lucide-react";
import React from "react";
import { PercentageSlider } from "./PercentageSlider";

export const Step1KeywordsOptions: React.FC<Step1KeywordsOptionsProps> = ({
  keywords,
  setKeywords,
  keywordInput,
  setKeywordInput,
  suggestedKeywords,
  matchingMethod,
  setMatchingMethod,
  partialPercentage,
  setPartialPercentage,
  autoLikeComment,
  setAutoLikeComment,
  autoHideComment,
  setAutoHideComment,
  autoReplyText,
  setAutoReplyText,
  hideConditionType,
  setHideConditionType,
  hideKeywords,
  setHideKeywords,
  hideKeywordInput,
  setHideKeywordInput,
  delaySeconds,
  setDelaySeconds,
  handleKeyDown,
  addKeyword,
  mediaType,
  requiresFollowing,
  setRequiresFollowing,
  followGateMessage,
  setFollowGateMessage,
  followGateButtonYes,
  setFollowGateButtonYes,
  followGateButtonNo,
  setFollowGateButtonNo,
  followGateRejectionMessage,
  setFollowGateRejectionMessage,
}) => {
  return (
    <div className="sm:p-6 p-4 space-y-6">
      {/* Keywords Tag Input (Read-only) */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-slate-500 ">
          Trigger Keywords
        </Label>
        <div
          className={cn(
            "min-h-10 p-3 rounded-lg border transition-all flex flex-wrap gap-2 items-center",
            "bg-slate-50 dark:bg-(--page-body-bg)",
            keywords.length
              ? "border-primary/20"
              : "border-slate-200 dark:border-none",
          )}
        >
          {keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex break-all whitespace-normal line-clamp-1 items-center px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-white"
            >
              {kw}
              <Button variant="unstyled"
                type="button"
                onClick={() =>
                  setKeywords((prev) => prev.filter((k) => k !== kw))
                }
                className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </Button>
            </span>
          ))}
          <div className="flex-1 min-w-[120px]">
            <Input
              type="text"
              placeholder="Type a keyword and press Enter..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 px-1 placeholder:text-slate-400 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Matching Methods */}
      <div className="space-y-3">
        <Label className="text-sm font-bold text-slate-500">
          Matching Method
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {MATCHING_METHODS.map((m) => (
            <Button
              key={m.value}
              type="button"
              onClick={() => setMatchingMethod(m.value)}
              className={cn(
                "flex h-18 justify-start items-start gap-3 p-4 rounded-lg border text-left transition-all",
                matchingMethod === m.value
                  ? "border-primary bg-primary/5! ring-1 ring-primary/10 shadow-sm"
                  : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/20 hover:bg-slate-50/50! bg-[unset]! dark:hover:bg-(--table-hover)!",
              )}
            >
              <div
                className={cn(
                  "w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all",
                  matchingMethod === m.value
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-(--card-border-color)",
                )}
              >
                {matchingMethod === m.value && (
                  <Check size={5} className="text-white" />
                )}
              </div>
              <div className="min-w-0 text-left rtl:text-right">
                <p
                  className={cn(
                    "text-sm font-bold",
                    matchingMethod === m.value
                      ? "text-primary"
                      : "text-slate-800 dark:text-white",
                  )}
                >
                  {m.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {matchingMethod === "partial" && (
        <PercentageSlider
          value={partialPercentage}
          onChange={setPartialPercentage}
        />
      )}

      {/* Additional Options */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-(--card-border-color)">
        <Label className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
          <Settings size={14} /> Automation Settings
        </Label>

        <div className="space-y-3">
          {mediaType !== "story" && (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
              <div className="flex items-center gap-3">
                <Heart className="text-pink-500" size={18} />
                <div>
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white">
                    Auto-Like Comment
                  </p>
                  <p className="text-sm text-slate-400">
                    Automatically likes the matching comment.
                  </p>
                </div>
              </div>
              <Switch
                checked={autoLikeComment}
                onCheckedChange={setAutoLikeComment}
              />
            </div>
          )}

          {mediaType !== "story" && (
            <div className="flex flex-col gap-3 p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
              <div className="flex items-center gap-3">
                <MessageCircle className="text-blue-500" size={18} />
                <div>
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white">
                    Auto-Reply to Comment
                  </p>
                  <p className="text-sm text-slate-400">
                    Leaves a public reply on the user's comment (Leave blank to
                    disable).
                  </p>
                </div>
              </div>
              <Input
                type="text"
                value={autoReplyText}
                onChange={(e) => setAutoReplyText(e.target.value)}
                placeholder="e.g. Check your DM for further instructions"
                className="mt-1 h-10 rounded-lg bg-white dark:bg-(--card-color) border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20"
              />
            </div>
          )}

          {mediaType !== "story" && (
            <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EyeOff className="text-slate-500" size={18} />
                  <div>
                    <p className="text-[15px] font-bold text-slate-800 dark:text-white">
                      Auto-Hide Comment
                    </p>
                    <p className="text-sm text-slate-400">
                      Hides the comment to prevent spam or copycats.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={autoHideComment}
                  onCheckedChange={setAutoHideComment}
                />
              </div>

              {autoHideComment && (
                <div className="space-y-4 pt-3 border-t border-slate-150 dark:border-(--card-border-color)">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">
                      Hide Condition
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={
                          hideConditionType === "keywords"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setHideConditionType("keywords")}
                        className="h-9"
                      >
                        Keyword Match
                      </Button>
                      <Button
                        type="button"
                        variant={
                          hideConditionType === "aimodel"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setHideConditionType("aimodel")}
                        className="h-9"
                      >
                        AI Model Analysis
                      </Button>
                    </div>
                  </div>

                  {hideConditionType === "keywords" && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">
                        Hide Keywords
                      </Label>
                      <div
                        className={cn(
                          "min-h-10 p-2 rounded-lg border flex flex-wrap gap-2 items-center",
                          "bg-white dark:bg-(--card-color) border-slate-200 dark:border-slate-700",
                        )}
                      >
                        {hideKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-(--dark-body) text-xs font-bold"
                          >
                            {kw}
                            <Button variant="unstyled"
                              type="button"
                              onClick={() =>
                                setHideKeywords((prev) =>
                                  prev.filter((k) => k !== kw),
                                )
                              }
                              className="ml-1.5 text-slate-400 hover:text-red-500"
                            >
                              <X size={12} />
                            </Button>
                          </span>
                        ))}
                        <Input
                          type="text"
                          placeholder="Type bad word & press Enter"
                          value={hideKeywordInput}
                          onChange={(e) => setHideKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              if (
                                hideKeywordInput.trim() &&
                                !hideKeywords.includes(hideKeywordInput.trim())
                              ) {
                                setHideKeywords((p) => [
                                  ...p,
                                  hideKeywordInput.trim(),
                                ]);
                                setHideKeywordInput("");
                              }
                            }
                          }}
                          className="flex-1 min-w-[120px] h-7 border-none bg-transparent shadow-none focus-visible:ring-0 px-1 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {hideConditionType === "aimodel" && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg">
                      <p className="text-[13px] text-blue-700 dark:text-blue-400">
                        The comment will be analyzed by your globally configured
                        AI Model in AI Settings. If the model determines the
                        comment contains hate speech, vulgarity, or spam, it
                        will be automatically hidden.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4 p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="text-indigo-500" size={18} />
                <div>
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white">
                    Requires Following
                  </p>
                  <p className="text-sm text-slate-400">
                    User must follow your profile to receive the DM reply.
                  </p>
                </div>
              </div>
              <Switch
                checked={requiresFollowing}
                onCheckedChange={setRequiresFollowing}
              />
            </div>

            {requiresFollowing && (
              <div className="space-y-4 pt-3 border-t border-slate-150 dark:border-(--card-border-color)">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Follow Gate Message
                  </Label>
                  <Input
                    type="text"
                    value={followGateMessage}
                    onChange={(e) => setFollowGateMessage(e.target.value)}
                    placeholder="E.g., You must follow us to get this offer. Would you like to follow now?"
                    className="h-10 rounded-lg bg-white dark:bg-(--card-color) border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Yes Button Text
                    </Label>
                    <Input
                      type="text"
                      value={followGateButtonYes}
                      onChange={(e) => setFollowGateButtonYes(e.target.value)}
                      placeholder="E.g., Yes, follow"
                      className="h-10 rounded-lg bg-white dark:bg-(--card-color) border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      No Button Text
                    </Label>
                    <Input
                      type="text"
                      value={followGateButtonNo}
                      onChange={(e) => setFollowGateButtonNo(e.target.value)}
                      placeholder="E.g., No, thanks"
                      className="h-10 rounded-lg bg-white dark:bg-(--card-color) border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Gate Rejection Message
                  </Label>
                  <Input
                    type="text"
                    value={followGateRejectionMessage}
                    onChange={(e) =>
                      setFollowGateRejectionMessage(e.target.value)
                    }
                    placeholder="E.g., Sorry, this exclusive offer is only for our followers!"
                    className="h-10 rounded-lg bg-white dark:bg-(--card-color) border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
            <div className="flex items-center gap-3">
              <Clock className="text-amber-500" size={18} />
              <div>
                <p className="text-[15px] font-bold text-slate-800 dark:text-white">
                  Reply Delay
                </p>
                <p className="text-sm text-slate-400">
                  Simulate natural response time (seconds).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 w-full">
              <Input
                type="number"
                min={0}
                max={3600}
                value={delaySeconds}
                onChange={(e) =>
                  setDelaySeconds(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-24 h-10 rounded-lg bg-white dark:bg-(--card-color) border-slate-200 dark:border-slate-700 focus-visible:ring-primary/20"
              />
              <span className="text-sm text-slate-400">seconds delay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
