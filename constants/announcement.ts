export const ANNOUNCEMENT_TYPES = ['GENERAL', 'URGENT', 'EVENT'] as const;
export type AnnouncementType = typeof ANNOUNCEMENT_TYPES[number];

export const ANNOUNCEMENT_TYPE_LABELS = {
  GENERAL: 'General',
  URGENT: 'Urgent',
  EVENT: 'Event',
};

export const ANNOUNCEMENT_TYPE_COLOURS = {
  GENERAL: { bg: '#E3F2FD', text: '#1565C0' },
  URGENT: { bg: '#FFEBEE', text: '#C62828' },
  EVENT: { bg: '#E8F5E9', text: '#2E7D32' },
};

export const MAX_ANNOUNCEMENT_BODY_LENGTH = 5000;
export const MAX_ANNOUNCEMENT_TITLE_LENGTH = 150;
