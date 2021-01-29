<script lang="ts">
  import { onMount } from 'svelte';
  import Origin from './Origin.svelte';
  import Square from './Square.svelte';
  import { squares } from './store';

  let viewportWidth = 0;
  let viewportHeight = 0;
  let svg: SVGSVGElement;
  let viewBoxMinX = 0;
  let viewBoxMinY = 0;
  const ORIGIN_OFFSET = 32;

  function setViewportSize() {
    viewportWidth = svg.clientWidth;
    viewportHeight = svg.clientHeight;
  }

  onMount(() => {
    setViewportSize();
    viewBoxMinX = -ORIGIN_OFFSET;
    viewBoxMinY = -viewportHeight + ORIGIN_OFFSET;
  });

  let zoom = 1;
  $: viewboxWidth = viewportWidth / zoom;
  $: viewboxHeight = viewportHeight / zoom;

  function handleZoom(e: WheelEvent) {
    // Determine new zoom level
    let zoomFactor: number;
    if (e.deltaY < 0) {
      zoomFactor = 0.9;
    } else {
      zoomFactor = 1 / 0.9;
    }
    const newZoom = zoom * zoomFactor;
    // Determine pointer location relative to svg element
    const svgBBox = svg.getBoundingClientRect();
    const offsetX = e.clientX - svgBBox.left;
    const offsetY = e.clientY - svgBBox.top;
    // Convert pointer location into SVG viewport coordinates
    const xBeforeZoom = offsetX / zoom;
    const yBeforeZoom = offsetY / zoom;
    // Determine pointer location after the zoom
    const xAfterZoom = offsetX / newZoom;
    const yAfterZoom = offsetY / newZoom;
    // Determine SVG image shift due to zoom
    const deltaX = xBeforeZoom - xAfterZoom;
    const deltaY = yBeforeZoom - yAfterZoom;
    // Translate SVG viewport to prevent the SVG image shift
    viewBoxMinX += deltaX;
    viewBoxMinY += deltaY;
    // Set new zoom level
    zoom = newZoom;
  }

  let isPan = false;
  let lastMousePosition = { x: 0, y: 0 };

  function startPan(e: PointerEvent) {
    e.preventDefault();
    const WHEEL_BUTTON = 1;
    if (e.button === WHEEL_BUTTON) {
      const dragElement = e.target as Element;
      dragElement.setPointerCapture(e.pointerId);
      isPan = true;
      // Save mouse position
      lastMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  }

  function panning(e: PointerEvent) {
    e.preventDefault();
    if (isPan) {
      const mousePosition = { x: e.clientX, y: e.clientY };
      const deltaX = (mousePosition.x - lastMousePosition.x) / zoom;
      const deltaY = (mousePosition.y - lastMousePosition.y) / zoom;
      viewBoxMinX -= deltaX;
      viewBoxMinY -= deltaY;
      // Save mouse position
      lastMousePosition = mousePosition;
    }
  }

  function stopPan(e: PointerEvent) {
    e.preventDefault();
    const dragElement = e.target as Element;
    dragElement.releasePointerCapture(e.pointerId);
    isPan = false;
  }
</script>

<svelte:window on:resize={setViewportSize} />

<svg
  version="1.1"
  width="100%"
  height="100%"
  viewBox={`${viewBoxMinX} ${viewBoxMinY} ${viewboxWidth} ${viewboxHeight}`}
  xmlns="http://www.w3.org/2000/svg"
  bind:this={svg}
  on:wheel={handleZoom}
  on:pointerdown={startPan}
  on:pointermove={panning}
  on:pointerup={stopPan}
>
  {#each Object.entries($squares) as [squareId, square]}
    <Square {square} />
  {/each}
  <Origin origin={{ x: 0, y: 0 }} size={100} strokeWidth={2} />
</svg>
