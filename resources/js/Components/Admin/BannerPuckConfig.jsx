import { createConfig } from '@puckeditor/core';

/* ── Animation Options ───────────────────────────────────── */
const ANIMATION_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Fade In', value: 'fade-in' },
  { label: 'Fade Up', value: 'fade-up' },
  { label: 'Zoom In', value: 'zoom-in' },
  { label: 'Slide Left', value: 'slide-left' },
];

/* ── Block Components for Puck Editor ─────────────────────── */
const ImageBlock = {
  type: 'image',
  label: 'Image',
  defaultProps: {
    src: '',
    alt: '',
    objectFit: 'cover',
    animation: 'none',
  },
  fields: [
    {
      type: 'text',
      name: 'src',
      label: 'Image URL',
    },
    {
      type: 'text',
      name: 'alt',
      label: 'Alt Text',
    },
    {
      type: 'select',
      name: 'objectFit',
      label: 'Object Fit',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
        { label: 'Fill', value: 'fill' },
      ],
    },
    {
      type: 'select',
      name: 'animation',
      label: 'Animation',
      options: ANIMATION_OPTIONS,
    },
  ],
  render: ({ src, alt, objectFit }) => (
    <img
      src={src}
      alt={alt}
      style={{ objectFit }}
      className="w-full h-full"
    />
  ),
};

const HeadingBlock = {
  type: 'heading',
  label: 'Heading',
  defaultProps: {
    text: 'Heading Text',
    size: '2xl',
    color: '#FFFFFF',
    animation: 'none',
  },
  fields: [
    {
      type: 'text',
      name: 'text',
      label: 'Text',
    },
    {
      type: 'select',
      name: 'size',
      label: 'Size',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Base', value: 'base' },
        { label: 'Large', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
        { label: '4XL', value: '4xl' },
      ],
    },
    {
      type: 'text',
      name: 'color',
      label: 'Color',
    },
    {
      type: 'select',
      name: 'animation',
      label: 'Animation',
      options: ANIMATION_OPTIONS,
    },
  ],
  render: ({ text, size, color }) => {
    const sizeClasses = {
      sm: 'text-lg',
      base: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
      '2xl': 'text-4xl',
      '3xl': 'text-5xl',
      '4xl': 'text-6xl',
    };
    return (
      <h2
        style={{ color }}
        className={`${sizeClasses[size] || sizeClasses['2xl']} font-bold`}
      >
        {text}
      </h2>
    );
  },
};

const TextBlock = {
  type: 'text',
  label: 'Text',
  defaultProps: {
    text: 'Lorem ipsum dolor sit amet',
    color: '#A8B3CF',
    animation: 'none',
  },
  fields: [
    {
      type: 'textarea',
      name: 'text',
      label: 'Text',
    },
    {
      type: 'text',
      name: 'color',
      label: 'Color',
    },
    {
      type: 'select',
      name: 'animation',
      label: 'Animation',
      options: ANIMATION_OPTIONS,
    },
  ],
  render: ({ text, color }) => (
    <p style={{ color }} className="text-sm leading-relaxed">
      {text}
    </p>
  ),
};

const ButtonBlock = {
  type: 'button',
  label: 'Button',
  defaultProps: {
    label: 'Shop Now',
    href: '/shop',
    variant: 'primary',
    animation: 'none',
  },
  fields: [
    {
      type: 'text',
      name: 'label',
      label: 'Button Label',
    },
    {
      type: 'text',
      name: 'href',
      label: 'Link / URL',
    },
    {
      type: 'select',
      name: 'variant',
      label: 'Variant',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    {
      type: 'select',
      name: 'animation',
      label: 'Animation',
      options: ANIMATION_OPTIONS,
    },
  ],
  render: ({ label, href, variant }) => {
    const variantStyles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-white hover:bg-gray-100 text-gray-900',
      outline: 'border-2 border-white text-white hover:bg-white/10',
    };
    return (
      <a
        href={href}
        className={`${variantStyles[variant] || variantStyles.primary} px-6 py-3 rounded-lg font-medium transition-colors`}
      >
        {label}
      </a>
    );
  },
};

const SpacerBlock = {
  type: 'spacer',
  label: 'Spacer',
  defaultProps: {
    height: 20,
  },
  fields: [
    {
      type: 'number',
      name: 'height',
      label: 'Height (px)',
    },
  ],
  render: ({ height }) => <div style={{ height }} />,
};

/* ── Puck Config ──────────────────────────────────────────── */
export const puckConfig = createConfig({
  root: {
    defaultProps: {
      direction: 'column',
    },
  },
  components: {
    image: ImageBlock,
    heading: HeadingBlock,
    text: TextBlock,
    button: ButtonBlock,
    spacer: SpacerBlock,
  },
});

export default puckConfig;
