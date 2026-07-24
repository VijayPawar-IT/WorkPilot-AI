/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper to initialize Gemini client safely
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured. Please add your key in the Secrets vault.');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// 1. AI MODULE: Career Assistant Roadmap & Skill Gaps
app.post('/api/ai/career-roadmap', async (req, res) => {
  try {
    const { currentRole, targetRole, yearsExperience, coreSkills } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are an elite executive career coach and organizational developer. 
    Design an exhaustive professional career transition roadmap.
    Current Role: ${currentRole}
    Target Transition Role: ${targetRole}
    Years of Experience: ${yearsExperience} years
    Current Core Skills: ${coreSkills}

    Please provide a structured response analysis matching the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            timeline: { type: Type.STRING },
            targetRole: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  skillsRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
                  actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['phase', 'skillsRequired', 'actions', 'resources'],
              },
            },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  gapLevel: { type: Type.STRING, description: 'low, medium, or high' },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['skill', 'gapLevel', 'recommendations'],
              },
            },
            salaryInsight: {
              type: Type.OBJECT,
              properties: {
                range: { type: Type.STRING },
                negotiatingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['range', 'negotiatingTips'],
            },
          },
          required: ['role', 'timeline', 'targetRole', 'steps', 'skillGaps', 'salaryInsight'],
        },
      },
    });

    const roadmapData = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, data: roadmapData });
  } catch (error: any) {
    console.error('Career Roadmap Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. AI MODULE: Resume Analyzer
app.post('/api/ai/analyze-resume', async (req, res) => {
  try {
    const { resumeText, targetJobDesc } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are an HR Director and ATS (Applicant Tracking System) Specialist.
    Analyze the following resume details against the target job profile.
    Resume content:
    ${resumeText}

    Target Job Description/Profile:
    ${targetJobDesc || 'Standard Professional Leadership Role'}

    Provide a precise review scoring, skill matching, bullet enhancements, and interview tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER, description: 'ATS score out of 100' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedBulletPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'High impact STAR format bullet replacements' },
            interviewPreparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            salaryNegotiationPointers: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['atsScore', 'strengths', 'missingSkills', 'suggestedBulletPoints', 'interviewPreparationTips', 'salaryNegotiationPointers']
        }
      }
    });

    const analysis = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. AI MODULE: Meeting Summary & Actions
app.post('/api/ai/meeting-summary', async (req, res) => {
  try {
    const { meetingTitle, notesText } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a Chief of Staff. Summarize these corporate meeting minutes cleanly and generate strict follow-ups and actions.
    Meeting Title: ${meetingTitle}
    Scribbled Notes:
    ${notesText}

    Return a beautiful formatted summary, the last discussed topic context, and next actionable items assigned to roles/methods.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            lastDiscussion: { type: Type.STRING },
            nextActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            emailDraft: { type: Type.STRING, description: 'A polished team follow-up message ready to send' }
          },
          required: ['summary', 'lastDiscussion', 'nextActions', 'emailDraft']
        }
      }
    });

    const analysis = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Meeting optimization error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. AI MODULE: Smart Professional Email Generator
app.post('/api/ai/write-email', async (req, res) => {
  try {
    const { sender, recipient, tone, context, keyPoints, callToAction } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are WorkPilot's master communication assistant. Write a professional email.
    Sender Name/Role: ${sender || 'Corporate Employee'}
    Recipient Name/Role: ${recipient || 'Stakeholder'}
    Tone style: ${tone || 'formal'}
    Primary context/trigger: ${context}
    Key information to include: ${keyPoints || 'None specified'}
    Call-to-Action required: ${callToAction || 'Please review and confirm'}

    Design a high-quality email template including a professional Subject Line and clean layout.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLine: { type: Type.STRING },
            body: { type: Type.STRING },
            tips: { type: Type.STRING, description: 'Pro-tips on sending/following up this email style' }
          },
          required: ['subjectLine', 'body', 'tips']
        }
      }
    });

    const emailData = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, data: emailData });
  } catch (error: any) {
    console.error('Email draft error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. AI MODULE: Auto-Journal Log Generator from Tasks
app.post('/api/ai/generate-journal', async (req, res) => {
  try {
    const { completedTasks, date } = req.body;
    const ai = getGeminiClient();

    const tasksString = completedTasks && completedTasks.length > 0 
      ? completedTasks.join(', ') 
      : 'Routine checks and managing inbox';

    const prompt = `You are WorkPilot's Daily Reflection Chronicler.
    Construct a professional, introspective daily work journal entry based on the completed tasks of the day.
    Date: ${date}
    Completed Items: ${tasksString}

    Draft a concise, polished work journal entry detailing performance reflections, learning metrics, and positive feedback points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            journalText: { type: Type.STRING },
            mood: { type: Type.STRING, description: 'Single word matching: Energetic, Focused, Balanced, Productive, Relaxed' },
            growthScore: { type: Type.INTEGER, description: 'Estimated rating of the day from 1-100 based on value created' }
          },
          required: ['journalText', 'mood', 'growthScore']
        }
      }
    });

    const journal = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, data: journal });
  } catch (error: any) {
    console.error('Journal reflection error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. AI MODULE: Corporate Chat Assistant with memory
app.post('/api/ai/chat-assistant', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    const ai = getGeminiClient();

    // Map message list safely
    const formattedHistory = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are Pilot, the core artificial intelligence for WorkPilot AI: Your Personal Corporate Life Manager.
    Your tone is exceptionally supportive, sharp, professional, and strategic (equal parts corporate whisperer, career mentor, and certified accountant).
    You have deep knowledge of:
    - Career progression, OKRs, promotions
    - Corporate finances, tax calculators (compliant with standard rules), investments (Mutual Funds, SIPs, Debt vs Equity)
    - Health hacks (avoiding screen fatigue, back pain posture checks, hydration tips)
    - Work-life balance.

    User Profile Context:
    Role: ${userProfile?.currentRole || 'Corporate Professional'} 
    Experience: ${userProfile?.yearsExperience || 'N/A'} years
    Focus areas: Financial health, learning growth, task organization.

    Reply helpfully, giving direct tactical suggestions. Keep explanations concise, scannable with markdown bold highlights, and extremely elegant.`;

    const lastMessage = formattedHistory.pop() || { parts: [{ text: 'Hello!' }] };

    const chatInput = {
      model: 'gemini-3.5-flash',
      contents: [
        ...formattedHistory,
        { role: lastMessage.role, parts: lastMessage.parts }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    };

    const response = await ai.models.generateContent(chatInput);
    res.json({ success: true, message: response.text });
  } catch (error: any) {
    console.error('AI Mentor error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// -------------------------------------------------------------
// VITE OR STATIC BUILD MIDDLEWARE MOUNTING
// -------------------------------------------------------------

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WorkPilot Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
