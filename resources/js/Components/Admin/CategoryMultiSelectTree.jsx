import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronDown, Folder, File } from 'lucide-react';

export default function CategoryMultiSelectTree({ categories = [], selectedIds = [], onSelectionChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(() => {
    const ids = new Set();
    const collect = (cats) => cats.forEach(cat => {
      if (cat.children && cat.children.length > 0) {
        ids.add(cat.id);
        collect(cat.children);
      }
    });
    collect(categories);
    return ids;
  });

  const handleToggle = (id) => {
    const next = new Set(expandedNodes);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedNodes(next);
  };

  const handleCheck = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelectionChange(Array.from(next));
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const q = searchTerm.toLowerCase();
    const filter = (cats) => cats.map(cat => {
      const matches = cat.name.toLowerCase().includes(q);
      const filteredChildren = cat.children ? filter(cat.children) : [];
      if (matches || filteredChildren.length > 0) return { ...cat, children: filteredChildren };
      return null;
    }).filter(Boolean);
    return filter(categories);
  }, [categories, searchTerm]);

  function TreeNode({ category, level }) {
    const isExpanded = expandedNodes.has(category.id) || !!searchTerm;
    const isSelected = selectedIds.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const isFolder = level <= 1;
    const indent = level * 16;

    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            paddingLeft: `${12 + indent}px`,
            cursor: 'pointer',
            borderRadius: '6px',
            margin: '1px 6px',
            backgroundColor: isSelected ? 'rgba(59,130,246,0.15)' : 'transparent',
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {/* Expand/collapse arrow */}
          <div
            style={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#475569' }}
            onClick={e => { e.stopPropagation(); if (hasChildren) handleToggle(category.id); }}
          >
            {hasChildren
              ? (isExpanded ? <ChevronDown size={12} color="#64748B" /> : <ChevronRight size={12} color="#64748B" />)
              : <span style={{ width: 12 }} />
            }
          </div>

          {/* Folder / File icon */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            {isFolder
              ? <Folder size={14} color="#FFFFFF" />
              : <File size={13} color="#FFFFFF" />
            }
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleCheck(category.id)}
            onClick={e => e.stopPropagation()}
            style={{ width: '13px', height: '13px', accentColor: '#3B82F6', cursor: 'pointer', flexShrink: 0 }}
          />

          {/* Label */}
          <span
            style={{ fontSize: '13px', color: isSelected ? '#F8FAFC' : '#CBD5E1', flex: 1, userSelect: 'none' }}
            onClick={() => handleCheck(category.id)}
          >
            {category.name}
          </span>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && category.children.map(child => (
          <TreeNode key={child.id} category={child} level={level + 1} />
        ))}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#101827',
      border: '1px solid #1E293B',
      borderRadius: '8px',
      height: '320px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Search */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid #1E293B', position: 'relative' }}>
        <Search size={13} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 10px 6px 28px',
            backgroundColor: '#0C1524',
            border: '1px solid #1E293B',
            borderRadius: '6px',
            color: '#F8FAFC',
            fontSize: '12px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tree */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        {filteredCategories.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>No categories found</div>
        ) : (
          filteredCategories.map(cat => <TreeNode key={cat.id} category={cat} level={0} />)
        )}
      </div>
    </div>
  );
}
