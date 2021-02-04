<script lang="ts">
  import type { Square } from './store';

  export let square: Square;

  $: center = { x: square.x, y: -square.y };

  let isHighlighted = false;
  let strokeColor: string;
  let strokeWidth: string;
  let cursorStyle: string;

  $: {
    // Set back to default style
    strokeColor = 'black';
    strokeWidth = '0';
    cursorStyle = 'grab';

    if (isHighlighted && !square.isSelected) {
      // Highlighted only
      strokeColor = 'rgb(85,160,185)';
      strokeWidth = '2';
    } else if (square.isSelected && !isHighlighted) {
      // Selected only
      strokeColor = 'rgb(175,35,95)';
      strokeWidth = '2';
    } else if (square.isSelected && isHighlighted) {
      // Highlighted and selected
      strokeColor = 'rgb(175,35,95)';
      strokeWidth = '2';
      cursorStyle = 'move';
    }
  }

  function handlePointerEnter() {
    isHighlighted = true;
  }

  function handlePointerLeave() {
    isHighlighted = false;
  }
</script>

<rect
  x={-square.sideLength / 2}
  y={-square.sideLength / 2}
  width={square.sideLength}
  height={square.sideLength}
  rx={square.sideLength / 10}
  ry={square.sideLength / 10}
  stroke={strokeColor}
  stroke-width={strokeWidth}
  cursor={cursorStyle}
  transform={`translate(${center.x} ${center.y}) rotate(${square.rotation})`}
  on:pointerenter={handlePointerEnter}
  on:pointerleave={handlePointerLeave}
/>
