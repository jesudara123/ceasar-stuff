import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UploadedFile } from '../../types';
import {
  ArrowLeft,
  FileCheck2,
  Clock,
  Download,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Sliders,
  Send,
  RotateCcw
} from 'lucide-react';
import { formatRelativeDeadline, formatDateTime, getFileTypeBadge } from '../../utils/formatters';

export const StudentAssignmentDetail: React.FC = () => {
  const {
    currentUser,
    selectedAssignmentId,
    setSelectedAssignmentId,
    assignments,
    courses,
    lecturers,
    submissions,
    submitAssignment,
    setCurrentTab,
    addToast
  } = useApp();

  const assignment = assignments.find(a => a.id === selectedAssignmentId);
  const course = courses.find(c => c.id === assignment?.courseId);
  const lecturer = lecturers.find(l => l.id === course?.lecturerId) || lecturers[0];

  const existingSubmission = submissions.find(
    s => s.assignmentId === selectedAssignmentId && s.studentId === currentUser.id
  );

  // Upload state
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [studentNote, setStudentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResubmittingMode, setIsResubmittingMode] = useState(false);

  if (!assignment) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-600">Assignment not found.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setCurrentTab('assignments')}>
          Back to Assignments
        </Button>
      </div>
    );
  }

  const countdown = formatRelativeDeadline(assignment.dueDate, assignment.dueTime);

  // Simulated file upload from browser file input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      fileList.push({
        id: 'file_' + Date.now() + '_' + i,
        name: f.name,
        size: `${sizeMB} MB`,
        type: f.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        mockContent: `// Uploaded content for ${f.name}\n// Verified file digest: SHA-256 ok`
      });
    }

    setSelectedFiles([...selectedFiles, ...fileList]);
  };

  const handleSimulateAddDemoFile = (name: string, size: string) => {
    setSelectedFiles([
      ...selectedFiles,
      {
        id: 'file_' + Date.now(),
        name,
        size,
        type: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        mockContent: `Academic submission deliverable: ${name}\nStudent: ${currentUser.name}\nMatric: ${currentUser.matricNumber}`
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      addToast('error', 'No File Selected', 'Please attach your assignment deliverable before submitting.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(assignment.id, selectedFiles, studentNote);
      setIsSubmitting(false);
      setIsResubmittingMode(false);
      setSelectedFiles([]);
      setStudentNote('');
    }, 600);
  };

  const hasSubmitted = !!existingSubmission && !isResubmittingMode;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150 pb-12">
      {/* Back button */}
      <button
        onClick={() => {
          setSelectedAssignmentId(null);
          setCurrentTab('assignments');
        }}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assignments
      </button>

      {/* Assignment Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200/60">
              {course?.code}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {course?.name}
            </span>
          </div>

          {/* Deadline Countdown Indicator */}
          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
            countdown.urgency === 'critical'
              ? 'bg-rose-100 text-rose-800 animate-pulse'
              : countdown.urgency === 'warning'
              ? 'bg-amber-100 text-amber-800'
              : countdown.urgency === 'past'
              ? 'bg-slate-200 text-slate-700'
              : 'bg-blue-100 text-blue-800'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {countdown.text}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {assignment.title}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Course Lecturer</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{lecturer?.name || 'Prof. Dr. Cusson'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Maximum Marks</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{assignment.totalMarks} Points</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Due Date</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{assignment.dueDate} at {assignment.dueTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Late Submissions</span>
            <span className="font-bold text-slate-800 mt-0.5 block capitalize">
              {assignment.lateSubmissionPolicy.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Description & Instructions */}
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Assignment Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {assignment.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Instructions & Requirements
            </h3>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
              {assignment.instructions}
            </div>
          </div>
        </div>

        {/* Reference Attachments from Lecturer */}
        {assignment.attachments.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Lecturer Attachments & Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {assignment.attachments.map(att => (
                <div key={att.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                    <span className="text-[10px] text-slate-400">({att.size})</span>
                  </div>
                  <button
                    onClick={() => addToast('info', 'Download Started', `Downloading ${att.name}`)}
                    className="p-1 text-slate-500 hover:text-indigo-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grading Rubric Guidelines */}
        {assignment.rubrics.length > 0 && (
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" /> Evaluation Rubric
            </h3>
            <div className="space-y-2">
              {assignment.rubrics.map(criterion => (
                <div key={criterion.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/40 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{criterion.title}</span>
                    <p className="text-slate-600 mt-0.5">{criterion.description}</p>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80 shrink-0">
                    {criterion.maxPoints} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SUBMISSION STATUS & UPLOAD AREA */}
      {hasSubmitted ? (
        /* State 1: Already Submitted View */
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submission Successful</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted on: <strong className="text-slate-800">{formatDateTime(existingSubmission.submittedAt)}</strong>
                </p>
              </div>
            </div>

            <Badge variant={existingSubmission.status === 'returned' ? 'success' : existingSubmission.status === 'late' ? 'danger' : 'primary'}>
              {existingSubmission.status === 'returned' ? 'Graded & Returned' : existingSubmission.status === 'late' ? 'Submitted (Late)' : 'Under Faculty Review'}
            </Badge>
          </div>

          {/* Graded Feedback Card if Returned */}
          {existingSubmission.score !== undefined && (
            <div className="p-5 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">Graded Score</span>
                  <span className="text-2xl font-black text-emerald-800">{existingSubmission.score} / {assignment.totalMarks}</span>
                </div>
                <Badge variant="success" size="md">Official Result</Badge>
              </div>

              {existingSubmission.studentFeedback && (
                <div className="pt-2 border-t border-emerald-200/60 text-xs">
                  <span className="font-bold text-emerald-950 block mb-1">Lecturer Feedback:</span>
                  <p className="text-emerald-900 leading-relaxed italic">"{existingSubmission.studentFeedback}"</p>
                </div>
              )}
            </div>
          )}

          {/* Submitted Files */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Submitted Deliverables (Attempt #{existingSubmission.attemptNumber})
            </h4>
            <div className="space-y-2">
              {existingSubmission.files.map(f => {
                const badge = getFileTypeBadge(f.name);
                return (
                  <div key={f.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${badge.colorClass}`}>
                        {badge.label}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{f.name}</span>
                      <span className="text-slate-400">({f.size})</span>
                    </div>
                    <button
                      onClick={() => addToast('info', 'Download', `Downloading your submission ${f.name}`)}
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resubmission Section (Only if enabled) */}
          {assignment.allowResubmission ? (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Resubmission is enabled by your lecturer until grading is finalized.
              </span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => setIsResubmittingMode(true)}
              >
                Submit New Revision
              </Button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
              Resubmission is disabled for this assignment by course policy.
            </p>
          )}
        </div>
      ) : (
        /* State 2: Submission Upload Dropzone Area */
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upload Your Submission</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Supported formats: {assignment.allowedFileTypes.join(', ')} • Max size: {assignment.maxFileSizeMB} MB
              </p>
            </div>
            {isResubmittingMode && (
              <Button variant="ghost" size="sm" onClick={() => setIsResubmittingMode(false)}>
                Cancel Revision
              </Button>
            )}
          </div>

          {/* Drag & Drop Simulation Dropzone */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
            <input
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">
              Drag & drop your files here, or <span className="text-indigo-600 underline">browse workstation</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, DOCX, ZIP, SQL, PY, JAVA, CPP
            </p>

            {/* Quick Demo File buttons */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Quick Attach Samples:</span>
              <button
                type="button"
                onClick={() => handleSimulateAddDemoFile(`${currentUser.name.replace(' ', '')}_Solution_Report.pdf`, '2.4 MB')}
                className="text-[11px] bg-white border border-slate-200 hover:border-indigo-400 px-2.5 py-1 rounded text-slate-700 shadow-2xs"
              >
                + Solution_Report.pdf (2.4 MB)
              </button>
              <button
                type="button"
                onClick={() => handleSimulateAddDemoFile(`${currentUser.name.replace(' ', '')}_SourceCode.zip`, '5.8 MB')}
                className="text-[11px] bg-white border border-slate-200 hover:border-indigo-400 px-2.5 py-1 rounded text-slate-700 shadow-2xs"
              >
                + SourceCode.zip (5.8 MB)
              </button>
            </div>
          </div>

          {/* Uploaded Files List */}
          {selectedFiles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Files Ready for Submission ({selectedFiles.length})
              </h4>
              <div className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div key={file.id} className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{file.name}</span>
                      <span className="text-slate-500">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:underline font-medium text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Submission Note to Lecturer (Optional)
            </label>
            <textarea
              rows={3}
              value={studentNote}
              onChange={e => setStudentNote(e.target.value)}
              placeholder="Add any specific context, compilation notes, or library versions..."
              className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              By submitting, you confirm this work is original and adheres to university honor codes.
            </span>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Assignment
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
