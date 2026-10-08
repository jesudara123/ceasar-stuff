export type UserRole = 'lecturer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  matricNumber?: string; // For students, e.g. CSC/2023/0481
  department: string;
  avatar?: string;
  title?: string; // e.g. "Associate Professor", "Senior Lecturer"
  office?: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
  maxPoints: number;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Course {
  id: string;
  code: string; // e.g. CSC 301
  name: string; // e.g. Data Structures & Algorithms
  department: string;
  level: string; // e.g. 300 Level
  semester: string; // e.g. First Semester
  session: string; // e.g. 2026/2027
  description: string;
  color: string; // hex or tailwind class
  lecturerId: string;
  enrolledStudentIds: string[];
  createdAt: string;
}

export type AssignmentStatus = 'draft' | 'published' | 'closed';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  totalMarks: number;
  allowedFileTypes: string[]; // e.g. ['.pdf', '.docx', '.zip']
  maxFileSizeMB: number;
  lateSubmissionPolicy: 'allowed_penalty' | 'allowed_no_penalty' | 'disallowed';
  latePenaltyPercentPerDay?: number;
  allowResubmission: boolean;
  anonymousGrading: boolean;
  autoReleaseGrades: boolean;
  status: AssignmentStatus;
  rubrics: RubricCriterion[];
  attachments: AssignmentAttachment[];
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  previewUrl?: string;
  mockContent?: string;
}

export type SubmissionStatus = 'submitted' | 'late' | 'graded' | 'returned';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  submittedAt: string; // ISO string
  status: SubmissionStatus;
  files: UploadedFile[];
  studentNote?: string;
  attemptNumber: number;
  score?: number;
  maxScore?: number;
  rubricScores?: Record<string, number>;
  privateNotes?: string;
  studentFeedback?: string;
  gradedAt?: string;
  returnedAt?: string;
  isReturned?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  courseId: string; // 'all' or courseId
  authorId: string;
  authorName: string;
  authorRole: string;
  publishDate: string;
  isUrgent?: boolean;
  readByUserIds: string[];
}

export interface NotificationItem {
  id: string;
  userId: string; // target user ID or 'all'
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'announcement' | 'submission';
  linkTab?: string;
  linkId?: string;
  read: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  courseId?: string;
  courseCode?: string;
  type: 'assignment_deadline' | 'lecture' | 'exam' | 'office_hours' | 'other';
  description?: string;
}

export type LecturerTab = 
  | 'dashboard' 
  | 'courses' 
  | 'course_detail'
  | 'assignments' 
  | 'create_assignment'
  | 'submissions' 
  | 'grading'
  | 'students' 
  | 'student_detail'
  | 'grades' 
  | 'announcements' 
  | 'calendar' 
  | 'analytics' 
  | 'settings';

export type StudentTab = 
  | 'dashboard' 
  | 'courses' 
  | 'course_detail'
  | 'assignments' 
  | 'assignment_detail' 
  | 'grades' 
  | 'calendar' 
  | 'announcements';
