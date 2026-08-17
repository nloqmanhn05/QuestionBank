import React from 'react';
import { LayoutGrid } from 'lucide-react';

export function QuickJumpGrid({
  currentChapterKey,
  currentQuestionIndex,
  onSelectQuestion,
  userState,
}) {
  const chapState = userState[currentChapterKey] || {};
  const answeredCount = Object.keys(chapState).length;

  return (
    <div className="pane-quick-jump w-full lg:w-[22%] flex-shrink-0 flex flex-col gap-2 sm:gap-3 bento p-3 sm:p-4 self-start">
      {/* Header */}
      <div
        className="flex items-center justify-between pb-2"
        style={{ borderBottom: '1px solid var(--card-line)' }}
      >
        <h3
          className="font-display text-sm font-semibold flex items-center gap-1.5"
          style={{ color: 'var(--ink)' }}
        >
          <LayoutGrid className="w-3.5 h-3.5" style={{ color: 'var(--index)' }} /> Quick Jump
        </h3>
        <span
          id="quick-jump-progress"
          className="font-mono text-xs font-bold"
          style={{ color: 'var(--index)' }}
        >
          {answeredCount}/30
        </span>
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-between text-[11px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'var(--correct)' }} />
          Correct
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'var(--wrong)' }} />
          Wrong
        </span>
      </div>

      {/* 30 Question Grid Matrix */}
      <div
        id="question-grid-nav"
        className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-1.5 pt-1"
      >
        {Array.from({ length: 30 }).map((_, i) => {
          const qState = chapState[i];
          const isActive = i === currentQuestionIndex;

          let bg = 'var(--paper)';
          let color = 'var(--ink-soft)';
          let borderColor = 'var(--card-line)';
          let outlineStyle = '';

          if (qState !== undefined) {
            if (qState.isCorrect) {
              bg = 'var(--correct)';
              color = '#ffffff';
              borderColor = 'var(--correct)';
            } else {
              bg = 'var(--wrong)';
              color = '#ffffff';
              borderColor = 'var(--wrong)';
            }
          }

          if (isActive) {
            outlineStyle = qState !== undefined ? '2.5px solid var(--ink)' : '2.5px solid var(--index)';
          }

          return (
            <button
              key={i}
              onClick={() => onSelectQuestion(i)}
              className="w-full aspect-square rounded-xl text-xs font-mono font-semibold flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              style={{
                background: bg,
                color: color,
                border: `1.5px solid ${borderColor}`,
                outline: outlineStyle,
                outlineOffset: '1px',
              }}
              title={`Question ${i + 1}${
                qState ? (qState.isCorrect ? ' (Correct)' : ' (Incorrect)') : ' (Unanswered)'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
