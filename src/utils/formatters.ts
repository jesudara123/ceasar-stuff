export function formatRelativeDeadline(dueDate: string, dueTime?: string): { text: string; isPast: boolean; urgency: 'critical' | 'warning' | 'normal' | 'past' } {
  const timeStr = dueTime || '23:59';
  const target = new Date(`${dueDate}T${timeStr}:00`);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { text: 'Deadline passed', isPast: true, urgency: 'past' };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return { text: `Due in ${diffMins} min${diffMins > 1 ? 's' : ''}`, isPast: false, urgency: 'critical' };
  }

  if (diffHours < 24) {
    if (diffHours === 1) return { text: 'Due in 1 hour', isPast: false, urgency: 'critical' };
    return { text: `Due in ${diffHours} hours`, isPast: false, urgency: 'critical' };
  }

  if (diffDays === 1) {
    return { text: 'Due tomorrow', isPast: false, urgency: 'warning' };
  }

  if (diffDays <= 3) {
    return { text: `Due in ${diffDays} days`, isPast: false, urgency: 'warning' };
  }

  return { text: `Due in ${diffDays} days`, isPast: false, urgency: 'normal' };
}

export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return isoDate;
  }
}

export function formatDateTime(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoDate;
  }
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : '';
}

export function getFileTypeBadge(filename: string): { label: string; colorClass: string } {
  const ext = getFileExtension(filename);
  switch (ext) {
    case '.pdf':
      return { label: 'PDF', colorClass: 'bg-red-50 text-red-700 border-red-200' };
    case '.docx':
    case '.doc':
      return { label: 'DOC', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    case '.zip':
    case '.tar.gz':
    case '.rar':
      return { label: 'ARCHIVE', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    case '.sql':
      return { label: 'SQL', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case '.java':
    case '.cpp':
    case '.py':
    case '.ts':
    case '.js':
      return { label: 'CODE', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' };
    default:
      return { label: 'FILE', colorClass: 'bg-slate-50 text-slate-700 border-slate-200' };
  }
}
