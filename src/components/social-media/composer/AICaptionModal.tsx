import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { TONES, LANGUAGES } from "./utils";

interface AICaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiKeywords: string;
  setAiKeywords: (val: string) => void;
  aiTone: string;
  setAiTone: (val: string) => void;
  aiLanguage: string;
  setAiLanguage: (val: string) => void;
  aiLimit: number;
  setAiLimit: (val: number) => void;
  aiNumCaptions: number;
  setAiNumCaptions: (val: number) => void;
  aiCustomPrompt: string;
  setAiCustomPrompt: (val: string) => void;
  generatedCaptions: string[];
  setCaption: (val: string) => void;
  isGeneratingCaption: boolean;
  onGenerate: () => void;
}

export function AICaptionModal({
  isOpen,
  onClose,
  aiKeywords,
  setAiKeywords,
  aiTone,
  setAiTone,
  aiLanguage,
  setAiLanguage,
  aiLimit,
  setAiLimit,
  aiNumCaptions,
  setAiNumCaptions,
  aiCustomPrompt,
  setAiCustomPrompt,
  generatedCaptions,
  setCaption,
  isGeneratingCaption,
  onGenerate
}: AICaptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-xl dark:bg-(--page-body-bg)">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-extrabold text-lg">
            <Sparkles className="animate-pulse" size={20} />
            AI Social Caption Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Keywords */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-350">
              What is this post about? (Keywords/Topic)
            </Label>
            <Input
              placeholder="e.g. Special weekend summer discount on organic cotton apparel"
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
              className="text-sm rounded-lg dark:bg-(--dark-body) h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-350">Post Tone</Label>
              <select
                className="w-full h-11 px-3 border border-slate-200 dark:border-(--card-border-color) rounded-lg dark:bg-(--dark-body) text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
              >
                {TONES.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-350">Language</Label>
              <select
                className="w-full h-11 px-3 border border-slate-200 dark:border-(--card-border-color) rounded-lg bg-white dark:bg-
                ( text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={aiLanguage}
                onChange={(e) => setAiLanguage(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Length */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-350">Max Characters</Label>
              <Input
                type="number"
                value={aiLimit}
                onChange={(e) => setAiLimit(parseInt(e.target.value) || 200)}
                className="text-sm rounded-xl h-11"
              />
            </div>

            {/* Count */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-350">Options Count</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={aiNumCaptions}
                onChange={(e) => setAiNumCaptions(Math.min(5, Math.max(1, parseInt(e.target.value) || 3)))}
                className="text-sm rounded-xl h-11"
              />
            </div>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-350">
              Additional Prompt Context (Optional)
            </Label>
            <Textarea
              placeholder="e.g. Include hashtag #SummerSale and mention free shipping above $50"
              value={aiCustomPrompt}
              onChange={(e) => setAiCustomPrompt(e.target.value)}
              className="text-xs rounded-xl min-h-[70px] resize-none"
            />
          </div>

          {/* Generation Results */}
          {generatedCaptions.length > 0 && (
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Select a generated caption to apply:
              </Label>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {generatedCaptions.map((cap, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCaption(cap);
                      onClose();
                    }}
                    className="p-3 border border-slate-200 dark:border-slate-800 hover:border-primary/50 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl cursor-pointer hover:bg-primary/5 transition-all text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium"
                  >
                    {cap}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <Button variant="outline" onClick={onClose} className="h-10 text-xs font-bold">
            Close
          </Button>
          <Button
            onClick={onGenerate}
            disabled={isGeneratingCaption}
            className="bg-primary text-white h-10 px-5 text-xs font-bold gap-2 border-none"
          >
            {isGeneratingCaption ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate Captions
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
