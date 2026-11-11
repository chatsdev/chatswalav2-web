import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { ConfirmModalProps } from "@/src/types/shared";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  subtitle = "This action cannot be undone. All values associated with this field will be lost.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  showIcon = true,
  showCancelButton = true,
  loadingText,
}) => {
  const { t } = useTranslation();
  const getVariantConfig = () => {
    switch (variant) {
      case "primary":
        return {
          icon: Info,
          iconBgColor: "bg-(--light-primary)",
          iconColor: "text-primary",
          buttonColor: "bg-primary hover:bg-primary/90",
        };
      case "danger":
        return {
          icon: AlertCircle,
          iconBgColor: "bg-red-100",
          iconColor: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          iconBgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "success":
        return {
          icon: CheckCircle,
          iconBgColor: "bg-green-100",
          iconColor: "text-green-600",
          buttonColor: "bg-primary hover:bg-green-700",
        };
      case "info":
        return {
          icon: Info,
          iconBgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          icon: Info,
          iconBgColor: "bg-primary/10",
          iconColor: "text-primary",
          buttonColor: "bg-primary hover:bg-primary/90",
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = config.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <AlertDialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)] border-none dark:bg-(--dark-body) overflow-visible rounded-lg shadow-2xl">
        {showIcon && (
          <div className="flex justify-center absolute -top-10 left-1/2 -translate-x-1/2 z-50">
            <div className="relative">
              <div
                className={`${config.iconBgColor} rounded-full p-4 w-15 h-15 flex items-center justify-center shadow-lg`}
              >
                <IconComponent className={`${config.iconColor} w-8 h-8`} />
              </div>
            </div>
          </div>
        )}
        <div className="p-0 max-h-[80dvh] overflow-y-auto custom-scrollbar">
          <AlertDialogHeader className="text-center space-y-4 relative mt-5">
            <AlertDialogTitle className="text-xl mb-0 font-bold text-center text-gray-900 dark:text-gray-100 tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed mx-auto">
              {subtitle}
            </AlertDialogDescription>
            {isLoading && loadingText && (
              <div className="text-sm text-gray-500 mt-2">{loadingText}</div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-4 mt-[calc(25px+(40-25)*((100vw-320px)/(1920-320)))]">
            {showCancelButton && (
              <Button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4.5 sm:py-5 py-3 h-11! rounded-lg font-bold bg-gray-100 border-none text-gray-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-400 hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 order-2 sm:order-1"
              >
                {cancelText}
              </Button>
            )}
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`${config.buttonColor} flex-1 h-11! px-4.5 sm:py-5 py-3  text-white rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center order-1 sm:order-2`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("common_loading", { defaultValue: "Loading..." })}
                </>
              ) : (
                confirmText
              )}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
