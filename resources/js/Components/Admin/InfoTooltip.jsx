import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';

/**
 * InfoTooltip — reusable rich tooltip component.
 *
 * Props:
 *   title       {string}              — bold heading inside tooltip
 *   content     {string|ReactNode}    — body text (supports \n for line breaks when string)
 *   iconSize    {number}              — icon px, default 13
 *   iconColor   {string}              — icon color, default '#64748B'
 *   maxWidth    {number}              — tooltip max-width px, default 320
 *
 * Behaviour:
 *   • Desktop : show on mouseenter, hide on mouseleave
 *   • Mobile  : toggle on click/tap
 *   • Auto-positions to stay inside viewport (flips left/right & up/down)
 *   • Fade + slide-up animation on enter
 *   • Pressing Escape closes tooltip
 */
export default function InfoTooltip({
  title,
  content,
  iconSize  = 13,
  iconColor = '#64748B',
  maxWidth  = 320,
}) {
  const [visible, setVisible]   = useState(false);
  const [pos, setPos]           = useState({ top: 0, left: 0, flip: false });
  const iconRef                 = useRef(null);
  const tipRef                  = useRef(null);
  const hideTimer               = useRef(null);

  /* ── close on Escape ──────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    const handle = (e) => { if (e.key === 'Escape') setVisible(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [visible]);

  /* ── close on outside click (mobile) ─────────────────── */
  useEffect(() => {
    if (!visible) return;
    const handle = (e) => {
      if (iconRef.current?.contains(e.target)) return;
      if (tipRef.current?.contains(e.target))  return;
      setVisible(false);
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [visible]);

  /* ── calculate position ───────────────────────────────── */
  const calcPos = useCallback(() => {
    if (!iconRef.current) return;
    const rect    = iconRef.current.getBoundingClientRect();
    const vw      = window.innerWidth;
    const vh      = window.innerHeight;
    const tipW    = maxWidth;
    const tipH    = 260; // approx

    // horizontal: prefer right of icon, flip left if not enough room
    let left = rect.right + 10;
    let flipX = false;
    if (left + tipW > vw - 12) {
      left  = rect.left - tipW - 10;
      flipX = true;
    }
    // ensure never off left edge
    if (left < 8) left = 8;

    // vertical: align to icon top, shift up if overflow bottom
    let top = rect.top + window.scrollY;
    if (rect.top + tipH > vh - 12) {
      top = rect.bottom + window.scrollY - tipH;
    }
    if (top < 8 + window.scrollY) top = 8 + window.scrollY;

    setPos({ top, left, flipX });
  }, [maxWidth]);

  const show = () => {
    clearTimeout(hideTimer.current);
    calcPos();
    setVisible(true);
  };

  const hide = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 120);
  };

  const toggleMobile = (e) => {
    e.stopPropagation();
    if (visible) { setVisible(false); return; }
    calcPos();
    setVisible(true);
  };

  /* ── render content lines ─────────────────────────────── */
  const renderContent = () => {
    if (typeof content !== 'string') return content;
    // split on \n, render paragraphs and indent bullet lines
    return content.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <div key={i} style={{ height: '6px' }} />;

      // section headers (ends with ':' and short)
      if (trimmed.endsWith(':') && trimmed.length < 40 && !trimmed.startsWith('•') && !trimmed.startsWith('✔')) {
        return (
          <p key={i} style={{ margin: '8px 0 2px', fontSize: '11px', fontWeight: '700',
            color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {trimmed}
          </p>
        );
      }

      // bullet / check lines
      if (trimmed.startsWith('•') || trimmed.startsWith('✔') || trimmed.startsWith('↓')) {
        return (
          <p key={i} style={{ margin: '2px 0', fontSize: '12px', color: '#CBD5E1',
            paddingLeft: '12px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <span style={{ color: '#3B82F6', flexShrink: 0 }}>{trimmed.slice(0, 1)}</span>
            <span>{trimmed.slice(1).trim()}</span>
          </p>
        );
      }

      // Tips line
      if (trimmed.startsWith('Tips:') || trimmed.startsWith('Tips :')) {
        return (
          <p key={i} style={{ margin: '8px 0 2px', fontSize: '12px', color: '#60A5FA',
            fontWeight: '600', display: 'flex', gap: '5px', alignItems: 'center' }}>
            💡 {trimmed}
          </p>
        );
      }

      // normal line
      return (
        <p key={i} style={{ margin: '2px 0', fontSize: '12px', color: '#CBD5E1', lineHeight: '1.6' }}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      {/* ── trigger icon ── */}
      <span
        ref={iconRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={toggleMobile}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'help', color: iconColor, flexShrink: 0,
          borderRadius: '50%',
          transition: 'color 0.15s',
        }}
        onMouseOver={e => e.currentTarget.style.color = '#3B82F6'}
        onMouseOut={e => e.currentTarget.style.color = iconColor}
      >
        <Info size={iconSize} />
      </span>

      {/* ── tooltip portal — rendered via fixed positioning ── */}
      {visible && (
        <div
          ref={tipRef}
          onMouseEnter={() => clearTimeout(hideTimer.current)}
          onMouseLeave={hide}
          style={{
            position:  'fixed',
            top:       pos.top,
            left:      pos.left,
            zIndex:    9999,
            maxWidth:  maxWidth,
            width:     'max-content',

            /* design */
            backgroundColor: '#0F172A',
            border:          '1px solid #334155',
            borderRadius:    '10px',
            boxShadow:       '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)',
            padding:         '14px 16px',
            pointerEvents:   'auto',

            /* animation */
            animation: 'tipIn 0.18s ease both',
          }}
        >
          {/* header rule */}
          {title && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                <Info size={13} style={{ color: '#3B82F6', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#F1F5F9' }}>
                  {title}
                </span>
              </div>
              <div style={{ height: '1px', backgroundColor: '#1E293B', marginBottom: '10px' }} />
            </>
          )}

          {/* body */}
          <div style={{ maxWidth: maxWidth - 32 }}>
            {renderContent()}
          </div>
        </div>
      )}

      {/* animation keyframes injected once */}
      <style>{`
        @keyframes tipIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
