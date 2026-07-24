/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkPilotState } from './types';

export const initialWorkPilotState: WorkPilotState = {
  tasks: [
    {
      id: 'task-1',
      title: 'Analyze Q3 Marketing Budget',
      description: 'Review expenses against KPI projections for the executive presentation.',
      priority: 'high',
      status: 'pending',
      dueDate: '2026-06-19',
      category: 'work'
    },
    {
      id: 'task-2',
      title: 'Complete skill analysis on AWS Architecture',
      description: 'WorkPilot skill gap tracker suggests practicing serverless architectures.',
      priority: 'medium',
      status: 'completed',
      dueDate: '2026-06-17',
      category: 'learning'
    },
    {
      id: 'task-3',
      title: 'Submit HRA landlord receipt forms',
      description: 'Upload landlord signature to tax portal to claim maximum savings.',
      priority: 'high',
      status: 'pending',
      dueDate: '2026-06-25',
      category: 'personal',
      isRecurring: true,
      recurrence: 'monthly'
    },
    {
      id: 'task-4',
      title: 'Review candidate resumes for Engineering Manager position',
      description: 'Filter based on system ATS architecture templates.',
      priority: 'medium',
      status: 'pending',
      dueDate: '2026-06-20',
      category: 'work'
    }
  ],
  meetings: [
    {
      id: 'meet-1',
      title: 'Q3 Board Review & Compensation Sync',
      host: 'Sarah Lin (VP HR)',
      date: '2026-06-18',
      time: '14:30',
      duration: '45 min',
      notes: 'Reviewed current department performance score sheets. Outlined plans to initiate the promotion cycle for junior and mid-level leads early next quarter. Discussed remote allowances and bonuses.',
      lastDiscussion: 'Discussed target milestones and basic base expansion tiers.',
      nextActions: [
        'Sponsor AWS certification vouchers for eligible engineers.',
        'File Q2 tax rebate structures by end of the week.'
      ],
      summary: 'VP of HR and Directors reviewed quarterly performance parameters. Major decisions made on remote team allowances and setting up standardized skill evaluation rubrics.',
      followUpGenerated: true,
      recordingUploaded: true
    },
    {
      id: 'meet-2',
      title: 'Technical Roadmapping & Tech Debt Strategy',
      host: 'Alex Mercer (Chief Architect)',
      date: '2026-06-19',
      time: '11:00',
      duration: '60 min',
      notes: 'Identify bottlenecks in database operations. Switch telemetry log outputs to standard formatting.',
      nextActions: [
        'Draft PostgreSQL migration script and test connection pools in preview container.',
        'Finalize API contracts for WorkPilot client components.'
      ],
      followUpGenerated: false
    }
  ],
  goals: [
    {
      id: 'goal-1',
      title: 'Obtain AWS Professional Architect Certification',
      type: 'annual',
      category: 'Professional growth',
      targetValue: 100,
      currentValue: 70,
      unit: '% preparation',
      targetDate: '2026-12-15',
      bossFeedback: 'Great progress. Certifying will validate leadership over cloud deployments.'
    },
    {
      id: 'goal-2',
      title: 'Drive Department Code Quality Score to 95%',
      type: 'quarterly',
      category: 'KPIs',
      targetValue: 95,
      currentValue: 88,
      unit: '% score',
      targetDate: '2026-06-30',
      bossFeedback: 'Excellent initiative. PR reviews are noticeably more diligent.'
    }
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'WorkPilot_Agreement_Letter.pdf',
      category: 'letter',
      uploadDate: '2026-01-10',
      isEncrypted: true,
      fileSize: '1.2 MB'
    },
    {
      id: 'doc-2',
      name: 'Salary_slip_May_2026.pdf',
      category: 'salary',
      uploadDate: '2026-06-01',
      isEncrypted: true,
      fileSize: '412 KB'
    },
    {
      id: 'doc-3',
      name: 'National_Identity_Passport.pdf',
      category: 'id',
      uploadDate: '2026-02-15',
      isEncrypted: true,
      fileSize: '2.4 MB'
    }
  ],
  salary: {
    basic: 85000,
    hra: 34000,
    allowance: 12000,
    lta: 5000,
    bonus: 10000,
    pfEmployer: 10200,
    pfEmployee: 10200,
    taxableIncome: 1400000,
    calculatedTax: 125000,
  },
  increments: [
    { date: '2025-04-01', oldSalary: 74000, newSalary: 85000, percentage: 14.8 },
    { date: '2024-04-01', oldSalary: 65000, newSalary: 74000, percentage: 13.8 }
  ],
  assets: [
    { id: 'asset-1', name: 'Groww Index Nifty 50 Fund', category: 'Mutual Fund', amount: 450000, monthlyCommitment: 15000 },
    { id: 'asset-2', name: 'Federal Bank Tax Saver FD', category: 'FD', amount: 150000 },
    { id: 'asset-3', name: 'HDFC Home Loan (EMI Tier)', category: 'Loan', amount: 2800000, monthlyCommitment: 24500, dueDate: '05th each month' }
  ],
  leaves: [
    { id: 'leave-1', type: 'Casual', startDate: '2026-07-02', endDate: '2026-07-04', status: 'Approved', reason: 'Family engagement weekend trip' },
    { id: 'leave-2', type: 'Sick', startDate: '2026-05-12', endDate: '2026-05-13', status: 'Approved', reason: 'Seasonal flu rest' }
  ],
  leaveBalance: {
    Casual: 8,
    Sick: 6,
    Earned: 15
  },
  health: {
    waterMl: 1250,
    waterGoalMs: 2500,
    stepsCount: 6420,
    stepsGoal: 10000,
    sleepHours: 7.2,
    meds: [
      { name: 'Omega-3 Capsule', time: '09:00', taken: true },
      { name: 'Calcium chewable', time: '21:00', taken: false }
    ],
    appointments: [
      { desc: 'Annual Eye Checkup & Vision Correction', date: '2026-06-24', category: 'Eye' },
      { desc: 'Dental scaling & Polishing', date: '2026-08-11', category: 'Dental' }
    ]
  },
  familyEvents: [
    { id: 'event-1', name: 'Aunt Eleanor Birthday', relationship: 'Aunt', date: '2026-06-25', category: 'Birthday' },
    { id: 'event-2', name: 'LIC Premium Renewal Payment', date: '2026-07-01', category: 'LIC', amountDue: 18500, isPaid: false },
    { id: 'event-3', name: 'Electricity Utility Bill Grid', date: '2026-06-22', category: 'Bill', amountDue: 4200, isPaid: true }
  ],
  journalLogs: [
    {
      id: 'journal-1',
      date: '2026-06-17',
      tasksCompleted: ['Complete skill analysis on AWS Architecture', 'Update system layout presets'],
      journalText: 'Successfully completed cloud architecture review. Found major avenues to enhance scaling patterns. Felt highly productive and aligned with annual certificiation objectives.',
      mood: 'Productive'
    }
  ],
  chatHistory: [
    {
      id: 'chat-init',
      role: 'assistant',
      content: 'Hello! I am Pilot, your WorkPilot AI corporate strategic companion. How can I facilitate your work-life today? You can ask me about tax planning, career roadmap transitions, drafting professional emails, corporate coaching insights, or tracking your health metric calendars!',
      timestamp: '2026-06-18 09:00AM'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: 'Tax Season Checklist Alert',
      message: 'ITR Filing deadline approaches! Re-evaluate HRA rent relief receipts inside the Tax module to avoid penalties.',
      date: '2026-06-18',
      type: 'tax',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Upcoming Meeting Prep',
      message: 'Your Review meeting with VP HR is today at 14:30. Ensure compensation notes are finalized.',
      date: '2026-06-18',
      type: 'meeting',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'Goal Progression Warning',
      message: 'AWS Roadmap requires 3 target skill upgrades before next quarterly reviews. Start AWS Architect labs.',
      date: '2026-06-15',
      type: 'goal',
      isRead: true
    }
  ]
};
