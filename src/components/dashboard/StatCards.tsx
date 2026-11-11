"use client";

import { ROUTES } from "@/src/constants";
import { usePermissions } from "@/src/hooks/usePermissions";
import { useGetUserSubscriptionQuery } from "@/src/redux/api/subscriptionApi";
import { useAppSelector } from "@/src/redux/hooks";
import { StatCardsPropsData } from "@/src/types/dashboard";
import {
  Database,
  HatGlasses,
  LayoutTemplate,
  Megaphone,
  MessageSquare,
  MessageSquareMore,
  Send,
  Tags,
  Users,
  Webhook,
  Workflow,
} from "lucide-react";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
import UsageStatCard from "./UsageStatCard";

const StatCards = ({ counts, isLoading, section }: StatCardsPropsData) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const selectedWorkspace = useAppSelector((state) => state.workspace?.selectedWorkspace);
  const { data: subData } = useGetUserSubscriptionQuery();
  const subscription = subData?.data;
  const isActive =
    subscription && ["active", "trial"].includes(subscription?.status);

  const getStatData = (
    featureKey: string,
    usageKey: string,
    dashboardCount: number,
  ) => {
    let limit;
    let current = dashboardCount;

    if (isActive && subscription) {
      const isSnapshot = subscription.features && Object.keys(subscription.features).length > 0;
      limit = isSnapshot 
        ? subscription.features?.[featureKey] 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (subscription.plan_id as any)?.features?.[featureKey];
      current = selectedWorkspace ? dashboardCount : (subscription.usage?.[usageKey] ?? dashboardCount);
    }

    return { current, limit: Number(limit) || 0 };
  };

  const allStats: Array<{
    label: string;
    current: number;
    limit: number;
    icon: JSX.Element;
    color: string;
    path: string;
    section: string;
    trend?: string;
    suffix?: string;
  }> = [
      {
        label: t("tags_label"),
        ...getStatData("tags", "tags_used", counts?.totalTags || 0),
        icon: <Tags size={18} />,
        color: "text-orange-500",
        trend: "5",
        path: ROUTES.Tags,
        section: "metrics",
      },
      {
        label: t("contacts_label"),
        ...getStatData("contacts", "contacts_used", counts?.totalContacts || 0),
        icon: <Users size={18} />,
        color: "text-primary",
        trend: "5",
        path: ROUTES.ContactDirectory,
        section: "metrics",
      },
      {
        label: t("chats_label"),
        ...getStatData(
          "conversations",
          "conversations_used",
          counts?.totalConversations || 0,
        ),
        icon: <MessageSquare size={18} />,
        color: "text-indigo-500",
        path: ROUTES.WAChat,
        section: "metrics",
      },
      {
        label: t("sent_label_message"),
        ...getStatData(
          "totalMessagesSent",
          "messages_sent",
          counts?.totalMessagesSent || 0,
        ),
        icon: <Send size={18} />,
        color: "text-amber-500",
        path: ROUTES.WAChat,
        section: "metrics",
      },
      {
        label: t("received_label_message"),
        ...getStatData(
          "totalMessagesReceived",
          "messages_received",
          counts?.totalMessagesReceived || 0,
        ),
        icon: <MessageSquareMore size={18} />,
        color: "text-blue-500",
        path: ROUTES.WAChat,
        section: "metrics",
      },
      {
        label: t("storage_label"),
        ...getStatData("storage", "storage_used", counts?.storage_used || 0),
        icon: <Database size={18} />,
        color: "text-rose-500",
        path: ROUTES.Media,
        section: "metrics",
        suffix: "MB",
      },
      {
        label: t("flows_label"),
        ...getStatData(
          "bot_flow",
          "flows_used",
          counts?.totalAutomationFlows || 0,
        ),
        icon: <Workflow size={18} />,
        color: "text-violet-500",
        trend: "0",
        path: ROUTES.BotFlow,
        section: "usage",
      },
      {
        label: t("templates_label"),
        ...getStatData(
          "template_bots",
          "templates_used",
          counts?.totalTemplates || 0,
        ),
        icon: <LayoutTemplate size={18} />,
        color: "text-orange-500",
        trend: "3",
        path: ROUTES.MessageTemplates,
        section: "usage",
      },
      {
        label: t("campaigns_label"),
        ...getStatData(
          "campaigns",
          "campaigns_used",
          counts?.totalCampaigns || 0,
        ),
        icon: <Megaphone size={18} />,
        color: "text-blue-500",
        trend: "12%",
        path: ROUTES.MessageCampaigns,
        section: "usage",
      },
      {
        label: t("staff_label"),
        ...getStatData("staff", "staff_used", counts?.totalAgents || 0),
        icon: <HatGlasses size={18} />,
        color: "text-amber-500",
        trend: "1",
        path: ROUTES.Agents,
        section: "usage",
      },
      {
        label: t("webhooks_label"),
        ...getStatData(
          "whatsapp_webhook",
          "webhooks_used",
          counts?.totalWebhooks || 0,
        ),
        icon: <Webhook size={18} />,
        color: "text-violet-500",
        trend: "1",
        path: ROUTES.Webhooks,
        section: "usage",
      },
    ];

  const stats = allStats.filter((s) => {
    if (s.section !== section) return false;

    // Permission checks
    if (s.label === t("tags_label") && !hasPermission("view.tags")) return false;
    if (s.label === t("contacts_label") && !hasPermission("view.contacts")) return false;
    if ([t("chats_label"), t("sent_label_message"), t("received_label_message")].includes(s.label) && !hasPermission("manage.conversations")) return false;
    if (s.label === t("flows_label") && !hasPermission("view.automation_flows")) return false;
    if (s.label === t("templates_label") && !hasPermission("view.template")) return false;
    if (s.label === t("campaigns_label") && !hasPermission("view.campaigns")) return false;
    if (s.label === t("staff_label") && !hasPermission("view.agents")) return false;
    if (s.label === t("webhooks_label") && !hasPermission("view.ecommerce_webhooks")) return false;

    return true;
  });

  const gridCols =
    stats.length === 6
      ? "xl:grid-cols-6"
      : stats.length === 5
        ? "xl:grid-cols-5"
        : "xl:grid-cols-3";

  return (
    <div className={`grid [@media(max-width:462px)]:grid-cols-1! [@media(max-width:700px)]:grid-cols-2 [@media(max-width:1475px)]:grid-cols-3 lg:grid-cols-3 ${gridCols} gap-6`}>
      {stats.map((stat, index) => (
        <UsageStatCard
          key={index}
          label={stat.label}
          current={stat.current}
          limit={stat.limit}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          path={stat.path}
          isLoading={isLoading}
          suffix={stat.suffix}
          showUsage={
            isActive &&
            ![
              t("orders_label"),
              t("webhooks_label"),
            ].includes(stat.label)
          }
        />
      ))}
    </div>
  );
};

export default StatCards;
