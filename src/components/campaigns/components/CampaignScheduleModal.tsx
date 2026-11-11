import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/elements/ui/radio-group";
import { useEffect, useState } from "react";

interface CampaignScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    action: "send_immediately" | "reschedule",
    scheduledTime?: string,
  ) => void;
  type: "resend" | "publish";
  isLoading: boolean;
}

export const CampaignScheduleModal = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  isLoading,
}: CampaignScheduleModalProps) => {
  const [scheduleAction, setScheduleAction] = useState<
    "send_immediately" | "reschedule"
  >("send_immediately");
  const [newScheduledTime, setNewScheduledTime] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setScheduleAction("send_immediately");
      setNewScheduledTime("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onSubmit(
      scheduleAction,
      scheduleAction === "reschedule" ? newScheduledTime : undefined,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none dark:bg-landing-card-dark rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {type === "resend" ? "Resend Campaign" : "Scheduled Time Passed"}
          </DialogTitle>
          <div className="text-sm text-gray-500 mt-2">
            {type === "resend"
              ? "This campaign was originally scheduled. How would you like to resend it?"
              : "The original scheduled time has passed. Do you want to send it immediately or reschedule?"}
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <RadioGroup
            value={scheduleAction}
            onValueChange={(val: string) =>
              setScheduleAction(val as "send_immediately" | "reschedule")
            }
            className="gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="send_immediately" id="r-send-now" />
              <Label htmlFor="r-send-now" className="cursor-pointer font-medium">
                Send Immediately
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reschedule" id="r-reschedule" />
              <Label htmlFor="r-reschedule" className="cursor-pointer font-medium">
                Reschedule for Later
              </Label>
            </div>
          </RadioGroup>

          {scheduleAction === "reschedule" && (
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Label htmlFor="newScheduledTime">Select New Time</Label>
              <Input
                id="newScheduledTime"
                type="datetime-local"
                value={newScheduledTime}
                onChange={(e) => setNewScheduledTime(e.target.value)}
                className="w-full h-11"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-primary text-white"
          >
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
