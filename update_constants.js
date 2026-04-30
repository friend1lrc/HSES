import fs from 'fs';

const content = fs.readFileSync('constants.tsx', 'utf8');

// We'll use a simple regex or AST to add scenarios, but since it's a TS file, it's easier to just replace the whole file with a generated one, or just use regex.
// Actually, I can just generate the full file here.

const newContent = content
  .replace(/(\s*\}\s*\]\s*\},?\s*\{\s*id: PersonaType.PEER_COLLABORATOR,)/, `,
      {
        id: "advisor_lab_conflict",
        title: "Lab Conflict Resolution",
        context: "Two junior lab members are arguing over equipment time, affecting your work. You need Dr. Thorne to intervene without seeming like you're complaining.",
        systemPrompt: "You expect students to handle their own interpersonal issues, but will step in if it affects productivity. Be annoyed that this was brought to you.",
        hints: [
          "Focus on the impact on research productivity.",
          "Suggest a specific schedule or solution.",
          "Keep the tone professional, not personal."
        ]
      }
$1`)
  .replace(/(\s*\}\s*\]\s*\},?\s*\{\s*id: PersonaType.HIRING_MANAGER,)/, `,
      {
        id: "peer_collaborator_grant",
        title: "Grant Co-PI Negotiation",
        context: "You and Dr. Chen are applying for a joint grant. You need to negotiate who will be the lead PI and how the budget is split.",
        systemPrompt: "You want to be lead PI because your department needs the overhead, but you know their expertise is crucial. Be firm but collaborative.",
        hints: [
          "Acknowledge their crucial expertise.",
          "Propose a fair budget split based on actual work.",
          "Discuss the strategic advantage of who is lead PI."
        ]
      }
$1`)
  .replace(/(\s*\}\s*\]\s*\},?\s*\{\s*id: PersonaType.COMMITTEE_CHAIR,)/, `,
      {
        id: "hiring_manager_weakness",
        title: "The Weakness Question",
        context: "Ms. Davis asks you the classic 'What is your greatest weakness?' question during the final interview round.",
        systemPrompt: "You are looking for self-awareness and a proactive approach to improvement, not a cliché answer like 'I work too hard'.",
        hints: [
          "Choose a real, but manageable weakness.",
          "Explain the steps you are taking to improve.",
          "Avoid clichés."
        ]
      },
      {
        id: "hiring_manager_5year",
        title: "The 5-Year Plan",
        context: "Ms. Davis asks where you see yourself in 5 years to gauge your ambition and alignment with the company.",
        systemPrompt: "You want to see ambition but also realistic expectations and a desire to grow within the company.",
        hints: [
          "Align your goals with the company's trajectory.",
          "Show ambition but remain realistic.",
          "Focus on skills you want to develop."
        ]
      }
$1`)
  .replace(/(\s*\}\s*\]\s*\},?\s*\{\s*id: PersonaType.DEAN,)/, `,
      {
        id: "committee_chair_theory",
        title: "Theory Application",
        context: "Dr. Vance questions the theoretical framework you chose for your dissertation, suggesting an alternative.",
        systemPrompt: "You believe your suggested framework is superior. The student must rigorously defend their choice or concede thoughtfully.",
        hints: [
          "Defend your choice with specific literature.",
          "Acknowledge the merits of his suggestion.",
          "Explain why your framework fits your specific data better."
        ]
      },
      {
        id: "committee_chair_postdoc",
        title: "Post-doc Advice",
        context: "You are asking Dr. Vance for advice and a potential recommendation for a prestigious post-doc position.",
        systemPrompt: "You are willing to help, but only if the student has a clear, compelling reason for wanting this specific post-doc.",
        hints: [
          "Explain exactly why this post-doc aligns with your goals.",
          "Highlight how your current work prepares you for it.",
          "Ask for specific feedback on your application materials."
        ]
      }
$1`)
  .replace(/(\s*\}\s*\]\s*\},?\s*\{\s*id: PersonaType.JOURNAL_EDITOR,)/, `,
      {
        id: "dean_diversity",
        title: "Diversity Initiative Funding",
        context: "You are proposing a new student-led diversity initiative and need Dean Sterling to allocate discretionary funds.",
        systemPrompt: "You support diversity but have a very tight budget. The proposal must show clear ROI and broad student impact.",
        hints: [
          "Focus on the broad impact on the student body.",
          "Provide a detailed, realistic budget.",
          "Align the initiative with the university's strategic goals."
        ]
      },
      {
        id: "dean_restructuring",
        title: "Departmental Restructuring",
        context: "Dean Sterling is proposing a restructuring that would merge your department with another. You are voicing student concerns.",
        systemPrompt: "You believe the merger is necessary for financial reasons. You need to hear student concerns but also manage their expectations.",
        hints: [
          "Present concerns calmly and objectively.",
          "Offer constructive alternatives or mitigations.",
          "Acknowledge the financial realities of the university."
        ]
      }
$1`)
  .replace(/(\s*\}\s*\]\s*\},?\s*\{\s*id: PersonaType.ETHICS_OFFICER,)/, `,
      {
        id: "journal_editor_reviewer3",
        title: "Reviewer 3's Impossible Demands",
        context: "Reviewer 3 has asked for additional experiments that are beyond the scope of your paper. You are asking Dr. Hayes for guidance.",
        systemPrompt: "You want the paper to be rigorous, but you also know Reviewer 3 can be unreasonable. The author needs to make a strong case for why the experiments are out of scope.",
        hints: [
          "Be respectful of the reviewer's perspective.",
          "Clearly explain why the experiments are out of scope.",
          "Propose a compromise, like addressing the limitation in the discussion."
        ]
      },
      {
        id: "journal_editor_cover_letter",
        title: "Cover Letter Pitch",
        context: "You are submitting a controversial paper and need to write a compelling cover letter to convince Dr. Hayes to send it out for review.",
        systemPrompt: "You are skeptical of controversial claims. The cover letter must clearly articulate the novelty and rigorous methodology of the paper.",
        hints: [
          "Highlight the novelty and significance of the findings.",
          "Address potential controversies head-on.",
          "Emphasize the rigor of your methodology."
        ]
      }
$1`)
  .replace(/(\s*\}\s*\]\s*\},?\s*\{\s*id: PersonaType.GRANT_REVIEWER,)/, `,
      {
        id: "ethics_officer_incidental",
        title: "Incidental Findings",
        context: "During an MRI study, you discovered an incidental anomaly in a participant's brain. You need to consult Dr. Patel on how to proceed.",
        systemPrompt: "You are focused on the approved protocol and the participant's well-being. You need to ensure the student follows the established procedure for incidental findings.",
        hints: [
          "State the facts clearly without diagnosing.",
          "Refer to the IRB protocol's section on incidental findings.",
          "Ask for clear next steps."
        ]
      },
      {
        id: "ethics_officer_retention",
        title: "Data Retention Policy",
        context: "You are leaving the university and want to take your research data with you. You need Dr. Patel's approval.",
        systemPrompt: "You must enforce the university's data ownership policies. The student can take copies, but the original data must remain.",
        hints: [
          "Acknowledge the university's ownership of the data.",
          "Explain why you need copies for your future work.",
          "Propose a secure method for transferring and storing the copies."
        ]
      }
$1`)
  .replace(/(\s*\}\s*\]\s*\}\s*\]\s*\};\s*)$/, `,
      {
        id: "grant_reviewer_innovation",
        title: "Innovation vs Feasibility",
        context: "Dr. Lewis criticized your proposal for being too innovative and lacking feasibility. You are discussing this in a debrief.",
        systemPrompt: "You stand by your critique. The applicant needs to show how they will mitigate the high risks of their innovative approach.",
        hints: [
          "Acknowledge the risks of your approach.",
          "Explain your specific risk mitigation strategies.",
          "Provide preliminary data to support feasibility."
        ]
      },
      {
        id: "grant_reviewer_team",
        title: "Team Composition",
        context: "Dr. Lewis noted that your team lacks expertise in a key methodology. You are explaining your plan to address this.",
        systemPrompt: "You need to see a concrete plan, such as a new collaboration or specific training, not just vague promises.",
        hints: [
          "Acknowledge the gap in expertise.",
          "Propose a specific collaborator or training plan.",
          "Explain how this addition strengthens the overall proposal."
        ]
      }
    ]
  }
];`);

fs.writeFileSync('constants.tsx', newContent);
console.log('constants.tsx updated');
