"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function Editor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    // FIX: This tells Tiptap NOT to render on the server
    immediatelyRender: false, 
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] border p-4 rounded-md bg-white w-full',
      },
    },
  });

  if (!editor) {
    return <div className="min-h-[400px] border p-4 rounded-md bg-gray-50 animate-pulse">Loading SkyAuthor Editor...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2 border-b pb-2 bg-gray-50 p-2 rounded-t-md">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          B
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          H2
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}