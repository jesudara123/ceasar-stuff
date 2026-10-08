import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, BookOpen, FileCheck2, Users, Inbox, X, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    courses,
    assignments,
    submissions,
    students,
    setCurrentTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
    setSelectedSubmissionId,
    setSelectedStudentId
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { courses: [], assignments: [], students: [], submissions: [] };
    const q = query.toLowerCase();

    const matchedCourses = courses.filter(
      c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.department.toLowerCase().includes(q)
    );

    const matchedAssignments = assignments.filter(
      a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );

    const matchedStudents = students.filter(
      s => s.name.toLowerCase().includes(q) || (s.matricNumber && s.matricNumber.toLowerCase().includes(q)) || s.email.toLowerCase().includes(q)
    );

    const matchedSubmissions = submissions.filter(sub => {
      const student = students.find(s => s.id === sub.studentId);
      const asg = assignments.find(a => a.id === sub.assignmentId);
      return (
        (student && (student.name.toLowerCase().includes(q) || (student.matricNumber && student.matricNumber.toLowerCase().includes(q)))) ||
        (asg && asg.title.toLowerCase().includes(q))
      );
    });

    return {
      courses: matchedCourses.slice(0, 4),
      assignments: matchedAssignments.slice(0, 4),
      students: matchedStudents.slice(0, 4),
      submissions: matchedSubmissions.slice(0, 4)
    };
  }, [query, courses, assignments, students, submissions]);

  if (!isSearchOpen) return null;

  const totalResults = results.courses.length + results.assignments.length + results.students.length + results.submissions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students, matric numbers, courses, assignments, submissions..."
            className="w-full bg-transparent border-0 text-sm focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Type keywords to search instantly across courses, assignments, matric numbers, and student submissions.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No results found for "<span className="font-medium text-slate-800">{query}</span>"
            </div>
          ) : (
            <>
              {/* Courses */}
              {results.courses.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Courses
                  </h4>
                  <div className="space-y-1">
                    {results.courses.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCourseId(c.id);
                          setCurrentTab('course_detail');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                            {c.code} — {c.name}
                          </p>
                          <p className="text-xs text-slate-500">{c.level} • {c.department}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {results.assignments.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5" /> Assignments
                  </h4>
                  <div className="space-y-1">
                    {results.assignments.map(a => {
                      const course = courses.find(c => c.id === a.courseId);
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            setSelectedAssignmentId(a.id);
                            setCurrentTab('assignments');
                            setIsSearchOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                              {a.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {course?.code || 'Course'} • Due: {a.dueDate} ({a.totalMarks} marks)
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Students */}
              {results.students.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Students
                  </h4>
                  <div className="space-y-1">
                    {results.students.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setCurrentTab('students');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={s.avatar} alt={s.name} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                              {s.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {s.matricNumber || s.email}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submissions */}
              {results.submissions.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Inbox className="w-3.5 h-3.5" /> Submissions
                  </h4>
                  <div className="space-y-1">
                    {results.submissions.map(sub => {
                      const st = students.find(s => s.id === sub.studentId);
                      const asg = assignments.find(a => a.id === sub.assignmentId);
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubmissionId(sub.id);
                            setCurrentTab('grading');
                            setIsSearchOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                              {st?.name || 'Student'} — {asg?.title || 'Assignment'}
                            </p>
                            <p className="text-xs text-slate-500">
                              Status: <span className="font-medium capitalize">{sub.status}</span> • {sub.score !== undefined ? `Score: ${sub.score}` : 'Ungraded'}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-indigo-600 group-hover:underline">Grade →</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
