# BrokenGlass Component

A React component that creates a broken glass effect by slicing an image into irregular shards using Voronoi diagrams and animating them with smooth physics-based transitions.

## Features

- 🎨 Voronoi diagram-based irregular shard generation
- 🎭 Smooth spring physics animations
- 🎮 Interactive controls (optional)
- 🖱️ Click to toggle assembly/scatter
- ⚙️ Fully customizable via props
- 📱 Responsive canvas sizing
- 🎯 TypeScript support

## Installation

The component is already in your project at `src/components/BrokenGlass/BrokenGlass.tsx`

## Usage

### Basic Example

```tsx
import BrokenGlass from '@/components/BrokenGlass';

function MyPage() {
  return (
    <BrokenGlass 
      imageSrc="/path/to/your/image.png"
    />
  );
}
```

### Advanced Example with All Props

```tsx
import BrokenGlass from '@/components/BrokenGlass';

function MyPage() {
  const handleToggle = (isAssembled: boolean) => {
    console.log('Glass is now:', isAssembled ? 'assembled' : 'scattered');
  };

  return (
    <BrokenGlass 
      imageSrc="/Main.png"
      rows={16}
      cols={16}
      width={800}
      height={800}
      initialAssembled={false}
      showControls={true}
      clickToToggle={true}
      className="my-custom-class"
      onToggle={handleToggle}
    />
  );
}
```

### Minimal Example (No Controls)

```tsx
import BrokenGlass from '@/components/BrokenGlass';

function MyPage() {
  return (
    <BrokenGlass 
      imageSrc="/hero-image.jpg"
      showControls={false}
      clickToToggle={true}
      rows={20}
      cols={20}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageSrc` | `string` | **required** | URL or path to the image to shatter |
| `rows` | `number` | `12` | Number of rows for the grid (affects shard count) |
| `cols` | `number` | `12` | Number of columns for the grid (affects shard count) |
| `width` | `number` | `800` | Canvas width in pixels |
| `height` | `number` | `800` | Canvas height in pixels |
| `initialAssembled` | `boolean` | `false` | Initial state - true for assembled, false for scattered |
| `showControls` | `boolean` | `true` | Show/hide the control buttons and sliders |
| `clickToToggle` | `boolean` | `true` | Enable/disable click on canvas to toggle state |
| `className` | `string` | `''` | Custom CSS class for the container |
| `onToggle` | `(isAssembled: boolean) => void` | `undefined` | Callback fired when assembly state changes |

## How It Works

1. **Voronoi Diagram Generation**: The component generates random points and creates a Voronoi diagram to divide the image into irregular, natural-looking shards.

2. **Shard Creation**: Each Voronoi cell becomes a shard with its own physics properties (position, velocity, rotation).

3. **Spring Physics**: Shards use spring physics for smooth, natural-looking animations between assembled and scattered states.

4. **Canvas Rendering**: Each shard is rendered using HTML5 Canvas with clipping paths to show only the relevant portion of the image.

## Customization Tips

- **More shards**: Increase `rows` and `cols` for smaller, more numerous pieces
- **Fewer shards**: Decrease `rows` and `cols` for larger, fewer pieces
- **Square images**: Use equal `width` and `height`
- **Landscape images**: Use `width > height`
- **Portrait images**: Use `height > width`

## Performance Notes

- The component uses `requestAnimationFrame` for smooth 60fps animations
- Shard count = `rows × cols` (e.g., 12×12 = 144 shards)
- Higher shard counts may impact performance on lower-end devices
- Recommended maximum: 32×32 = 1024 shards

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6+
- React 18+

## Example Integration in Your Project

```tsx
// In your page.tsx or component
"use client";

import BrokenGlass from '@/components/BrokenGlass';

export default function GalleryPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Broken Glass Gallery</h1>
      
      <div className="max-w-4xl mx-auto">
        <BrokenGlass 
          imageSrc="/gallery/photo1.jpg"
          rows={15}
          cols={15}
          width={800}
          height={600}
          showControls={true}
          onToggle={(assembled) => {
            console.log('Photo is', assembled ? 'whole' : 'shattered');
          }}
        />
      </div>
    </div>
  );
}
```

## Styling

The component comes with minimal inline styles. You can customize the appearance by:

1. Using the `className` prop to add custom styles to the container
2. Wrapping the component in a styled div
3. Modifying the inline styles in the component source

Example:

```tsx
<div className="rounded-lg shadow-2xl overflow-hidden">
  <BrokenGlass 
    imageSrc="/image.jpg"
    showControls={false}
  />
</div>
```
