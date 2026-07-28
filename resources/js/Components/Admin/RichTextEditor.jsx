import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder = 'Enter content...', rows = 6, height = null }) {
  return (
    <div>
      {/* Rich Text Editor Toolbar */}
      <div className="bg-[#121C2E] border border-[#1E293B] rounded-t-xl px-4 py-2.5 flex items-center gap-1 flex-wrap">
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <Bold className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <Italic className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <Underline className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[#1E293B] mx-1" />
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <List className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[#1E293B] mx-1" />
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <AlignRight className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[#1E293B] mx-1" />
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <Link className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <ImageIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-[#1E293B] mx-1" />
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <Undo className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#17243B] rounded-lg transition text-[#94A3B8] hover:text-[#F8FAFC]">
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Text Area */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={height ? { height } : {}}
        className="w-full bg-[#0C1524] border border-[#1E293B] border-t-0 rounded-b-xl px-4 py-3 text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] transition-all duration-200 resize-none"
      />
    </div>
  );
}
