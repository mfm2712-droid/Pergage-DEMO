export type ScorecardType = "organisational" | "individual";

export const scorecardQuestions: Record<ScorecardType, { id: string; text: string }[]> = {
  organisational: [
    { id: "org-01", text: "People understand what good performance looks like here." },
    { id: "org-02", text: "Teams have a meaningful say in how work is designed." },
    { id: "org-03", text: "Leaders notice and address conditions that make good work harder." },
    { id: "org-04", text: "We learn from problems rather than relying on individual heroics." },
    { id: "org-05", text: "There is a practical rhythm for reviewing and improving how we work." },
  ],
  individual: [
    { id: "ind-01", text: "I have a clear sense of what matters most in my work." },
    { id: "ind-02", text: "I have enough influence over how I organise my work." },
    { id: "ind-03", text: "I can raise obstacles without feeling that I have to solve everything alone." },
    { id: "ind-04", text: "I have useful opportunities to learn and improve." },
    { id: "ind-05", text: "The way I work helps me maintain good performance over time." },
  ],
};

// Working assumptions only. Paul’s final questions, weighting and result copy are still to be approved.
export const resultBands = [
  { min: 4.1, label: "Strong foundations", summary: "Your responses suggest several conditions are supporting sustained capability. The next step is to protect what is working and look for the few gaps that could weaken it over time." },
  { min: 3.1, label: "Room to strengthen", summary: "Your responses suggest a mixed picture: some conditions are helping, while others may be making good work less reliable than it could be. A focused conversation can help identify the highest-value improvement." },
  { min: 0, label: "An opportunity to act", summary: "Your responses suggest there may be important conditions getting in the way of sustained capability. The most useful next step is to understand the system around the work and choose one practical place to begin." },
];
