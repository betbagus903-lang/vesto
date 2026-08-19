# Mountain Animation Positioning Guide

## 📁 Folder Structure
```
public/images/mountain/
├── mountain-part-1.jpg    (Background layer - furthest back)
├── mountain-part-2.jpg    (Middle layer)
├── mountain-part-3.jpg    (Front layer - closest)
└── POSITIONING_GUIDE.md   (This file)
```

## 🎨 Image Preparation Tips

### 1. **Image Format**
- Use PNG with transparency for overlapping parts
- Or use JPG if parts don't need transparency
- Recommended size: 1920x1080px or higher for quality
- Consistent aspect ratio across all parts

### 2. **Cutting Strategy**
- Cut mountain horizontally from bottom to top
- Each part should overlap slightly with the next
- Background part should be the widest/fullest
- Front parts can be narrower/more detailed

### 3. **Layer Order (Important!)**
```
Part 1 (Back) → zIndex: 1  → Furthest, should be widest
Part 2 (Middle) → zIndex: 2  → Middle layer
Part 3 (Front) → zIndex: 3  → Closest, can be narrower
```

## 🎯 Positioning Configuration

### Basic Setup Example:
```javascript
const mountainParts = [
  {
    image: '/images/mountain/mountain-part-1.jpg',
    bottomPosition: '0%',      // Start from very bottom
    leftPosition: '0%',       // Start from left edge
    width: '100%',            // Full width
    height: 'auto',           // Maintain aspect ratio
    zIndex: 1                 // Back layer
  },
  {
    image: '/images/mountain/mountain-part-2.jpg',
    bottomPosition: '15%',     // 15% from bottom
    leftPosition: '10%',       // 10% from left
    width: '80%',             // 80% width
    height: 'auto',
    zIndex: 2                 // Middle layer
  },
  {
    image: '/images/mountain/mountain-part-3.jpg',
    bottomPosition: '30%',     // 30% from bottom
    leftPosition: '20%',       // 20% from left
    width: '60%',             // 60% width
    height: 'auto',
    zIndex: 3                 // Front layer
  }
];
```

## 🔧 Development Mode

### Enable Positioning Guides:
```javascript
<MountainAnimation 
  mountainParts={yourMountainParts}
  staggerDelay={0.8}
  showGuides={true}    // 🔧 Set to TRUE to see positioning guides
  containerHeight="400px"
  containerWidth="100%"
/>
```

### What Guides Show:
- **Red borders**: Around each mountain part
- **Red labels**: Part number, bottom position, and z-index
- **Blue grid**: 10x10 positioning grid
- **Container info**: Overall dimensions

## 🎬 Animation Settings

### Stagger Delay Options:
```javascript
staggerDelay={0.5}    // Fast - 0.5s between parts
staggerDelay={0.8}    // Medium - 0.8s between parts (recommended)
staggerDelay={1.0}    // Slow - 1s between parts
staggerDelay={1.5}    // Very slow - 1.5s between parts
```

### Animation Duration:
- Default: 1.2s per part
- Can be modified in the component useEffect

## 🐛 Troubleshooting

### Problem: Parts look disconnected
**Solution**: Increase overlap between parts, adjust bottomPosition

### Problem: Parts overlap wrong order
**Solution**: Check zIndex values - ensure back parts have lower zIndex

### Problem: Parts too wide/narrow
**Solution**: Adjust width percentage for each part

### Problem: Parts not aligned horizontally
**Solution**: Adjust leftPosition and width values

### Problem: Animation too fast/slow
**Solution**: Adjust staggerDelay value

## 📐 Testing Checklist

1. ✅ Enable `showGuides={true}` during development
2. ✅ Check that red borders show correct positioning
3. ✅ Verify zIndex order (back to front)
4. ✅ Test animation timing with different staggerDelay
5. ✅ Disable guides when satisfied: `showGuides={false}`
6. ✅ Test on different screen sizes

## 🎯 Pro Tips

1. **Start Simple**: Begin with 2-3 parts, add more later
2. **Use Guides**: Always enable guides during development
3. **Test Responsive**: Check on mobile and desktop
4. **Consistent Naming**: Use clear file names (part-1, part-2, etc.)
5. **Backup Originals**: Keep original full mountain image for reference

## 🚀 Next Steps

1. Prepare your mountain images
2. Upload to `/public/images/mountain/` folder
3. Configure positioning in Welcome.jsx
4. Enable guides to test positioning
5. Adjust timing and animation
6. Disable guides for production