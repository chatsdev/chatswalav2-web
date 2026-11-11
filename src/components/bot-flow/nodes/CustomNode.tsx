/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ApiNode } from "./ApiNode";
import { ButtonMessageNode } from "./ButtonMessageNode";
import { ConditionNode } from "./ConditionNode";
import { DelayNode } from "./DelayNode";
import { GenericNode } from "./GenericNode";
import { ListMessageNode } from "./ListMessageNode";
import { LocationNode } from "./LocationNode";
import { MediaMessageNode } from "./MediaMessageNode";
import { ResponseSaverNode } from "./ResponseSaverNode";
import { TextMessageNode } from "./TextMessageNode";
import { TriggerNode } from "./TriggerNode";
import { WaitForReplyNode } from "./WaitForReplyNode";
import { AskAndWaitNode } from "./AskAndWaitNode";
import { SendTemplateNode } from "./SendTemplateNode";
import { CtaButtonNode } from "./CtaButtonNode";
import { AssignChatbotNode } from "./AssignChatbotNode";
import { GoogleSheetNode } from "./GoogleSheetNode";
import { CalendarEventNode } from "./CalendarEventNode";
import { CreateGoogleMeetNode } from "./CreateGoogleMeetNode";
import { AddTagNode } from "./AddTagNode";
import { WebhookNode } from "./WebhookNode";
import { FormFlowNode } from "./FormFlowNode";
import { AddSegmentNode } from "./AddSegmentNode";
import { UpdateContactNode } from "./UpdateContactNode";
import { RemoveTagNode } from "./RemoveTagNode";
import { AssignAgentNode } from "./AssignAgentNode";
import { AssignRandomAgentNode } from "./AssignRandomAgentNode";
import { SendSequenceNode } from "./SendSequenceNode";
import { RunSubFlowNode } from "./RunSubFlowNode";
import { AppointmentFlowNode } from "./AppointmentFlowNode";
import { SendCatalogNode } from "./SendCatalogNode";
import { SendShopifyNode } from "./SendShopifyNode";
import { SendGoogleFormNode } from "./SendGoogleFormNode";
import { AdvancedConditionNode } from "./AdvancedConditionNode";
import { MoveToPipelineStageNode } from "./MoveToPipelineStageNode";

export function CustomNode(props: any) {
  switch (props.data.nodeType) {
    case "condition":
      return <ConditionNode {...props} />;
    case "advanced_condition":
      return <AdvancedConditionNode {...props} />;
    case "delay":
      return <DelayNode {...props} />;
    case "trigger":
      return <TriggerNode {...props} />;
    case "text_message":
    case "send-message":
      return <TextMessageNode {...props} />;
    case "button_message":
      return <ButtonMessageNode {...props} />;
    case "list-message":
    case "list_message":
      return <ListMessageNode {...props} />;
    case "media_message":
      return <MediaMessageNode {...props} />;
    case "location":
      return <LocationNode {...props} />;
    case "wait_for_reply":
      return <WaitForReplyNode {...props} />;
    case "ask_and_wait":
      return <AskAndWaitNode {...props} />;
    case "api":
    case "api_request":
      return <ApiNode {...props} />;
    case "response_saver":
      return <ResponseSaverNode {...props} />;
    case "send_template":
      return <SendTemplateNode {...props} />;
    case "cta_button":
      return <CtaButtonNode {...props} />;
    case "assign_chatbot":
      return <AssignChatbotNode {...props} />;
    case "save_to_google_sheet":
      return <GoogleSheetNode {...props} />;
    case "send_google_form":
      return <SendGoogleFormNode {...props} />;
    case "create_calendar_event":
      return <CalendarEventNode {...props} />;
    case "create_google_meet":
      return <CreateGoogleMeetNode {...props} />;
    case "add_tag":
      return <AddTagNode {...props} />;
    case "webhook":
      return <WebhookNode {...props} />;
    case "form_flow":
      return <FormFlowNode {...props} />;
    case "add_segment":
      return <AddSegmentNode {...props} />;
    case "update_contact":
      return <UpdateContactNode {...props} />;
    case "remove_tag":
      return <RemoveTagNode {...props} />;
    case "assign_agent":
      return <AssignAgentNode {...props} />;
    case "assign_random_agent":
      return <AssignRandomAgentNode {...props} />;
    case "send_sequence":
      return <SendSequenceNode {...props} />;
    case "run_sub_flow":
      return <RunSubFlowNode {...props} />;
    case "appointment_flow":
      return <AppointmentFlowNode {...props} />;
    case "send_catalog":
      return <SendCatalogNode {...props} />;
    case "send_shopify":
      return <SendShopifyNode {...props} />;
    case "move_to_pipeline_stage":
      return <MoveToPipelineStageNode {...props} />;
    default:
      return <GenericNode {...props} />;
  }
}
