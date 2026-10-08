import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  Course,
  Assignment,
  Submission,
  Announcement,
  NotificationItem,
  CalendarEvent,
  LecturerTab,
  StudentTab,
  UserRole
} from '../types';
import { StorageService } from '../services/storage';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  students: User[];
  lecturers: User[];
  switchUser: (userId: string) => void;
  loginUser: (email: string, role: UserRole) => boolean;
  registerUser: (newUser: Partial<User>) => User;

  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;
  selectedSubmissionId: string | null;
  setSelectedSubmissionId: (id: string | null) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;

  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'lecturerId'>) => Course;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  enrollStudentInCourse: (courseId: string, studentId: string) => void;
  unenrollStudentFromCourse: (courseId: string, studentId: string) => void;

  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => Assignment;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  duplicateAssignment: (id: string) => Assignment;
  toggleAssignmentStatus: (id: string) => void;

  submissions: Submission[];
  submitAssignment: (assignmentId: string, files: any[], note?: string) => Submission;
  gradeSubmission: (
    submissionId: string,
    score: number,
    rubricScores: Record<string, number>,
    privateNotes: string,
    studentFeedback: string,
    returnToStudent: boolean
  ) => void;

  studentsList: User[];
  addStudent: (student: Omit<User, 'id' | 'role'>, courseIds?: string[]) => User;
  removeStudent: (id: string) => void;

  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'authorId' | 'authorName' | 'authorRole' | 'publishDate' | 'readByUserIds'>) => Announcement;
  deleteAnnouncement: (id: string) => void;
  markAnnouncementRead: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  deleteCalendarEvent: (id: string) => void;

  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => StorageService.getCurrentUserId());
  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [assignments, setAssignments] = useState<Assignment[]>(() => StorageService.getAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(() => StorageService.getSubmissions());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => StorageService.getCalendarEvents());

  // Navigation state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Search and Toasts
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Current user derived
  const currentUser = useMemo(() => {
    const found = users.find(u => u.id === currentUserId);
    if (found) return found;
    return users[0] || {
      id: 'default',
      name: 'Default User',
      email: 'user@faculty.edu',
      role: 'lecturer',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  }, [users, currentUserId]);

  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);
  const lecturers = useMemo(() => users.filter(u => u.role === 'lecturer'), [users]);

  // Sync to storage on change
  useEffect(() => { StorageService.saveUsers(users); }, [users]);
  useEffect(() => { StorageService.saveCourses(courses); }, [courses]);
  useEffect(() => { StorageService.saveAssignments(assignments); }, [assignments]);
  useEffect(() => { StorageService.saveSubmissions(submissions); }, [submissions]);
  useEffect(() => { StorageService.saveAnnouncements(announcements); }, [announcements]);
  useEffect(() => { StorageService.saveNotifications(notifications); }, [notifications]);
  useEffect(() => { StorageService.saveCalendarEvents(calendarEvents); }, [calendarEvents]);
  useEffect(() => { StorageService.saveCurrentUserId(currentUserId); }, [currentUserId]);

  // Keyboard shortcut for Cmd/Ctrl + K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      setCurrentTab('dashboard');
      setSelectedCourseId(null);
      setSelectedAssignmentId(null);
      setSelectedSubmissionId(null);
      setSelectedStudentId(null);
      addToast('info', 'Switched User Profile', `Now interacting as ${target.name} (${target.role.toUpperCase()})`);
    }
  };

  const loginUser = (email: string, role: UserRole): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (found) {
      setCurrentUserId(found.id);
      setCurrentTab('dashboard');
      addToast('success', 'Welcome Back', `Logged in as ${found.name}`);
      return true;
    }
    // If not found, create a demo user with that email
    const id = 'user_' + Date.now();
    const newUser: User = {
      id,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      email,
      role,
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      matricNumber: role === 'student' ? `CSC/2024/${Math.floor(1000 + Math.random() * 9000)}` : undefined
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(id);
    setCurrentTab('dashboard');
    addToast('success', 'Account Created & Logged In', `Welcome, ${newUser.name}`);
    return true;
  };

  const registerUser = (newUserPartial: Partial<User>): User => {
    const id = 'user_' + Date.now();
    const created: User = {
      id,
      name: newUserPartial.name || 'New User',
      email: newUserPartial.email || `user${Date.now()}@faculty.edu`,
      role: newUserPartial.role || 'student',
      department: newUserPartial.department || 'Computer Science',
      matricNumber: newUserPartial.role === 'student' ? (newUserPartial.matricNumber || `CSC/2024/0${Math.floor(100 + Math.random() * 900)}`) : undefined,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      title: newUserPartial.title,
      office: newUserPartial.office
    };
    // Prepend so new user is immediately at the top of directory and switchers
    setUsers(prev => [created, ...prev]);

    // If registering as student, auto-enroll into all courses so they have coursework right away!
    if (created.role === 'student') {
      setCourses(prev => prev.map(c => ({
        ...c,
        enrolledStudentIds: [created.id, ...c.enrolledStudentIds]
      })));
    }

    setCurrentUserId(created.id);
    setCurrentTab('dashboard');
    addToast('success', 'Registered Successfully', `Welcome, ${created.name}! Enrolled in courses and visible in Student Directory.`);
    return created;
  };

  // Course actions
  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'lecturerId'>): Course => {
    const id = 'course_' + courseData.code.toLowerCase().replace(/\s+/g, '') + '_' + Date.now().toString(36);
    const newCourse: Course = {
      ...courseData,
      id,
      lecturerId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setCourses(prev => [newCourse, ...prev]);
    addToast('success', 'Course Created', `${newCourse.code} - ${newCourse.name} has been created.`);
    return newCourse;
  };

  const updateCourse = (updated: Course) => {
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
    addToast('success', 'Course Updated', `${updated.code} has been updated.`);
  };

  const deleteCourse = (id: string) => {
    const course = courses.find(c => c.id === id);
    setCourses(prev => prev.filter(c => c.id !== id));
    // Also remove associated assignments
    setAssignments(prev => prev.filter(a => a.courseId !== id));
    setSubmissions(prev => prev.filter(s => s.courseId !== id));
    addToast('info', 'Course Deleted', `${course?.code || 'Course'} and its assignments have been removed.`);
    if (selectedCourseId === id) {
      setSelectedCourseId(null);
      setCurrentTab('courses');
    }
  };

  const enrollStudentInCourse = (courseId: string, studentId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId && !c.enrolledStudentIds.includes(studentId)) {
        return { ...c, enrolledStudentIds: [...c.enrolledStudentIds, studentId] };
      }
      return c;
    }));
    addToast('success', 'Student Enrolled', 'Student was successfully enrolled in the course.');
  };

  const unenrollStudentFromCourse = (courseId: string, studentId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, enrolledStudentIds: c.enrolledStudentIds.filter(id => id !== studentId) };
      }
      return c;
    }));
    addToast('info', 'Student Removed', 'Student was unenrolled from this course.');
  };

  // Assignment actions
  const addAssignment = (data: Omit<Assignment, 'id' | 'createdAt'>): Assignment => {
    const id = 'asg_' + Date.now();
    const created: Assignment = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };
    setAssignments(prev => [created, ...prev]);

    // Add calendar event automatically for assignment due date
    const course = courses.find(c => c.id === data.courseId);
    const newEvent: CalendarEvent = {
      id: 'ev_' + Date.now(),
      title: `${course?.code || 'Course'}: ${data.title}`,
      date: data.dueDate,
      time: data.dueTime,
      courseId: data.courseId,
      courseCode: course?.code,
      type: 'assignment_deadline',
      description: data.description
    };
    setCalendarEvents(prev => [...prev, newEvent]);

    // Send notifications to enrolled students if published
    if (data.status === 'published' && course) {
      const studentNotifs: NotificationItem[] = course.enrolledStudentIds.map(stId => ({
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        userId: stId,
        title: `New Assignment in ${course.code}`,
        message: `"${data.title}" has been published. Due on ${data.dueDate} at ${data.dueTime}.`,
        type: 'assignment',
        linkTab: 'assignment_detail',
        linkId: id,
        read: false,
        createdAt: new Date().toISOString()
      }));
      setNotifications(prev => [...studentNotifs, ...prev]);
    }

    addToast('success', 'Assignment Published', `"${created.title}" is now available to students.`);
    return created;
  };

  const updateAssignment = (updated: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
    addToast('success', 'Assignment Saved', `"${updated.title}" has been updated.`);
  };

  const deleteAssignment = (id: string) => {
    const asg = assignments.find(a => a.id === id);
    setAssignments(prev => prev.filter(a => a.id !== id));
    setSubmissions(prev => prev.filter(s => s.assignmentId !== id));
    addToast('info', 'Assignment Deleted', `"${asg?.title || 'Assignment'}" was removed.`);
    if (selectedAssignmentId === id) {
      setSelectedAssignmentId(null);
      setCurrentTab('assignments');
    }
  };

  const duplicateAssignment = (id: string): Assignment => {
    const original = assignments.find(a => a.id === id);
    if (!original) throw new Error('Assignment not found');
    const copy: Assignment = {
      ...original,
      id: 'asg_' + Date.now(),
      title: `${original.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    setAssignments(prev => [copy, ...prev]);
    addToast('success', 'Assignment Duplicated', `Created draft copy of "${original.title}".`);
    return copy;
  };

  const toggleAssignmentStatus = (id: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'published' ? 'closed' : 'published';
        addToast('info', 'Status Updated', `Assignment is now ${nextStatus.toUpperCase()}`);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Submission actions
  const submitAssignment = (assignmentId: string, uploadedFiles: any[], note?: string): Submission => {
    const asg = assignments.find(a => a.id === assignmentId);
    if (!asg) throw new Error('Assignment not found');

    const now = new Date();
    const dueDateTime = new Date(`${asg.dueDate}T${asg.dueTime || '23:59'}:00`);
    const isLate = now > dueDateTime;

    const existingSub = submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
    const attempt = existingSub ? existingSub.attemptNumber + 1 : 1;

    const newSub: Submission = {
      id: existingSub ? existingSub.id : 'sub_' + Date.now(),
      assignmentId,
      studentId: currentUser.id,
      courseId: asg.courseId,
      submittedAt: now.toISOString(),
      status: isLate ? 'late' : 'submitted',
      files: uploadedFiles,
      studentNote: note,
      attemptNumber: attempt,
    };

    setSubmissions(prev => {
      const filtered = prev.filter(s => !(s.assignmentId === assignmentId && s.studentId === currentUser.id));
      return [newSub, ...filtered];
    });

    // Notify Lecturer
    const lecturer = lecturers[0];
    if (lecturer) {
      const course = courses.find(c => c.id === asg.courseId);
      const newNotif: NotificationItem = {
        id: 'notif_' + Date.now(),
        userId: lecturer.id,
        title: `Submission from ${currentUser.name}`,
        message: `${currentUser.name} submitted "${asg.title}" for ${course?.code || 'course'}${isLate ? ' (LATE)' : ''}.`,
        type: 'submission',
        linkTab: 'submissions',
        linkId: newSub.id,
        read: false,
        createdAt: now.toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    addToast('success', 'Submission Successful', `Your work for "${asg.title}" has been received!`);
    return newSub;
  };

  const gradeSubmission = (
    submissionId: string,
    score: number,
    rubricScores: Record<string, number>,
    privateNotes: string,
    studentFeedback: string,
    returnToStudent: boolean
  ) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const now = new Date().toISOString();
    const updatedSub: Submission = {
      ...sub,
      score,
      rubricScores,
      privateNotes,
      studentFeedback,
      status: returnToStudent ? 'returned' : 'graded',
      isReturned: returnToStudent,
      gradedAt: now,
      returnedAt: returnToStudent ? now : sub.returnedAt
    };

    setSubmissions(prev => prev.map(s => s.id === submissionId ? updatedSub : s));

    // If returned to student, send notification
    if (returnToStudent) {
      const asg = assignments.find(a => a.id === sub.assignmentId);
      const notif: NotificationItem = {
        id: 'notif_' + Date.now(),
        userId: sub.studentId,
        title: `Assignment Graded: ${asg?.title || 'Assignment'}`,
        message: `Your score is ${score}/${asg?.totalMarks || 100}. View lecturer feedback and rubric marks.`,
        type: 'grade',
        linkTab: 'grades',
        linkId: sub.id,
        read: false,
        createdAt: now
      };
      setNotifications(prev => [notif, ...prev]);
      addToast('success', 'Grade Returned', `Grade (${score}) and feedback have been published to the student.`);
    } else {
      addToast('success', 'Grade Saved', `Draft score of ${score} saved. Remember to Return to Student when ready.`);
    }
  };

  // Student management
  const addStudent = (studentData: Omit<User, 'id' | 'role'>, courseIds?: string[]): User => {
    const newStudent: User = {
      ...studentData,
      id: 'user_student_' + Date.now(),
      role: 'student',
      avatar: studentData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      matricNumber: studentData.matricNumber || `CSC/2024/${Math.floor(1000 + Math.random() * 9000)}`
    };

    // Prepend so new student is at the top of all directories and rosters
    setUsers(prev => [newStudent, ...prev]);

    // Enroll into selected courses
    const targetCourseIds = courseIds && courseIds.length > 0 ? courseIds : courses.map(c => c.id);
    setCourses(prev => prev.map(c => {
      if (targetCourseIds.includes(c.id) && !c.enrolledStudentIds.includes(newStudent.id)) {
        return { ...c, enrolledStudentIds: [newStudent.id, ...c.enrolledStudentIds] };
      }
      return c;
    }));

    addToast('success', 'Student Registered & Enrolled', `${newStudent.name} (${newStudent.matricNumber}) is now active in Student Directory.`);
    return newStudent;
  };

  const removeStudent = (id: string) => {
    const st = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    // Remove from courses enrolled
    setCourses(prev => prev.map(c => ({
      ...c,
      enrolledStudentIds: c.enrolledStudentIds.filter(sid => sid !== id)
    })));
    addToast('info', 'Student Removed', `${st?.name || 'Student'} was removed.`);
  };

  // Announcements
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'authorId' | 'authorName' | 'authorRole' | 'publishDate' | 'readByUserIds'>): Announcement => {
    const id = 'ann_' + Date.now();
    const newAnn: Announcement = {
      ...data,
      id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.title || 'Course Lecturer',
      publishDate: new Date().toISOString(),
      readByUserIds: [currentUser.id]
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    // Send notifications to students
    const targetStudents = data.courseId === 'all'
      ? students
      : students.filter(s => {
          const c = courses.find(crs => crs.id === data.courseId);
          return c?.enrolledStudentIds.includes(s.id);
        });

    const notifs: NotificationItem[] = targetStudents.map(s => ({
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      userId: s.id,
      title: `Announcement: ${data.title}`,
      message: `${currentUser.name} posted a new announcement: "${data.title}"`,
      type: 'announcement',
      linkTab: 'announcements',
      linkId: id,
      read: false,
      createdAt: new Date().toISOString()
    }));

    setNotifications(prev => [...notifs, ...prev]);
    addToast('success', 'Announcement Published', `"${data.title}" broadcasted to ${data.courseId === 'all' ? 'all courses' : 'course students'}.`);
    return newAnn;
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addToast('info', 'Announcement Removed', 'The announcement was deleted.');
  };

  const markAnnouncementRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id && !a.readByUserIds.includes(currentUser.id)) {
        return { ...a, readByUserIds: [...a.readByUserIds, currentUser.id] };
      }
      return a;
    }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
    addToast('info', 'All Caught Up', 'All notifications marked as read.');
  };

  const userNotifications = notifications.filter(n => n.userId === currentUser.id || n.userId === 'all');
  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Calendar
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'ev_' + Date.now()
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    addToast('success', 'Event Added', `Added "${newEvent.title}" to calendar.`);
    return newEvent;
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    addToast('info', 'Event Removed', 'Calendar event removed.');
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    StorageService.resetAll();
    setUsers(StorageService.getUsers());
    setCourses(StorageService.getCourses());
    setAssignments(StorageService.getAssignments());
    setSubmissions(StorageService.getSubmissions());
    setAnnouncements(StorageService.getAnnouncements());
    setNotifications(StorageService.getNotifications());
    setCalendarEvents(StorageService.getCalendarEvents());
    setCurrentUserId('user_lecturer_1');
    setCurrentTab('dashboard');
    setSelectedCourseId(null);
    setSelectedAssignmentId(null);
    setSelectedSubmissionId(null);
    setSelectedStudentId(null);
    addToast('info', 'Demo Data Reset', 'Restored pristine sample courses, students, and submissions.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        students,
        lecturers,
        switchUser,
        loginUser,
        registerUser,

        currentTab,
        setCurrentTab,
        selectedCourseId,
        setSelectedCourseId,
        selectedAssignmentId,
        setSelectedAssignmentId,
        selectedSubmissionId,
        setSelectedSubmissionId,
        selectedStudentId,
        setSelectedStudentId,

        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        enrollStudentInCourse,
        unenrollStudentFromCourse,

        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        duplicateAssignment,
        toggleAssignmentStatus,

        submissions,
        submitAssignment,
        gradeSubmission,

        studentsList: students,
        addStudent,
        removeStudent,

        announcements,
        addAnnouncement,
        deleteAnnouncement,
        markAnnouncementRead,

        notifications: userNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,

        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,

        toasts,
        addToast,
        removeToast,

        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,

        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
