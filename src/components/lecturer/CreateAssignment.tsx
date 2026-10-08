import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { RubricCriterion, AssignmentAttachment } from '../../types';
import {
  FileCheck2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';

export const CreateAssignment: React.FC = () => {
  const {
    courses,
    assignments,
    selectedAssignmentId,
    setSelectedAssignmentId,
    addAssignment,
    updateAssignment,
    setCurrentTab,
    addToast
  } = useApp();

  const editingAssignment = assignments.find(a => a.id === selectedAssignmentId);
  const isEditing = !!editingAssignment;

  // Basic Details
  const [title, setTitle] = useState(editingAssignment?.title || '');
  const [courseId, setCourseId] = useState(editingAssignment?.courseId || courses[0]?.id || '');
  const [description, setDescription] = useState(editingAssignment?.description || '');
  const [instructions, setInstructions] = useState(editingAssignment?.instructions || '');
  const [dueDate, setDueDate] = useState(editingAssignment?.dueDate || '2026-10-15');
  const [dueTime, setDueTime] = useState(editingAssignment?.dueTime || '23:59');
  const [totalMarks, setTotalMarks] = useState(editingAssignment?.totalMarks || 100);

  // File Constraints
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(editingAssignment?.allowedFileTypes || ['.pdf', '.zip']);
  const [customFileType, setCustomFileType] = useState('');
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(editingAssignment?.maxFileSizeMB || 25);

  // Policies
  const [latePolicy, setLatePolicy] = useState<'allowed_penalty' | 'allowed_no_penalty' | 'disallowed'>(editingAssignment?.lateSubmissionPolicy || 'allowed_penalty');
  const [latePenalty, setLatePenalty] = useState(editingAssignment?.latePenaltyPercentPerDay || 10);
  const [allowResubmission, setAllowResubmission] = useState(editingAssignment ? editingAssignment.allowResubmission : true);
  const [anonymousGrading, setAnonymousGrading] = useState(editingAssignment ? editingAssignment.anonymousGrading : false);
  const [autoReleaseGrades, setAutoReleaseGrades] = useState(editingAssignment ? editingAssignment.autoReleaseGrades : false);

  // Attachments
  const [attachments, setAttachments] = useState<AssignmentAttachment[]>(editingAssignment?.attachments || []);
  const [attachmentName, setAttachmentName] = useState('');

  // Rubrics
  const [rubrics, setRubrics] = useState<RubricCriterion[]>(editingAssignment?.rubrics || [
    { id: 'crit_1', title: 'Technical Correctness & Functionality', description: 'Fulfills all requirements with zero logical defects or compilation errors.', maxPoints: 40 },
    { id: 'crit_2', title: 'Empirical Analysis & Benchmarks', description: 'Methodical benchmarks, asymptotic analysis, and data graphs.', maxPoints: 30 },
    { id: 'crit_3', title: 'Code Quality & Modular Design', description: 'Adheres to naming conventions, documentation, and clean architecture.', maxPoints: 20 },
    { id: 'crit_4', title: 'Report Presentation & Clarity', description: 'Structured LaTeX/PDF documentation with clear citations.', maxPoints: 10 },
  ]);

  const [newCriterionTitle, setNewCriterionTitle] = useState('');
  const [newCriterionDesc, setNewCriterionDesc] = useState('');
  const [newCriterionPoints, setNewCriterionPoints] = useState(20);

  const rubricTotal = rubrics.reduce((sum, r) => sum + r.maxPoints, 0);

  const handleAddFileType = (ext: string) => {
    if (!allowedFileTypes.includes(ext)) {
      setAllowedFileTypes([...allowedFileTypes, ext]);
    }
  };

  const handleRemoveFileType = (ext: string) => {
    setAllowedFileTypes(allowedFileTypes.filter(t => t !== ext));
  };

  const handleAddCustomExt = () => {
    if (customFileType) {
      const formatted = customFileType.startsWith('.') ? customFileType : `.${customFileType}`;
      handleAddFileType(formatted);
      setCustomFileType('');
    }
  };

  const handleAddAttachment = () => {
    if (!attachmentName) return;
    setAttachments([
      ...attachments,
      {
        id: 'att_' + Date.now(),
        name: attachmentName,
        size: '1.4 MB',
        type: 'application/pdf',
        url: '#'
      }
    ]);
    setAttachmentName('');
  };

  const handleAddRubricCriterion = () => {
    if (!newCriterionTitle) return;
    setRubrics([
      ...rubrics,
      {
        id: 'crit_' + Date.now(),
        title: newCriterionTitle,
        description: newCriterionDesc,
        maxPoints: Number(newCriterionPoints)
      }
    ]);
    setNewCriterionTitle('');
    setNewCriterionDesc('');
    setNewCriterionPoints(20);
  };

  const handleRemoveRubricCriterion = (id: string) => {
    setRubrics(rubrics.filter(r => r.id !== id));
  };

  const handleSyncMarksWithRubric = () => {
    setTotalMarks(rubricTotal);
    addToast('info', 'Synchronized Marks', `Total marks updated to match rubric sum: ${rubricTotal}`);
  };

  const handlePublish = (status: 'published' | 'draft') => {
    // Validation
    if (!title.trim()) {
      addToast('error', 'Missing Title', 'Please specify an assignment title.');
      return;
    }
    if (!courseId) {
      addToast('error', 'Missing Course', 'Please select a course for this assignment.');
      return;
    }
    if (!dueDate) {
      addToast('error', 'Missing Due Date', 'Please set a submission deadline.');
      return;
    }

    if (isEditing && editingAssignment) {
      updateAssignment({
        ...editingAssignment,
        courseId,
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        dueDate,
        dueTime,
        totalMarks: Number(totalMarks),
        allowedFileTypes,
        maxFileSizeMB: Number(maxFileSizeMB),
        lateSubmissionPolicy: latePolicy,
        latePenaltyPercentPerDay: latePolicy === 'allowed_penalty' ? Number(latePenalty) : undefined,
        allowResubmission,
        anonymousGrading,
        autoReleaseGrades,
        status,
        rubrics,
        attachments
      });
      setSelectedAssignmentId(null);
    } else {
      addAssignment({
        courseId,
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        dueDate,
        dueTime,
        totalMarks: Number(totalMarks),
        allowedFileTypes,
        maxFileSizeMB: Number(maxFileSizeMB),
        lateSubmissionPolicy: latePolicy,
        latePenaltyPercentPerDay: latePolicy === 'allowed_penalty' ? Number(latePenalty) : undefined,
        allowResubmission,
        anonymousGrading,
        autoReleaseGrades,
        status,
        rubrics,
        attachments
      });
    }

    setCurrentTab('assignments');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-150 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isEditing ? 'Edit Assignment' : 'Create Assignment'}
            </h1>
            {isEditing && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Editing Mode
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-0.5">
            {isEditing
              ? `Updating coursework configuration for "${editingAssignment.title}"`
              : 'Design and publish coursework with comprehensive rubrics and automated deadline policies.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAssignmentId(null);
                setTitle('');
                setDescription('');
                setInstructions('');
              }}
            >
              + Create New Instead
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePublish('draft')}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePublish('published')}
          >
            {isEditing ? 'Update & Save Changes' : 'Publish Assignment'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: General Details */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" /> Assignment Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Assignment Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Assignment 3: Distributed Hash Tables & Consistent Hashing"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Course <span className="text-rose-500">*</span>
              </label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Short Summary Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary displayed on cards and calendar events"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Instructions & Requirements
            </label>
            <textarea
              rows={5}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Provide step-by-step submission guidelines, expected deliverables, and benchmark standards..."
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Section 2: Deadline & Scoring */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" /> Deadline & Marks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Total Marks
                </label>
                {rubricTotal !== totalMarks && (
                  <button
                    type="button"
                    onClick={handleSyncMarksWithRubric}
                    className="text-[11px] text-indigo-600 hover:underline font-semibold"
                  >
                    Match Rubric ({rubricTotal})
                  </button>
                )}
              </div>
              <input
                type="number"
                min={1}
                max={500}
                value={totalMarks}
                onChange={e => setTotalMarks(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: File Submission Rules */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-600" /> Submission Rules & File Formats
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Allowed File Extensions
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {['.pdf', '.docx', '.zip', '.tar.gz', '.sql', '.py', '.java', '.cpp'].map(ext => {
                const isSelected = allowedFileTypes.includes(ext);
                return (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => isSelected ? handleRemoveFileType(ext) : handleAddFileType(ext)}
                    className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ext} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 max-w-xs">
              <input
                type="text"
                value={customFileType}
                onChange={e => setCustomFileType(e.target.value)}
                placeholder="Add other (e.g. .ipynb)"
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Button variant="outline" size="sm" type="button" onClick={handleAddCustomExt}>
                Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Max File Size (MB)
              </label>
              <select
                value={maxFileSizeMB}
                onChange={e => setMaxFileSizeMB(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value={10}>10 MB</option>
                <option value={25}>25 MB (Recommended)</option>
                <option value={50}>50 MB</option>
                <option value={100}>100 MB</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Late Submission Policy
              </label>
              <select
                value={latePolicy}
                onChange={e => setLatePolicy(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="allowed_penalty">Allow with percentage deduction penalty</option>
                <option value="allowed_no_penalty">Allow without penalty</option>
                <option value="disallowed">Strict deadline (No late submissions)</option>
              </select>
            </div>
          </div>

          {latePolicy === 'allowed_penalty' && (
            <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-900">Penalty per day late:</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={latePenalty}
                  onChange={e => setLatePenalty(Number(e.target.value))}
                  className="w-16 px-2 py-0.5 border border-amber-300 rounded bg-white text-center font-bold"
                />
                <span className="text-amber-900">% deducted per 24 hours</span>
              </div>
            </div>
          )}

          {/* Additional Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={allowResubmission}
                onChange={e => setAllowResubmission(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Allow Resubmission
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymousGrading}
                onChange={e => setAnonymousGrading(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Anonymous Grading
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoReleaseGrades}
                onChange={e => setAutoReleaseGrades(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Auto-Release Grades
            </label>
          </div>
        </div>

        {/* Section 4: Rubric Builder (Section 9) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" /> Grading Rubric System
              </h3>
              <p className="text-xs text-slate-500">
                Define evaluation criteria for objective scoring during grading.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Rubric Total:</span>
              <span className={`text-base font-bold ml-1.5 ${rubricTotal === totalMarks ? 'text-emerald-600' : 'text-amber-600'}`}>
                {rubricTotal} / {totalMarks} pts
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {rubrics.map((criterion, idx) => (
              <div key={criterion.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">#{idx + 1}</span>
                    <h4 className="text-sm font-bold text-slate-900">{criterion.title}</h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {criterion.maxPoints} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{criterion.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRubricCriterion(criterion.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Criterion Form */}
          <div className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              + Add Rubric Criterion
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newCriterionTitle}
                  onChange={e => setNewCriterionTitle(e.target.value)}
                  placeholder="Criterion title (e.g. Research Depth, Code Quality)"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
              <div>
                <input
                  type="number"
                  min={1}
                  value={newCriterionPoints}
                  onChange={e => setNewCriterionPoints(Number(e.target.value))}
                  placeholder="Max Points"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>
            <textarea
              rows={2}
              value={newCriterionDesc}
              onChange={e => setNewCriterionDesc(e.target.value)}
              placeholder="Description of what constitutes full marks..."
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleAddRubricCriterion}
              disabled={!newCriterionTitle}
            >
              Add Criterion
            </Button>
          </div>
        </div>

        {/* Section 5: Attachments Upload */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-600" /> Lecturer Reference Attachments
          </h3>

          <div className="space-y-2">
            {attachments.map(att => (
              <div key={att.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 text-xs">
                <span className="font-semibold text-slate-800">{att.name} ({att.size})</span>
                <button
                  type="button"
                  onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))}
                  className="text-rose-600 hover:text-rose-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={attachmentName}
              onChange={e => setAttachmentName(e.target.value)}
              placeholder="e.g. project_specification_v1.pdf"
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              leftIcon={<Upload className="w-3.5 h-3.5" />}
              onClick={handleAddAttachment}
              disabled={!attachmentName}
            >
              Attach File
            </Button>
          </div>
        </div>

        {/* Bottom Publish Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentTab('assignments')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => handlePublish('published')}
          >
            Publish Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};
