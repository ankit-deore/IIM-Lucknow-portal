export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'STUDENT' | 'ADMIN';
  status: 'DORMANT' | 'ACTIVE' | 'DEACTIVATED';
  profile: {
    programme: string | null;
    batch: string | null;
    dob: Date | null;
    currentRole: string | null;
    company: string | null;
    industry: string | null;
    workExperience: string | null;
    academicBackground: string | null;
    photoUrl: string | null;
    profileComplete: boolean;
    showInterviewStats: boolean;
  } | null;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  type: 'GENERAL' | 'URGENT' | 'EVENT';
  targetProgrammes: string[];
  isPinned: boolean;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
  author: {
    name: string | null;
    email: string;
  };
}

export interface TimetableItem {
  id: string;
  subject: string;
  faculty: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  venue: string | null;
  sessionType: 'LECTURE' | 'WORKSHOP' | 'GUEST_TALK' | 'EXAM' | 'OTHER';
  notes: string | null;
  resourceId: string | null;
}

export interface ResourceItem {
  id: string;
  title: string;
  driveUrl: string;
  typeTag: 'PDF' | 'FOLDER' | 'SPREADSHEET' | 'VIDEO' | 'LINK';
  effectiveFrom: Date | null;
}

export interface ResourceCategoryWithItems {
  id: string;
  name: string;
  description: string | null;
  resources: ResourceItem[];
}

export interface InterviewSession {
  id: string;
  requesterId: string;
  partnerId: string;
  sessionFormat: 'QUICK_PREP' | 'FULL_MOCK';
  proposedSlots: any;
  confirmedSlot: Date | null;
  status: 'REQUESTED' | 'CONFIRMED' | 'AWAITING_FEEDBACK' | 'COMPLETED' | 'CANCELLED' | 'DECLINED' | 'EXPIRED';
  requesterNote: string | null;
  requester?: { id: string; name: string | null; email: string };
  partner?: { id: string; name: string | null; email: string };
}

export interface InterviewFeedback {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  whatWentWell: string | null;
  improvements: string | null;
  wouldRepeat: boolean;
  submittedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}
