import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ChevronsLeft, 
  ChevronsRight, 
  BookOpen, 
  RotateCcw, 
  UserLock, 
  LogOut 
} from 'lucide-react';

export function Sidebar({
  chapters,
  currentChapterKey,
  onSelectChapter,
  chapterStats,
  globalStats,
  userState,
  onResetChapter,
  onOpenAuth,
  currentUser,
  onSignOut
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebarCollapsed') === '1';
    } catch (e) {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebarCollapsed', next ? '1' : '0');
      } catch (e) {}
      return next;
    });
  };

  const chapterKeys = Object.keys(chapters);

  return (
    <aside
      id="sidebar"
      className={`flex-shrink-0 flex flex-col justify-between h-full overflow-hidden relative transition-all duration-200 ${
        isCollapsed ? 'collapsed' : ''
      }`}
      style={{
        background: 'var(--paper-raised)',
        borderRight: '1px solid var(--card-line)',
      }}
    >
      {/* Brand Header */}
      <div
        className="brand-container flex items-center gap-3 px-4 sm:px-5 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--card-line)' }}
      >
        <button
          id="sidebar-toggle"
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-base flex-shrink-0 relative transition-all duration-200 hover:scale-105 active:scale-95 group shadow-sm cursor-pointer border-0 overflow-hidden"
          style={{ background: 'var(--index)', color: '#fff' }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <GraduationCap className="w-5 h-5 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75 group-hover:rotate-12" />
          <div className="absolute transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100">
            {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </div>
        </button>

        {!isCollapsed && (
          <div
            className="min-w-0 sidebar-label cursor-pointer"
            onClick={toggleSidebar}
            title="Toggle sidebar"
          >
            <h1
              className="font-display text-base font-semibold tracking-tight leading-tight truncate"
              style={{ color: 'var(--ink)' }}
            >
              Ethics & Studies
            </h1>
            <p
              className="text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap"
              style={{ color: 'var(--ink-soft)' }}
            >
              210 Questions · 7 Chapters
            </p>
          </div>
        )}
      </div>

      {/* Center Body: Global Stats & Chapter Navigation */}
      <div className="sidebar-body-center flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Global Stats */}
        {!isCollapsed && (
          <div
            className="stats-row flex px-4 sm:px-5 py-3 gap-2.5 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--card-line)' }}
          >
            <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'var(--paper)' }}>
              <span
                className="block text-[9px] uppercase tracking-widest font-bold"
                style={{ color: 'var(--ink-soft)' }}
              >
                Score
              </span>
              <span className="font-mono font-bold text-sm" style={{ color: 'var(--ink)' }}>
                {globalStats.totalCorrect} / {globalStats.totalQuestions}
              </span>
            </div>
            <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'var(--paper)' }}>
              <span
                className="block text-[9px] uppercase tracking-widest font-bold"
                style={{ color: 'var(--ink-soft)' }}
              >
                Accuracy
              </span>
              <span className="font-mono font-bold text-sm" style={{ color: 'var(--index)' }}>
                {globalStats.accuracy}%
              </span>
            </div>
          </div>
        )}

        {/* Chapter List Header */}
        {!isCollapsed && (
          <div className="chapter-intro px-4 sm:px-5 pt-4 pb-2 flex-shrink-0">
            <h2
              className="font-display text-sm font-semibold mb-1 flex items-center gap-2"
              style={{ color: 'var(--ink)' }}
            >
              <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--index)' }} /> Course Chapters
            </h2>
            <p className="text-[11px] mb-2" style={{ color: 'var(--ink-soft)' }}>
              Every chapter has 30 questions.
            </p>
          </div>
        )}

        {/* Chapter Buttons */}
        <div id="chapter-list" className="px-3 sm:px-4 pb-3 space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          {chapterKeys.map((key, index) => {
            const chap = chapters[key];
            const answeredCount = Object.keys(userState[key] || {}).length;
            const isActive = key === currentChapterKey;
            const chapNum = index + 1;
            const shortTitle = chap.title.split(': ')[1] || chap.title;
            const isComplete = answeredCount === 30;

            return (
              <button
                key={key}
                onClick={() => onSelectChapter(key)}
                className={`chapter-btn w-full text-left rounded-xl transition flex flex-col gap-1 relative cursor-pointer ${
                  isCollapsed ? 'p-2 items-center justify-center aspect-square' : 'p-2.5 sm:p-3'
                } ${
                  isActive
                    ? 'active-chap-btn shadow-sm'
                    : 'hover:bg-[var(--paper)]'
                }`}
                style={{
                  border: isActive ? '1.5px solid var(--index)' : '1.5px solid var(--card-line)',
                  background: isActive ? 'var(--index-soft)' : 'var(--paper-raised)',
                }}
                title={`Chapter ${chapNum}: ${shortTitle} (${answeredCount}/30 completed)`}
              >
                {!isCollapsed ? (
                  <div className="full-info w-full flex flex-col gap-0.5">
                    <div className="flex justify-between items-center w-full gap-2">
                      <span
                        className="font-mono font-bold text-xs uppercase tracking-wide"
                        style={{ color: isActive ? 'var(--index)' : 'var(--ink-soft)' }}
                      >
                        Chapter {chapNum}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold"
                        style={{
                          background: isComplete ? 'var(--correct-soft)' : 'var(--paper)',
                          color: isComplete ? 'var(--correct)' : 'var(--ink-soft)',
                          border: isComplete ? 'none' : '1px solid var(--card-line)',
                        }}
                      >
                        {answeredCount}/30
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm line-clamp-1 font-medium truncate" style={{ color: 'var(--ink)' }}>
                      {shortTitle}
                    </span>
                  </div>
                ) : (
                  <div className="mini-info flex flex-col items-center justify-center">
                    <span
                      className="font-mono font-bold text-sm leading-none"
                      style={{ color: isActive ? 'var(--index)' : 'var(--ink)' }}
                    >
                      C{chapNum}
                    </span>
                    <span
                      className="text-[9px] font-mono font-bold leading-tight mt-0.5"
                      style={{ color: isComplete ? 'var(--correct)' : 'var(--ink-soft)' }}
                    >
                      {answeredCount}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter Progress & Reset Action */}
      {!isCollapsed && (
        <div
          className="progress-block px-4 sm:px-5 py-3.5 flex-shrink-0"
          style={{ borderTop: '1px solid var(--card-line)' }}
        >
          <h3
            className="text-xs font-bold mb-2 flex items-center justify-between uppercase tracking-wide"
            style={{ color: 'var(--ink-soft)' }}
          >
            <span>Chapter Progress</span>
            <span className="font-mono text-xs" style={{ color: 'var(--index)' }}>
              {chapterStats.answeredCount}/30
            </span>
          </h3>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--card-line)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${chapterStats.progressPercent}%`,
                background: 'var(--index)',
              }}
            />
          </div>
          <button
            onClick={() => onResetChapter(currentChapterKey)}
            className="mt-3 w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90"
            style={{
              background: 'var(--wrong-soft)',
              color: 'var(--wrong)',
              border: '1px solid #e8cec3',
            }}
            title="Reset Chapter Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" /> <span>Reset Chapter</span>
          </button>
        </div>
      )}

      {/* User Auth & Progress Sync Block */}
      <div
        id="auth-user-block"
        className="auth-user-block px-3 sm:px-5 py-3 flex-shrink-0"
        style={{
          borderTop: '1px solid var(--card-line)',
          background: 'var(--paper-raised)',
        }}
      >
        {!currentUser ? (
          <div className="flex flex-col gap-1.5">
            <button
              id="btn-open-auth"
              onClick={onOpenAuth}
              className="w-full py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-[1.02] active:scale-98"
              style={{
                background: 'var(--index)',
                color: '#fff',
                border: '1px solid var(--index)',
              }}
              title="Sign in to save and sync progress across devices"
            >
              <UserLock className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="auth-btn-label">Sign In / Sync</span>}
            </button>
            {!isCollapsed && (
              <p className="auth-sync-hint text-[10px] text-center" style={{ color: 'var(--ink-soft)' }}>
                Save progress to cloud account
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-serif-instrument text-sm font-bold flex-shrink-0 shadow-xs uppercase"
                style={{
                  background: 'var(--index-soft)',
                  color: 'var(--index)',
                  border: '1.5px solid var(--index)',
                }}
              >
                {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 sidebar-label">
                  <p className="text-xs font-bold truncate leading-tight font-display" style={{ color: 'var(--ink)' }}>
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] font-mono leading-tight mt-0.5" style={{ color: 'var(--correct)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--correct)] inline-block animate-pulse"></span>
                    Cloud Synced
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl text-xs transition cursor-pointer hover:bg-black/5 hover:text-[var(--wrong)]"
              style={{ color: 'var(--ink-soft)' }}
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
