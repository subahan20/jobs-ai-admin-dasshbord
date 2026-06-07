import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Notification({ notification }) {
  if (!notification) return null;

  const { type, text } = notification;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
      type === 'success' 
        ? 'bg-emerald-950/80 border-emerald-800/50 text-emerald-200' 
        : 'bg-red-950/80 border-red-900/50 text-red-200'
    }`}>
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      )}
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}
