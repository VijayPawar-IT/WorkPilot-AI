/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Briefcase,
  Target,
  Video,
  CheckSquare,
  ShieldCheck,
  DollarSign,
  CreditCard,
  Calendar,
  Heart,
  Users,
  BookOpen,
  Mail,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  Lock,
  Unlock,
  FileText,
  Plus,
  Trash,
  Play,
  Check,
  Sparkles,
  Clock,
  ArrowUpRight,
  Award,
  Crown,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Activity,
  Coffee,
  RotateCcw,
  FileUp,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { initialWorkPilotState } from './mockData';
import { WorkPilotState, Task, Meeting, Goal, DocumentRecord, ChatMessage, FamilyEvent } from './types';

export default function App() {
  // Theme & State
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [appState, setAppState] = useState<WorkPilotState>(initialWorkPilotState);

  // Subscription / Upgrade Hub selection state
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [activePlan, setActivePlan] = useState<'free' | 'monthly' | 'yearly'>('free');
  
  // Custom User details for initialization / career customization
  const [userProfile, setUserProfile] = useState({
    name: 'Vijay Pawar',
    email: 'vijaypawar845298@gmail.com',
    currentRole: 'Senior Software Engineer',
    targetRole: 'VP of Engineering / Lead Architect',
    yearsExperience: '8',
    coreSkills: 'React, TypeScript, Node.js, System Architecture, AWS'
  });

  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default true for preview ease, toggleable
  const [authMethod, setAuthMethod] = useState<string>('email');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authOtp, setAuthOtp] = useState<string>('');

  // Notifications State
  const [notifMenuOpen, setNotifMenuOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // AI Career States
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [customRoadmap, setCustomRoadmap] = useState<any>(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeJobTarget, setResumeJobTarget] = useState('');
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [resumeResult, setResumeResult] = useState<any>(null);

  // AI Meeting Assistant
  const [editingMeetingId, setEditingMeetingId] = useState<string>('meet-1');
  const [meetingTranscribing, setMeetingTranscribing] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingSummaryResult, setMeetingSummaryResult] = useState<any>(null);

  // AI Email Writer Specs
  const [emailSender, setEmailSender] = useState('Vijay Pawar');
  const [emailRecipient, setEmailRecipient] = useState('Sarah Lin (VP HR)');
  const [emailTone, setEmailTone] = useState('formal');
  const [emailContext, setEmailContext] = useState('Negotiating a remote allowance base increase after the early review cycle promotion');
  const [emailKeyPoints, setEmailKeyPoints] = useState('Leadership on multi-tier migration, AWS certification progress, maintaining Q2 department code coverage at 88%');
  const [emailCta, setEmailCta] = useState('Let us schedule a quick sync room conversation tomorrow');
  const [emailDrafting, setEmailDrafting] = useState(false);
  const [emailResult, setEmailResult] = useState<any>(null);

  // Chat memory assistant states
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Dynamic creation overlays & states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'work' | 'personal' | 'learning'>('work');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDate, setNewTaskDate] = useState('2026-06-19');

  const [vaultPassword, setVaultPassword] = useState('');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [selectedDocToDecrypt, setSelectedDocToDecrypt] = useState<DocumentRecord | null>(null);

  // Auto Journal Logic state
  const [journalText, setJournalText] = useState('');
  const [journalMood, setJournalMood] = useState('');
  const [generatingJournal, setGeneratingJournal] = useState(false);

  // Tax and finance model values
  const [simulatedGross, setSimulatedGross] = useState<number>(1400000);
  const [simulatedInvestments, setSimulatedInvestments] = useState<number>(150000); // Section 80C standard limit
  const [estimatedTax, setEstimatedTax] = useState<number>(125000);

  // Document upload sim state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState<'letter' | 'salary' | 'id' | 'certificate' | 'insurance' | 'finance'>('letter');

  // Trigger alert helper
  const showAlert = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  // Sync state between App & Tailwind dark preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Set default transcript for chosen meeting trigger
  useEffect(() => {
    const selected = appState.meetings.find(m => m.id === editingMeetingId);
    if (selected) {
      setMeetingNotes(selected.notes || '');
      setMeetingSummaryResult(selected.summary ? {
        summary: selected.summary,
        lastDiscussion: selected.lastDiscussion || '',
        nextActions: selected.nextActions || [],
        emailDraft: 'Hi Team,\n\nFollowing our review, please note parameters.'
      } : null);
    }
  }, [editingMeetingId, appState.meetings]);

  // 1. DYNAMIC ANALYTICS SCORES COMPUTATION
  const computedScores = useMemo(() => {
    const totalTasks = appState.tasks.length;
    const completedTasks = appState.tasks.filter(t => t.status === 'completed').length;
    const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 75;

    const totalGoals = appState.goals.length;
    const completedGoalsValue = appState.goals.reduce((acc, g) => acc + (g.currentValue / g.targetValue), 0);
    const goalScore = totalGoals > 0 ? Math.round((completedGoalsValue / totalGoals) * 100) : 80;

    const financeHealthScore = Math.max(20, Math.min(100, Math.round(95 - (estimatedTax / simulatedGross) * 150)));
    const learningScore = userProfile.coreSkills.split(',').length * 15 + (appState.tasks.filter(t => t.category === 'learning' && t.status === 'completed').length * 10);
    const finalLearning = Math.min(100, learningScore || 85);

    const careerScore = Math.round((productivityScore * 0.3) + (goalScore * 0.4) + (finalLearning * 0.3));

    return {
      productivity: productivityScore,
      goal: goalScore,
      finance: financeHealthScore,
      learning: finalLearning,
      career: careerScore
    };
  }, [appState.tasks, appState.goals, estimatedTax, simulatedGross, userProfile.coreSkills]);

  // 2. NETWORK API CONTROLLERS CALLING THE SERVER.TS SERVICES

  // Generate Career Roadmap via Gemini AI
  const handleGenerateRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const response = await fetch('/api/ai/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRole: userProfile.currentRole,
          targetRole: userProfile.targetRole,
          yearsExperience: userProfile.yearsExperience,
          coreSkills: userProfile.coreSkills,
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setCustomRoadmap(resData.data);
        showAlert('AI Mentorship Roadmap successfully modeled!', 'success');
      } else {
        throw new Error(resData.error || 'Server returned invalid response');
      }
    } catch (err: any) {
      console.error(err);
      showAlert(`AI Call failed: Please check GEMINI_API_KEY. Details: ${err.message}`, 'error');
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Analyze Resume with ATS
  const handleAnalyzeResume = async () => {
    if (!resumeText) {
      showAlert('Please enter your resume text or Paste credentials first', 'info');
      return;
    }
    setResumeAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetJobDesc: resumeJobTarget || 'Lead Software / Cloud System Architect'
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setResumeResult(resData.data);
        showAlert('Resume analysis complete! ATS score calibrated.', 'success');
      } else {
        throw new Error(resData.error);
      }
    } catch (err: any) {
      console.error(err);
      showAlert(`AI Call failed: Ensure your GEMINI_API_KEY is configured.`, 'error');
    } finally {
      setResumeAnalyzing(false);
    }
  };

  // Summarize meeting notes & extract action points
  const handleOptimizeMeeting = async () => {
    if (!meetingNotes) {
      showAlert('Meeting notes cannot be empty', 'info');
      return;
    }
    setMeetingTranscribing(true);
    try {
      const currentMeeting = appState.meetings.find(m => m.id === editingMeetingId);
      const response = await fetch('/api/ai/meeting-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTitle: currentMeeting?.title || 'Team Alignment Meeting',
          notesText: meetingNotes
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setMeetingSummaryResult(resData.data);

        // Map updates to actual state dynamically to preserve tracking
        setAppState(prev => ({
          ...prev,
          meetings: prev.meetings.map(m => {
            if (m.id === editingMeetingId) {
              return {
                ...m,
                notes: meetingNotes,
                summary: resData.data.summary,
                lastDiscussion: resData.data.lastDiscussion,
                nextActions: resData.data.nextActions,
                followUpGenerated: true
              };
            }
            return m;
          })
        }));
        showAlert('AI compiled meeting notes & actions saved to history!', 'success');
      } else {
        throw new Error(resData.error);
      }
    } catch (err: any) {
      console.error(err);
      showAlert(`AI compilation failed: Review server logs or API key`, 'error');
    } finally {
      setMeetingTranscribing(false);
    }
  };

  // Generate tactical email
  const handleGenerateEmail = async () => {
    setEmailDrafting(true);
    try {
      const response = await fetch('/api/ai/write-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: emailSender,
          recipient: emailRecipient,
          tone: emailTone,
          context: emailContext,
          keyPoints: emailKeyPoints,
          callToAction: emailCta
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setEmailResult(resData.data);
        showAlert('Polished corporate email formulated!', 'success');
      } else {
        throw new Error(resData.error);
      }
    } catch (err: any) {
      console.error(err);
      showAlert(`Email generator failed: Configure your system API secrets.`, 'error');
    } finally {
      setEmailDrafting(false);
    }
  };

  // Auto Journal Log reflective maker
  const handleAutoJournal = async () => {
    setGeneratingJournal(true);
    try {
      const completed = appState.tasks
        .filter(t => t.status === 'completed')
        .map(t => t.title);

      const response = await fetch('/api/ai/generate-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTasks: completed,
          date: new Date().toISOString().split('T')[0]
        })
      });
      const resData = await response.json();
      if (resData.success) {
        const newLog = {
          id: `journal-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          tasksCompleted: completed,
          journalText: resData.data.journalText,
          mood: resData.data.mood
        };
        setAppState(prev => ({
          ...prev,
          journalLogs: [newLog, ...prev.journalLogs]
        }));
        setJournalText(resData.data.journalText);
        setJournalMood(resData.data.mood);
        showAlert('AI Daily Journal logged based on tasks done!', 'success');
      } else {
        throw new Error(resData.error);
      }
    } catch (err: any) {
      console.error(err);
      showAlert(`Failed to auto-reflect daily logs.`, 'error');
    } finally {
      setGeneratingJournal(false);
    }
  };

  // Core Corporate Chatbot implementation with live response
  const handleSendChatMessage = async () => {
    if (!chatMessageInput.trim()) return;
    
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: 'user',
      content: chatMessageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAppState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg]
    }));
    const textToSend = chatMessageInput;
    setChatMessageInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...appState.chatHistory, userMsg],
          userProfile
        })
      });
      const resData = await response.json();
      if (resData.success) {
        const assistantMsg: ChatMessage = {
          id: `chat-${Date.now() + 1}`,
          role: 'assistant',
          content: resData.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAppState(prev => ({
          ...prev,
          chatHistory: [...prev.chatHistory, assistantMsg]
        }));
      } else {
        throw new Error(resData.error);
      }
    } catch (err: any) {
      console.error(err);
      const assistantMsgErr: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: 'assistant',
        content: `**API Hook Alert:** I am unable to connect to the model. Check that your \`GEMINI_API_KEY\` is configured. Here has been an error: *${err.message}*.\n\nMeanwhile, feel free to use standard services or edit profile configurations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAppState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, assistantMsgErr]
      }));
    } finally {
      setChatLoading(false);
    }
  };

  // Task manipulation utilities
  const handleToggleTaskStatus = (id: string) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t)
    }));
    showAlert('Task status synchronized.', 'success');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const added: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: 'Manually logged schedule parameter.',
      priority: newTaskPriority,
      status: 'pending',
      dueDate: newTaskDate,
      category: newTaskCategory
    };
    setAppState(prev => ({
      ...prev,
      tasks: [added, ...prev.tasks]
    }));
    setNewTaskTitle('');
    setShowTaskModal(false);
    showAlert('Task added successfully!', 'success');
  };

  const handleDeleteTask = (id: string) => {
    setAppState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
    showAlert('Task removed.', 'info');
  };

  // Secure Crypt Vault interactions
  const handleEncryptUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const mockFilename = docFile ? docFile.name : `Uploaded_Doc_${Date.now().toString().slice(-4)}.pdf`;
    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      name: mockFilename,
      category: docCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      isEncrypted: true,
      fileSize: '482 KB'
    };
    setAppState(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents]
    }));
    setDocFile(null);
    showAlert('Document encrypted using military-grade security and uploaded.', 'success');
  };

  const triggerDecryptDoc = (doc: DocumentRecord) => {
    setSelectedDocToDecrypt(doc);
    setVaultPassword('');
    setVaultUnlocked(false);
  };

  const verifyVaultPassword = () => {
    if (vaultPassword === '1234') { // Secure demo PIN
      setVaultUnlocked(true);
      showAlert('E2E Decryption verified!', 'success');
    } else {
      showAlert('Access Denied: Invalid secure master PIN.', 'error');
    }
  };

  // Dynamic calculations for Tax
  useEffect(() => {
    const calculatedTaxIncome = Math.max(0, simulatedGross - simulatedInvestments - (appState.salary.hra + appState.salary.allowance));
    let tax = 0;
    if (calculatedTaxIncome > 1200000) {
      tax = (calculatedTaxIncome - 1200000) * 0.15 + 45000;
    } else if (calculatedTaxIncome > 800000) {
      tax = (calculatedTaxIncome - 800000) * 0.10 + 15000;
    } else if (calculatedTaxIncome > 400000) {
      tax = (calculatedTaxIncome - 400000) * 0.05;
    }
    setEstimatedTax(Math.round(tax));
  }, [simulatedGross, simulatedInvestments, appState.salary.hra, appState.salary.allowance]);

  // Handle marking notification as read
  const handleMarkNotifRead = (id: string) => {
    setAppState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    }));
  };

  // Water increment helper
  const handleWaterDrink = (amount: number) => {
    setAppState(prev => ({
      ...prev,
      health: {
        ...prev.health,
        waterMl: Math.min(prev.health.waterGoalMs, prev.health.waterMl + amount)
      }
    }));
    showAlert(`Logged +${amount}ml water hydration.`, 'success');
  };

  // Step goal logic addition
  const handleLogSteps = (count: number) => {
    setAppState(prev => ({
      ...prev,
      health: {
        ...prev.health,
        stepsCount: Math.min(prev.health.stepsGoal * 2, prev.health.stepsCount + count)
      }
    }));
    showAlert(`Steps count logged: ${count}. Keep active!`, 'success');
  };

  // Family Bill trigger payments
  const handlePayBill = (id: string) => {
    setAppState(prev => ({
      ...prev,
      familyEvents: prev.familyEvents.map(f => f.id === id ? { ...f, isPaid: true } : f)
    }));
    showAlert('Dynamic payment authorized! SIP asset cleared.', 'success');
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-all duration-300`}>
      
      {/* 1. TOP DENTIST GLASS HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/60 lg:hidden"
            id="sidebar-toggle-btn"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-semibold font-display shadow-lg shadow-violet-500/20">
              W
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-400 bg-clip-text text-transparent">
                WorkPilot AI
              </h1>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                YOUR CORPORATE LIFE MANAGER
              </p>
            </div>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-4">
          
          {/* Real AI Connection Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-violet-500/10 dark:bg-violet-400/5 text-violet-600 dark:text-violet-400 border border-violet-500/20 rounded-full text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span>Gemini Model Active</span>
          </div>

          {/* Theme Toggler */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-300 dark:hover:border-slate-800 transition-all cursor-pointer"
            id="theme-toggler"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>

          {/* Smart Alerts Box */}
          <div className="relative">
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-300 dark:hover:border-slate-800 transition-all relative cursor-pointer"
              id="notif-btn"
            >
              <Bell className="h-5 w-5" />
              {appState.notifications.some(n => !n.isRead) && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
              )}
            </button>

            {/* Notifications drop down */}
            {notifMenuOpen && (
              <div className="absolute right-0 mt-3 w-80 glass-panel-heavy p-4 z-50 text-xs shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-2 mb-2">
                  <h3 className="font-semibold text-sm">Notifications Engine</h3>
                  <button 
                    onClick={() => {
                      setAppState(prev => ({
                        ...prev,
                        notifications: prev.notifications.map(n => ({ ...n, isRead: true }))
                      }));
                      showAlert('All items marked read.', 'info');
                    }}
                    className="text-violet-500 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {appState.notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleMarkNotifRead(n.id)}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${n.isRead ? 'bg-transparent text-slate-500' : 'bg-violet-500/10 text-slate-100'}`}
                    >
                      <div className="flex justify-between items-start font-medium pb-1">
                        <span className="capitalize text-violet-500 font-bold">[{n.type}] {n.title}</span>
                        {!n.isRead && <span className="h-1.5 w-1.5 bg-rose-500 rounded-full"></span>}
                      </div>
                      <p className="text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick User Avatar Pin */}
          <div className="flex items-center gap-2 border-l border-slate-300 dark:border-slate-800 pl-3">
            <div className="h-9 w-9 rounded-full bg-violet-600 text-white font-medium flex items-center justify-center text-sm font-display">
              VP
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold">{userProfile.name}</p>
              <p className="text-[10px] text-slate-500 hover:underline cursor-pointer" onClick={() => setCurrentTab('settings')}>{userProfile.currentRole}</p>
            </div>
          </div>

        </div>
      </header>

      {/* DYNAMIC FLASH ALERT WIDGET */}
      {alertMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl border glass-panel-heavy shadow-2xl animate-fade-in-up">
          {alertMessage.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-rose-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          )}
          <span className="text-xs font-mono font-medium">{alertMessage.text}</span>
        </div>
      )}

      {/* 2. BODY SHELL */}
      <div className="flex">
        
        {/* SIDE BAR NAVIGATION CONTAINER */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'} shrink-0 min-h-[calc(100vh-69px)] border-r border-slate-200/50 dark:border-slate-800/80 bg-slate-100/30 dark:bg-slate-950/40 backdrop-blur-sm transition-all duration-300 overflow-hidden`}>
          <div className="p-4 space-y-7">
            
            {/* Nav list categories group */}
            <div className="space-y-1">
              {[
                { tabName: 'dashboard', label: 'Primary Terminal', icon: BarChart3 },
                { tabName: 'career', label: 'AI Career Mentor', icon: Briefcase },
                { tabName: 'kpi', label: 'Goal & KPI Deck', icon: Target },
                { tabName: 'meetings', label: 'Meeting & Tasks', icon: Video },
                { tabName: 'vault', label: 'Document Lockbox', icon: ShieldCheck },
                { tabName: 'salary', label: 'Salary & Taxes', icon: DollarSign },
                { tabName: 'health', label: 'Health Indicators', icon: Heart },
                { tabName: 'creator', label: 'AI Creator Space', icon: Sparkles },
                { tabName: 'settings', label: 'Admin Options', icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = currentTab === item.tabName;
                return (
                  <button
                    key={item.tabName}
                    onClick={() => {
                      setCurrentTab(item.tabName);
                      // On mobile close side screen
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-3 py-3.5 my-1.5 transition-all outline-none rounded-xl cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600 text-white font-semibold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 shrink-0" />
                    <span className={`text-[13px] whitespace-nowrap transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick stats mini card inside sidebar */}
            {sidebarOpen && (
              <div className="p-3.5 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-600/5 to-indigo-600/5">
                <div className="flex items-center gap-1.5 pb-1">
                  <Award className="h-4 w-4 text-violet-500" />
                  <span className="text-[11px] font-bold tracking-wider font-mono">PILOT SCORE</span>
                </div>
                <div className="text-2xl font-display font-extrabold text-violet-500">{computedScores.career}%</div>
                <div className="w-full bg-slate-300 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-violet-500 h-full rounded-full" style={{ width: `${computedScores.career}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 pt-1">Model calculated corporate efficiency.</p>
              </div>
            )}

            {/* Premium CTA upgrade panel */}
            {sidebarOpen && (
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-center text-xs shadow-xl">
                <Crown className="h-5 w-5 text-yellow-400 mx-auto mb-1.5" />
                <h4 className="font-semibold text-slate-100">WorkPilot Pro</h4>
                <p className="text-[10px] text-slate-400 mt-1">Unlock all ATS parsing and unlimited dynamic resumes.</p>
                <button
                  onClick={() => {
                    setCurrentTab('settings');
                    showAlert('Showing monetization license setup.', 'info');
                  }}
                  className="w-full mt-2.5 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-[10px] uppercase font-bold tracking-wider rounded-lg text-white"
                >
                  Upgrade Hub
                </button>
              </div>
            )}

          </div>
        </aside>

        {/* 3. CORE DISPLAY WORKSPACE CONTAINER */}
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto overflow-y-auto min-h-[calc(100vh-69px)]">

          {/* TAB 1: WORKPILOT TERMINAL (DASHBOARD) */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* HEADING ROW */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
                    Welcome Back, {userProfile.name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowTaskModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 font-semibold text-xs rounded-xl hover:shadow-lg transition-all text-white cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Schedule Action Item
                  </button>
                  <button
                    onClick={() => handleAutoJournal()}
                    disabled={generatingJournal}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl border border-transparent hover:border-slate-300 dark:hover:border-slate-800 transition-all cursor-pointer"
                  >
                    {generatingJournal ? 'Syncing...' : 'AI Reflect Log'}
                  </button>
                </div>
              </div>

              {/* BENTO GRID 1: CORE SCORES INDEX CARD */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="glass-panel p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400">PRODUCTIVITY</span>
                    <h3 className="text-2xl font-extrabold font-display mt-0.5">{computedScores.productivity}%</h3>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${computedScores.productivity}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400">GOAL COMPLETION</span>
                    <h3 className="text-2xl font-extrabold font-display mt-0.5">{computedScores.goal}%</h3>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${computedScores.goal}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400">FINANCE TIER</span>
                    <h3 className="text-2xl font-extrabold font-display mt-0.5">{computedScores.finance}%</h3>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: `${computedScores.finance}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400">LEARNING INDEX</span>
                    <h3 className="text-2xl font-extrabold font-display mt-0.5">{computedScores.learning}%</h3>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${computedScores.learning}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel p-4 col-span-2 lg:col-span-1 bg-gradient-to-tr from-violet-600/10 to-indigo-600/10 border-violet-500/20 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-violet-400">AGGREGATE PILOT SCORE</span>
                    <h3 className="text-3xl font-extrabold font-display text-violet-500">{computedScores.career}%</h3>
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400">Combined KPI performance metrics metrics.</p>
                </div>

              </div>

              {/* INTERACTIVE WORKSPACE SPLIT BLOCK */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* TIMELINE COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* AI DAY SUMMARY */}
                  <div className="glass-panel p-5 bg-gradient-to-r from-violet-600/5 to-indigo-600/5 border border-violet-500/10 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-24 w-24 bg-violet-600/5 blur-2xl rounded-full"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-violet-500" />
                      <h3 className="text-sm font-semibold font-display">Daily WorkPilot Briefing</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      Based on your upcoming schedule, you have <strong className="text-violet-500">{appState.meetings.length} vital synced operations</strong>. 
                      Your code quality goals require evaluating AWS training benchmarks. 
                      Ensure your landlord receipt details are ready for tax filings by target due dates inside your planner parameters.
                    </p>
                    
                    {/* Embedded Actionable tips */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600">
                        💡 Tip: Re-verify PF savings logs before compiling compensation.
                      </span>
                    </div>
                  </div>

                  {/* ACTIVE AGENDA TIMELINE ITEMS */}
                  <div className="glass-panel p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/80">
                      <h3 className="text-[14px] font-bold font-display">Priority Operational Logs</h3>
                      <span className="text-xs text-slate-400">{appState.tasks.filter(t => t.status === 'pending').length} remaining action items</span>
                    </div>

                    <div className="space-y-3">
                      {appState.tasks.map(task => (
                        <div 
                          key={task.id} 
                          className="p-3 bg-slate-100/50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-400 dark:hover:border-slate-800 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleToggleTaskStatus(task.id)}
                              className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                                task.status === 'completed' 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-400 dark:border-slate-600 hover:border-violet-500'
                              }`}
                            >
                              {task.status === 'completed' && <Check className="h-3 w-3" />}
                            </button>
                            <div>
                              <h4 className={`text-xs font-semibold ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                  task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
                                }`}>
                                  {task.priority}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" /> Due: {task.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVE MEETING SYNCED TIMELINE */}
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-[14px] font-bold font-display">Agenda Meetings Sync</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appState.meetings.map(meet => (
                        <div key={meet.id} className="p-4 bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-xl space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-slate-100">{meet.title}</h4>
                            <span className="text-[9px] bg-violet-600/15 text-violet-400 px-2 py-0.5 rounded font-bold font-mono">
                              {meet.time}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed max-line-2 font-mono">
                            Hosted by {meet.host}
                          </p>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-[9px] text-slate-500">Duration: {meet.duration}</span>
                            <button
                              onClick={() => {
                                setEditingMeetingId(meet.id);
                                setCurrentTab('meetings');
                              }}
                              className="text-[10px] text-violet-500 font-bold hover:underline"
                            >
                              Open Assistant →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* SIDE COLUMN: QUICK HEALTH, REMINDERS & LEAVES STATUS */}
                <div className="space-y-6">
                  
                  {/* METRIC PRESETS: LEAVE STATUS BALANCE */}
                  <div className="glass-panel p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[14px] font-bold font-display">Leave Registry</h3>
                      <button 
                        onClick={() => setCurrentTab('settings')}
                        className="text-[10px] text-violet-500 font-bold hover:underline"
                      >
                        Request Slips
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-bold">CASUAL</span>
                        <p className="text-xl font-extrabold text-violet-500 mt-1">{appState.leaveBalance.Casual}</p>
                      </div>
                      <div className="p-2.5 bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-bold">SICK</span>
                        <p className="text-xl font-extrabold text-emerald-500 mt-1">{appState.leaveBalance.Sick}</p>
                      </div>
                      <div className="p-2.5 bg-slate-200/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] text-slate-500 font-bold">EARNED</span>
                        <p className="text-xl font-extrabold text-blue-500 mt-1">{appState.leaveBalance.Earned}</p>
                      </div>
                    </div>
                  </div>

                  {/* QUICK HEALTH INDICATORS ACTIONS */}
                  <div className="glass-panel p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[14px] font-bold font-display">Health Trackers</h3>
                      <span className="text-[10px] text-emerald-500 font-mono uppercase font-bold flex items-center gap-1">
                        <Activity className="h-3 w-3" /> Aligned
                      </span>
                    </div>

                    {/* Water log action */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1">💧 Hydration Intake</span>
                          <span className="font-mono font-bold text-blue-400">{appState.health.waterMl}ml / {appState.health.waterGoalMs}ml</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-400 h-full rounded-full transition-all duration-300 animate-pulse" 
                            style={{ width: `${(appState.health.waterMl / appState.health.waterGoalMs) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={() => handleWaterDrink(250)}
                            className="flex-1 py-1 text-[9px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg"
                          >
                            +250ml
                          </button>
                          <button
                            onClick={() => handleWaterDrink(500)}
                            className="flex-1 py-1 text-[9px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg"
                          >
                            +500ml
                          </button>
                        </div>
                      </div>

                      {/* Walk counter tracker log */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1">🏃 Walking Metric</span>
                          <span className="font-mono font-bold text-emerald-400">{appState.health.stepsCount} / {appState.health.stepsGoal} steps</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(100, (appState.health.stepsCount / appState.health.stepsGoal) * 100)}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={() => handleLogSteps(1500)}
                          className="w-full mt-2 py-1 text-[9px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg"
                        >
                          Simulate Walk (+1500 steps)
                        </button>
                      </div>

                      {/* Med List Log */}
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Medicine Timers</span>
                        <div className="space-y-1.5 text-[11px]">
                          {appState.health.meds.map((m, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-200/30 dark:bg-slate-900/40 p-2 rounded-lg">
                              <span>{m.name} <span className="text-[9px] text-slate-500">({m.time})</span></span>
                              <button
                                onClick={() => {
                                  const updatedMeds = [...appState.health.meds];
                                  updatedMeds[idx].taken = !updatedMeds[idx].taken;
                                  setAppState(prev => ({
                                    ...prev,
                                    health: { ...prev.health, meds: updatedMeds }
                                  }));
                                  showAlert(`Logged dosage: ${m.name}`, 'success');
                                }}
                                className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase ${
                                  m.taken ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                }`}
                              >
                                {m.taken ? 'TAKEN' : 'MARK'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ACTIVE COMPREHENSIVE FAMILY ALERTS */}
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-[14px] font-bold font-display text-slate-900 dark:text-slate-100">Family & Household Reminders</h3>
                    <div className="space-y-2.5">
                      {appState.familyEvents.map(event => (
                        <div key={event.id} className="p-3 bg-slate-200/30 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-900 rounded-xl space-y-2 leading-relaxed">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold">{event.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              event.category === 'Birthday' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-rose-400'
                            }`}>
                              {event.category}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/30 dark:border-slate-800/40">
                            <span>Key Date: {event.date}</span>
                            {event.amountDue && (
                              <button
                                onClick={() => handlePayBill(event.id)}
                                disabled={event.isPaid}
                                className={`px-2.5 py-1 rounded font-bold text-[9px] transition-colors ${
                                  event.isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500 hover:bg-rose-600 text-white'
                                }`}
                              >
                                {event.isPaid ? 'PAID' : `PAY $${event.amountDue}`}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AI CAREER ASSISTANT & COUNSELOR */}
          {currentTab === 'career' && (
            <div className="space-y-6">
              
              {/* Introduction */}
              <div className="glass-panel p-6 bg-gradient-to-r from-violet-600/5 to-indigo-600/5 border border-violet-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="h-6 w-6 text-violet-500" />
                  <h2 className="text-lg font-bold font-display">AI Strategic Career Assistant</h2>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Analyze skill parameters, generate robust promotional roadmaps, evaluate resume ATS guidelines, and complete simulation interviews using WorkPilot's server-routed Gemini capabilities.
                </p>
              </div>

              {/* TWO COLUMN INTERACTION PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. MODEL CONFIGURATION OR GENERATION */}
                <div className="space-y-6">
                  
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-[14px] font-bold font-display border-b border-slate-900 pb-2">1. Career Sync profile</h3>
                    
                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">CURRENT PROFESSIONAL ROLE</label>
                        <input 
                          type="text" 
                          value={userProfile.currentRole} 
                          onChange={(e) => setUserProfile({ ...userProfile, currentRole: e.target.value })}
                          className="glass-input text-xs text-slate-100" 
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">TARGET CAREER TRANSITION</label>
                        <input 
                          type="text" 
                          value={userProfile.targetRole} 
                          onChange={(e) => setUserProfile({ ...userProfile, targetRole: e.target.value })}
                          className="glass-input text-xs text-slate-100" 
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">EXP (YEARS)</label>
                          <input 
                            type="text" 
                            value={userProfile.yearsExperience} 
                            onChange={(e) => setUserProfile({ ...userProfile, yearsExperience: e.target.value })}
                            className="glass-input text-xs text-slate-100 text-center" 
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">CORE SKILLSET SUMMARY</label>
                          <input 
                            type="text" 
                            value={userProfile.coreSkills} 
                            onChange={(e) => setUserProfile({ ...userProfile, coreSkills: e.target.value })}
                            className="glass-input text-xs text-slate-100" 
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleGenerateRoadmap}
                        disabled={roadmapLoading}
                        className="w-full mt-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-xs text-white font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5"
                      >
                        {roadmapLoading ? (
                          <>
                            <Clock className="animate-spin h-4 w-4" /> Drafting Roadmap...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 text-amber-400" /> Formulate Transition Roadmap
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ATS RESUME ANALYZER PANEL */}
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-[14px] font-bold font-display border-b border-slate-900 pb-2">2. Intelligent ATS Resume Check</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono block text-slate-400 mb-1">PASTE EXPERIENCES / RESUME CONTENT</label>
                        <textarea
                          rows={6}
                          placeholder="Paste details of jobs, roles, certifications, and current tasks..."
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          className="glass-input text-xs font-mono font-normal resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono block text-slate-400 mb-1">TARGET JOB PROFILE / TARGET COMPANY DESIRED</label>
                        <input
                          type="text"
                          placeholder="e.g. Lead Software Architect at Tier-1, or VP of Platform Services"
                          value={resumeJobTarget}
                          onChange={(e) => setResumeJobTarget(e.target.value)}
                          className="glass-input text-xs text-slate-100"
                        />
                      </div>

                      <button
                        onClick={handleAnalyzeResume}
                        disabled={resumeAnalyzing}
                        className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-violet-500/50 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        {resumeAnalyzing ? (
                          <>
                            <Clock className="animate-spin h-3.5 w-3.5" /> Modeling Index...
                          </>
                        ) : (
                          <>
                            <Award className="h-3.5 w-3.5 text-violet-500" /> Trigger ATS Audit
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>

                {/* 2. DYNAMIC GENERATION FEEDBACK (GEMINI OUTPUT) */}
                <div className="space-y-6">
                  
                  {/* ROADMAP RENDERER BAR */}
                  <div className="glass-panel p-5 space-y-4 min-h-[400px]">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-800/80">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 font-mono">Live Copilot Recommendation</h3>
                      <span className="text-[10px] bg-violet-600/20 text-violet-400 font-bold px-2 py-0.5 rounded">Dynamic Sync</span>
                    </div>

                    {!customRoadmap && !resumeResult && (
                      <div className="flex flex-col items-center justify-center h-80 text-center text-xs text-slate-500">
                        <Award className="h-12 w-12 text-slate-700 mb-2.5 animate-bounce" />
                        <p className="max-w-xs leading-relaxed font-mono">
                          Select the target criteria at the left and click "Formulate" or "Trigger ATS" to pull insights directly using the Gemini AI client models.
                        </p>
                      </div>
                    )}

                    {/* Show Custom roadmap details */}
                    {customRoadmap && (
                      <div className="space-y-5 animate-fade-in text-xs">
                        <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl leading-relaxed">
                          <p className="font-mono text-[10px] text-slate-400">TARGET DESIGNATION</p>
                          <h4 className="text-sm font-extrabold text-violet-400 mt-0.5">{customRoadmap.targetRole}</h4>
                          <p className="mt-1 font-semibold">Recommended Horizon: <span className="text-slate-100 underline">{customRoadmap.timeline}</span></p>
                        </div>

                        {/* Steps Roadmap map */}
                        <div className="space-y-3.5">
                          <h4 className="font-bold text-slate-500 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                            <Check className="h-4 w-4 text-emerald-500" /> STEPPED IMPLEMENTATION MILESTONES
                          </h4>
                          
                          {customRoadmap.steps?.map((step: any, idx: number) => (
                            <div key={idx} className="p-3 bg-slate-900 border border-slate-900 rounded-xl space-y-1.5 leading-relaxed">
                              <span className="text-[10px] font-mono text-violet-500 font-bold">PHASE {idx + 1}: {step.phase}</span>
                              
                              <div className="mt-1">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Critical Skills targeted</span>
                                <div className="flex flex-wrap gap-1.5 mt-0.5">
                                  {step.skillsRequired?.map((sk: string, i: number) => (
                                    <span key={i} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-1.5">
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Recommended Transition Steps</span>
                                <ul className="list-disc pl-3.5 text-[10.5px] mt-0.5 text-slate-400 space-y-0.5">
                                  {step.actions?.map((act: string, i: number) => <li key={i}>{act}</li>)}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Skill gap analysis highlights */}
                        {customRoadmap.skillGaps && (
                          <div className="space-y-2.5">
                            <h4 className="font-bold text-slate-500 border-b border-slate-800 pt-2 pb-1">IDENTIFIED SKILL GAPS MATRIX</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {customRoadmap.skillGaps.map((gap: any, idx: number) => (
                                <div key={idx} className="p-2.5 bg-slate-900 border border-slate-900 rounded-lg flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-semibold block text-slate-200">{gap.skill}</span>
                                    <span className="text-[9.5px] text-slate-500">Recs: {gap.recommendations?.[0] || 'Observe labs'}</span>
                                  </div>
                                  <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                                    gap.gapLevel === 'high' ? 'bg-rose-500/15 text-rose-400' : 'bg-yellow-500/15 text-yellow-500'
                                  }`}>
                                    {gap.gapLevel} GAP
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Negotiation highlights */}
                        {customRoadmap.salaryInsight && (
                          <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-1.5 leading-relaxed">
                            <span className="font-bold text-amber-500 font-display">Salary & Progression Negotiation Parameters</span>
                            <p className="font-mono text-[10.5px]">Expected Tiers range: <strong className="text-slate-100">{customRoadmap.salaryInsight.range}</strong></p>
                            <div className="text-[10px] text-slate-400 italic">
                              * {customRoadmap.salaryInsight.negotiatingTips?.[0] || 'Cite specific database migrations done'}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resume result modeling */}
                    {resumeResult && (
                      <div className="space-y-4 animate-fade-in text-xs leading-relaxed">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500">ATS RANGER MATCH</span>
                            <h4 className="text-2xl font-extrabold text-emerald-500 mt-1">{resumeResult.atsScore}% Score</h4>
                          </div>
                          <Award className="h-10 w-10 text-emerald-500" />
                        </div>

                        <div>
                          <span className="font-bold text-slate-300 block mb-1">ATS STRENGTHS</span>
                          <ul className="list-disc pl-4.5 space-y-1 text-slate-400 text-[11px]">
                            {resumeResult.strengths?.map((str: string, i: number) => <li key={i}>{str}</li>)}
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-rose-400 block mb-1">MISSING PROFILE HIGHLIGHTS</span>
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {resumeResult.missingSkills?.map((sk: string, i: number) => (
                              <span key={i} className="text-[9.5px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-mono">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <span className="font-bold text-violet-400 block mb-1">SUGGESTED STAR BULLET IMPROVEMENTS</span>
                          <div className="space-y-2 text-[10px] text-slate-400">
                            {resumeResult.suggestedBulletPoints?.map((b: string, i: number) => (
                              <p key={i} className="p-2 bg-slate-900 border border-slate-900 rounded-lg italic">
                                "{b}"
                              </p>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-violet-700/5 border border-violet-800 rounded-xl">
                          <span className="font-bold text-slate-100 block mb-1">INTERVIEW STRATEGY</span>
                          <p className="text-[10.5px] text-slate-400">{resumeResult.interviewPreparationTips?.[0]}</p>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: GOALS & KPI TRACKING OKR PANEL */}
          {currentTab === 'kpi' && (
            <div className="space-y-6">
              
              <div className="glass-panel p-6 bg-gradient-to-tr from-indigo-600/5 to-violet-600/5 border border-violet-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-indigo-400">Quarterly OKRs & boss metrics</h2>
                  <p className="text-xs text-slate-400 mt-1">Implement strategic milestones. Track values dynamically.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block">GOALS SUCCESS ESTIMATE</span>
                  <p className="text-3xl font-extrabold text-indigo-400 mt-1">{computedScores.goal}%</p>
                </div>
              </div>

              {/* CARD PROGRESS VIEWER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appState.goals.map((goal) => (
                  <div key={goal.id} className="glass-panel p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded uppercase font-bold">
                          {goal.type} goal
                        </span>
                        <h3 className="text-base font-bold font-display mt-2">{goal.title}</h3>
                        <p className="text-[11px] text-slate-500">Category: {goal.category}</p>
                      </div>
                      
                      {/* Interactive modifier buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setAppState(prev => ({
                              ...prev,
                              goals: prev.goals.map(g => {
                                if (g.id === goal.id) {
                                  const val = Math.max(0, g.currentValue - 5);
                                  return { ...g, currentValue: val };
                                }
                                return g;
                              })
                            }));
                            showAlert('Score minimized', 'info');
                          }}
                          className="px-2 py-1 text-xs bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-slate-300"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => {
                            setAppState(prev => ({
                              ...prev,
                              goals: prev.goals.map(g => {
                                if (g.id === goal.id) {
                                  const val = Math.min(g.targetValue, g.currentValue + 5);
                                  return { ...g, currentValue: val };
                                }
                                return g;
                              })
                            }));
                            showAlert('KPI valuation incremented!', 'success');
                          }}
                          className="px-2 py-1 text-xs bg-violet-600 text-white rounded hover:bg-violet-700 font-bold"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    {/* Progress Slider representation */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Milestone Status Tracker</span>
                        <span className="font-mono font-bold text-indigo-400">
                          {goal.currentValue} {goal.unit} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 border border-slate-300 dark:border-slate-800/80 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-305"
                          style={{ width: `${(goal.currentValue / goal.targetValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Boss alignment check insights */}
                    {goal.bossFeedback && (
                      <div className="p-3.5 bg-slate-100/55 dark:bg-slate-950/70 border border-slate-200/50 dark:border-slate-800 rounded-xl leading-relaxed text-xs">
                        <div className="flex items-center gap-1 font-semibold text-slate-400 mb-1">
                          <Users className="h-3.5 w-3.5 text-violet-500" />
                          <span>Supervisor Feedback Audit</span>
                        </div>
                        <p className="italic text-slate-700 dark:text-slate-300">"{goal.bossFeedback}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: MEETINGS & TASKS */}
          {currentTab === 'meetings' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* MEETINGS SIDE CHANGER */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-panel p-5 space-y-3">
                    <h3 className="text-sm font-semibold font-display border-b border-slate-900 pb-2">Active Board Meetings</h3>
                    <div className="space-y-2">
                      {appState.meetings.map(meet => (
                        <div 
                          key={meet.id}
                          onClick={() => setEditingMeetingId(meet.id)}
                          className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                            editingMeetingId === meet.id 
                              ? 'bg-violet-600 text-white border-violet-500' 
                              : 'bg-slate-900 border-slate-900 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-start font-bold">
                            <span className="text-xs text-slate-100">{meet.title}</span>
                            <span className="text-[9px] font-mono font-normal opacity-85">{meet.time}</span>
                          </div>
                          <p className="text-[10px] mt-1.5 opacity-75">Hosted: {meet.host}</p>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5 text-[9px]">
                            <span>{meet.date}</span>
                            <span>{meet.followUpGenerated ? '✓ Summary Logged' : 'Needs Sync'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MEETING TRANSCRIBER AND SUMMARY */}
                <div className="lg:col-span-2 space-y-4">
                  
                  <div className="glass-panel p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[14px] font-bold font-display">Notes & Real-time AI Transcript</h3>
                      <button
                        onClick={handleOptimizeMeeting}
                        disabled={meetingTranscribing}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 hover:shadow-lg transition-all cursor-pointer"
                      >
                        {meetingTranscribing ? 'Processing...' : <><Sparkles className="h-3.5 w-3.5" /> Optimize notes & actions</>}
                      </button>
                    </div>

                    <textarea
                      rows={6}
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      placeholder="Write raw meeting transcripts or outline discussion points here..."
                      className="glass-input text-xs font-mono font-normal resize-none"
                    ></textarea>

                    {meetingSummaryResult && (
                      <div className="space-y-4 p-4.5 bg-slate-900 border border-slate-800 rounded-xl text-xs leading-relaxed animate-fade-in">
                        <div className="border-b border-slate-900 pb-2">
                          <span className="text-[9px] font-mono text-cyan-400 tracking-wider block font-bold">AI EXECUTIVE SUMMARY</span>
                          <p className="mt-1 text-slate-200">{meetingSummaryResult.summary}</p>
                        </div>

                        {meetingSummaryResult.lastDiscussion && (
                          <div className="pb-2 border-b border-slate-900">
                            <span className="text-[9px] font-mono text-violet-400 tracking-wider block font-bold">LAST KEY ISSUE DISCUSSED</span>
                            <p className="mt-1 text-slate-300 italic">"{meetingSummaryResult.lastDiscussion}"</p>
                          </div>
                        )}

                        <div className="pb-2">
                          <span className="text-[9px] font-mono text-emerald-400 tracking-wider block font-bold">GENERATED NEXT ACTION ITEMS</span>
                          <ul className="list-disc pl-4 space-y-0.5 mt-1.5 text-slate-400">
                            {meetingSummaryResult.nextActions?.map((act: string, idx: number) => (
                              <li key={idx} className="hover:text-slate-100 transition-colors">{act}</li>
                            ))}
                          </ul>
                        </div>

                        {meetingSummaryResult.emailDraft && (
                          <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[10px]">
                            <div className="flex justify-between items-center text-slate-500 mb-1">
                              <span>TEAM FOLLOW-UP EMAIL DRAFT</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(meetingSummaryResult.emailDraft);
                                  showAlert('Draft copied!', 'success');
                                }}
                                className="text-violet-500 font-bold hover:underline"
                              >
                                Copy Email Draft
                              </button>
                            </div>
                            <pre className="whitespace-pre-wrap font-mono text-slate-300 leading-relaxed max-h-40 overflow-y-auto">
                              {meetingSummaryResult.emailDraft}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 5: SECURE DOCUMENT VAULT (E2E LOCKBOX) */}
          {currentTab === 'vault' && (
            <div className="space-y-6">
              
              <div className="glass-panel p-6 bg-gradient-to-tr from-slate-900 to-indigo-950/20 text-slate-100 border border-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold font-display flex items-center gap-1.5 text-violet-400">
                      <ShieldCheck className="h-6 w-6 text-violet-500" />
                      E2E Encrypted Document Safe
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Your offer letters, payslips, national IDs, and credentials are locally hashed and stored dynamically using WorkPilot Secure protocols.
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-800 border border-slate-700 px-3 py-1 rounded font-mono uppercase text-slate-400 font-bold">
                    AES-256 Enabled
                  </span>
                </div>
              </div>

              {/* GRID INTERFERENCE UP/DOWN DISPLAY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. UPLOAD DECRYPT COMPONENT */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-sm font-semibold font-display border-b border-slate-900 pb-2">Vault upload portal</h3>
                    
                    <form onSubmit={handleEncryptUpload} className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-mono block text-slate-400 mb-1">CHOOSE FILE</label>
                        <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 text-center hover:border-violet-500 transition-colors cursor-pointer bg-slate-200/20 dark:bg-slate-900/10">
                          <FileUp className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                          <span className="text-[10px] font-mono text-slate-400">Drag or click to choose system slips</span>
                          <input 
                            type="file" 
                            onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                            className="hidden" 
                            id="file-element-input"
                          />
                        </div>
                        {docFile && <p className="text-[10.5px] mt-1 text-emerald-400 font-mono">Selected: {docFile.name}</p>}
                      </div>

                      <div>
                        <label className="text-[10px] font-mono block text-slate-400 mb-1">CLASSIFICATION CATEGORY</label>
                        <select 
                          value={docCategory}
                          onChange={(e: any) => setDocCategory(e.target.value)}
                          className="glass-input text-xs text-slate-100"
                        >
                          <option value="letter">Promotion / Offer Letters</option>
                          <option value="salary">Tax Slips / Comp Slips</option>
                          <option value="id">Aadhaar / Passport Identification</option>
                          <option value="certificate">Education Certificates</option>
                          <option value="insurance">Insurance Plans</option>
                        </select>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2 bg-violet-600 text-white hover:bg-violet-700 text-xs font-bold rounded-lg"
                      >
                        Secure Encrypt & Upload
                      </button>
                    </form>
                  </div>
                </div>

                {/* 2. REPOSITORY GRID */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-sm font-semibold font-display pb-1 border-b border-slate-800">Local document records</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appState.documents.map((doc) => (
                        <div key={doc.id} className="p-4 bg-slate-900 border border-slate-900 hover:border-violet-500/30 rounded-xl space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <FileText className="h-7 w-7 text-violet-500" />
                              <div>
                                <h4 className="text-xs font-bold text-slate-100">{doc.name}</h4>
                                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-medium">{doc.category}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                            <span>Uploaded: {doc.uploadDate} ({doc.fileSize})</span>
                            <button
                              onClick={() => triggerDecryptDoc(doc)}
                              className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <Lock className="h-3 w-3" /> Click Open
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Decrypt authentication popup box embedded */}
                    {selectedDocToDecrypt && (
                      <div className="p-4.5 bg-slate-950 border border-violet-500/20 rounded-xl space-y-3 animate-fade-in text-xs leading-relaxed">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-violet-400 font-display">DECRYPT SECURE SYSTEM REQUEST: {selectedDocToDecrypt.name}</span>
                          <button onClick={() => setSelectedDocToDecrypt(null)} className="text-slate-500 hover:text-slate-300">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {!vaultUnlocked ? (
                          <div className="space-y-2">
                            <p className="text-[10.5px] text-slate-400">Enter secure master PIN to decrypt credentials (preset is <strong className="text-slate-100">1234</strong>):</p>
                            <div className="flex gap-2">
                              <input 
                                type="password" 
                                placeholder="Master PIN..." 
                                value={vaultPassword}
                                onChange={(e) => setVaultPassword(e.target.value)}
                                className="glass-input text-xs w-40 text-center font-mono letter-spacing-2" 
                              />
                              <button
                                onClick={verifyVaultPassword}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl"
                              >
                                Decrypt File
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-500/5 rounded-xl text-xs space-y-2">
                            <span className="text-emerald-500 font-bold font-mono">FILE DECRYPTED SUCCESSFULLY</span>
                            <p className="text-[10.5px] leading-relaxed text-slate-300">
                              AES Keys verified. Local system reference preview loaded. 
                              Ready for presentation cycles or compliance uploads.
                            </p>
                            <button
                              onClick={() => {
                                showAlert('File decrypted successfully! Ready for use.', 'success');
                                setSelectedDocToDecrypt(null);
                              }}
                              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-white text-[10px] uppercase rounded-lg"
                            >
                              Preview File
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: SALARY, TAX & DEBT MANAGER */}
          {currentTab === 'salary' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. COMP STRUCTURE DETAILS */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-sm font-semibold font-display pb-1 border-b border-slate-800">Salary structure metrics</h3>
                    
                    <div className="space-y-3.5 text-xs text-slate-400">
                      <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                        <span>Basic Base Expansion</span>
                        <strong className="text-slate-100">${appState.salary.basic}</strong>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                        <span>HRA Relief Claim</span>
                        <strong className="text-slate-100">${appState.salary.hra}</strong>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                        <span>Standard Performance Allowance</span>
                        <strong className="text-slate-100">${appState.salary.allowance}</strong>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                        <span>LTA Travel Reliefs</span>
                        <strong className="text-slate-100">${appState.salary.lta}</strong>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg">
                        <span>Accumulated Bonus History</span>
                        <strong className="text-slate-100">${appState.salary.bonus}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-sm font-semibold font-display border-b border-slate-800 pb-1">Historical increments</h3>
                    <div className="space-y-2.5">
                      {appState.increments.map((inc, i) => (
                        <div key={i} className="p-3 bg-slate-900/60 border border-slate-900 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold block text-slate-100">{inc.date}</span>
                            <span className="text-[10px] text-slate-500">Base: ${inc.oldSalary} → ${inc.newSalary}</span>
                          </div>
                          <span className="text-[10.5px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                            +{inc.percentage}% Raise
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. TAX ESTIMATOR SYSTEM */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="glass-panel p-5 space-y-4">
                    <h3 className="text-sm font-semibold font-display pb-1 border-b border-slate-800">Compliance & Income Tax Simulator</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono block text-slate-400 mb-1">ANNUAL GROSS COMPENSATION ($)</label>
                        <input
                          type="number"
                          value={simulatedGross}
                          onChange={(e) => setSimulatedGross(Number(e.target.value))}
                          className="glass-input text-xs font-semibold text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono block text-slate-400 mb-1">DEDUCTIONS DECLARATION ($)</label>
                        <input
                          type="number"
                          value={simulatedInvestments}
                          onChange={(e) => setSimulatedInvestments(Number(e.target.value))}
                          className="glass-input text-xs font-semibold text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-violet-700/5 border border-violet-800 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider block">Estimated Tax Valuation</span>
                        <h4 className="text-3xl font-extrabold text-violet-400 mt-1">${estimatedTax}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                          Based on dynamic calculations accounting for HRA Claim (${appState.salary.hra}) and basic exclusions.
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block font-bold">NET TAKE-HOME</span>
                        <p className="text-xl font-extrabold text-slate-100 mt-1">${simulatedGross - estimatedTax}</p>
                      </div>
                    </div>

                    {/* SIP and EMI investments tracker inside same block */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">SIP / FD & Assets commitments</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {appState.assets.map(as => (
                          <div key={as.id} className="p-3 bg-slate-900 border border-slate-900 rounded-xl text-xs flex justify-between items-center leading-relaxed">
                            <div>
                              <span className="font-semibold block text-slate-100">{as.name}</span>
                              <span className="text-[10.5px] text-slate-500">Value: ${as.amount}</span>
                            </div>
                            {as.monthlyCommitment && (
                              <span className="text-[10px] font-mono text-indigo-400 font-bold">
                                SIP: ${as.monthlyCommitment}/m
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: HEALTH STABILITY CALENDARS */}
          {currentTab === 'health' && (
            <div className="space-y-6">
              
              <div className="glass-panel p-5 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-start gap-4">
                  <Heart className="h-6 w-6 text-emerald-500" />
                  <div>
                    <h2 className="text-base font-bold font-display text-emerald-500">Corporate Health indicators planner</h2>
                    <p className="text-xs text-slate-700 dark:text-slate-400 mt-1">
                      Sedentary routines demand constant physiological sync. Re-verify water logs, scheduling appointments, and vision check reminders.
                    </p>
                  </div>
                </div>
              </div>

              {/* THREE GRID CHOP SCREEN */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* WATER DIAL OVERVIEW */}
                <div className="glass-panel p-5 space-y-4">
                  <h3 className="text-sm font-semibold font-display border-b border-slate-900 pb-2">1. Fluid metrics dashboard</h3>
                  <div className="text-center py-7 bg-slate-900 rounded-xl border border-slate-900 relative overflow-hidden">
                    <div className="h-28 w-28 bg-blue-500/10 rounded-full mx-auto flex flex-col justify-center items-center border border-blue-500/20">
                      <span className="text-[10px] text-slate-500">DRUNK</span>
                      <span className="text-xl font-extrabold text-blue-400">{appState.health.waterMl}ml</span>
                    </div>

                    <div className="flex justify-center gap-1.5 mt-5 px-4">
                      <button 
                        onClick={() => handleWaterDrink(250)}
                        className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] uppercase font-bold"
                      >
                        Drink Cup
                      </button>
                      <button 
                        onClick={() => {
                          setAppState(prev => ({ ...prev, health: { ...prev.health, waterMl: 0 } }));
                          showAlert('Fluid intake reset', 'info');
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-slate-400"
                      >
                        Reset Dial
                      </button>
                    </div>
                  </div>
                </div>

                {/* TRACKED DOCTOR VISITS */}
                <div className="glass-panel p-5 space-y-4 col-span-2">
                  <h3 className="text-sm font-semibold font-display pb-1 border-b border-slate-800">2. Scheduled specialist reviews</h3>
                  <div className="space-y-3">
                    {appState.health.appointments.map((ap, i) => (
                      <div key={i} className="p-4 bg-slate-900 border border-slate-900 hover:border-violet-500/30 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between items-start font-bold">
                          <span className="text-slate-100">{ap.desc}</span>
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                            ap.category === 'Eye' ? 'bg-cyan-500/15 text-cyan-400' : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {ap.category} Checkup
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px] text-slate-500 border-t border-slate-800 pt-2 font-mono">
                          <span>Target Date: {ap.date}</span>
                          <button
                            onClick={() => showAlert('Appointment reminder synced with standard OS calendars!', 'success')}
                            className="text-violet-500 font-bold hover:underline"
                          >
                            Set Push Reminder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 8: AI CREATOR SUITE (EMAILS, REFLECTIONS & MEMORY CHAT) */}
          {currentTab === 'creator' && (
            <div className="space-y-6">
              
              <div className="glass-panel p-6 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20">
                <div className="flex items-center gap-1.5 pb-1">
                  <Sparkles className="h-6 w-6 text-violet-500" />
                  <h2 className="text-lg font-bold font-display text-slate-900 dark:text-slate-100">Live AI Assistant Workspace</h2>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-400 leading-relaxed mt-0.5">
                  Compose high-impact executive level messages, analyze complete tasks to formulate automatic chronological journal logs, or carry out strategic workspace troubleshooting with memory.
                </p>
              </div>

              {/* THREE CARD TENTACLE LAYOUT (EMAILS / REFLECTIONS / CHAT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* COLUMN 1: INTERACTIVE PROFESSIONAL EMAIL DRAFTER */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="glass-panel p-5 space-y-3.5">
                    <h3 className="text-xs font-bold tracking-wider font-mono uppercase border-b border-slate-800 pb-2">1. Strategic Email Writer</h3>
                    
                    <div className="space-y-3 text-xs leading-relaxed">
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">SENDER & RECIPIENT</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={emailSender} 
                            onChange={(e) => setEmailSender(e.target.value)}
                            placeholder="Sender name" 
                            className="glass-input text-xs" 
                          />
                          <input 
                            type="text" 
                            value={emailRecipient} 
                            onChange={(e) => setEmailRecipient(e.target.value)}
                            placeholder="Recipient name" 
                            className="glass-input text-xs" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">INTENT & KEY CONTEXT</label>
                        <textarea
                          rows={3}
                          value={emailContext}
                          onChange={(e) => setEmailContext(e.target.value)}
                          className="glass-input text-xs resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">STRIKING KEY POINTS CITED</label>
                        <textarea
                          rows={3}
                          value={emailKeyPoints}
                          onChange={(e) => setEmailKeyPoints(e.target.value)}
                          className="glass-input text-xs resize-none"
                        ></textarea>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block mb-1">DESIRED CALL-TO-ACTION (CTA)</label>
                        <input 
                          type="text" 
                          value={emailCta} 
                          onChange={(e) => setEmailCta(e.target.value)}
                          className="glass-input text-xs" 
                        />
                      </div>

                      <button
                        onClick={handleGenerateEmail}
                        disabled={emailDrafting}
                        className="w-full py-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white hover:from-violet-700 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5"
                      >
                        {emailDrafting ? 'Drafting...' : <><Mail className="h-4 w-4" /> Generate Professional Template</>}
                      </button>
                    </div>

                    {emailResult && (
                      <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl space-y-2 text-xs leading-relaxed animate-fade-in mt-3">
                        <div className="flex justify-between text-slate-500 mb-1">
                          <span className="font-bold text-violet-500 font-mono">DRAFT COMPILED</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`Subject: ${emailResult.subjectLine}\n\n${emailResult.body}`);
                              showAlert('Email copied to clipboard!', 'success');
                            }}
                            className="text-violet-500 font-bold hover:underline"
                          >
                            Copy Draft
                          </button>
                        </div>
                        <p className="font-semibold text-slate-100 border-b border-slate-900 pb-1.5">Subject: {emailResult.subjectLine}</p>
                        <pre className="text-[10px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto mt-2 text-slate-300">
                          {emailResult.body}
                        </pre>
                        {emailResult.tips && (
                          <div className="text-[9.5px] text-amber-500 border-t border-slate-900 pt-2">
                            * {emailResult.tips}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* COLUMN 2: REAL-TIME CONVERSATIONAL MEMORY CHATBOX WITH LIVE BACKEND ENDPOINT */}
                <div className="lg:col-span-7 space-y-4">
                  
                  <div className="glass-panel p-5 space-y-4 min-h-[500px] flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-violet-500 animate-pulse" />
                        <div>
                          <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-400">PILOT: Strategic Workspace Advisor</h3>
                          <span className="text-[9px] text-slate-500">Dual corporate counselor & finance analyst assistant</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setAppState(prev => ({ ...prev, chatHistory: [initialWorkPilotState.chatHistory[0]] }));
                          showAlert('Conversational memory synchronized.', 'info');
                        }}
                        className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-900 rounded transition-all text-slate-500 hover:text-rose-500"
                        title="Clear history"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Chat Bubble List */}
                    <div className="flex-1 space-y-3.5 my-3.5 pr-2.5 max-h-[360px] overflow-y-auto text-xs leading-relaxed">
                      {appState.chatHistory.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-display ${
                            msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-violet-400 border border-slate-800'
                          }`}>
                            {msg.role === 'user' ? 'UA' : 'P'}
                          </div>
                          
                          <div className={`p-3 rounded-2xl ${
                            msg.role === 'user' 
                              ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white' 
                              : 'bg-slate-900 border border-slate-900 text-slate-300'
                          }`}>
                            {/* Simple text with basic markdown code formats */}
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <span className="text-[8px] opacity-60 block text-right mt-1 font-mono">{msg.timestamp}</span>
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono italic pl-11">
                          <Clock className="animate-spin h-3.5 w-3.5 text-violet-500" /> Pilot is strategizing key corporate paths...
                        </div>
                      )}
                    </div>

                    {/* Chat Input row */}
                    <div className="flex gap-2.5 pt-3.5 border-t border-slate-200/50 dark:border-slate-800/80">
                      <input
                        type="text"
                        placeholder="Ask me about HRA deductions, promotion roadmaps, or draft an email..."
                        value={chatMessageInput}
                        onChange={(e) => setChatMessageInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                        className="glass-input text-xs"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        disabled={chatLoading}
                        className="px-5 py-2.5 bg-violet-600 text-white hover:bg-violet-800 font-bold rounded-xl transition-all"
                      >
                        Send
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 9: ADMIN OPTIONS & SUBSCRIPTION PLANS */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MONETIZATION CHANGER PANEL */}
                <div className="glass-panel p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-sm font-bold font-display">WorkPilot Premium Subscription</h3>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-900 rounded-xl space-y-2.5 text-xs leading-relaxed">
                    <span className="text-[9px] font-mono bg-yellow-500/15 text-yellow-500 px-2 py-0.5 rounded font-bold uppercase">
                      {activePlan === 'free' ? 'FREE DEMO MODE' : 'PREMIUM ACTIVE'}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-100">
                      Current Level: {activePlan === 'free' ? 'Enterprise Trial' : activePlan === 'monthly' ? 'Premium Monthly' : 'AI-Pro Yearly'}
                    </h4>
                    <p className="text-[11px] text-slate-400">Your account is synced to Vijay Pawar Enterprise License logs.</p>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed pt-2">
                    <span className="font-bold text-slate-400 block">CHOOSE ALTERNATIVE PACKAGE PRESSETS</span>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPlan('monthly')}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('monthly'); }}
                      className={`p-3.5 bg-slate-900 border rounded-xl cursor-pointer flex justify-between items-center transition-colors ${selectedPlan === 'monthly' ? 'border-violet-500 ring-1 ring-violet-500/50' : 'border-slate-800 hover:border-violet-500/35'}`}
                    >
                      <div>
                        <strong className="block text-slate-100">Premium Monthly Plan</strong>
                        <span className="text-[10px] text-slate-500">Access full encrypted documents vault storage</span>
                      </div>
                      <span className="text-xs font-bold text-violet-400 font-mono">$19 / mo</span>
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedPlan('yearly')}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedPlan('yearly'); }}
                      className={`p-3.5 bg-slate-900 border rounded-xl cursor-pointer flex justify-between items-center transition-colors ${selectedPlan === 'yearly' ? 'border-violet-500 ring-1 ring-violet-500/50' : 'border-slate-800 hover:border-violet-500/35'}`}
                    >
                      <div>
                        <strong className="block text-slate-100">AI-Pro Yearly Tier</strong>
                        <span className="text-[10px] text-slate-500">Unlimited structural resume ATS scoring reviews</span>
                      </div>
                      <span className="text-xs font-bold text-violet-400 font-mono">$149 / yr</span>
                    </div>

                    <button
                      disabled={!selectedPlan}
                      onClick={() => {
                        if (!selectedPlan) {
                          showAlert('Please select a plan above first.', 'info');
                          return;
                        }
                        setActivePlan(selectedPlan);
                        showAlert(`Payment system simulation complete. License set to ${selectedPlan === 'monthly' ? 'Premium Monthly' : 'AI-Pro Yearly'}.`, 'success');
                      }}
                      className="w-full mt-2 py-2.5 bg-violet-600 text-white hover:bg-violet-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs uppercase rounded-xl tracking-wider"
                    >
                      Process License Sync
                    </button>
                  </div>
                </div>

                {/* USER PROFILE MANAGEMENT CONTROLLER */}
                <div className="glass-panel p-6 space-y-4">
                  <h3 className="text-sm font-semibold font-display border-b border-slate-800 pb-1">Platform Admin Management</h3>
                  
                  <div className="space-y-3.5 text-xs leading-relaxed text-slate-400">
                    <div>
                      <span className="font-bold text-slate-200 block mb-1">Corporate Member Profile</span>
                      <p className="text-[10px] leading-relaxed mb-3">Manually modify employee identity parameters inside the core global context.</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[9.5px] font-mono block text-slate-500">MEMBER NAME</label>
                          <input 
                            type="text" 
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                            className="glass-input text-xs" 
                          />
                        </div>
                        <div>
                          <label className="text-[9.5px] font-mono block text-slate-500">AUTHENTICATED EMAIL</label>
                          <input 
                            type="text" 
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                            className="glass-input text-xs" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <span className="font-bold text-slate-400 block">SIMULATE NEW DATA SEED</span>
                      <p className="text-[9.5px]">Force reload the standard static metrics or restore default database parameters.</p>
                      <button
                        onClick={() => {
                          setAppState(initialWorkPilotState);
                          showAlert('Workspace loaded with original templates', 'success');
                        }}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-900 rounded-lg"
                      >
                        Restore Mock Factory Presets
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* 4. MODALS: CREATE SCHEDULE TASK POPUP */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-heavy p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800 pb-3">
              <h3 className="font-display font-black text-slate-100 text-base text-violet-500">Schedule Operational Metric</h3>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">TASK / EVENT TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Audit payroll slips files"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">CATEGORY</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="glass-input"
                  >
                    <option value="work">Work Operations</option>
                    <option value="personal">Personal / Family</option>
                    <option value="learning">Professional growth</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">PRIORITY BAND</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="glass-input"
                  >
                    <option value="low">Low priority</option>
                    <option value="medium">Medium schedule</option>
                    <option value="high">Urgent Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 block mb-1">TARGET DEADLINE DATE</label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="glass-input font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold tracking-wider uppercase rounded-xl hover:shadow-lg transition-all"
              >
                Log to Terminal
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
