import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { GraduationCap, BookOpen, Clock, FileText, CheckCircle2, Sliders } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const StudentGradesView: React.FC = () => {
  const { currentUser, courses, assignments, submissions, setCurrentTab, setSelectedAssignmentId } = useApp();

  const studentCourses = courses.filter(c => c.enrolledStudentIds.includes(currentUser.id));
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);

  // Group by Course
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  const gradedSubmissions = studentSubmissions.filter(s => s.score !== undefined && (s.isReturned || s.status === 'returned'));

  const filteredSubs = studentSubmissions.filter(s => {
    if (selectedCourseFilter !== 'all' && s.courseId !== selectedCourseFilter) return false;
    return true;
  });

  // Calculate overall GPA / Weighted Average
  const totalScoreObtained = gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0);
  const totalScorePossible = gradedSubmissions.reduce((acc, s) => {
    const asg = assignments.find(a => a.id === s.assignmentId);
    return acc + (asg?.totalMarks || 100);
  }, 0);

  const overallAverage = totalScorePossible > 0 ? Math.round((totalScoreObtained / totalScorePossible) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Grades & Transcripts</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Review your marks, rubric distributions, and personal lecturer feedback.
          </p>
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course:</span>
          <select
            value={selectedCourseFilter}
            onChange={e => setSelectedCourseFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Enrolled Courses</option>
            {studentCourses.map(c => (
              <option key={c.id} value={c.id}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Continuous Assessment Average</span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">
            {totalScorePossible > 0 ? `${overallAverage}%` : 'N/A'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on {gradedSubmissions.length} graded assignments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Graded Deliverables</span>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">
            {gradedSubmissions.length} / {studentSubmissions.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Returned by course professors</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Academic Standing</span>
          <div className="text-2xl font-bold text-slate-800 mt-2 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Good Standing
          </div>
          <p className="text-[11px] text-slate-400 mt-1">No missing deadlines flagged</p>
        </div>
      </div>

      {/* Graded Works List */}
      <div className="space-y-4">
        {filteredSubs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            No submissions recorded for this selection yet.
          </div>
        ) : (
          filteredSubs.map(sub => {
            const asg = assignments.find(a => a.id === sub.assignmentId);
            const course = courses.find(c => c.id === sub.courseId);
            const isGraded = sub.score !== undefined;

            return (
              <div key={sub.id} className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {course?.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{asg?.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Submitted: {formatDateTime(sub.submittedAt)} • Attempt #{sub.attemptNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    {isGraded ? (
                      <div>
                        <span className="text-2xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                          {sub.score} / {asg?.totalMarks || 100}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Graded on {sub.gradedAt ? formatDateTime(sub.gradedAt) : 'Recently'}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="warning">Under Review (Pending)</Badge>
                    )}
                  </div>
                </div>

                {/* Rubric Breakdown if available */}
                {sub.rubricScores && asg?.rubrics && asg.rubrics.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Rubric Marks Breakdown
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {asg.rubrics.map(criterion => {
                        const pts = sub.rubricScores?.[criterion.id] ?? 0;
                        return (
                          <div key={criterion.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                            <span className="font-medium text-slate-800">{criterion.title}</span>
                            <span className="font-bold text-emerald-700">{pts} / {criterion.maxPoints} pts</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Feedback Note */}
                {sub.studentFeedback ? (
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs">
                    <span className="font-bold text-emerald-950 block mb-1">Lecturer Feedback:</span>
                    <p className="text-emerald-900 leading-relaxed italic">"{sub.studentFeedback}"</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No personal feedback comment left.</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
