import { User, Course, Assignment, Submission, Announcement, NotificationItem, CalendarEvent } from '../types';
import {
  initialUsers,
  initialCourses,
  initialAssignments,
  initialSubmissions,
  initialAnnouncements,
  initialNotifications,
  initialCalendarEvents
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'lam_users_v1',
  COURSES: 'lam_courses_v1',
  ASSIGNMENTS: 'lam_assignments_v1',
  SUBMISSIONS: 'lam_submissions_v1',
  ANNOUNCEMENTS: 'lam_announcements_v1',
  NOTIFICATIONS: 'lam_notifications_v1',
  CALENDAR: 'lam_calendar_v1',
  CURRENT_USER_ID: 'lam_current_user_id_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const StorageService = {
  getUsers(): User[] {
    let users = safeGet<User[]>(STORAGE_KEYS.USERS, []);
    if (!users || users.length === 0) {
      safeSet(STORAGE_KEYS.USERS, initialUsers);
      return initialUsers;
    }
    // Seamless update if previous session cached the old lecturer name
    let changed = false;
    users = users.map(u => {
      if (u.id === 'user_lecturer_1' && u.name.includes('Thorne')) {
        changed = true;
        return {
          ...u,
          name: 'Prof. Dr. Cusson',
          email: 'dr.cusson@faculty.edu'
        };
      }
      return u;
    });
    if (changed) {
      safeSet(STORAGE_KEYS.USERS, users);
    }
    return users;
  },

  saveUsers(users: User[]): void {
    safeSet(STORAGE_KEYS.USERS, users);
  },

  getCourses(): Course[] {
    const courses = safeGet<Course[]>(STORAGE_KEYS.COURSES, []);
    if (!courses || courses.length === 0) {
      safeSet(STORAGE_KEYS.COURSES, initialCourses);
      return initialCourses;
    }
    return courses;
  },

  saveCourses(courses: Course[]): void {
    safeSet(STORAGE_KEYS.COURSES, courses);
  },

  getAssignments(): Assignment[] {
    const assignments = safeGet<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []);
    if (!assignments || assignments.length === 0) {
      safeSet(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
      return initialAssignments;
    }
    return assignments;
  },

  saveAssignments(assignments: Assignment[]): void {
    safeSet(STORAGE_KEYS.ASSIGNMENTS, assignments);
  },

  getSubmissions(): Submission[] {
    const subs = safeGet<Submission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    if (!subs || subs.length === 0) {
      safeSet(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
      return initialSubmissions;
    }
    return subs;
  },

  saveSubmissions(submissions: Submission[]): void {
    safeSet(STORAGE_KEYS.SUBMISSIONS, submissions);
  },

  getAnnouncements(): Announcement[] {
    const announcements = safeGet<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, []);
    if (!announcements || announcements.length === 0) {
      safeSet(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
      return initialAnnouncements;
    }
    return announcements;
  },

  saveAnnouncements(announcements: Announcement[]): void {
    safeSet(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  },

  getNotifications(): NotificationItem[] {
    const notifs = safeGet<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (!notifs || notifs.length === 0) {
      safeSet(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
      return initialNotifications;
    }
    return notifs;
  },

  saveNotifications(notifs: NotificationItem[]): void {
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  getCalendarEvents(): CalendarEvent[] {
    const events = safeGet<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
    if (!events || events.length === 0) {
      safeSet(STORAGE_KEYS.CALENDAR, initialCalendarEvents);
      return initialCalendarEvents;
    }
    return events;
  },

  saveCalendarEvents(events: CalendarEvent[]): void {
    safeSet(STORAGE_KEYS.CALENDAR, events);
  },

  getCurrentUserId(): string {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user_lecturer_1';
  },

  saveCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  },

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }
};
