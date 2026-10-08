import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Navbar } from './components/navigation/Navbar';
import { GlobalSearchModal } from './components/navigation/GlobalSearchModal';
import { AuthModal } from './components/navigation/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';

// Lecturer components
import { LecturerDashboard } from './components/lecturer/LecturerDashboard';
import { CourseList } from './components/lecturer/CourseList';
import { CourseDetail } from './components/lecturer/CourseDetail';
import { CreateAssignment } from './components/lecturer/CreateAssignment';
import { AssignmentList } from './components/lecturer/AssignmentList';
import { SubmissionManagement } from './components/lecturer/SubmissionManagement';
import { GradingView } from './components/lecturer/GradingView';
import { StudentManagement } from './components/lecturer/StudentManagement';
import { AnalyticsView } from './components/lecturer/AnalyticsView';
import { SettingsView } from './components/lecturer/SettingsView';
import { CreateCourseModal } from './components/lecturer/CreateCourseModal';
import { AddStudentModal } from './components/lecturer/AddStudentModal';
import { CreateAnnouncementModal } from './components/lecturer/CreateAnnouncementModal';

// Student components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAssignmentList } from './components/student/StudentAssignmentList';
import { StudentAssignmentDetail } from './components/student/StudentAssignmentDetail';
import { StudentGradesView } from './components/student/StudentGradesView';

// Shared components
import { AcademicCalendar } from './components/common/AcademicCalendar';
import { AnnouncementsView } from './components/common/AnnouncementsView';

const MainLayout: React.FC = () => {
  const { currentUser, currentTab, setCurrentTab, selectedAssignmentId } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false);

  const isLecturer = currentUser.role === 'lecturer';

  // Role Security Guard: Students cannot access faculty tabs
  const lecturerOnlyTabs = ['create_assignment', 'grading', 'analytics', 'settings'];
  if (!isLecturer && lecturerOnlyTabs.includes(currentTab)) {
    setCurrentTab('dashboard');
  }

  // Render main tab view
  const renderContent = () => {
    if (isLecturer) {
      switch (currentTab) {
        case 'dashboard':
          return (
            <LecturerDashboard
              onOpenCreateCourse={() => setIsCreateCourseModalOpen(true)}
              onOpenAddStudent={() => setIsAddStudentModalOpen(true)}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementModalOpen(true)}
            />
          );
        case 'courses':
          return <CourseList onOpenCreateModal={() => setIsCreateCourseModalOpen(true)} />;
        case 'course_detail':
          return (
            <CourseDetail
              onOpenCreateAssignment={() => setCurrentTab('create_assignment')}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementModalOpen(true)}
            />
          );
        case 'assignments':
          return <AssignmentList />;
        case 'create_assignment':
          return <CreateAssignment />;
        case 'submissions':
          return <SubmissionManagement />;
        case 'grading':
          return <GradingView />;
        case 'students':
          return <StudentManagement onOpenAddStudentModal={() => setIsAddStudentModalOpen(true)} />;
        case 'grades':
          return <SubmissionManagement />;
        case 'announcements':
          return <AnnouncementsView onOpenCreateModal={() => setIsCreateAnnouncementModalOpen(true)} />;
        case 'calendar':
          return <AcademicCalendar />;
        case 'analytics':
          return <AnalyticsView />;
        case 'settings':
          return <SettingsView />;
        default:
          return (
            <LecturerDashboard
              onOpenCreateCourse={() => setIsCreateCourseModalOpen(true)}
              onOpenAddStudent={() => setIsAddStudentModalOpen(true)}
              onOpenCreateAnnouncement={() => setIsCreateAnnouncementModalOpen(true)}
            />
          );
      }
    } else {
      // Student views
      switch (currentTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'courses':
          return <CourseList onOpenCreateModal={() => setIsCreateCourseModalOpen(true)} />;
        case 'course_detail':
          return (
            <CourseDetail
              onOpenCreateAssignment={() => {}}
              onOpenCreateAnnouncement={() => {}}
            />
          );
        case 'assignments':
          return selectedAssignmentId ? <StudentAssignmentDetail /> : <StudentAssignmentList />;
        case 'assignment_detail':
          return <StudentAssignmentDetail />;
        case 'grades':
          return <StudentGradesView />;
        case 'announcements':
          return <AnnouncementsView onOpenCreateModal={() => {}} />;
        case 'calendar':
          return <AcademicCalendar />;
        default:
          return <StudentDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
      />
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      />
      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementModalOpen}
        onClose={() => setIsCreateAnnouncementModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
