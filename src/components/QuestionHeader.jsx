import React from 'react';
import { Compass, ArrowLeft, ArrowRight } from 'lucide-react';

export function QuestionHeader({
  currentChapterKey,
  currentChapterTitle,
  currentQuestionIndex,
  onPrev,
  onNext,
  onStartTour,
}) {
  const chapterNumber = currentChapterKey.replace('ch', '');
  const cleanTitle = currentChapterTitle.replace(/^Chapter \d+:\s*/, '');

  return (
    <div className="bento p-3 px-4 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
      <div>
        <span
          id="current-chap-badge"
          className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider block"
          style={{ color: 'var(--index)' }}
        >
          Chapter {chapterNumber}
        </span>
        <h2
          id="current-chap-title"
          className="font-display text-base sm:text-lg font-semibold mt-0.5"
          style={{ color: 'var(--ink)' }}
        >
          {cleanTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <button
          id="btn-start-tour"
          onClick={() => onStartTour(false)}
          className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 border-0"
          style={{
            background: 'var(--index-soft)',
            color: 'var(--index)',
          }}
          title="Start Onboarding Tour Guide"
        >
          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          <span className="hidden sm:inline">Tour Guide</span>
        </button>

        <div id="q-nav-buttons" className="flex items-center gap-2">
          <button
            id="btn-prev-q"
            onClick={onPrev}
            disabled={currentQuestionIndex === 0}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-[var(--paper-raised)] active:scale-95"
            style={{
              background: 'var(--paper)',
              border: '1.5px solid var(--card-line)',
              color: 'var(--ink)',
            }}
            title="Previous Question"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <span
            id="q-number-indicator"
            className="font-mono font-bold px-2 text-xs"
            style={{ color: 'var(--ink-soft)' }}
          >
            Q {currentQuestionIndex + 1} / 30
          </span>

          <button
            id="btn-next-q"
            onClick={onNext}
            disabled={currentQuestionIndex === 29}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-[var(--paper-raised)] active:scale-95"
            style={{
              background: 'var(--paper)',
              border: '1.5px solid var(--card-line)',
              color: 'var(--ink)',
            }}
            title="Next Question"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
