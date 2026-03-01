import React from 'react';
import { Note } from '@/app/mock-data';

interface NoteThreadProps {
  notes: Note[];
}

const NoteThread: React.FC<NoteThreadProps> = ({ notes }) => {
  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return '✅';
      case 'rejection':
        return '❌';
      case 'feedback':
      default:
        return '💬';
    }
  };

  const getNoteColor = (type: string) => {
    switch (type) {
      case 'approval':
        return 'bg-green-100/10 border-green-700/30';
      case 'rejection':
        return 'bg-red-100/10 border-red-700/30';
      case 'feedback':
      default:
        return 'bg-blue-100/10 border-blue-700/30';
    }
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No feedback yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`border rounded-lg p-4 ${getNoteColor(note.type)}`}
        >
          <div className="flex items-start gap-3 mb-2">
            <span className="text-lg">{getNoteIcon(note.type)}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{note.author}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{note.text}</p>
        </div>
      ))}
    </div>
  );
};

export default NoteThread;
