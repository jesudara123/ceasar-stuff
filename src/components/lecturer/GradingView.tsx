import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  User,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MessageSquare,
  Sparkles,
  Send,
  Eye,
  Sliders
} from 'lucide-react';
import { formatDateTime, getFileTypeBadge } from '../../utils/formatters';

export const GradingView: React.FC = () => {
  const {
    submissions,
    assignments,
    courses,
    students,
    selectedSubmissionId,
    setSelectedSubmissionId,
    setCurrentTab,
    gradeSubmission,
    addToast
  } = useApp();

  const submission = submissions.find(s => s.id === selectedSubmissionId);
  const assignment = assignments.find(a => a.id === submission?.assignmentId);
  const course = courses.find(c => c.id === submission?.courseId);
  const student = students.find(s => s.id === submission?.studentId);

  // All submissions for this assignment to support Prev / Next navigation
  const assignmentSubmissions = submissions.filter(s => s.assignmentId === submission?.assignmentId);
  const currentIndex = assignmentSubmissions.findIndex(s => s.id === selectedSubmissionId);

  // Grading form state
  const [score, setScore] = useState<number>(submission?.score ?? 0);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    if (submission?.rubricScores) return submission.rubricScores;
    // Default rubric initial values
    const initial: Record<string, number> = {};
    assignment?.rubrics.forEach(r => {
      initial[r.id] = Math.round(r.maxPoints * 0.85); // reasonable starting baseline
    });
    return initial;
  });

  const [privateNotes, setPrivateNotes] = useState(submission?.privateNotes || '');
  const [studentFeedback, setStudentFeedback] = useState(submission?.studentFeedback || '');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Sync state when submission changes
  useEffect(() => {
    if (submission) {
      setScore(submission.score ?? (assignment ? Math.round(assignment.totalMarks * 0.85) : 80));
      setPrivateNotes(submission.privateNotes || '');
      setStudentFeedback(submission.studentFeedback || '');
      if (submission.rubricScores) {
        setRubricScores(submission.rubricScores);
      } else if (assignment) {
        const init: Record<string, number> = {};
        assignment.rubrics.forEach(r => {
          init[r.id] = Math.round(r.maxPoints * 0.85);
        });
        setRubricScores(init);
      }
    }
  }, [selectedSubmissionId, submission, assignment]);

  // Recalculate score from rubric changes
  const handleRubricScoreChange = (criterionId: string, val: number) => {
    const updated = { ...rubricScores, [criterionId]: Number(val) };
    setRubricScores(updated);
    const sum = Object.values(updated).reduce((acc, v) => acc + (v || 0), 0);
    setScore(sum);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedSubmissionId(assignmentSubmissions[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < assignmentSubmissions.length - 1) {
      setSelectedSubmissionId(assignmentSubmissions[currentIndex + 1].id);
    }
  };

  const handleSaveGrade = (returnToStudent: boolean) => {
    if (!submission) return;
    gradeSubmission(
      submission.id,
      score,
      rubricScores,
      privateNotes,
      studentFeedback,
      returnToStudent
    );
    if (returnToStudent) {
      setIsReturnModalOpen(false);
    }
  };

  if (!submission || !assignment || !student) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-600">Please select a submission to begin grading.</p>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => setCurrentTab('submissions')}>
          Go to Submissions
        </Button>
      </div>
    );
  }

  const activeFile = submission.files[selectedFileIndex] || submission.files[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Bar: Navigation & Action Controls */}
      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('submissions')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to submissions list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              Grading: {assignment.title}
            </h2>
            <p className="text-xs text-slate-500">
              {course?.code} • Student {currentIndex + 1} of {assignmentSubmissions.length}
            </p>
          </div>
        </div>

        {/* Previous / Next student */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex <= 0}
            onClick={() => handleNavigate('prev')}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex >= assignmentSubmissions.length - 1}
            onClick={() => handleNavigate('next')}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSaveGrade(false)}
          >
            Save Draft Grade
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsReturnModalOpen(true)}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Return to Student
          </Button>
        </div>
      </div>

      {/* 3-Column Layout: Left (Student Info) | Center (Submission Viewer) | Right (Grading Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: Student Information (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Student Information
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100 shrink-0"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{student.name}</h4>
                <p className="text-xs font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                  {student.matricNumber}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{student.email}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Enrolled Course</span>
                <span className="font-semibold text-slate-800">{course?.code} — {course?.name}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Submitted On</span>
                <span className="font-semibold text-slate-800">{formatDateTime(submission.submittedAt)}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Submission Status</span>
                <div className="mt-1">
                  {submission.status === 'late' ? (
                    <Badge variant="danger" size="sm">LATE SUBMISSION</Badge>
                  ) : submission.status === 'returned' ? (
                    <Badge variant="success" size="sm">RETURNED TO STUDENT</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">PENDING EVALUATION</Badge>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Submission Attempt</span>
                <span className="font-semibold text-slate-800">Attempt #{submission.attemptNumber}</span>
              </div>

              {submission.studentNote && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Student's Note:</span>
                  <p className="text-slate-600 italic text-xs leading-relaxed">"{submission.studentNote}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Submitted Files List */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Submitted Files ({submission.files.length})</span>
            </h4>
            <div className="space-y-1.5">
              {submission.files.map((file, idx) => {
                const badge = getFileTypeBadge(file.name);
                const isSelected = idx === selectedFileIndex;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${badge.colorClass}`}>
                        {badge.label}
                      </span>
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{file.size}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Submission Preview / Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col h-[750px] overflow-hidden">
          {/* File Viewer Toolbar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-bold text-slate-800 truncate">{activeFile ? activeFile.name : 'Submission'}</span>
            </div>
            <a
              href={`#download_${activeFile?.name}`}
              onClick={(e) => {
                e.preventDefault();
                addToast('success', 'Download Started', `Downloading ${activeFile?.name} for offline inspection.`);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Download File
            </a>
          </div>

          {/* Document Content View */}
          <div className="flex-1 p-5 overflow-y-auto bg-slate-900/2 font-mono text-xs leading-relaxed text-slate-800">
            {activeFile?.mockContent ? (
              <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                {activeFile.mockContent}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <FileText className="w-16 h-16 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-800">{activeFile?.name}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Binary archive file ({activeFile?.size}). Ready for grading inspection.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => addToast('info', 'File Download', `Extracted archive files to lecturer staging folder.`)}
                >
                  Inspect Archive ({activeFile?.size})
                </Button>
              </div>
            )}
          </div>

          {/* Viewer Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Uploaded: {formatDateTime(submission.submittedAt)}</span>
            <span>Security scanned • No vulnerabilities</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Grading & Rubrics Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-5 h-[750px] overflow-y-auto">
          {/* Overall Score Box */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block">Total Score</span>
              <p className="text-xs text-indigo-700">Calculated from rubric criteria</p>
            </div>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                min={0}
                max={assignment.totalMarks}
                value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="w-16 px-2 py-1 text-2xl font-black text-indigo-950 bg-white border border-indigo-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-2xs"
              />
              <span className="text-lg font-bold text-indigo-800">/ {assignment.totalMarks}</span>
            </div>
          </div>

          {/* Rubric Evaluation Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Rubric Evaluation
              </h4>
              <span className="text-[11px] text-slate-500">{assignment.rubrics.length} Criteria</span>
            </div>

            <div className="space-y-3">
              {assignment.rubrics.map(criterion => {
                const currentVal = rubricScores[criterion.id] ?? 0;
                return (
                  <div key={criterion.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">{criterion.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{criterion.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={criterion.maxPoints}
                          value={currentVal}
                          onChange={e => handleRubricScoreChange(criterion.id, Number(e.target.value))}
                          className="w-12 px-1.5 py-0.5 text-xs font-bold text-center border border-slate-300 rounded bg-white text-slate-900"
                        />
                        <span className="text-xs font-medium text-slate-500">/ {criterion.maxPoints}</span>
                      </div>
                    </div>

                    {/* Range slider for intuitive grading */}
                    <input
                      type="range"
                      min={0}
                      max={criterion.maxPoints}
                      value={currentVal}
                      onChange={e => handleRubricScoreChange(criterion.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Feedback */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Feedback <span className="text-slate-400 font-normal">(Visible to Student)</span>
              </label>
            </div>
            <textarea
              rows={4}
              value={studentFeedback}
              onChange={e => setStudentFeedback(e.target.value)}
              placeholder="e.g. Excellent methodology and unit tests. Consider improving the final section analysis on AVL trees..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />

            {/* Quick Feedback Snippet Chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[
                'Excellent analysis!',
                'Strong unit test coverage.',
                'Refactor redundant rotations.',
                'Good work, expand final conclusions.'
              ].map(snip => (
                <button
                  key={snip}
                  type="button"
                  onClick={() => setStudentFeedback(prev => prev ? `${prev} ${snip}` : snip)}
                  className="text-[10px] bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                >
                  + {snip}
                </button>
              ))}
            </div>
          </div>

          {/* Private Lecturer Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" /> Private Notes <span className="text-slate-400 font-normal">(Faculty Eyes Only)</span>
            </label>
            <textarea
              rows={2}
              value={privateNotes}
              onChange={e => setPrivateNotes(e.target.value)}
              placeholder="Internal reminders or potential TA notes..."
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 bg-slate-50/40"
            />
          </div>

          {/* Submission action buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              rightIcon={<Send className="w-4 h-4" />}
              onClick={() => setIsReturnModalOpen(true)}
            >
              Return Graded Work to Student
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleSaveGrade(false)}
            >
              Save as Draft (Don't Publish Yet)
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Before Returning Graded Work (Section 8 requirement) */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Return Graded Submission to Student?"
        description="Release score and comments to the student's portal"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsReturnModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => handleSaveGrade(true)}
            >
              Confirm & Return to Student
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            You are about to return this submission to <strong className="text-slate-900">{student.name} ({student.matricNumber})</strong>.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 font-sans">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Final Score:</span>
              <span className="font-bold text-slate-900 text-sm">{score} / {assignment.totalMarks}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Student Feedback:</span>
              <span className="text-slate-900 text-right truncate max-w-[200px]">{studentFeedback || '(None)'}</span>
            </div>
          </div>
          <p className="text-slate-500">
            The student will immediately receive a notification on their dashboard and can view their feedback and grade breakdown.
          </p>
        </div>
      </Modal>
    </div>
  );
};
