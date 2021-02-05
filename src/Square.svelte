<script lang="ts">
  import type { Square } from './store';
  import { squares } from './store';

  export let square: Square;
  export let svgRef: SVGSVGElement;

  let isHighlighted = false;
  let strokeColor: string;
  let strokeWidth: string;
  let cursorStyle: string;

  $: {
    // Set to default style
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

  $: center = { x: square.x, y: -square.y };

  function handlePointerEnter() {
    isHighlighted = true;
  }

  function handlePointerLeave() {
    isHighlighted = false;
  }

  let hasDragStarted = false;
  let lastMousePosition = { x: 0, y: 0 };

  function startDrag(e: PointerEvent) {
    e.stopPropagation();
    const MAIN_BUTTON = 0;
    if (e.button === MAIN_BUTTON && square.isSelected === true) {
      hasDragStarted = true;
      const dragElement = e.target as HTMLDivElement;
      dragElement.setPointerCapture(e.pointerId);
      lastMousePosition = clientToSvgCoordinates(e);
    }
  }

  function clientToSvgCoordinates(e: MouseEvent) {
    const CTM = svgRef.getScreenCTM();
    const mousePos = { x: 0, y: 0 };
    if (CTM) {
      mousePos.x = (e.clientX - CTM.e) / CTM.a;
      mousePos.y = (e.clientY - CTM.f) / CTM.d;
    }
    return mousePos;
  }

  let lastUpdate = 0;
  let isDrag = false;

  function dragging(e: PointerEvent) {
    // Throttle
    if (Date.now() - lastUpdate < 1000 / 60) {
      return;
    }
    lastUpdate = Date.now();
    // Handle dragging of square
    if (hasDragStarted === true) {
      e.stopPropagation();
      isDrag = true;
      const mousePosition = clientToSvgCoordinates(e);
      const deltaX = mousePosition.x - lastMousePosition.x;
      const deltaY = mousePosition.y - lastMousePosition.y;
      // Translate squares
      squares.translate(deltaX, deltaY);
      // Save last mouse position
      lastMousePosition = mousePosition;
    }
  }

  function stopDrag(e: PointerEvent) {
    const dragElement = e.target as HTMLDivElement;
    dragElement.releasePointerCapture(e.pointerId);
    isDrag = false;
    hasDragStarted = false;
  }

  function toggleSelect() {
    squares.select(square.id);
  }

  function handlePointerUp(e: PointerEvent) {
    const MAIN_BUTTON = 0;
    if (e.button !== MAIN_BUTTON) {
      return;
    }

    e.stopPropagation();

    if (isDrag === false) {
      toggleSelect();
    }
    stopDrag(e);
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
  on:pointerdown={startDrag}
  on:pointermove={dragging}
  on:pointerup={handlePointerUp}
/>
