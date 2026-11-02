export type ScorecardType = "organisational" | "individual";

// PROVISIONAL: these eight questions per scorecard mirror the V4 demo. Paul's final
// questions, weighting and result wording replace them.
export const scorecardQuestions: Record<ScorecardType, { id: string; text: string }[]> = {
  organisational: [
    { id: "org-01", text: "Teams can explain how their day-to-day work connects to the organisation’s priorities." },
    { id: "org-02", text: "When priorities change, the reasons are shared with the people affected." },
    { id: "org-03", text: "People closest to the work can change how it is done without lengthy approval." },
    { id: "org-04", text: "Improvement ideas from frontline teams are regularly picked up and acted on." },
    { id: "org-05", text: "Teams have the tools and skills they need for the work they are asked to do." },
    { id: "org-06", text: "Time is set aside for people to learn and practise better ways of working." },
    { id: "org-07", text: "We track how working conditions change over time, not only output." },
    { id: "org-08", text: "Leaders review what is getting in the way of teams and follow up on it." },
  ],
  individual: [
    { id: "ind-01", text: "I know what a good day’s work looks like in my role." },
    { id: "ind-02", text: "I understand how my work contributes to my team’s goals." },
    { id: "ind-03", text: "I have a say in how I organise my own work." },
    { id: "ind-04", text: "I can raise a problem at work and expect it to be taken seriously." },
    { id: "ind-05", text: "I can get help from colleagues when work becomes difficult." },
    { id: "ind-06", text: "I have regular conversations about what would help me do my job well." },
    { id: "ind-07", text: "I have had a chance to learn something useful at work recently." },
    { id: "ind-08", text: "I can see a path for developing my skills where I work." },
  ],
};

// PROVISIONAL: working assumptions only. Paul’s final questions, weighting and result copy are still to be approved.
export const resultBands = [
  { min: 4.1, label: "Strong foundations", summary: "Your responses suggest several conditions are supporting sustained capability. The next step is to protect what is working and look for the few gaps that could weaken it over time." },
  { min: 3.1, label: "Room to strengthen", summary: "Your responses suggest a mixed picture: some conditions are helping, while others may be making good work less reliable than it could be. A focused conversation can help identify the highest-value improvement." },
  { min: 0, label: "An opportunity to act", summary: "Your responses suggest there may be important conditions getting in the way of sustained capability. The most useful next step is to understand the system around the work and choose one practical place to begin." },
];
