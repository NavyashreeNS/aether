import React from 'react';
import { X, Bell, Sparkles, MessageSquare, UserPlus, CheckCheck } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifs-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h2 id="notifs-title" className="font-display font-bold text-lg text-white">
                Resonance Influx
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close notifications drawer"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-white/5 text-xs font-mono">
            <span className="text-slate-400">Activity Log</span>
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-white/5 overflow-y-auto max-h-[calc(100vh-12rem)] my-2 pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`py-3.5 flex items-start gap-3 transition-colors ${
                  !notif.read ? 'bg-cyan-500/5 -mx-2 px-2 rounded-xl' : ''
                }`}
              >
                <img
                  src={notif.actor.avatar}
                  alt={notif.actor.name}
                  className="w-8 h-8 rounded-xl object-cover border border-white/10 shrink-0"
                />

                <div className="space-y-1 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-200">{notif.actor.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{notif.timestamp}</span>
                  </div>

                  <p className="font-body text-slate-300 leading-snug">
                    {notif.message}
                  </p>

                  {notif.echoSnippet && (
                    <p className="text-[11px] font-display italic text-slate-400 border-l-2 border-cyan-400/40 pl-2 mt-1 line-clamp-1">
                      "{notif.echoSnippet}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] font-mono text-slate-500">
            Notifications are emitted only for deliberate human resonance.
          </p>
        </div>
      </div>
    </div>
  );
};
