import { Contact } from "@/src/types/components";
import { Segment } from "@/src/types/segment";

export interface AudienceCountParams {
  recipient_type?: "all_contacts" | "specific_contacts" | "tags" | "segments";
  avoid_unsubscribers?: boolean;
  specific_contacts?: string[];
  tag_ids?: string[];
  segment_ids?: string[];
  contacts?: Contact[];
  segments?: Segment[];
}

/** Normalize tag references on a contact to plain string IDs. */
export const getContactTagIds = (contact: any): string[] => {
  const rawTags = contact?.tags || contact?.tag_ids || [];
  return rawTags
    .map((t: any) => (typeof t === "string" ? t : t?._id || t?.id || t?.value))
    .filter(Boolean) as string[];
};

/** Normalize segment references on a contact to plain string IDs. */
export const getContactSegmentIds = (contact: any): string[] => {
  const rawSegments = contact?.segments || contact?.segment_ids || [];
  return rawSegments
    .map((s: any) => (typeof s === "string" ? s : s?._id || s?.id || s?.value))
    .filter(Boolean) as string[];
};

/**
 * Calculates the number of UNIQUE contacts that match the given recipient
 * criteria. Each contact is counted at most ONCE regardless of how many
 * selected tags or segments it belongs to.
 */
export const calculateAudienceCount = (params: AudienceCountParams): number => {
  const {
    recipient_type = "all_contacts",
    avoid_unsubscribers = false,
    specific_contacts = [],
    tag_ids = [],
    segment_ids = [],
    contacts = [],
    segments = [],
  } = params;

  if (!contacts || contacts.length === 0) return 0;

  const isEligible = (c: any): boolean =>
    avoid_unsubscribers ? c.is_unsubscribed !== true : true;

  // ── All contacts ──────────────────────────────────────────────────────────
  if (recipient_type === "all_contacts") {
    // contacts array from the API is already unique per contact.
    return contacts.filter(isEligible).length;
  }

  // ── Specific contacts ─────────────────────────────────────────────────────
  if (recipient_type === "specific_contacts") {
    const selectedSet = new Set<string>(specific_contacts ?? []);
    if (selectedSet.size === 0) return 0;
    // API list is unique; simple filter is safe.
    return contacts.filter((c: any) => selectedSet.has(c._id) && isEligible(c)).length;
  }

  // ── Tags ──────────────────────────────────────────────────────────────────
  if (recipient_type === "tags") {
    const selectedTagSet = new Set<string>(tag_ids ?? []);
    if (selectedTagSet.size === 0) return 0;

    // Use a Set of _ids so a contact with MULTIPLE matching tags is counted once.
    const matchedIds = new Set<string>();
    for (const c of contacts as any[]) {
      if (!isEligible(c)) continue;
      const cTagIds = getContactTagIds(c);
      if (cTagIds.some((tId) => selectedTagSet.has(tId))) {
        matchedIds.add(c._id);
      }
    }
    return matchedIds.size;
  }

  // ── Segments ──────────────────────────────────────────────────────────────
  if (recipient_type === "segments") {
    const selectedSegSet = new Set<string>(segment_ids ?? []);
    if (selectedSegSet.size === 0) return 0;

    // Build a helper set from any embedded contact lists on segment objects.
    const segmentContactIds = new Set<string>();
    for (const seg of (segments ?? []) as any[]) {
      if (!selectedSegSet.has(seg._id)) continue;
      (seg.contacts ?? []).forEach((cId: any) => {
        const id =
          typeof cId === "string" ? cId : cId?._id || cId?.id || cId?.value;
        if (id) segmentContactIds.add(id);
      });
    }

    // Use a Set of _ids so a contact belonging to MULTIPLE matching segments is counted once.
    const matchedIds = new Set<string>();
    for (const c of contacts as any[]) {
      if (!isEligible(c)) continue;
      const cSegIds = getContactSegmentIds(c);
      const matchesDirect = cSegIds.some((sId) => selectedSegSet.has(sId));
      const matchesViaSegObj = segmentContactIds.has(c._id);
      if (matchesDirect || matchesViaSegObj) {
        matchedIds.add(c._id); // Set guarantees no duplicates.
      }
    }
    return matchedIds.size;
  }

  return 0;
};
