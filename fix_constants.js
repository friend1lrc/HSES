import fs from 'fs';
let content = fs.readFileSync('constants.tsx', 'utf8');

content = content.replace(/(\s*\]),\s*\{\s*id: "advisor_lab_conflict"/, '$1\n      },\n      {\n        id: "advisor_lab_conflict"');
content = content.replace(/(\s*\]),\s*\{\s*id: "peer_collaborator_grant"/, '$1\n      },\n      {\n        id: "peer_collaborator_grant"');
content = content.replace(/(\s*\]),\s*\{\s*id: "hiring_manager_weakness"/, '$1\n      },\n      {\n        id: "hiring_manager_weakness"');
content = content.replace(/(\s*\]),\s*\{\s*id: "committee_chair_theory"/, '$1\n      },\n      {\n        id: "committee_chair_theory"');
content = content.replace(/(\s*\]),\s*\{\s*id: "dean_diversity"/, '$1\n      },\n      {\n        id: "dean_diversity"');
content = content.replace(/(\s*\]),\s*\{\s*id: "journal_editor_reviewer3"/, '$1\n      },\n      {\n        id: "journal_editor_reviewer3"');
content = content.replace(/(\s*\]),\s*\{\s*id: "ethics_officer_incidental"/, '$1\n      },\n      {\n        id: "ethics_officer_incidental"');

fs.writeFileSync('constants.tsx', content);
