/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  dueDate: string;
  category: 'work' | 'personal' | 'learning';
  isRecurring?: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly';
}

export interface Meeting {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  lastDiscussion?: string;
  nextActions: string[];
  summary?: string;
  followUpGenerated?: boolean;
  recordingUploaded?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'quarterly' | 'annual';
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  bossFeedback?: string;
}

export interface DocumentRecord {
  id: string;
  name: string;
  category: 'letter' | 'salary' | 'id' | 'certificate' | 'insurance' | 'finance';
  uploadDate: string;
  isEncrypted: boolean;
  fileSize: string;
  previewUrl?: string;
}

export interface SalaryRecord {
  basic: number;
  hra: number;
  allowance: number;
  lta: number;
  bonus: number;
  pfEmployer: number;
  pfEmployee: number;
  taxableIncome?: number;
  calculatedTax?: number;
}

export interface IncrementHistory {
  date: string;
  oldSalary: number;
  newSalary: number;
  percentage: number;
}

export interface AssetRecord {
  id: string;
  name: string;
  category: 'SIP' | 'Mutual Fund' | 'FD' | 'Insurance' | 'Credit Card' | 'Loan' | 'EMI';
  amount: number;
  monthlyCommitment?: number;
  dueDate?: string;
  interestRate?: number;
}

export interface LeaveRequest {
  id: string;
  type: 'Casual' | 'Sick' | 'Earned' | 'Maternity' | 'Paternity';
  startDate: string;
  endDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
}

export interface LeaveBalance {
  Casual: number;
  Sick: number;
  Earned: number;
}

export interface HealthLog {
  waterMl: number; // target e.g. 2500ml, log current ml
  waterGoalMs: number;
  stepsCount: number;
  stepsGoal: number;
  sleepHours: number;
  meds: { name: string; time: string; taken: boolean }[];
  appointments: { desc: string; date: string; category: 'Eye' | 'Dental' | 'General' }[];
}

export interface FamilyEvent {
  id: string;
  name: string;
  relationship?: string;
  date: string;
  category: 'Birthday' | 'Anniversary' | 'Bill' | 'LIC' | 'Other';
  amountDue?: number;
  isPaid?: boolean;
}

export interface CareerRoadmap {
  role: string;
  timeline: string;
  targetRole: string;
  steps: {
    phase: string;
    skillsRequired: string[];
    actions: string[];
    resources: string[];
  }[];
  skillGaps: { skill: string; gapLevel: 'low' | 'medium' | 'high'; recommendations: string[] }[];
  salaryInsight: { range: string; negotiatingTips: string[] };
}

export interface JournalLog {
  id: string;
  date: string;
  tasksCompleted: string[];
  journalText: string;
  mood: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'meeting' | 'tax' | 'goal' | 'health' | 'family' | 'finance' | 'system';
  isRead: boolean;
}

export interface WorkPilotState {
  tasks: Task[];
  meetings: Meeting[];
  goals: Goal[];
  documents: DocumentRecord[];
  salary: SalaryRecord;
  increments: IncrementHistory[];
  assets: AssetRecord[];
  leaves: LeaveRequest[];
  leaveBalance: LeaveBalance;
  health: HealthLog;
  familyEvents: FamilyEvent[];
  journalLogs: JournalLog[];
  chatHistory: ChatMessage[];
  notifications: Notification[];
}
