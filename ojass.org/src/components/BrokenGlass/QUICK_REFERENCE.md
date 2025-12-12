# BrokenGlass Component - Quick Reference

## Import

```tsx
import BrokenGlass from '@/components/BrokenGlass';
// or
import BrokenGlass, { BrokenGlassProps } from '@/components/BrokenGlass';
```

## Minimal Usage

```tsx
<BrokenGlass imageSrc="/your-image.png" />
```

## All Props

```tsx
<BrokenGlass 
  imageSrc="/image.png"        // Required: Image path or URL
  rows={12}                     // Optional: Grid rows (default: 12)
  cols={12}                     // Optional: Grid columns (default: 12)
  width={800}                   // Optional: Canvas width in px (default: 800)
  height={800}                  // Optional: Canvas height in px (default: 800)
  initialAssembled={false}      // Optional: Start assembled? (default: false)
  showControls={true}           // Optional: Show UI controls? (default: true)
  clickToToggle={true}          // Optional: Click to toggle? (default: true)
  className=""                  // Optional: Custom CSS class
  onToggle={(assembled) => {}}  // Optional: Callback on state change
/>
```

## Common Patterns

### Hero Section
```tsx
<BrokenGlass 
  imageSrc="/hero.jpg"
  showControls={false}
  initialAssembled={true}
  width={1920}
  height={1080}
/>
```

### Gallery Item
```tsx
<BrokenGlass 
  imageSrc="/gallery/photo.jpg"
  rows={15}
  cols={15}
  showControls={false}
  clickToToggle={true}
/>
```

### Interactive Demo
```tsx
<BrokenGlass 
  imageSrc="/demo.png"
  showControls={true}
  onToggle={(assembled) => console.log(assembled)}
/>
```

### Portrait Image
```tsx
<BrokenGlass 
  imageSrc="/portrait.jpg"
  width={600}
  height={900}
/>
```

### Landscape Image
```tsx
<BrokenGlass 
  imageSrc="/landscape.jpg"
  width={1200}
  height={600}
/>
```

## Tips

- **Shard Count**: Total shards = rows × cols (e.g., 12×12 = 144 shards)
- **Performance**: Keep total shards under 1024 for best performance
- **Image Ratio**: Component automatically fits image maintaining aspect ratio
- **Fallback**: Shows gradient if image fails to load
- **Animation**: Uses spring physics for smooth, natural movement

## File Structure

```
src/components/BrokenGlass/
├── BrokenGlass.tsx    # Main component
├── index.ts           # Export file
├── README.md          # Full documentation
├── QUICK_REFERENCE.md # This file
├── demo.tsx           # Demo page
└── examples.tsx       # Usage examples
```

## Props Type Definition

```typescript
interface BrokenGlassProps {
  imageSrc: string;
  rows?: number;
  cols?: number;
  width?: number;
  height?: number;
  initialAssembled?: boolean;
  showControls?: boolean;
  clickToToggle?: boolean;
  className?: string;
  onToggle?: (isAssembled: boolean) => void;
}
```
