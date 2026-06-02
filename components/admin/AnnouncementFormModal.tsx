'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { X, Bold, Italic, List, ListOrdered, Link as LinkIcon, RemoveFormatting } from 'lucide-react';
import { ANNOUNCEMENT_TYPE_LABELS, ANNOUNCEMENT_TYPE_COLOURS } from '@/constants/announcement';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

interface AnnouncementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  announcement?: any | null; // null = create mode
}

const ALL_PROGRAMMES = ['IPMX', 'PGPSM', 'PGPWE', 'DGMP'];

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-surface rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'hover:bg-white text-text-secondary'}`}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'hover:bg-white text-text-secondary'}`}
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'hover:bg-white text-text-secondary'}`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'hover:bg-white text-text-secondary'}`}
      >
        <ListOrdered size={16} />
      </button>
      <div className="w-px h-4 bg-border mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="p-1.5 rounded hover:bg-white text-text-secondary"
        title="Clear formatting"
      >
        <RemoveFormatting size={16} />
      </button>
    </div>
  );
};

export function AnnouncementFormModal({ isOpen, onClose, onSuccess, announcement }: AnnouncementFormModalProps) {
  const isEdit = !!announcement;
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'GENERAL' | 'URGENT' | 'EVENT'>('GENERAL');
  const [targetProgrammes, setTargetProgrammes] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bodyLength, setBodyLength] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write your announcement here...' })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setBodyLength(editor.getText().length);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto p-4',
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && announcement) {
        setTitle(announcement.title);
        setType(announcement.type);
        setTargetProgrammes(announcement.targetProgrammes);
        setIsPinned(announcement.isPinned);
        setExpiryDate(announcement.expiryDate ? announcement.expiryDate.split('T')[0] : '');
        editor?.commands.setContent(announcement.body);
        setBodyLength(editor?.getText().length || 0);
      } else {
        setTitle('');
        setType('GENERAL');
        setTargetProgrammes([]);
        setIsPinned(false);
        setExpiryDate('');
        editor?.commands.setContent('');
        setBodyLength(0);
      }
      setIsPreview(false);
    }
  }, [isOpen, isEdit, announcement, editor]);

  if (!isOpen) return null;

  const handleProgrammeToggle = (prog: string) => {
    if (prog === 'ALL') {
      setTargetProgrammes([]);
    } else {
      let newProgs = [...targetProgrammes];
      if (newProgs.includes(prog)) {
        newProgs = newProgs.filter(p => p !== prog);
      } else {
        newProgs.push(prog);
      }
      if (newProgs.length === ALL_PROGRAMMES.length) {
        setTargetProgrammes([]); // all selected = none selected in DB
      } else {
        setTargetProgrammes(newProgs);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length > 150) {
      toast.error('Title is required (max 150 characters)');
      return;
    }
    if (!editor || editor.isEmpty) {
      toast.error('Announcement body is required');
      return;
    }

    const htmlContent = editor.getHTML();

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        body: htmlContent,
        type,
        targetProgrammes,
        isPinned,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      };

      const url = isEdit ? `/api/admin/announcements/${announcement.id}` : '/api/admin/announcements';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save');

      toast.success(isEdit ? 'Announcement updated' : 'Announcement published');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[720px] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">
            {isEdit ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface transition-colors">
            <X size={20} />
          </button>
        </div>

        <form id="announcement-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="E.g., Welcome to the new semester"
              maxLength={150}
              required
            />
            <div className="text-right text-xs text-text-secondary mt-1">{title.length} / 150</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Type <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-4">
              {(['GENERAL', 'URGENT', 'EVENT'] as const).map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    checked={type === t} 
                    onChange={() => setType(t)}
                    className="text-primary focus:ring-primary"
                  />
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: ANNOUNCEMENT_TYPE_COLOURS[t].bg, color: ANNOUNCEMENT_TYPE_COLOURS[t].text }}
                  >
                    {ANNOUNCEMENT_TYPE_LABELS[t]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Target Audience <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={targetProgrammes.length === 0} 
                  onChange={() => handleProgrammeToggle('ALL')}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">All Programmes</span>
              </label>
              {ALL_PROGRAMMES.map(prog => (
                <label key={prog} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={targetProgrammes.includes(prog)} 
                    onChange={() => handleProgrammeToggle(prog)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-secondary">{prog}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isPinned}
              onClick={() => setIsPinned(!isPinned)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPinned ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPinned ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div>
              <div className="text-sm font-medium text-text-primary">Pin this announcement to the top of the feed</div>
              <div className="text-xs text-text-secondary">Pinned announcements always appear first, regardless of date.</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Expiry Date <span className="text-text-secondary font-normal">(Optional)</span></label>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                min={minDate}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              {expiryDate && (
                <button type="button" onClick={() => setExpiryDate('')} className="text-sm text-red-500 hover:underline">Clear</button>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-1">After this date, the announcement is hidden from students but remains in your admin archive.</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-text-primary">Body <span className="text-red-500">*</span></label>
              <div className="flex bg-surface rounded-lg p-1">
                <button 
                  type="button" 
                  onClick={() => setIsPreview(false)} 
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!isPreview ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Edit
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsPreview(true)} 
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${isPreview ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Preview
                </button>
              </div>
            </div>
            
            {isPreview ? (
              <div 
                className="border border-border rounded-lg p-4 min-h-[241px] max-h-[441px] overflow-y-auto prose prose-sm max-w-none bg-white"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editor?.getHTML() || '') }}
              />
            ) : (
              <div className="border border-border rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            )}
            
            <div className="flex justify-between items-center mt-1 text-xs">
              <span className={`${bodyLength > 4500 ? 'text-red-500 font-medium' : 'text-text-secondary'}`}>
                {bodyLength > 4500 && `Approaching limit — ${5000 - bodyLength} characters remaining`}
              </span>
              <span className="text-text-secondary">{bodyLength} / 5000</span>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between p-6 border-t border-border bg-surface/30">
          <button 
            type="button"
            onClick={onClose} 
            className="px-6 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {isEdit ? 'Cancel' : 'Discard'}
          </button>
          <button 
            type="submit"
            form="announcement-form"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish')}
          </button>
        </div>
      </div>
    </div>
  );
}
