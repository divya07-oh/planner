import React, { useState, useEffect, useRef } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Button } from '../components/UI';
import {
  Search,
  Plus,
  Trash2,
  Save,
  Tag as TagIcon,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = usePlanner();

  // Selection states
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Editor Panel Form states
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // Reference for active selected note
  const currentNote = notes.find(n => n.id === selectedNoteId);

  // Set default selection when notes loads
  useEffect(() => {
    if (notes.length > 0 && selectedNoteId === null) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  // Load selected note details into editor
  useEffect(() => {
    if (currentNote) {
      setEditorTitle(currentNote.title);
      setEditorContent(currentNote.content);
      setEditorTags(currentNote.tags);
      setIsSaved(true);
    } else if (notes.length === 0) {
      setEditorTitle('');
      setEditorContent('');
      setEditorTags([]);
      setIsSaved(true);
    }
  }, [selectedNoteId, currentNote, notes.length]);

  // AUTO-SAVE DEBOUNCE EFFECT
  const saveTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (!selectedNoteId || !currentNote) return;

    // Detect if content actually changed
    const hasChanged =
      editorTitle !== currentNote.title ||
      editorContent !== currentNote.content ||
      JSON.stringify(editorTags) !== JSON.stringify(currentNote.tags);

    if (hasChanged) {
      setIsSaved(false);

      // Debounce saving by 1.5 seconds
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(() => {
        updateNote(selectedNoteId, editorTitle, editorContent, editorTags);
        setIsSaved(true);
      }, 1500);
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [editorTitle, editorContent, editorTags, selectedNoteId, currentNote, updateNote]);

  // Gather all unique tags from notes
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(t => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [notes]);

  // Filter notes based on search query and tag selection
  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = () => {
    const newNote = {
      title: 'Untitled Note',
      content: '',
      tags: ['Personal'],
    };
    addNote(newNote);
    
    // Select newly created note
    setTimeout(() => {
      if (notes.length > 0) {
        setSelectedNoteId(notes[0].id);
      }
    }, 50);

    confetti({
      particleCount: 30,
      spread: 20,
      origin: { x: 0.15, y: 0.8 }
    });
  };

  const handleManualSave = () => {
    if (!selectedNoteId) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    updateNote(selectedNoteId, editorTitle, editorContent, editorTags);
    setIsSaved(true);
    
    confetti({
      particleCount: 40,
      spread: 30,
      colors: ['#4F46E5', '#10B981'],
      origin: { y: 0.9 }
    });
  };

  const handleDelete = () => {
    if (!selectedNoteId) return;
    deleteNote(selectedNoteId);
    
    // Select next note
    const currentIndex = notes.findIndex(n => n.id === selectedNoteId);
    let nextNoteId: string | null = null;
    if (notes.length > 1) {
      if (currentIndex === notes.length - 1) {
        nextNoteId = notes[currentIndex - 1].id;
      } else {
        nextNoteId = notes[currentIndex + 1].id;
      }
    }
    setSelectedNoteId(nextNoteId);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const tag = newTagInput.trim();
      if (!editorTags.includes(tag)) {
        setEditorTags(prev => [...prev, tag]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditorTags(prev => prev.filter(t => t !== tag));
  };

  const formatNoteTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8 h-[calc(100vh-80px)] max-w-[1600px] mx-auto w-full overflow-hidden select-none">
      
      {/* Left Panel: Note List & Search Sidebar */}
      <div className="w-full md:w-80 glass-panel rounded-2xl p-4 flex flex-col h-[280px] md:h-full overflow-hidden shadow-sm bg-white">
        
        {/* Header Search & Actions */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            onClick={handleCreateNote}
            className="p-2 bg-primary hover:bg-[#1D4ED8] text-white rounded-xl shadow-sm cursor-pointer transition-colors"
            title="Create note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Tag Filters list */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 border-b border-slate-100 scrollbar-thin">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
              selectedTag === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            All Notes
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedTag === tag
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Notes list pane */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scroll-smooth">
          {filteredNotes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <FileText className="w-6 h-6 opacity-30 mb-2" />
              <p className="text-xs">No notes found.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full p-3.5 text-left rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer relative overflow-hidden group bg-white ${
                  selectedNoteId === note.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-800 truncate pr-4">
                  {note.title || 'Untitled Note'}
                </h4>
                
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                  {note.content.replace(/[#*`_-]/g, '') || 'Empty note...'}
                </p>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[8px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatNoteTime(note.updatedAt)}
                  </span>
                  
                  <div className="flex gap-1 overflow-hidden">
                    {note.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[8px] font-extrabold text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Note Editor Area */}
      <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col h-[calc(100%-300px)] md:h-full overflow-hidden shadow-sm bg-white border border-slate-200">
        {selectedNoteId && currentNote ? (
          <div className="flex flex-col h-full gap-4">
            
            {/* Editor Action Header Row */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">
                  <FileText className="w-5 h-5" />
                </span>
                
                {/* Auto-save Saving indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Workspace</span>
                  {isSaved ? (
                    <span className="text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-success" /> Saved
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full animate-pulse">
                      Saving...
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSave}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-slate-400 hover:text-danger hover:bg-danger/5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Note Title Input */}
            <input
              type="text"
              value={editorTitle}
              onChange={(e) => setEditorTitle(e.target.value)}
              placeholder="Give your note a title..."
              className="text-lg font-bold bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 w-full"
            />

            {/* Tags creation editor row */}
            <div className="flex flex-wrap gap-2 items-center py-2 bg-slate-50 px-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                <TagIcon className="w-3.5 h-3.5" />
                <span>Tags:</span>
              </div>

              {editorTags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center bg-slate-100 text-[10px] font-bold text-slate-600 pl-2 pr-1.5 py-0.5 rounded-lg border border-slate-200"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-slate-400 hover:text-slate-700 font-extrabold focus:outline-none cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}

              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Press Enter to add tag"
                className="text-[10px] font-semibold bg-transparent border-none focus:outline-none text-slate-600 min-w-[120px] placeholder-slate-400"
              />
            </div>

            {/* Content Textarea */}
            <div className="flex-1 min-h-[220px]">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="Write your reflection, task details, or general notes. Markdown headers, quotes, and bullets are visually supported..."
                className="w-full h-full bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder-slate-400 font-sans resize-none leading-relaxed"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-24">
            <FileText className="w-10 h-10 opacity-30 mb-2" />
            <h4 className="text-sm font-bold text-slate-500">No Note Selected</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Choose an existing document from the left list or create a blank one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
