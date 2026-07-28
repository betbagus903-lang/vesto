import React, { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCenter, useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Save, Plus, Trash2, GripVertical, Search, ChevronDown, ChevronRight, X, Layers } from 'lucide-react';

/* ─── Bagisto default groups split: left (Main) / right (Side) ─── */
const MAIN_GROUPS = ['General', 'Description', 'Meta', 'SEO'];
const SIDE_GROUPS = ['Price', 'Shipping', 'Inventory', 'Settings', 'RMA'];

const TYPE_BADGE = {
  text: '#3B82F6', textarea: '#8B5CF6', boolean: '#10B981',
  select: '#F59E0B', multiselect: '#F97316', price: '#22C55E',
  date: '#06B6D4', datetime: '#14B8A6', image: '#EC4899',
};

/* ─── shared styles ─────────────────────────────────────────────── */
const S = {
  page: { backgroundColor: '#0F172A', minHeight: '100vh', padding: '24px 28px' },
  card: { backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', marginBottom: '12px', overflow: 'hidden' },
  cardHeader: { padding: '12px 16px', borderBottom: '1px solid #334155', fontSize: '13px', fontWeight: '600', color: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardBody: { padding: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '500', color: '#94A3B8', marginBottom: '5px' },
  input: (err) => ({ width: '100%', padding: '8px 11px', backgroundColor: '#0F172A', border: `1px solid ${err ? '#EF4444' : '#334155'}`, borderRadius: '6px', color: '#F1F5F9', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }),
  hint: { fontSize: '11px', color: '#64748B', marginTop: '3px' },
  err: { fontSize: '11px', color: '#EF4444', marginTop: '3px' },
  btnBlue: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', backgroundColor: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer' },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', backgroundColor: 'transparent', color: '#94A3B8', border: '1px solid #334155', cursor: 'pointer' },
  btnDanger: { background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', padding: '2px' },
};

/* ─── SortableAttribute: one draggable row inside a group ──────── */
function SortableAttribute({ id, attr, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const color = TYPE_BADGE[attr?.type] || '#64748B';
  return (
    <div ref={setNodeRef} style={{ ...style, display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '6px', marginBottom: '4px' }}>
      <span {...attributes} {...listeners} style={{ cursor: 'grab', color: '#475569', display: 'flex' }}>
        <GripVertical size={13} />
      </span>
      <span style={{ flex: 1, fontSize: '13px', color: '#E2E8F0' }}>{attr?.admin_name}</span>
      <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '10px', backgroundColor: color + '20', color, border: `1px solid ${color}40` }}>{attr?.type}</span>
      {attr?.is_required && <span style={{ fontSize: '10px', color: '#F87171' }}>req</span>}
      <button type="button" onClick={onRemove} style={S.btnDanger}><X size={12} /></button>
    </div>
  );
}

/* ─── DroppableGroup: a group panel inside a column ─────────────── */
function DroppableGroup({ groupId, group, attrs, onRename, onDelete, onToggle, expanded, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: groupId });
  const [editing, setEditing] = useState(false);
  const [tmpName, setTmpName] = useState(group.name);

  const commitName = () => { onRename(tmpName || group.name); setEditing(false); };

  return (
    <div style={{ ...S.card, outline: isOver ? '2px solid #3B82F6' : 'none', marginBottom: '8px' }}>
      {/* Group header */}
      <div style={S.cardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <button type="button" onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', padding: 0 }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {editing ? (
            <input autoFocus value={tmpName} onChange={e => setTmpName(e.target.value)}
              onBlur={commitName} onKeyDown={e => e.key === 'Enter' && commitName()}
              style={{ ...S.input(false), height: '24px', padding: '2px 8px', fontSize: '13px', flex: 1 }} />
          ) : (
            <span onDoubleClick={() => { setTmpName(group.name); setEditing(true); }}
              style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9', cursor: 'text', userSelect: 'none' }}
              title="Double-click to rename">
              {group.name}
            </span>
          )}
          <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '2px' }}>({attrs.length})</span>
        </div>
        <button type="button" onClick={onDelete} style={{ ...S.btnDanger, marginLeft: '8px' }}><Trash2 size={13} /></button>
      </div>

      {/* Group body — droppable zone */}
      {expanded && (
        <div ref={setNodeRef} style={{ padding: '10px', minHeight: '48px' }}>
          {children}
          {attrs.length === 0 && (
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', padding: '8px 0' }}>
              Drop attributes here or drag from panel →
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── DraggableUnassigned: card in the unassigned panel ─────────── */
function DraggableUnassigned({ attr }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `unassigned-${attr.id}` });
  const color = TYPE_BADGE[attr.type] || '#64748B';
  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1,
        padding: '8px 10px', backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '6px',
        marginBottom: '4px', cursor: 'grab', userSelect: 'none' }}
      {...attributes} {...listeners}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <GripVertical size={12} style={{ color: '#475569', flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: '12px', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attr.admin_name}</span>
        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: color + '20', color, border: `1px solid ${color}40`, flexShrink: 0 }}>{attr.type}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#475569', marginLeft: '18px', marginTop: '1px' }}>{attr.code}</div>
    </div>
  );
}

