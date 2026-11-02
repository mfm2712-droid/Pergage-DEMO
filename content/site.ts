/**
 * Local content provider boundary.
 *
 * This is deliberately file-backed until Pergage chooses a CMS and owns the
 * production account. Each entry can later map one-for-one to CMS fields.
 */
export type ContentSource = "brief" | "paul-email" | "provisional";

export type ContentField = {
  text: string;
  source: ContentSource;
};

const brief = (text: string): ContentField => ({ text, source: "brief" });
const provisional = (text: string): ContentField => ({ text, source: "provisional" });

export const siteContent = {
  hero: {
    eyebrow: provisional("Pergage / Engagement, engineered"),
    title: brief("Most organisations maintain their processes. Fewer maintain their people."),
    lede: brief("Pergage makes the conditions for capable work visible, then helps you improve them."),
  },
  elephant: {
    label: brief("The elephant in the room"),
    title: provisional("The conditions behind good work are easy to miss."),
    body: brief("Work gets inspected, serviced and improved before it fails. Pergage makes the human conditions around it easier to notice and improve — with people, not to them."),
  },
  approach: {
    title: brief("Pergage engineers the conditions, not the people."),
    body: provisional("Reliable performance is not created by asking people to try harder. It is created by understanding the system around them and improving the conditions that make good work possible."),
  },
  cta: {
    label: provisional("Make the next move"),
    title: brief("Start with a conversation."),
  },
} as const;
