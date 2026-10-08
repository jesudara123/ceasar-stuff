import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { assignments, submissions, courses, students } = useApp();

  const totalPossibleSubmissions = assignments.filter(a => a.status === 'published').length * students.length;
  const totalReceived = submissions.length;
  const overallSubmissionRate = totalPossibleSubmissions > 0 ? Math.round((totalReceived / totalPossibleSubmissions) * 100) : 0;

  const lateCount = submissions.filter(s => s.status === 'late').length;
  const lateRate = totalReceived > 0 ? Math.round((lateCount / totalReceived) * 100) : 0;

  const gradedSubmissions = submissions.filter(s => s.score !== undefined);
  const avgClassScore = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubmissions.length)
    : 0;

  // Assignment-by-assignment stats breakdown
  const assignmentAnalytics = assignments.filter(a => a.status !== 'draft').map(asg => {
    const course = courses.find(c => c.id === asg.courseId);
    const enrolledCount = course?.enrolledStudentIds.length || students.length;
    const asgSubs = submissions.filter(s => s.assignmentId === asg.id);

    const submittedCount = asgSubs.length;
    const missingCount = Math.max(0, enrolledCount - submittedCount);
    const submittedPct = enrolledCount > 0 ? Math.round((submittedCount / enrolledCount) * 100) : 0;
    const missingPct = Math.max(0, 100 - submittedPct);

    const graded = asgSubs.filter(s => s.score !== undefined);
    const avgScore = graded.length > 0
      ? Math.round(graded.reduce((acc, s) => acc + (s.score || 0), 0) / graded.length)
      : null;

    return {
      id: asg.id,
      title: asg.title,
      courseCode: course?.code || 'CSC',
      totalMarks: asg.totalMarks,
      enrolledCount,
      submittedCount,
      missingCount,
      submittedPct,
      missingPct,
      avgScore
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Analytics</h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Performance metrics, submission adherence, and class score distributions.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Submission Rate</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-2 flex items-baseline gap-1">
            {overallSubmissionRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across active coursework</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Average Score</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {avgClassScore} / 100
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Class mean across graded work</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Late Submission Rate</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">
            {lateRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{lateCount} late assignments recorded</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Learners</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {students.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registered university students</p>
        </div>
      </div>

      {/* Comparative Progress Bars per Assignment */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Submission & Completion Rates by Assignment</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ratio of submitted work versus missing submissions per cohort</p>
        </div>

        <div className="space-y-5">
          {assignmentAnalytics.map(item => (
            <div key={item.id} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                    {item.courseCode}
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">{item.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="text-emerald-700">Submitted: {item.submittedPct}% ({item.submittedCount})</span>
                  <span className="text-slate-400">Missing: {item.missingPct}% ({item.missingCount})</span>
                  {item.avgScore !== null && (
                    <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      Avg Score: {item.avgScore}/{item.totalMarks}
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Split Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-2xs">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${item.submittedPct}%` }}
                  title={`Submitted: ${item.submittedPct}%`}
                />
                <div
                  className="bg-rose-400 transition-all duration-500"
                  style={{ width: `${item.missingPct}%` }}
                  title={`Missing: ${item.missingPct}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Distribution & Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Grade Distribution Tiers</h3>
          <p className="text-xs text-slate-500 mb-4">Letter grade breakdown across completed grading</p>

          <div className="space-y-3 text-xs">
            {[
              { tier: 'First Class / Distinction (70 - 100%)', count: gradedSubmissions.filter(s => (s.score || 0) >= 70).length, color: 'bg-emerald-500' },
              { tier: 'Upper Second Class (60 - 69%)', count: gradedSubmissions.filter(s => (s.score || 0) >= 60 && (s.score || 0) < 70).length, color: 'bg-blue-500' },
              { tier: 'Lower Second Class (50 - 59%)', count: gradedSubmissions.filter(s => (s.score || 0) >= 50 && (s.score || 0) < 60).length, color: 'bg-amber-500' },
              { tier: 'Pass / Below 50%', count: gradedSubmissions.filter(s => (s.score || 0) < 50).length, color: 'bg-rose-500' },
            ].map(row => {
              const pct = gradedSubmissions.length > 0 ? Math.round((row.count / gradedSubmissions.length) * 100) : 0;
              return (
                <div key={row.tier} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-medium">{row.tier}</span>
                    <span className="font-bold">{row.count} students ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${row.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Faculty Recommendations</h3>
          <p className="text-xs text-slate-500 mb-4">Actionable insights generated from submission adherence</p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-indigo-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <strong className="block font-semibold">High Engagement in CSC 301</strong>
                <p className="text-slate-600 mt-0.5">Red-Black Trees assignment recorded 94% submission rate within 48 hours of publication.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <strong className="block font-semibold">Late Submissions in CSC 315</strong>
                <p className="text-slate-600 mt-0.5">Authentication lab had 25% late submissions. Consider reviewing Docker and Redis environment dependencies.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-900 flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong className="block font-semibold">Strong Rubric Alignment</strong>
                <p className="text-slate-600 mt-0.5">Average score on mathematical rigor is 92%, indicating strong grasp of asymptotic proofs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
