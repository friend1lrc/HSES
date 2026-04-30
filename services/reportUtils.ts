
import { Persona, Scenario, Message } from '../types';

async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Error converting audio to base64:", e);
    return '';
  }
}

export async function generateHtmlTranscript(persona: Persona, scenario: Scenario, messages: Message[] | any[], sessionRecordingBlob?: Blob): Promise<string> {
  const timestamp = new Date().toLocaleString();
  
  const toBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  let sessionAudioHtml = '';
  if (sessionRecordingBlob) {
    const sessionAudioBase64 = await toBase64(sessionRecordingBlob);
    sessionAudioHtml = `
      <div class="session-audio">
        <div class="role">FULL SESSION RECORDING</div>
        <audio controls src="${sessionAudioBase64}"></audio>
      </div>
    `;
  }

  let messagesHtml = '';
  for (const m of messages) {
    const isUser = m.role === 'user';
    const roleName = isUser ? 'STUDENT' : persona.name.toUpperCase();
    const audioBase64 = m.audioUrl ? await urlToBase64(m.audioUrl) : null;
    
    let feedbackHtml = '';
    if (m.feedback) {
      feedbackHtml = `
        <div class="feedback">
          <strong>Assessment:</strong> Rating ${m.feedback.rating}/5 | 
          Flags: ${[
            m.feedback.clarity ? 'Clear' : null,
            m.feedback.relevance ? 'Relevant' : null,
            m.feedback.helpfulness ? 'Helpful' : null
          ].filter(Boolean).join(', ')}
          ${m.feedback.comments ? `<br><strong>Notes:</strong> ${m.feedback.comments}` : ''}
        </div>
      `;
    }

    messagesHtml += `
      <div class="message ${m.role}">
        <div class="role">${roleName}</div>
        <div class="text">${m.text}</div>
        ${audioBase64 ? `<audio controls src="${audioBase64}"></audio>` : ''}
        ${feedbackHtml}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Academic Communication Portfolio</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f0f2f5; color: #1c1e21; }
    .header { background: #00274C; color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header h1 { margin: 0 0 10px 0; font-size: 24px; }
    .header p { margin: 5px 0; opacity: 0.9; font-size: 14px; }
    .session-audio { background: #FFCB05; color: #00274C; padding: 20px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .message { margin-bottom: 20px; padding: 20px; border-radius: 12px; background: white; border: 1px solid #e4e6eb; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .user { border-left: 6px solid #FFCB05; }
    .model { border-left: 6px solid #00274C; }
    .role { font-weight: 800; margin-bottom: 8px; font-size: 11px; color: #65676b; text-transform: uppercase; letter-spacing: 0.05em; }
    .session-audio .role { color: #00274C; opacity: 0.7; }
    .text { margin-bottom: 12px; line-height: 1.6; font-size: 16px; }
    .feedback { background: #fff9e6; padding: 12px; border-radius: 8px; font-size: 13px; margin-top: 15px; border: 1px solid #ffeeba; color: #856404; }
    audio { width: 100%; margin-top: 10px; height: 35px; }
    .footer { text-align: center; margin-top: 40px; color: #65676b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Academic Communication Portfolio</h1>
    <p><strong>Interaction Partner:</strong> ${persona.name} (${persona.title})</p>
    <p><strong>Scenario:</strong> ${scenario.title}</p>
    <p><strong>Context:</strong> ${scenario.context}</p>
    <p><strong>Generated:</strong> ${timestamp}</p>
  </div>
  
  ${sessionAudioHtml}

  <div class="transcript">
    ${messagesHtml}
  </div>
  <div class="footer">
    &copy; ${new Date().getFullYear()} Academic English Simulator - University of Michigan ELI
  </div>
</body>
</html>
  `;
}

export function generateTranscript(persona: Persona, scenario: Scenario, messages: Message[] | any[]): string {
  const timestamp = new Date().toLocaleString();
  let report = `ACADEMIC COMMUNICATION PORTFOLIO\n`;
  report += `Generated: ${timestamp}\n`;
  report += `------------------------------------------------------------\n\n`;
  report += `PARTICIPANT PROFILE:\n`;
  report += `Interaction Partner: ${persona.name} (${persona.title})\n`;
  report += `Communication Scenario: ${scenario.title}\n`;
  report += `Context: ${scenario.context}\n\n`;
  report += `------------------------------------------------------------\n`;
  report += `DIALOGUE TRANSCRIPT:\n\n`;

  messages.forEach((m, i) => {
    const role = m.role === 'user' ? 'STUDENT' : persona.name.toUpperCase();
    report += `[${role}]: ${m.text}\n`;
    if (m.audioUrl) {
      report += `   >> VOICE RECORDING: [Audio clip recorded]\n`;
    }
    if (m.feedback) {
      report += `   >> ASSESSMENT: Rating ${m.feedback.rating}/5 | `;
      report += `Flags: ${[
        m.feedback.clarity ? 'Clear' : null,
        m.feedback.relevance ? 'Relevant' : null,
        m.feedback.helpfulness ? 'Helpful' : null
      ].filter(Boolean).join(', ')}\n`;
      if (m.feedback.comments) {
        report += `   >> NOTES: ${m.feedback.comments}\n`;
      }
    }
    report += `\n`;
  });

  report += `------------------------------------------------------------\n`;
  report += `END OF REPORT\n`;
  return report;
}

export async function generateStudyGuideHtml(persona: Persona, scenario: Scenario, messages: Message[]): Promise<string> {
  const flagged = messages.filter(m => m.isFlagged);
  
  const toBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const messageItems = await Promise.all(flagged.map(async (m) => {
    let audioHtml = '';
    if (m.audioUrl) {
      try {
        const response = await fetch(m.audioUrl);
        const blob = await response.blob();
        const base64 = await toBase64(blob);
        audioHtml = `<audio controls src="${base64}"></audio>`;
      } catch (e) {
        console.error("Failed to embed audio for study guide", e);
      }
    }

    return `
      <div class="study-item">
        <div class="meta">
          <span class="role">${persona.name}</span>
          <span class="timestamp">${new Date(m.timestamp).toLocaleString()}</span>
        </div>
        <div class="content">${m.text}</div>
        ${audioHtml}
      </div>
    `;
  }));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Study Guide - ${persona.name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #00274C; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #f8fafc; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 4px solid #FFCB05; padding-bottom: 20px; }
        h1 { margin: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 24px; }
        .scenario { font-style: italic; color: #64748b; margin-top: 10px; font-size: 14px; }
        .study-item { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-left: 6px solid #FFCB05; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; }
        .role { color: #00274C; }
        .content { font-size: 15px; margin-bottom: 15px; color: #1e293b; }
        audio { width: 100%; height: 32px; }
        .footer { text-align: center; margin-top: 60px; font-size: 11px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Study Guide: Key Learning Points</h1>
        <p>Interaction Partner: <strong>${persona.name}</strong> (${persona.title})</p>
        <div class="scenario">Scenario: ${scenario.title}</div>
      </div>
      <div class="items">
        ${messageItems.length > 0 ? messageItems.join('') : '<p style="text-align:center; color:#64748b;">No points were flagged during this session.</p>'}
      </div>
      <div class="footer">
        Generated by Practice High-Stakes Academic English Simulator &copy; 2026
      </div>
    </body>
    </html>
  `;
}

export function generateSessionJson(persona: Persona, scenario: Scenario, messages: Message[], mode: 'text' | 'voice'): string {
  const data = {
    version: '1.0',
    timestamp: Date.now(),
    mode,
    persona,
    scenario,
    messages
  };
  return JSON.stringify(data, null, 2);
}

export function parseSessionJson(json: string): any {
  try {
    const data = JSON.parse(json);
    if (!data.persona || !data.scenario || !data.messages || !data.mode) {
      throw new Error("Invalid session file format: missing required fields.");
    }
    return data;
  } catch (e) {
    throw new Error("Failed to parse session file: " + (e instanceof Error ? e.message : "Invalid JSON"));
  }
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function shareToInstructor(persona: Persona, scenario: Scenario) {
  const subject = encodeURIComponent(`Academic Communication Portfolio: ${scenario.title}`);
  const body = encodeURIComponent(`Hello Instructor,\n\nI have completed a high-stakes communication simulation with ${persona.name} regarding "${scenario.title}".\n\nPlease find my attached transcript and recording for review.\n\nBest regards,`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}