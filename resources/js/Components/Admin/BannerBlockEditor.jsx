import { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Image as ImageIcon, Type, Link as LinkIcon, Minus, Eye } from 'lucide-react';

const THEME = {
    background: '#0A0D14',
    card: '#111827',
    secondaryCard: '#161F2F',
    border: 'rgba(255,255,255,0.08)',
    primaryBlue: '#4F6BFF',
    purple: '#6C63FF',
    white: '#FFFFFF',
    secondaryText: '#A8B3CF',
    muted: '#667085',
    danger: '#EF4444',
};

const ANIMATION_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Fade In', value: 'fade-in' },
  { label: 'Fade Up', value: 'fade-up' },
  { label: 'Zoom In', value: 'zoom-in' },
  { label: 'Slide Left', value: 'slide-left' },
];

const BLOCK_TYPES = [
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'heading', label: 'Heading', icon: Type },
  { type: 'text', label: 'Text', icon: Type },
  { type: 'button', label: 'Button', icon: LinkIcon },
  { type: 'spacer', label: 'Spacer', icon: Minus },
];

export default function BannerBlockEditor({ value, onChange }) {
  const [blocks, setBlocks] = useState(value || []);
  const [expandedBlocks, setExpandedBlocks] = useState({});

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      props: getDefaultProps(type),
      animation: 'none',
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setExpandedBlocks({ ...expandedBlocks, [newBlock.id]: true });
    onChange(newBlocks);
  };

  const removeBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const updateBlock = (index, updates) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const moveBlock = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const toggleExpanded = (blockId) => {
    setExpandedBlocks({ ...expandedBlocks, [blockId]: !expandedBlocks[blockId] });
  };

  return (
    <div className="space-y-4">
      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2">
        {BLOCK_TYPES.map((blockType) => {
          const Icon = blockType.icon;
          return (
            <button
              key={blockType.type}
              type="button"
              onClick={() => addBlock(blockType.type)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, color: THEME.white, border: `1px solid ${THEME.border}` }}
            >
              <Icon className="w-4 h-4" />
              {blockType.label}
            </button>
          );
        })}
      </div>

      {/* Blocks List */}
      {blocks.length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: THEME.muted }}>
          No blocks added yet. Click a button above to add a block.
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <BlockEditorItem
              key={block.id}
              block={block}
              index={index}
              isExpanded={expandedBlocks[block.id]}
              onToggle={() => toggleExpanded(block.id)}
              onUpdate={(updates) => updateBlock(index, updates)}
              onRemove={() => removeBlock(index)}
              onMoveUp={() => moveBlock(index, index - 1)}
              onMoveDown={() => moveBlock(index, index + 1)}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BlockEditorItem({ block, index, isExpanded, onToggle, onUpdate, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: THEME.card, border: `1px solid ${THEME.border}` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {!isFirst && (
              <button
                type="button"
                onClick={onMoveUp}
                className="p-1 transition-colors"
                style={{ color: THEME.secondaryText }}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
            {!isLast && (
              <button
                type="button"
                onClick={onMoveDown}
                className="p-1 transition-colors"
                style={{ color: THEME.secondaryText }}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
          <GripVertical className="w-4 h-4" style={{ color: THEME.muted }} />
          <span className="text-sm font-medium capitalize" style={{ color: THEME.white }}>{block.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="p-1 transition-colors"
            style={{ color: THEME.secondaryText }}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 transition-colors"
            style={{ color: THEME.danger }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <BlockFields block={block} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function BlockFields({ block, onUpdate }) {
  const { props, animation } = block;

  return (
    <>
      {/* Animation */}
      <div>
        <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Animation</label>
        <select
          value={animation}
          onChange={(e) => onUpdate({ animation: e.target.value })}
          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
          style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
        >
          {ANIMATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Type-specific fields */}
      {block.type === 'image' && (
        <>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Image URL</label>
            <input
              type="text"
              value={props.src || ''}
              onChange={(e) => onUpdate({ props: { ...props, src: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Alt Text</label>
            <input
              type="text"
              value={props.alt || ''}
              onChange={(e) => onUpdate({ props: { ...props, alt: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
              placeholder="Image description"
            />
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Object Fit</label>
            <select
              value={props.objectFit || 'cover'}
              onChange={(e) => onUpdate({ props: { ...props, objectFit: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>
        </>
      )}

      {block.type === 'heading' && (
        <>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Text</label>
            <input
              type="text"
              value={props.text || ''}
              onChange={(e) => onUpdate({ props: { ...props, text: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
              placeholder="Heading text"
            />
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Size</label>
            <select
              value={props.size || '2xl'}
              onChange={(e) => onUpdate({ props: { ...props, size: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
            >
              <option value="xl">XL</option>
              <option value="2xl">2XL</option>
              <option value="3xl">3XL</option>
              <option value="4xl">4XL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Color</label>
            <input
              type="color"
              value={props.color || '#FFFFFF'}
              onChange={(e) => onUpdate({ props: { ...props, color: e.target.value } })}
              className="w-full h-10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
            />
          </div>
        </>
      )}

      {block.type === 'text' && (
        <>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Text</label>
            <textarea
              value={props.text || ''}
              onChange={(e) => onUpdate({ props: { ...props, text: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
              rows={3}
              placeholder="Text content"
            />
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Color</label>
            <input
              type="color"
              value={props.color || '#A8B3CF'}
              onChange={(e) => onUpdate({ props: { ...props, color: e.target.value } })}
              className="w-full h-10 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
            />
          </div>
        </>
      )}

      {block.type === 'button' && (
        <>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Label</label>
            <input
              type="text"
              value={props.label || ''}
              onChange={(e) => onUpdate({ props: { ...props, label: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
              placeholder="Button text"
            />
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Link</label>
            <input
              type="text"
              value={props.href || ''}
              onChange={(e) => onUpdate({ props: { ...props, href: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Variant</label>
            <select
              value={props.variant || 'primary'}
              onChange={(e) => onUpdate({ props: { ...props, variant: e.target.value } })}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
            </select>
          </div>
        </>
      )}

      {block.type === 'spacer' && (
        <div>
          <label className="block text-xs mb-2" style={{ color: THEME.secondaryText }}>Height (px)</label>
          <input
            type="number"
            value={props.height || 20}
            onChange={(e) => onUpdate({ props: { ...props, height: parseInt(e.target.value) } })}
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
            style={{ backgroundColor: THEME.secondaryCard, border: `1px solid ${THEME.border}`, color: THEME.white }}
            min="0"
            max="200"
          />
        </div>
      )}
    </>
  );
}

function getDefaultProps(type) {
  switch (type) {
    case 'image':
      return { src: '', alt: '', objectFit: 'cover' };
    case 'heading':
      return { text: '', size: '2xl', color: '#FFFFFF' };
    case 'text':
      return { text: '', color: '#A8B3CF' };
    case 'button':
      return { label: '', href: '', variant: 'primary' };
    case 'spacer':
      return { height: 20 };
    default:
      return {};
  }
}
