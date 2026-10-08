import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  BookOpen,
  Plus,
  Users,
  FileCheck2,
  Search,
  ExternalLink,
  Trash2,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';

interface CourseListProps {
  onOpenCreateModal: () => void;
}

export const CourseList: React.FC<CourseListProps> = ({ onOpenCreateModal }) => {
  const {
    courses,
    assignments,
    students,
    deleteCourse,
    setCurrentTab,
    setSelectedCourseId
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleOpenCourse = (id: string) => {
    setSelectedCourseId(id);
    setCurrentTab('course_detail');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Courses</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Manage your academic curriculums, student enrollments, and course assignments.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onOpenCreateModal}
        >
          Create Course
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by course code, title, or dept..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Level:</span>
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="100 Level">100 Level</option>
            <option value="200 Level">200 Level</option>
            <option value="300 Level">300 Level</option>
            <option value="400 Level">400 Level</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>
      </div>

      {/* Course Grid Cards */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No courses found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm ? 'Try adjusting your search criteria or clear filters.' : 'Get started by creating your first academic course.'}
          </p>
          <Button variant="primary" size="sm" className="mt-4" onClick={onOpenCreateModal}>
            + Create First Course
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => {
            const courseAssignments = assignments.filter(a => a.courseId === course.id);
            const enrolledCount = course.enrolledStudentIds.length;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col group"
              >
                {/* Course Header Bar with Color Accent */}
                <div
                  className="h-3"
                  style={{ backgroundColor: course.color || '#4f46e5' }}
                />

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">
                      {course.code}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {course.level}
                    </Badge>
                  </div>

                  <h3
                    onClick={() => handleOpenCourse(course.id)}
                    className="text-lg font-bold text-slate-900 mt-2.5 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {course.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{enrolledCount} Students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{courseAssignments.length} Assignments</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 text-slate-400 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>{course.semester} • {course.session}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-medium"
                      rightIcon={<ExternalLink className="w-3 h-3" />}
                      onClick={() => handleOpenCourse(course.id)}
                    >
                      Open Course
                    </Button>
                    <button
                      onClick={() => setCourseToDelete(course)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Course Deletion */}
      <Modal
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        title="Delete Course?"
        description="This action cannot be undone."
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCourseToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (courseToDelete) {
                  deleteCourse(courseToDelete.id);
                  setCourseToDelete(null);
                }
              }}
            >
              Delete Course
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to permanently delete{' '}
          <strong className="text-slate-900">{courseToDelete?.code} — {courseToDelete?.name}</strong>?
          All associated assignments and student submissions will also be removed.
        </p>
      </Modal>
    </div>
  );
};
