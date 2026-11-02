// PROVISIONAL: the six stage labels and their order come from the brief. They deliberately have
// no definitions: Paul must supply one plain-English sentence for each before any are written.
export const cycleStages = [
  "Teach & Coach",
  "Trust",
  "Agency",
  "Ownership",
  "Performance",
  "Culture",
] as const;

export const zones = [
  {
    number: "01",
    name: "Work factors",
    description:
      "The shared conditions everyone meets at work. A safe, practical place to begin.",
  },
  {
    number: "02",
    name: "Work–life factors",
    description:
      "The boundary around work: flexibility, access, caring and the way work fits real life.",
  },
  {
    number: "03",
    name: "Life factors",
    description:
      "Personal, opt-in reflection. Pergage does not prescribe individual health advice.",
  },
] as const;

// PROVISIONAL: confirm with Paul that these four layer names and descriptors are his own wording.
// "Human maintenance" (Recovery, energy, pace, reserve) sits closest to health language and to a
// machine metaphor, so it must not be reworded without his decision.
export const pyramidLayers = [
  {
    name: "Purpose & performance",
    detail: "Ownership, contribution, innovation",
  },
  {
    name: "Capability",
    detail: "Focus, decisions, problem-solving, collaboration",
  },
  {
    name: "Resilience",
    detail: "Pressure, habits, relationships, support",
  },
  {
    name: "Human maintenance",
    detail: "Recovery, energy, pace, reserve",
  },
] as const;
