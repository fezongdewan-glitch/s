import React from 'react';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Flame,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Send,
  Flag,
} from 'lucide-react';
import { CardItem, PriorityLevel } from '../types';

interface KanbanCardProps {
  card: CardItem;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onQuickToggleComplete?: (cardId: string) => void;
  onOpenOrgMessages?: (card: CardItem) => void;
}

const PRIORITY_BADGES: Record<PriorityLevel, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  urgent: {
    label: 'Priority',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: <Flame className="w-3 h-3 text-red-500" />,
  },
  high: {
    label: 'High',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: <AlertCircle className="w-3 h-3 text-amber-600" />,
  },
  medium: {
    label: 'Medium',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: <Clock className="w-3 h-3 text-blue-500" />,
  },
  low: {
    label: 'Low',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    icon: null,
  },
};

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onClick,
  onDragStart,
  onQuickToggleComplete,
  onOpenOrgMessages,
}) => {
  // Format Start Date & ETA Date separately
  const effectiveEta = card.etaDate || card.dueDate;
  let isOverdue = false;
  let formattedEta = '';

  if (effectiveEta) {
    const due = new Date(effectiveEta);
    if (!isNaN(due.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueNormalized = new Date(due);
      dueNormalized.setHours(0, 0, 0, 0);

      isOverdue = dueNormalized < today && !card.completed;
      formattedEta = due.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } else {
      formattedEta = effectiveEta;
    }
  }

  let formattedStart = '';
  if (card.startDate) {
    const start = new Date(card.startDate);
    if (!isNaN(start.getTime())) {
      formattedStart = start.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } else {
      formattedStart = card.startDate;
    }
  }

  const priorityMeta = PRIORITY_BADGES[card.priority] || PRIORITY_BADGES.medium;

  // Primary custom field metric (e.g. Story Points, Value, or Cost)
  const customFieldFirst = card.customFields ? Object.entries(card.customFields)[0] : null;

  const pdfCount =
    card.attachments?.filter(
      (a) =>
        a.type === 'pdf' ||
        a.name.toLowerCase().endsWith('.pdf') ||
        a.url.startsWith('data:application/pdf')
    ).length || 0;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onClick={onClick}
      className={`bg-white p-3 rounded-lg shadow-xs border border-[#091E4224] hover:border-[#0055CC] cursor-pointer transition-all hover:shadow-sm select-none group relative ${
        card.completed ? 'opacity-80' : ''
      }`}
      id={`kanban-card-${card.id}`}
    >
      {/* Optional Top Cover Photo or Color Banner */}
      {card.coverImage ? (
        <div className="h-28 -mx-3 -mt-3 mb-2.5 rounded-t-lg overflow-hidden bg-slate-900">
          <img
            src={card.coverImage}
            alt="Card cover"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : card.coverColor ? (
        <div
          className="h-2 -mx-3 -mt-3 mb-2.5 rounded-t-lg"
          style={{ backgroundColor: card.coverColor }}
        />
      ) : null}

      {/* Label Pills & WhatsApp Quick Trigger */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                label.name.toLowerCase().includes('sku') || label.name.toLowerCase().includes('feat') || label.name.toLowerCase().includes('front')
                  ? 'bg-blue-100 text-blue-700'
                  : label.name.toLowerCase().includes('bug') || label.name.toLowerCase().includes('sec')
                  ? 'bg-red-100 text-red-700'
                  : label.name.toLowerCase().includes('ui')
                  ? 'bg-purple-100 text-purple-700'
                  : label.name.toLowerCase().includes('sync') || label.name.toLowerCase().includes('plan')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {label.name}
            </span>
          ))}

          {card.priority !== 'low' && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${priorityMeta.bg} ${priorityMeta.text}`}>
              {priorityMeta.label}
            </span>
          )}
        </div>

        {/* Org Message Share Button on hover */}
        {onOpenOrgMessages && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenOrgMessages(card);
            }}
            className="p-1 rounded bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white transition-all shadow-2xs opacity-80 hover:opacity-100"
            title="Discuss Campaign in Org Messages"
          >
            <MessageSquare className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Campaign Title */}
      <div className="flex items-start gap-1.5 mb-2">
        {onQuickToggleComplete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickToggleComplete(card.id);
            }}
            className="mt-0.5 text-gray-300 hover:text-emerald-600 transition-colors shrink-0"
            title={card.completed ? 'Mark active' : 'Mark completed'}
          >
            {card.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            ) : (
              <div className="w-3.5 h-3.5 rounded-sm border border-gray-400 hover:border-[#0055CC]" />
            )}
          </button>
        )}
        <p
          className={`text-sm font-medium leading-snug text-[#172B4D] ${
            card.completed ? 'line-through text-gray-400' : ''
          }`}
        >
          {card.title}
        </p>
      </div>

      {/* Dates Row: Start Date & ETA Date clearly shown */}
      {(card.startDate || formattedEta) && (
        <div className="flex items-center flex-wrap gap-2 text-[11px] mb-2 text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded-md">
          {card.startDate && (
            <div className="flex items-center gap-1 text-slate-600" title={`Campaign Start Date: ${card.startDate}`}>
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Start: <strong className="text-slate-800">{formattedStart}</strong></span>
            </div>
          )}

          {formattedEta && (
            <div
              className={`flex items-center gap-1 ${
                isOverdue ? 'text-red-600 font-semibold' : 'text-slate-600'
              }`}
              title={`Target ETA Date: ${card.etaDate || card.dueDate}`}
            >
              <Flag className="w-3 h-3 text-[#0055CC]" />
              <span>ETA: <strong className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-800'}>{formattedEta}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* Card Bottom Meta Divider */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
        {/* Left Stats: Custom Field / Attachments */}
        <div className="flex items-center gap-2 text-gray-500">
          {customFieldFirst ? (
            <span className="font-semibold text-[#172B4D]">
              {customFieldFirst[0] === 'Story Points' ? `${customFieldFirst[1]} pts` : customFieldFirst[1]}
            </span>
          ) : card.completed ? (
            <span className="text-emerald-600 font-medium">Completed</span>
          ) : null}

          {card.attachments && card.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-0.5 text-gray-500 font-medium" title={`${card.attachments.length} attachments`}>
                <Paperclip className="w-3 h-3 text-[#0055CC]" />
                <span>{card.attachments.length}</span>
              </span>
              {pdfCount > 0 && (
                <span className="px-1 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700">
                  PDF
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Assignees & Creator */}
        <div
          className="flex items-center -space-x-1"
          title={
            card.creator
              ? `Created by: ${card.creator.name}${
                  card.assignees?.length
                    ? ` | Assigned: ${card.assignees.map((a) => a.name).join(', ')}`
                    : ''
                }`
              : undefined
          }
        >
          {card.creator && (
            <div
              className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold ring-2 ring-white shadow-2xs z-10"
              title={`Creator: ${card.creator.name}`}
            >
              {card.creator.name ? card.creator.name.slice(0, 2).toUpperCase() : 'CR'}
            </div>
          )}

          {card.assignees &&
            card.assignees
              .filter((a) => !card.creator || a.name.toLowerCase() !== card.creator.name.toLowerCase())
              .map((assignee) => (
                <img
                  key={assignee.id}
                  src={assignee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(assignee.name)}`}
                  alt={assignee.name}
                  title={`Assigned: ${assignee.name}`}
                  className="w-6 h-6 rounded-full ring-2 ring-white shadow-2xs"
                  referrerPolicy="no-referrer"
                />
              ))}
        </div>
      </div>
    </div>
  );
};
