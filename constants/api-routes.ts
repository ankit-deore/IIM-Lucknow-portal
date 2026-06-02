export const API = {
  // Auth
  AUTH:                    '/api/auth',
  USER_COMPLETE_PROFILE:   '/api/user/complete-profile',
  USER_ME:                 '/api/user/me',

  // Announcements
  ANNOUNCEMENTS:           '/api/announcements',
  ANNOUNCEMENT_READ:       (id: string) => `/api/announcements/${id}/read`,

  // Timetable
  TIMETABLE:               '/api/timetable',
  TIMETABLE_EXPORT:        '/api/timetable/export',

  // Resources
  RESOURCES:               '/api/resources',
  RESOURCE_CATEGORIES:     '/api/resources/categories',

  // Mock Interviews
  INTERVIEWS:              '/api/interviews',
  INTERVIEW_FEEDBACK:      (id: string) => `/api/interviews/${id}/feedback`,

  // Directory
  DIRECTORY:               '/api/directory',
  DIRECTORY_STUDENT:       (id: string) => `/api/directory/${id}`,

  // Admin
  ADMIN_STUDENTS:          '/api/admin/students',
  ADMIN_STUDENT:           (id: string) => `/api/admin/students/${id}`,
  ADMIN_ANNOUNCEMENTS:     '/api/admin/announcements',
  ADMIN_ANNOUNCEMENT:      (id: string) => `/api/admin/announcements/${id}`,
  ADMIN_TIMETABLE:         '/api/admin/timetable',
  ADMIN_RESOURCES:         '/api/admin/resources',
  ADMIN_AUDIT_LOG:         '/api/admin/audit-log',
} as const;