/* ─── Overlay ghost card ─────────────────────────────────────────── */
function DragGhost({ attr }) {
  if (!attr) return null;
  const color = TYPE_BADGE[attr.type] || '#64748B';
  return (
    <div style={{ padding: '8px 12px', backgroundColor: '#1E3A5F', border: '2px solid #3B82F6', borderRadius: '6px', minWidth: '160px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <GripVertical size={12} style={{ color: '#93C5FD' }} />
        <span style={{ flex: 1, fontSize: '12px', color: '#E2E8F0' }}>{attr.admin_name}</span>
        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: color + '20', color }}>{attr.type}</span>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN COMPONENT ════════════════════════════ */
export default function CreateAttributeFamily({ allAttributes }) {
  const attrs = allAttributes || [];

  const [formData, setFormData] = useState({ code: '', name: '' });
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');

  /* groups: { id(tmp), name, column('main'|'side'), attrIds[] } */
  const [groups, setGroups] = useState(() => [
    ...MAIN_GROUPS.map((name, i) => ({ id: `g-main-${i}`, name, column: 'main', attrIds: [], expanded: true })),
    ...SIDE_GROUPS.map((name, i) => ({ id: `g-side-${i}`, name, column: 'side', attrIds: [], expanded: true })),
  ]);

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  /* ── derived ─────────────────────────────────────────── */
  const assignedIds = groups.flatMap(g => g.attrIds);
  const unassigned  = attrs.filter(a => !assignedIds.includes(a.id));
  const filtered    = unassigned.filter(a =>
    !search.trim() ||
    a.admin_name.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase())
  );

  const getAttr   = id => attrs.find(a => a.id === id);
  const mainGroups = groups.filter(g => g.column === 'main');
  const sideGroups = groups.filter(g => g.column === 'side');

  /* ── group mutations ─────────────────────────────────── */
  const addGroup = (column) => {
    const id = `g-${column}-${Date.now()}`;
    setGroups(p => [...p, { id, name: 'New Group', column, attrIds: [], expanded: true }]);
  };

  const delGroup = (gId) =>
    setGroups(p => p.filter(g => g.id !== gId));

  const renameGroup = (gId, name) =>
    setGroups(p => p.map(g => g.id === gId ? { ...g, name } : g));

  const toggleGroup = (gId) =>
    setGroups(p => p.map(g => g.id === gId ? { ...g, expanded: !g.expanded } : g));

  const removeAttrFromGroup = (gId, attrId) =>
    setGroups(p => p.map(g => g.id === gId ? { ...g, attrIds: g.attrIds.filter(id => id !== attrId) } : g));

  /* ── DnD handlers ────────────────────────────────────── */
  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = useCallback(({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const activeStr = String(active.id);
    const overStr   = String(over.id);

    /* Case 1: dragging from unassigned panel → drop on a group zone */
    if (activeStr.startsWith('unassigned-')) {
      const attrId  = active.id.toString().replace('unassigned-', '');
      const numId   = parseInt(attrId, 10);
      const targetG = groups.find(g => g.id === overStr || g.attrIds.map(String).includes(overStr));
      if (!targetG) return;
      if (targetG.attrIds.includes(numId)) return; // already assigned
      setGroups(p => p.map(g => g.id === targetG.id ? { ...g, attrIds: [...g.attrIds, numId] } : g));
      return;
    }

    /* Case 2: reordering within same group */
    const sourceGroup = groups.find(g => g.attrIds.map(String).includes(activeStr));
    const destGroup   = groups.find(g => g.id === overStr || g.attrIds.map(String).includes(overStr));

    if (!sourceGroup) return;

    if (sourceGroup.id === destGroup?.id) {
      /* reorder within group */
      const oldIdx = sourceGroup.attrIds.map(String).indexOf(activeStr);
      const newIdx = sourceGroup.attrIds.map(String).indexOf(overStr);
      if (oldIdx === newIdx) return;
      const reordered = arrayMove(sourceGroup.attrIds, oldIdx, newIdx);
      setGroups(p => p.map(g => g.id === sourceGroup.id ? { ...g, attrIds: reordered } : g));
    } else if (destGroup) {
      /* move to different group */
      const attrId = parseInt(activeStr, 10);
      setGroups(p => p.map(g => {
        if (g.id === sourceGroup.id) return { ...g, attrIds: g.attrIds.filter(id => id !== attrId) };
        if (g.id === destGroup.id)   return { ...g, attrIds: [...g.attrIds, attrId] };
        return g;
      }));
    }
  }, [groups]);

  /* ── submit ──────────────────────────────────────────── */
  const submit = (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    router.post('/admin/attribute-families', {
      code:   formData.code,
      name:   formData.name,
      groups: groups.map((g, i) => ({
        name:          g.name,
        position:      i,
        attribute_ids: g.attrIds,
      })),
    }, {
      onSuccess: () => router.visit('/admin/attribute-families'),
      onFinish: () => setSaving(false),
      onError:  (e) => { setErrors(e); setSaving(false); },
    });
  };

  /* ── active drag attr ────────────────────────────────── */
  const activeAttr = (() => {
    if (!activeId) return null;
    const str = String(activeId);
    if (str.startsWith('unassigned-')) return getAttr(parseInt(str.replace('unassigned-', ''), 10));
    return getAttr(parseInt(str, 10));
  })();

  /* ── column renderer ─────────────────────────────────── */
  const renderColumn = (colGroups, column) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* column header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {column === 'main' ? 'Main Column' : 'Right Side Column'}
        </span>
        <button type="button" onClick={() => addGroup(column)}
          style={{ ...S.btnGhost, padding: '4px 10px', fontSize: '12px' }}>
          <Plus size={12} /> Add Group
        </button>
      </div>

      {colGroups.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed #334155', borderRadius: '8px', color: '#475569', fontSize: '13px' }}>
          No groups. Click Add Group.
        </div>
      )}

      {colGroups.map(group => (
        <SortableContext key={group.id} items={group.attrIds.map(String)} strategy={verticalListSortingStrategy}>
          <DroppableGroup
            groupId={group.id}
            group={group}
            attrs={group.attrIds.map(id => getAttr(id)).filter(Boolean)}
            onRename={name => renameGroup(group.id, name)}
            onDelete={() => delGroup(group.id)}
            onToggle={() => toggleGroup(group.id)}
            expanded={group.expanded}
          >
            {group.expanded && group.attrIds.map(attrId => {
              const attr = getAttr(attrId);
              if (!attr) return null;
              return (
                <SortableAttribute
                  key={String(attrId)}
                  id={String(attrId)}
                  attr={attr}
                  onRemove={() => removeAttrFromGroup(group.id, attrId)}
                />
              );
            })}
          </DroppableGroup>
        </SortableContext>
      ))}
    </div>
  );

  /* ── render ──────────────────────────────────────────── */
  return (
    <AdminLayout>
      <div style={S.page}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <nav style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', gap: '6px' }}>
              <a href="/admin/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Dashboard</a>
              <span>/</span>
              <a href="/admin/attribute-families" style={{ color: '#64748B', textDecoration: 'none' }}>Attribute Families</a>
              <span>/</span>
              <span style={{ color: '#94A3B8' }}>Create</span>
            </nav>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Create Attribute Family</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="/admin/attribute-families" style={S.btnGhost}>Back</a>
            <button onClick={submit} disabled={saving} style={{ ...S.btnBlue, opacity: saving ? 0.6 : 1 }}>
              {saving ? <><span style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />Saving…</> : <><Save size={14} />Save Family</>}
            </button>
          </div>
        </div>

        <form onSubmit={submit}>
          {/* General card */}
          <div style={S.card}>
            <div style={S.cardHeader}><span>General</span></div>
            <div style={{ ...S.cardBody, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={S.label}>Family Code <span style={{ color: '#EF4444' }}>*</span></label>
                <input style={S.input(!!errors.code)} value={formData.code}
                  onChange={e => setFormData(p => ({ ...p, code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+/, '') }))}
                  placeholder="e.g. clothing"
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = errors.code ? '#EF4444' : '#334155'} />
                <p style={S.hint}>Lowercase, numbers, underscores only.</p>
                {errors.code && <p style={S.err}>{errors.code}</p>}
              </div>
              <div>
                <label style={S.label}>Family Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input style={S.input(!!errors.name)} value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Clothing"
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = errors.name ? '#EF4444' : '#334155'} />
                {errors.name && <p style={S.err}>{errors.name}</p>}
              </div>
            </div>
          </div>

          {/* DnD area */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

              {/* Main Column */}
              {renderColumn(mainGroups, 'main')}

              {/* Right Side Column */}
              {renderColumn(sideGroups, 'side')}

              {/* Unassigned Attributes panel */}
              <div style={{ width: '260px', flexShrink: 0, position: 'sticky', top: '16px' }}>
                <div style={{ ...S.card, marginBottom: 0 }}>
                  <div style={S.cardHeader}>
                    <span>Unassigned Attributes</span>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>{filtered.length}</span>
                  </div>
                  <div style={{ padding: '10px' }}>
                    {/* search */}
                    <div style={{ position: 'relative', marginBottom: '8px' }}>
                      <Search size={13} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                      <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search…"
                        style={{ ...S.input(false), paddingLeft: '28px', fontSize: '12px' }} />
                    </div>

                    {/* list */}
                    <SortableContext items={filtered.map(a => `unassigned-${a.id}`)} strategy={verticalListSortingStrategy}>
                      <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                        {filtered.length === 0 ? (
                          <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', padding: '20px 0' }}>
                            {unassigned.length === 0 ? 'All attributes assigned.' : 'No results.'}
                          </p>
                        ) : filtered.map(attr => (
                          <DraggableUnassigned key={attr.id} attr={attr} />
                        ))}
                      </div>
                    </SortableContext>

                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #1E293B', fontSize: '11px', color: '#475569' }}>
                      {assignedIds.length} assigned · {unassigned.length} unassigned
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <DragOverlay><DragGhost attr={activeAttr} /></DragOverlay>
          </DndContext>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminLayout>
  );
}
