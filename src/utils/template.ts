/* eslint-disable @typescript-eslint/no-explicit-any */

export const getTemplateVariables = (template: any): string[] => {
  if (!template) return [];
  const keys = new Set<string>();

  const bodyVars = template?.body_variables || [];
  bodyVars.forEach((v: any) => {
    if (v.key) keys.add(v.key);
  });

  const btnVars = template?.button_variables || [];
  btnVars.forEach((v: any) => {
    if (v.key) keys.add(v.key);
  });

  const components = template?.components || [];
  components.forEach((c: any) => {
    let textToScan = c.text || "";
    if (c.buttons) {
      textToScan += " " + c.buttons.map((b: any) => b.text || "").join(" ");
    }
    const matches = textToScan.match(/\{\{([^}]+)\}\}/g) || [];
    matches.forEach((m: string) => keys.add(m.replace(/\{\{|\}\}/g, "")));
  });

  const topLevelButtons = template?.buttons || [];
  topLevelButtons.forEach((b: any) => {
    if (b.text) {
      const matches = b.text.match(/\{\{([^}]+)\}\}/g) || [];
      matches.forEach((m: string) => keys.add(m.replace(/\{\{|\}\}/g, "")));
    }
  });

  if (keys.size === 0 && template?.message_body) {
    const matches = template.message_body.match(/\{\{([^}]+)\}\}/g) || [];
    matches.forEach((m: string) => keys.add(m.replace(/\{\{|\}\}/g, "")));
  }

  return Array.from(keys).sort();
};


export const isMarketingTemplate = (template: any): boolean => {
  if (!template) return false;
  const type = template.template_type || "";
  if (type === "coupon" || type === "limited_time_offer") return true;

  const components = template.components || [];
  const hasCopyCodeBtn = components.some((c: any) => c.buttons?.some((b: any) => b.type === "copy_code"));
  if (hasCopyCodeBtn) return true;

  const topLevelButtons = template.buttons || [];
  if (topLevelButtons.some((b: any) => b.type === "copy_code")) return true;

  return false;
};

export const hasMediaTemplateHeader = (template: any): boolean => {
  if (!template) return false;
  const header = template.header;
  return header?.format === "media";
};

export const formatExpirationTime = (minutes: number | string | undefined): string => {
  if (minutes === undefined || minutes === "" || isNaN(Number(minutes))) return "";
  const mins = Number(minutes);
  if (mins <= 0) return "";

  if (mins < 60) {
    return `This template expires within ${mins} min${mins > 1 ? "s" : ""}`;
  }

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hours < 24) {
    let text = `This template expires within ${hours} hour${hours > 1 ? "s" : ""}`;
    if (remainingMins > 0) {
      text += ` and ${remainingMins} min${remainingMins > 1 ? "s" : ""}`;
    }
    return text;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  let text = `This template expires within ${days} day${days > 1 ? "s" : ""}`;
  if (remainingHours > 0) {
    text += ` and ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
  }
  return text;
};
