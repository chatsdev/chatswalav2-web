/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants/route";
import { operatorMap, prefixMap } from "@/src/data/botFlow";
import { NODETEMPLATES } from "@/src/data/SidebarList";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import {
  useCreateAutomationFlowMutation,
  useGetAutomationFlowQuery,
  useUpdateAutomationFlowMutation,
} from "@/src/redux/api/automationApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Node,
} from "@xyflow/react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Play,
  Save,
  Search,
  Send,
  Sparkles,
  Workflow,
  X
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AIAutomationFlowModal from "./AIAutomationFlowModal";
import ChannelSelectModal from "./ChannelSelectModal";
import { CustomEdge } from "./edges/CustomEdge";
import { CustomNode } from "./nodes/CustomNode";
import { AdvancedConditionNode } from "./nodes/AdvancedConditionNode";
import TestFlowModal from "./TestFlowModal";

const edgeTypes = {
  custom: CustomEdge,
};

const nodeTypes = {
  custom: CustomNode,
  advanced_condition: AdvancedConditionNode,
};

const FlowCanvas = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const flowId = params?.id as string;

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [selectedCategory] = useState("All");
  const [flowName, setFlowName] = useState("New Flow");
  const [forceValidation, setForceValidation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { screenToFlowPosition, setViewport } = useReactFlow();

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const {
    isFeatureEnabled,
    getEnabledChannels,
    isLoading: subLoading,
  } = useFeatureAccess();
  const enabledChannels = getEnabledChannels();
  const {
    facebook: hasFb,
    instagram: hasIg,
    telegram: hasTg,
  } = enabledChannels;

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    if (!flowId && !subLoading && !selectedPlatform) {
      const hasOmnichannel =
        (hasFb && isFeatureEnabled("fb_automation")) ||
        (hasIg && isFeatureEnabled("ig_automation")) ||
        (hasTg && isFeatureEnabled("tg_automation"));
      if (!hasOmnichannel) {
        setSelectedPlatform("whatsapp");
        setIsPlatformModalOpen(false);
      } else {
        setIsPlatformModalOpen(true);
      }
    }
  }, [
    flowId,
    subLoading,
    hasFb,
    hasIg,
    hasTg,
    isFeatureEnabled,
    selectedPlatform,
  ]);

  const { data: flowData, isLoading: isLoadingFlow } =
    useGetAutomationFlowQuery(
      { flowId, workspace_id: selectedWorkspace?._id },
      {
        skip: !flowId,
      },
    );

  const [createFlow, { isLoading: isCreating }] =
    useCreateAutomationFlowMutation();
  const [updateFlow, { isLoading: isUpdating }] =
    useUpdateAutomationFlowMutation();

  useEffect(() => {
    dispatch(setSidebarToggle(true));

    return () => {
      dispatch(setSidebarToggle(false));
    };
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsDrawerCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          forceValidation,
        },
      })),
    );
  }, [forceValidation, setNodes]);

  const validateFlow = useCallback(() => {
    if (nodes.length === 0) return false;
    // Allow single node with no edges, or multiple nodes with edges
    if (nodes.length > 1 && edges.length === 0) return false;

    const allNodesValid = nodes.every((node) => {
      if (node.data.nodeType === "trigger") {
        return (
          node.data.contactType &&
          node.data.triggerType &&
          (node.data.triggerType === "any message" ||
            node.data.triggerType === "order received" ||
            (node.data.keywords && node.data.keywords.length > 0))
        );
      }
      if (
        node.data.nodeType === "text_message" ||
        node.data.nodeType === "send-message"
      ) {
        return node.data.message && node.data.message.trim();
      }
      if (node.data.nodeType === "button_message") {
        return (
          node.data.message?.trim() &&
          node.data.buttons?.length > 0 &&
          node.data.buttons.every((b: any) => b.text)
        );
      }
      if (node.data.nodeType === "list_message") {
        return (
          node.data.bodyText?.trim() &&
          node.data.buttonText?.trim() &&
          node.data.sections?.length > 0
        );
      }
      if (node.data.nodeType === "media_message") {
        return node.data.mediaUrl?.trim();
      }
      if (node.data.nodeType === "location") {
        return node.data.lat && node.data.lng;
      }
      if (node.data.nodeType === "contact_card") {
        return (
          node.data.contacts?.length > 0 &&
          node.data.contacts.every((c: any) => c.firstName && c.phone)
        );
      }
      if (
        node.data.nodeType === "api_request" ||
        node.data.nodeType === "api" ||
        node.data.nodeType === "webhook"
      ) {
        return node.data.url?.trim();
      }
      if (node.data.nodeType === "send_template") {
        return node.data.template_id;
      }
      if (node.data.nodeType === "form_flow") {
        return (
          node.data.form_id &&
          node.data.message_body &&
          node.data.message_body.trim()
        );
      }
      if (node.data.nodeType === "add_segment") {
        return node.data.segment_id;
      }
      if (node.data.nodeType === "remove_tag") {
        return Array.isArray(node.data.tag_ids) && node.data.tag_ids.length > 0;
      }
      if (node.data.nodeType === "assign_agent") {
        return !!node.data.agent_id;
      }
      if (node.data.nodeType === "assign_random_agent") {
        // Valid if mode is 'all', or mode is 'team' AND a team is selected
        const mode = node.data.assign_mode || "all";
        return mode === "all" || !!node.data.team_id;
      }
      if (node.data.nodeType === "update_contact") {
        return (
          node.data.updates?.length > 0 &&
          node.data.updates.every((u: any) => u.field_key && u.value?.trim())
        );
      }
      if (node.data.nodeType === "move_to_pipeline_stage") {
        return !!node.data.funnel_id && !!node.data.stage_id;
      }
      if (node.data.nodeType === "cta_button") {
        return (
          node.data.text?.trim() &&
          node.data.button_text?.trim() &&
          node.data.url?.trim()
        );
      }
      if (node.data.nodeType === "assign_chatbot") {
        return node.data.chatbot_id;
      }
      if (node.data.nodeType === "save_to_google_sheet") {
        return node.data.google_account_id && node.data.spreadsheet_id;
      }
      if (node.data.nodeType === "send_google_form") {
        return node.data.google_account_id && node.data.form_id;
      }
      if (node.data.nodeType === "send_catalog" || node.data.nodeType === "send_shopify") {
        return !!node.data.product_id;
      }
      if (node.data.nodeType === "advanced_condition") {
        return (
          node.data.rules?.length > 0 &&
          node.data.rules.every((r: any) =>
            r.field?.trim() &&
            (['is_empty', 'is_not_empty'].includes(r.operator) || r.value?.trim())
          )
        );
      }

      if (node.data.nodeType === "create_calendar_event" || node.data.nodeType === "create_google_meet") {
        return node.data.google_account_id && node.data.summary;
      }
      if (node.data.nodeType === "run_sub_flow") {
        return !!node.data.sub_flow_id;
      }
      if (node.data.nodeType === "appointment_flow") {
        return !!node.data.appointment_config_id;
      }
      return true;
    });

    return allNodesValid;
  }, [nodes, edges]);

  const isSaveDisabled = isCreating || isUpdating || !validateFlow();

  const restoreFlowFromData = useCallback(
    (flow: any) => {
      setFlowName(flow.name || "AI Generated Flow");

      if (flow.platform) {
        setSelectedPlatform(flow.platform);
      } else if (!selectedPlatform) {
        setSelectedPlatform("all");
      }

      const restoredNodes = flow.nodes
        .filter((n: any) => {
          if (n.id.startsWith("trigger-implicit-")) return false;
          if (
            n.type === "condition" &&
            (n.id.startsWith("cond-start-") ||
              n.id.startsWith("cond-btn-") ||
              n.id.startsWith("cond-list-"))
          )
            return false;
          return true;
        })
        .map((n: any) => {
          const params = JSON.parse(JSON.stringify(n.parameters || {}));

          // Reconstruct Keywords if this is a trigger
          let keywords = params.keywords;
          if (n.type === "trigger") {
            const connectedCondition = flow.nodes?.find(
              (chk: any) =>
                chk.type === "condition" &&
                chk.id.startsWith("cond-start-") &&
                flow.connections?.some(
                  (c: any) => c.source === n.id && c.target === chk.id,
                ),
            );
            if (connectedCondition?.parameters?.condition?.value) {
              const val = connectedCondition.parameters.condition.value;
              const rawKeywords = Array.isArray(val) ? val : [val];
              keywords = rawKeywords.filter(
                (kw: string) => !kw.includes("___"),
              );
            }
          }

          if (params.buttons && Array.isArray(params.buttons)) {
            params.buttons = params.buttons.map((btn: any) => ({
              ...btn,
              value: btn.value?.includes("___")
                ? btn.value.split("___").pop()
                : btn.value,
            }));
          }
          if (params.sections && Array.isArray(params.sections)) {
            params.sections = params.sections.map((sec: any) => ({
              ...sec,
              items: sec.items?.map((item: any) => ({
                ...item,
                title: item.title?.includes("___")
                  ? item.title.split("___").pop()
                  : item.title,
              })),
            }));
          }

          return {
            id: n.id,
            type: "custom",
            position: n.position || { x: 100, y: 100 },
            data: {
              ...params,
              nodeType:
                params.nodeType ||
                (n.type === "send_message"
                  ? "text_message"
                  : n.type === "trigger"
                    ? "trigger"
                    : n.type),
              message:
                params.message ||
                params.message_template ||
                params.message_body ||
                "",
              keywords: keywords || [],
              triggerType: params.triggerType || "contains keyword",
              contactType: params.contactType || "Contact",
              platform: flow.platform || selectedPlatform || "all",
              // Restore location params if present
              ...(params.location_params
                ? {
                  lat: params.location_params.latitude,
                  lng: params.location_params.longitude,
                  name: params.location_params.name,
                  address: params.location_params.address,
                }
                : {}),
              // Restore media params if present
              ...(params.media_url
                ? {
                  mediaUrl: params.media_url,
                  caption: params.message_template,
                }
                : {}),
            },
          };
        });

      // Filter and remap edges to bypass the condition node
      const restoredEdges = (flow.connections || [])
        .filter((c: any) => {
          if (c.source.startsWith("trigger-implicit-")) return false;
          const sourceNode = flow.nodes?.find((n: any) => n.id === c.source);
          return (
            sourceNode?.type !== "condition" ||
            (!sourceNode.id.startsWith("cond-start-") &&
              !sourceNode.id.startsWith("cond-btn-") &&
              !sourceNode.id.startsWith("cond-list-"))
          );
        })
        .map((c: any) => {
          const sourceNode = flow.nodes?.find((n: any) => n.id === c.source);
          let source = c.source;
          let sourceHandle = ["default", "source", "output"].includes(
            c.sourceHandle,
          )
            ? "src"
            : c.sourceHandle;
          let target = c.target;
          let targetHandle = ["default", "target", "input"].includes(
            c.targetHandle,
          )
            ? "tgt"
            : c.targetHandle;

          // Resolve legacy/AI-generated source handles for ask_and_wait nodes
          if (
            sourceNode &&
            (sourceNode.type === "ask_and_wait" ||
              sourceNode.parameters?.nodeType === "ask_and_wait")
          ) {
            if (sourceHandle === "expected_answers") {
              const expectedAnswers =
                sourceNode.parameters?.expected_answers || [];
              const matchingAnswer = expectedAnswers.find((ans: any) => {
                if (!ans.route) return false;
                return (
                  ans.route === target ||
                  target.includes(ans.route) ||
                  ans.route.includes(target)
                );
              });
              if (matchingAnswer) {
                sourceHandle = matchingAnswer.route;
              } else if (expectedAnswers.length > 0) {
                sourceHandle = expectedAnswers[0].route;
              }
            } else if (sourceHandle === "fallback_route") {
              sourceHandle = "fallback";
            }
          }

          const targetNode = flow.nodes?.find((n: any) => n.id === c.target);
          if (
            targetNode?.type === "condition" &&
            (targetNode.id.startsWith("cond-start-") ||
              targetNode.id.startsWith("cond-btn-") ||
              targetNode.id.startsWith("cond-list-"))
          ) {
            const outgoingEdge = flow.connections?.find(
              (out: any) => out.source === targetNode.id,
            );
            if (outgoingEdge) {
              target = outgoingEdge.target;
              targetHandle =
                outgoingEdge.targetHandle === "default" ||
                  outgoingEdge.targetHandle === "target"
                  ? "tgt"
                  : outgoingEdge.targetHandle;
            }

            if (targetNode.id.startsWith("cond-btn-")) {
              const parts = targetNode.id.split("___");
              if (parts.length >= 3) {
                source = parts[1];
                sourceHandle = `src-btn-${parts[2]}`;
              }
            } else if (targetNode.id.startsWith("cond-list-")) {
              const parts = targetNode.id.split("___");
              if (parts.length >= 4) {
                source = parts[1];
                sourceHandle = `src-item-${parts[2]}-${parts[3]}`;
              }
            }
          }

          return {
            id:
              c.id ||
              `e-${source}-${target}-${Math.random().toString(36).substr(2, 9)}`,
            source: source,
            sourceHandle: sourceHandle || "src",
            target: target,
            targetHandle: targetHandle || "tgt",
            type: "custom",
            animated: false,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          };
        })
        .filter((edge: any) => edge.source && edge.target) // Ensure basic integrity
        .filter(
          (edge: any, index: number, self: any[]) =>
            index ===
            self.findIndex(
              (t) =>
                t.source === edge.source &&
                t.target === edge.target &&
                t.sourceHandle === edge.sourceHandle &&
                t.targetHandle === edge.targetHandle,
            ),
        );

      setNodes(restoredNodes);
      setEdges(restoredEdges);

      // fitView takes a bit to work after setting nodes
      setTimeout(() => setViewport({ x: 0, y: 0, zoom: 1 }), 100);
    },
    [setNodes, setEdges, setViewport, selectedPlatform],
  );

  useEffect(() => {
    if (flowData?.data) {
      restoreFlowFromData(flowData.data);
    }
  }, [flowData, restoreFlowFromData]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "custom", animated: false }, eds),
      ),
    [setEdges],
  );

  const getUnsavedFlowPayload = useCallback(() => {
    // Find all trigger nodes (allows multiple entry points)
    const triggerNodes = nodes.filter((n) => n.data.nodeType === "trigger");

    // Compute reachable nodes from trigger nodes
    const getReachableNodeIds = () => {
      const reachable = new Set<string>();
      const queue: string[] = [];

      triggerNodes.forEach((tNode) => {
        reachable.add(tNode.id);
        queue.push(tNode.id);
      });

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        edges.forEach((edge) => {
          if (edge.source === currentId) {
            if (!reachable.has(edge.target)) {
              reachable.add(edge.target);
              queue.push(edge.target);
            }
          }
        });
      }
      return reachable;
    };

    const reachableNodeIds = getReachableNodeIds();

    const formattedNodes: any[] = [];
    const formattedConnections: any[] = [];
    const flowPrefix = flowId
      ? `f${flowId.slice(-6)}`
      : `new${Math.random().toString(36).substring(7)}`;

    const getBackendId = (node: any) => {
      if (!node) return "";
      const nodeType = node.data?.nodeType || node.type;
      if (nodeType === "trigger") {
        return node.id.startsWith("trigger-") ? node.id : `trigger-${node.id}`;
      }

      const prefix = prefixMap[nodeType] || "send_message-";
      if (node.id.startsWith(prefix)) return node.id;
      if (node.id.startsWith(nodeType + "-"))
        return `${prefix}${node.id.slice(nodeType.length + 1)}`;
      return `${prefix}${node.id}`;
    };

    // Add all trigger nodes to the payload
    triggerNodes.forEach((tNode) => {
      formattedNodes.push({
        id: getBackendId(tNode),
        type: "trigger",
        position: tNode.position,
        parameters: { ...tNode.data },
        name: "Incoming Message",
      });
    });

    const getFormattedNode = (node: any) => {
      const nodeType = node.data.nodeType;
      let type =
        nodeType === "delay"
          ? "delay"
          : nodeType === "wait_for_reply"
            ? "wait_for_reply"
            : nodeType === "ask_and_wait"
              ? "ask_and_wait"
              : nodeType === "api" || nodeType === "api_request"
                ? "api"
                : nodeType === "response_saver"
                  ? "response_saver"
                  : nodeType === "condition"
                    ? "condition"
                    : nodeType === "advanced_condition"
                      ? "advanced_condition"
                      : [
                        "send_template",
                        "cta_button",
                        "assign_chatbot",
                        "save_to_google_sheet",
                        "create_calendar_event",
                        "create_google_meet",
                        "add_tag",
                        "remove_tag",
                        "assign_agent",
                        "assign_random_agent",
                        "webhook",
                        "form_flow",
                        "update_contact",
                        "move_to_pipeline_stage",
                        "run_sub_flow",
                        "appointment_flow",
                        "send_google_form",
                        "send_catalog",
                        "send_shopify",
                      ].includes(nodeType)
                        ? nodeType
                        : nodeType === "add_segment"
                          ? "add_to_segment"
                          : "send_message";
      const parameters: any = { ...node.data };

      if (
        type === "send_message" ||
        type === "send_template" ||
        type === "cta_button"
      ) {
        parameters.recipient = "{{senderNumber}}";
        parameters.provider_type = "business_api";

        if (node.data.nodeType === "location") {
          parameters.messageType = "location";
          parameters.location_params = {
            latitude: node.data.lat,
            longitude: node.data.lng,
            name: node.data.name || "",
            address: node.data.address || "",
          };
        } else if (node.data.nodeType === "list_message") {
          parameters.messageType = "interactive";
          parameters.interactive_type = "list";
          parameters.media_url = node.data.mediaUrl || null;
          parameters.list_params = {
            header: node.data.headerText || "",
            body: node.data.bodyText || "",
            footer: node.data.footerText || "",
            buttonTitle: node.data.buttonText || "Select",
            sectionTitle: (node.data.sections || [])[0]?.title || "Options",
            items: (node.data.sections || []).flatMap((section: any) =>
              (section.items || []).map((item: any) => {
                const uniqueId = `${flowPrefix}___${getBackendId(node)}___${item.title}`;
                return {
                  id: uniqueId,
                  title: item.title,
                  description: item.description || "",
                };
              }),
            ),
          };
          parameters.message_template = node.data.bodyText || "";
        } else if (node.data.mediaUrl) {
          parameters.messageType = node.data.mediaType || "image";
          parameters.media_url = node.data.mediaUrl;
          parameters.message_template = node.data.caption || "";
        } else if (node.data.nodeType === "button_message") {
          parameters.messageType = "interactive";
          parameters.interactive_type = "button";
          parameters.media_url = node.data.mediaUrl || null;
          parameters.button_params = (node.data.buttons || []).map(
            (btn: any) => {
              const rawVal = btn.value || btn.text;
              const uniqueId = `${flowPrefix}___${getBackendId(node)}___${rawVal}`;
              return { id: uniqueId, title: btn.text };
            },
          );
          parameters.message_template = node.data.message || "";
        } else {
          parameters.message_template =
            node.data.message || node.data.bodyText || "";
        }
      } else if (type === "wait_for_reply") {
        parameters.variable_name = node.data.variable_name;
      } else if (type === "ask_and_wait") {
        parameters.variable_name = node.data.variable_name;
        parameters.timeout_minutes = node.data.timeout_minutes;
        parameters.validation = node.data.validation;
        parameters.retry_limit = node.data.retry_limit;
        parameters.retry_message = node.data.retry_message;
        parameters.expected_answers = node.data.expected_answers;
        parameters.fallback_route = node.data.fallback_route || "fallback";
        parameters.message = node.data.message;
        parameters.recipient = "{{senderNumber}}";
        parameters.provider_type = "business_api";
      } else if (type === "api" || type === "webhook") {
        parameters.url = node.data.url;
        parameters.method =
          node.data.method || (type === "api" ? "GET" : "POST");

        // Convert arrays to objects for backend
        const arrayToObj = (arr: any) => {
          if (!arr) return {};
          if (typeof arr === "object" && !Array.isArray(arr)) return arr;

          const obj: any = {};
          (arr || []).forEach((item: any) => {
            if (item.key) obj[item.key] = item.value;
          });
          return obj;
        };

        parameters.headers = arrayToObj(node.data.headers);
        parameters.body = arrayToObj(node.data.body);
      } else if (type === "form_flow") {
        parameters.form_id = node.data.form_id;
        parameters.message_body = node.data.message_body;
        parameters.button_text = node.data.button_text;
        parameters.recipient = "{{senderNumber}}";
      } else if (type === "add_to_segment") {
        parameters.segment_id = node.data.segment_id;
      } else if (type === "remove_tag") {
        parameters.tag_ids = node.data.tag_ids || [];
      } else if (type === "assign_agent") {
        parameters.agent_id = node.data.agent_id;
      } else if (type === "assign_random_agent") {
        parameters.team_id =
          node.data.assign_mode === "team" ? node.data.team_id || null : null;
      } else if (type === "send_sequence") {
        parameters.sequence_id = node.data.sequence_id;
      } else if (type === "run_sub_flow") {
        parameters.sub_flow_id = node.data.sub_flow_id;
      } else if (type === "appointment_flow") {
        parameters.appointment_config_id = node.data.appointment_config_id;
      } else if (type === "update_contact") {
        parameters.updates = node.data.updates || [];
      } else if (type === "move_to_pipeline_stage") {
        parameters.funnel_id = node.data.funnel_id;
        parameters.stage_id = node.data.stage_id;
      } else if (type === "response_saver") {
        parameters.mappings = node.data.mappings || [];
      } else if (type === "condition") {
        parameters.conditions = node.data.conditions || [];
        parameters.no_match_handle = "no_match";
      } else if (type === "advanced_condition") {
        parameters.match_type = node.data.match_type || "AND";
        parameters.rules = node.data.rules || [];
      } else if (type === "send_google_form") {
        parameters.google_account_id = node.data.google_account_id;
        parameters.form_id = node.data.form_id;
        parameters.message_body = node.data.message_body || "";
      } else if (type === "send_catalog" || type === "send_shopify") {
        parameters.product_ids = node.data.product_ids || [];
        parameters.catalog_id = node.data.catalog_id || null;
        parameters.header = node.data.header || "";
        parameters.body = node.data.body || "";
        parameters.footer = node.data.footer || "";
        parameters.recipient = node.data.recipient || "{{senderNumber}}";
      }

      return {
        id: getBackendId(node),
        type: type,
        position: node.position,
        parameters: parameters,
        name: node.data.label || node.data.name || "Response",
      };
    };

    // Helper to add a branch to the payload and follow its chain
    const addBranch = (
      idPrefix: string,
      condition: any,
      firstTargetNode: any,
      name: string,
      sourceId: string,
      sourceHandle: string = "src",
    ) => {
      const condId = `cond-${idPrefix}-${getBackendId(firstTargetNode)}`;

      if (condition && !formattedNodes.find((n) => n.id === condId)) {
        formattedNodes.push({
          id: condId,
          type: "condition",
          position: {
            x: firstTargetNode.position.x - 250,
            y: firstTargetNode.position.y,
          },
          parameters: { condition },
          name: `Is ${name}?`,
        });
      }

      const targetPayloadId = condition
        ? condId
        : getBackendId(firstTargetNode);
      if (
        !formattedConnections.find(
          (c) =>
            c.source === sourceId &&
            c.target === targetPayloadId &&
            c.sourceHandle === sourceHandle,
        )
      ) {
        formattedConnections.push({
          id: `c-t-${idPrefix}-${Math.random().toString(36).substr(2, 5)}`,
          source: sourceId,
          target: targetPayloadId,
          sourceHandle: sourceHandle,
          targetHandle: "tgt",
        });
      }

      if (condition) {
        const secondConnId = `c-q-${idPrefix}-${Math.random().toString(36).substr(2, 5)}`;
        if (
          !formattedConnections.find(
            (c) =>
              c.source === condId && c.target === getBackendId(firstTargetNode),
          )
        ) {
          formattedConnections.push({
            id: secondConnId,
            source: condId,
            target: getBackendId(firstTargetNode),
            sourceHandle: "src",
            targetHandle: "tgt",
          });
        }
      }

      if (!formattedNodes.find((n) => n.id === getBackendId(firstTargetNode))) {
        formattedNodes.push(getFormattedNode(firstTargetNode));
      }
    };

    // 1. Handle paths directly from EACH Trigger (Keyword match)
    triggerNodes.forEach((tNode) => {
      const triggerEdges = edges.filter((e) => e.source === tNode.id);
      triggerEdges.forEach((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (targetNode) {
          const isOrderReceived = tNode.data.triggerType === "order received";
          const isAnyMessage = tNode.data.triggerType === "any message";

          let condition = null;
          if (isOrderReceived) {
            condition = {
              field: "event_type",
              operator: "equals",
              value: "order_received",
            };
          } else if (isAnyMessage) {
            condition = {
              field: "event_type",
              operator: "equals",
              value: "message_received",
            };
          } else {
            condition = {
              field: "message",
              operator: operatorMap[tNode.data.triggerType] || "contains_any",
              value: tNode.data.keywords || [],
            };
          }

          addBranch(
            "start",
            condition,
            targetNode,
            isOrderReceived ? "Order Received" : "Greeting",
            getBackendId(tNode),
            "src",
          );
        }
      });
    });

    // 2. Handle paths from Button clicks (Starting new sub-branches)
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode && !reachableNodeIds.has(sourceNode.id)) {
        return;
      }
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (
        sourceNode?.data.nodeType === "button_message" &&
        edge.sourceHandle?.startsWith("src-btn-")
      ) {
        const btnIndex = parseInt(edge.sourceHandle.replace("src-btn-", ""));
        const button = sourceNode.data.buttons?.[btnIndex];

        const anchorTriggerId =
          triggerNodes.length > 0 ? getBackendId(triggerNodes[0]) : "";

        if (button && targetNode) {
          const rawVal = button.value || button.text;
          const uniqueId = `${flowPrefix}___${getBackendId(sourceNode)}___${rawVal}`;

          addBranch(
            `btn-___${getBackendId(sourceNode)}___${btnIndex}___${getBackendId(targetNode)}`,
            {
              field: "message",
              operator: "equals",
              value: uniqueId,
            },
            targetNode,
            button.text,
            anchorTriggerId,
            "src",
          );
        }
      }

      if (
        sourceNode?.data.nodeType === "list_message" &&
        edge.sourceHandle?.startsWith("src-item-")
      ) {
        const parts = edge.sourceHandle.replace("src-item-", "").split("-");
        const sIdx = parseInt(parts[0]);
        const iIdx = parseInt(parts[1]);
        const item = sourceNode.data.sections?.[sIdx]?.items?.[iIdx];

        const anchorTriggerId =
          triggerNodes.length > 0 ? getBackendId(triggerNodes[0]) : "";

        if (item && targetNode) {
          const rawVal = item.title;
          const uniqueId = `${flowPrefix}___${getBackendId(sourceNode)}___${rawVal}`;

          addBranch(
            `list-___${getBackendId(sourceNode)}___${sIdx}___${iIdx}___${getBackendId(targetNode)}`,
            {
              field: "message",
              operator: "equals",
              value: uniqueId,
            },
            targetNode,
            item.title,
            anchorTriggerId,
            "src",
          );
        }
      }

      if (sourceNode?.data.nodeType === "condition") {
        const conditions = sourceNode.data.conditions || [];
        conditions.forEach((cond: any, idx: number) => {
          const handleId = cond.sourceHandle || cond.id;
          if (edge.sourceHandle === handleId && targetNode) {
            addBranch(
              `cond-${getBackendId(sourceNode)}-${handleId}`,
              null,
              targetNode,
              `Condition ${idx + 1}`,
              getBackendId(sourceNode),
              handleId,
            );
          }
        });

        if (edge.sourceHandle === "no_match" && targetNode) {
          addBranch(
            `cond-${getBackendId(sourceNode)}-no-match`,
            null,
            targetNode,
            "No Match fallback",
            getBackendId(sourceNode),
            "no_match",
          );
        }
      }
    });

    // 3. Ensure ALL nodes on canvas are captured (even if orphaned)
    nodes.forEach((node) => {
      if (
        node.data.nodeType !== "trigger" &&
        !formattedNodes.find((n) => n.id === getBackendId(node))
      ) {
        formattedNodes.push(getFormattedNode(node));
      }
    });

    // 4. Ensure ALL connections on canvas are captured
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (sourceNode && targetNode) {
        const sId = getBackendId(sourceNode);
        const tId = getBackendId(targetNode);

        const isSpecialBranch =
          edge.sourceHandle?.startsWith("src-btn-") ||
          edge.sourceHandle?.startsWith("src-item-") ||
          sourceNode.data.nodeType === "condition";
        const isTriggerSource = sourceNode.data.nodeType === "trigger";

        if (!isSpecialBranch && !isTriggerSource) {
          if (
            !formattedConnections.find(
              (c) =>
                c.source === sId &&
                c.target === tId &&
                c.sourceHandle === (edge.sourceHandle || "src") &&
                c.targetHandle === (edge.targetHandle || "tgt"),
            )
          ) {
            formattedConnections.push({
              id: `c-s-${sId}-${tId}-${Math.random().toString(36).substr(2, 5)}`,
              source: sId,
              target: tId,
              sourceHandle: edge.sourceHandle || "src",
              targetHandle: edge.targetHandle || "tgt",
            });
          }
        }
      }
    });

    const getResponseKeywords = () => {
      const keywords: string[] = [];
      nodes.forEach((n: any) => {
        if (!reachableNodeIds.has(n.id)) return;
        if (n.data.nodeType === "button_message") {
          (n.data.buttons || []).forEach((b: any) => {
            const rawVal = b.value || b.text;
            const uniqueId = `${flowPrefix}___${rawVal}`;
            if (uniqueId && !keywords.includes(uniqueId))
              keywords.push(uniqueId);
          });
        } else if (n.data.nodeType === "list_message") {
          (n.data.sections || []).forEach((section: any) => {
            (section.items || []).forEach((item: any) => {
              const rawVal = item.title;
              const uniqueId = `${flowPrefix}___${rawVal}`;
              if (uniqueId && !keywords.includes(uniqueId))
                keywords.push(uniqueId);
            });
          });
        }
      });
      return keywords;
    };

    const buttonKeywords = getResponseKeywords();
    const triggers: any[] = [];

    // 1. Add Primary Triggers
    triggerNodes.forEach((tNode) => {
      if (tNode.data.triggerType === "any message") {
        triggers.push({
          event_type: "message_received",
          conditions: {},
        });
      } else if (tNode.data.triggerType === "order received") {
        triggers.push({
          event_type: "order_received",
          conditions: {},
        });
      } else {
        const userKeywords = Array.isArray(tNode.data.keywords)
          ? tNode.data.keywords
          : [];
        const op = operatorMap[tNode.data.triggerType] || "contains_any";

        if (op === "contains_any") {
          triggers.push({
            event_type: "message_received",
            conditions: {
              field: "message",
              operator: "contains_any",
              value: [...userKeywords],
            },
          });
        } else {
          userKeywords.forEach((kw: string) => {
            triggers.push({
              event_type: "message_received",
              conditions: {
                field: "message",
                operator: op,
                value: kw,
              },
            });
          });
        }
      }
    });

    if (buttonKeywords.length > 0) {
      const hasAnyMessageTrigger = triggers.some(
        (t) =>
          t.event_type === "message_received" &&
          Object.keys(t.conditions).length === 0,
      );

      if (!hasAnyMessageTrigger) {
        const existingContainsAny = triggers.find(
          (t) =>
            t.event_type === "message_received" &&
            t.conditions?.operator === "contains_any",
        );

        if (existingContainsAny) {
          const currentVals = Array.isArray(
            existingContainsAny.conditions.value,
          )
            ? [...existingContainsAny.conditions.value]
            : [existingContainsAny.conditions.value];

          buttonKeywords.forEach((kw) => {
            if (!currentVals.includes(kw)) currentVals.push(kw);
          });
          existingContainsAny.conditions.value = currentVals;
        } else {
          triggers.push({
            event_type: "message_received",
            conditions: {
              field: "message",
              operator: "contains_any",
              value: buttonKeywords,
            },
          });
        }
      }
    }

    if (triggers.length === 0) {
      triggers.push({
        event_type: "message_received",
        conditions: {},
      });
    }

    if (triggerNodes.length === 0) {
      const implicitTriggerId = `trigger-implicit-${Math.random().toString(36).substr(2, 5)}`;
      formattedNodes.push({
        id: implicitTriggerId,
        type: "trigger",
        position: { x: 0, y: 0 },
        parameters: { event_type: "message_received" },
        name: "Incoming Message",
      });

      const rootNodes = nodes.filter(
        (n) => !edges.some((e: any) => e.target === n.id),
      );
      rootNodes.forEach((rootNode) => {
        formattedConnections.push({
          id: `c-implicit-${Math.random().toString(36).substr(2, 5)}`,
          source: implicitTriggerId,
          target: getBackendId(rootNode),
          sourceHandle: "src",
          targetHandle: "tgt",
        });
      });

      if (triggers.length === 0) {
        triggers.push({
          event_type: "message_received",
          conditions: {},
        });
      }
    }

    return {
      triggers,
      nodes: formattedNodes,
      connections: formattedConnections,
    };
  }, [nodes, edges, flowId]);

  const handleSave = async (isActive: boolean = true) => {
    try {
      if (!flowName.trim()) {
        toast.error("Please enter a flow name");
        return;
      }

      setForceValidation(true);

      const unsavedFlow = getUnsavedFlowPayload();

      const triggerNodes = nodes.filter((n) => n.data.nodeType === "trigger");

      const body = {
        name: flowName,
        description:
          triggerNodes.length > 0
            ? `Handles ${Array.isArray(triggerNodes[0].data.keywords) && triggerNodes[0].data.keywords.length > 0 ? triggerNodes[0].data.keywords.join(", ") : triggerNodes[0].data.triggerType} and related interactive menus`
            : `Custom flow: ${flowName}`,
        is_active: isActive,
        triggers: unsavedFlow.triggers,
        nodes: unsavedFlow.nodes,
        connections: unsavedFlow.connections,
        platform: selectedPlatform || "all",
        workspace_id: selectedWorkspace?._id || undefined,
      };

      if (flowId) {
        await updateFlow({ flowId, ...body }).unwrap();
        toast.success(
          isActive ? "Flow published successfully!" : "Flow saved in draft!",
        );
      } else {
        await createFlow(body).unwrap();
        toast.success(
          isActive ? "Flow published successfully!" : "Flow saved in draft!",
        );
      }

      router.push(ROUTES.BotFlow);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save flow");
    }
  };

  const addNodeToCanvas = useCallback(
    (template: (typeof NODETEMPLATES)[0]) => {
      const position = screenToFlowPosition({
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 50,
      });

      const newNode: Node = {
        id: `${template.id}-${Date.now()}`,
        type: "custom",
        data: {
          nodeType: template.id,
          label: template.label,
          description: template.description,
          // icon: template.icon, // Exclude React element from serializable data
          color: template.color,
          messageType: "Simple text",
          message: "",
          forceValidation: false,
          platform: selectedPlatform || "all",
          ...(template.id === "trigger"
            ? {
              contactType: "Contact",
              triggerType: "contains keyword",
              keywords: [],
            }
            : {}),
        },
        position,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, selectedPlatform],
  );

  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const categories = [
    "All",
    ...Array.from(new Set(NODETEMPLATES.map((t) => t.category))),
  ];
  const filteredTemplates = NODETEMPLATES.filter((t: any) => {
    if (
      isBaileys &&
      (t.id === "button_message" ||
        t.id === "list_message" ||
        t.id === "call_to_action" ||
        t.id === "form_flow" ||
        t.id === "send_sequence" ||
        t.id === "appointment_flow" ||
        t.id === "send_catalog" ||
        t.id === "send_shopify")
    ) {
      return false;
    }

    if (t.featureKey && !isFeatureEnabled(t.featureKey)) {
      return false;
    }

    // Filter templates based on selected channel/platform
    if (selectedPlatform === "all") {
      // If 'all' is selected: Hide Form Flow, Send Template, and Send Sequence nodes
      if (t.id === "form_flow" || t.id === "send_template" || t.id === "appointment_flow" || t.id === "send_sequence") {
        return false;
      }
    } else if (selectedPlatform !== "whatsapp") {
      // If telegram, facebook, or instagram is selected: Hide Form Flow node
      if (t.id === "form_flow" || t.id === "appointment_flow") {
        return false;
      }
    }

    // send_catalog is EXCLUSIVE to whatsapp platform
    if (t.id === "send_catalog" && selectedPlatform !== "whatsapp") {
      return false;
    }

    if (selectedCategory !== "All" && t.category !== selectedCategory) {
      return false;
    }
    if (
      searchQuery &&
      !t.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (isLoadingFlow)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading flow...
      </div>
    );

  return (
    <div className="flex relative h-full w-full overflow-hidden flex-row-reverse">
      <ChannelSelectModal
        isOpen={isPlatformModalOpen}
        onSelect={(platform) => {
          setSelectedPlatform(platform);
          setIsPlatformModalOpen(false);
        }}
        onBack={() => router.push(ROUTES.BotFlow)}
      />
      <TestFlowModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        flowId={flowId}
        flowName={flowName}
        platform={selectedPlatform || "whatsapp"}
        getUnsavedFlowPayload={getUnsavedFlowPayload}
      />
      <AIAutomationFlowModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        platform={selectedPlatform || "all"}
        onApplyAI={restoreFlowFromData}
      />
      {/* Side Drawer (Now on the Right) */}
      <div
        className="flex flex-col overflow-hidden border-l border-gray-200 dark:border-(--card-border-color)  transition-all duration-300 z-999 relative top-0 right-0 md:h-auto"
        style={{ width: isDrawerCollapsed ? "72px" : "320px" }}
      >
        <div
          className={`flex items-center gap-3 border-b bg-white border-gray-200 p-4 dark:border-(--card-border-color) dark:bg-(--card-color) ${isDrawerCollapsed ? "flex-col px-2" : "justify-between"}`}
        >
          <div
            className={`flex items-center gap-2.5 ${isDrawerCollapsed ? "hidden" : ""}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/15 dark:shadow-none">
              <LayoutGrid size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Flow Toolkit
              </h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                Components
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
            className="h-8 w-8 hover:bg-white hover:shadow-sm dark:hover:bg-(--table-hover) transition-all"
          >
            {isDrawerCollapsed ? (
              <ChevronLeft size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </Button>
        </div>

        {!isDrawerCollapsed && (
          <>
            <div className="p-2 md:p-3 bg-white dark:bg-(--card-color)">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 px-10 text-sm focus-visible:ring-primary border-gray-100 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg)"
                />
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="absolute! right-2.5! top-1/2! -translate-y-1/2! text-gray-400! hover:text-gray-600! bg-[unset]!"
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Node List */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-(--card-color) px-2 md:px-3 py-3 md:py-4 custom-scrollbar">
          {categories
            .filter((cat) => cat !== "All")
            .map((category) => {
              const categoryTemplates = filteredTemplates.filter(
                (t) => t.category === category,
              );
              if (categoryTemplates.length === 0) return null;

              return (
                <div key={category} className="mb-4 md:mb-6">
                  {!isDrawerCollapsed && (
                    <h3 className="mb-3 px-1 text-[12px] font-medium text-gray-400">
                      {category}
                    </h3>
                  )}
                  <div className={`grid ${isDrawerCollapsed ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
                    {categoryTemplates.map((template, index) => {
                      const isLastAndOdd = !isDrawerCollapsed && index === categoryTemplates.length - 1 && categoryTemplates.length % 2 !== 0;
                      return (
                        <div
                          key={template.id}
                          draggable
                          onDragStart={(event) => {
                            const { ...serializableTemplate } = template;
                            event.dataTransfer.setData(
                              "application/reactflow",
                              JSON.stringify(serializableTemplate),
                            );
                            event.dataTransfer.effectAllowed = "move";
                          }}
                          onClick={() => addNodeToCanvas(template)}
                          className={`flex-1 cursor-pointer rounded-lg border border-gray-200 dark:border-(--card-border-color)! dark:bg-(--page-body-bg)! dark:border-none dark:hover:bg-(--table-hover) bg-white transition-all hover:shadow-lg group active:scale-95 ${isDrawerCollapsed ? "p-1 dark:border-none dark:bg-transparent! flex justify-center" : "p-2.5"} ${isLastAndOdd ? "col-span-2" : ""}`}
                          style={{
                            borderColor:
                              selectedCategory === template.category
                                ? template.color
                                : undefined,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = template.color;
                            e.currentTarget.style.backgroundColor = `${template.color}08`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--gray-200)";
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <div
                            className={`flex flex-col items-center gap-2 ${isDrawerCollapsed ? "" : "text-center"}`}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg transition-all duration-300 group-hover:scale-110 shadow-sm`}
                              style={{
                                background: template.color,
                                color: "white",
                              }}
                            >
                              {template.icon}
                            </div>
                            {!isDrawerCollapsed && (
                              <div className="w-full">
                                <div
                                  className={`text-[11px] font-bold text-gray-800 dark:text-gray-200 transition-colors group-hover:text-[${template.color}]! dark:group-hover:text-indigo-400 truncate`}
                                >
                                  {template.label}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Flow Canvas */}
      <div
        className="relative flex-1"
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
        onDrop={(event) => {
          event.preventDefault();

          const data = event.dataTransfer.getData("application/reactflow");
          if (!data) return;

          const template = JSON.parse(data);
          const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });

          const newNode: Node = {
            id: `${template.id}-${Date.now()}`,
            type: "custom",
            data: {
              nodeType: template.id,
              label: template.label,
              description: template.description,
              color: template.color,
              messageType: "Simple text",
              message: "",
              forceValidation: false,
              platform: selectedPlatform || "all",
              ...(template.id === "trigger"
                ? {
                  contactType: "Contact",
                  triggerType: "contains keyword",
                  keywords: [],
                }
                : {}),
              ...(template.id === "call_to_action"
                ? {
                  buttonText: "Visit our site",
                  valueText: "",
                  buttonLink: "https://",
                  header: "",
                }
                : {}),
            },
            position,
          };

          setNodes((nds) => [...nds, newNode]);
        }}
      >
        <div className="absolute left-1/2 top-3 z-30 flex flex-nowrap w-[calc(100%-1.5rem)] -translate-x-1/2 items-center justify-between gap-2 rounded-xl p-1.5 shadow-2xl border border-white/20 dark:border-white/10 bg-white/80 backdrop-blur-md dark:bg-(--card-color) md:top-4 md:w-auto md:min-w-100 md:gap-4 md:p-2">
          <div className="flex items-center gap-1.5 pr-2 border-r border-gray-100 dark:border-white/5 md:gap-3 md:pr-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(ROUTES.BotFlow)}
              className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-(--table-hover) transition-all md:h-9 md:w-9 shrink-0"
              title="Back to list"
            >
              <ChevronLeft size={18} className="text-gray-500" />
            </Button>
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg md:h-9 md:w-9 shrink-0">
              <Workflow size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <Input
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                className="h-5 w-24 border-none bg-transparent shadow-none text-[12px] font-bold text-gray-900 dark:text-gray-100 focus-visible:ring-0 placeholder:text-gray-400 md:h-6 md:w-40 md:text-sm truncate p-0"
                placeholder="Untitled Flow"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-bold tracking-tight md:text-[9px] truncate">
                  Editing Flow
                </span>
                <div className="flex sm:hidden items-center gap-1 truncate">
                  <span className="h-1 w-1 rounded-full bg-primary animate-pulse shrink-0" />
                  <span className="text-[8px] font-bold text-gray-400 truncate">
                    {nodes.length}n
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex flex-1 px-1 md:px-2 min-w-0">
            <div className="flex items-center gap-1.5 truncate bg-light-primary dark:bg-primary/10 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-[9px] font-bold text-primary dark:text-primary truncate md:text-[10px]">
                {nodes.length} Nodes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsAIModalOpen(true)}
              variant="outline"
              className="gap-1.5 shadow-sm transition-all font-bold px-3 h-8.5 rounded-lg active:scale-95 md:gap-2 md:px-4 md:h-10 shrink-0 border border-[var(--primary-opacity-30)] dark:border-primary/20 hover:bg-light-primary dark:hover:bg-primary-darker/20 text-primary dark:text-primary"
            >
              <Sparkles size={14} className="md:size-4" />
              <span className="text-[10px] md:text-xs">Build with AI</span>
            </Button>
            <Button
              onClick={() => setIsTestModalOpen(true)}
              variant="outline"
              className="gap-1.5 shadow-sm transition-all font-bold px-3 h-8.5 rounded-lg active:scale-95 md:gap-2 md:px-5 md:h-10 shrink-0 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400"
            >
              <Play size={14} className="md:size-4 fill-indigo-600 dark:fill-indigo-400" />
              <span className="text-[10px] md:text-xs">Test Flow</span>
            </Button>
            {!flowData?.data?.is_active && (
              <Button
                onClick={() => handleSave(false)}
                disabled={isSaveDisabled}
                variant="outline"
                className="gap-1.5 shadow-sm transition-all font-bold px-3 h-8.5 rounded-lg active:scale-95 md:gap-2 md:px-5 md:h-10 shrink-0 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
              >
                <Save size={14} className="md:size-4" />
                <span className="text-[10px] md:text-xs">
                  {isCreating || isUpdating ? "Wait..." : "Save Draft"}
                </span>
              </Button>
            )}
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaveDisabled}
              className={cn(
                "gap-1.5 shadow-lg transition-all font-bold px-3 h-8.5 rounded-lg active:scale-95 border-none md:gap-2 md:px-5 md:h-10 shrink-0",
                isSaveDisabled
                  ? "bg-primary text-white cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-white",
              )}
            >
              <Send size={14} className="md:size-4" />
              <span className="text-[10px] md:text-xs">
                {isCreating || isUpdating ? "Wait..." : "Publish"}
              </span>
            </Button>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="bg-white border-gray-100 shadow-xl dark:bg-dark-gray dark:border-(--card-border-color)" />
          <MiniMap
            pannable
            zoomable
            className="hidden md:block rounded-lg border-gray-100 shadow-xl dark:bg-dark-gray dark:border-(--card-border-color)"
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="var(--slate-200)"
            className="bg-(--input-color) dark:bg-slate-900"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowCanvas;
