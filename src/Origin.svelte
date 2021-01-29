<script lang="ts">
  export let origin: { x: number; y: number };
  export let size: number;
  export let strokeWidth: number;

  $: markerSize = 3 * strokeWidth;

  $: xArrow = { x: origin.x + size, y: -origin.y };
  $: yArrow = { x: origin.x, y: -(origin.y + size) };

  $: xLabel = {
    x: xArrow.x - 4 * markerSize,
    y: xArrow.y + 3 * markerSize,
  };

  $: yLabel = {
    x: yArrow.x - 3 * markerSize,
    y: yArrow.y + 4 * markerSize,
  };

  $: invOrigin = { x: origin.x, y: -origin.y };
</script>

<marker
  id="arrow"
  viewBox="0 0 10 10"
  refX="5"
  refY="5"
  markerWidth={markerSize}
  markerHeight={markerSize}
  orient="auto-start-reverse"
>
  <path d="M 0 0 L 10 5 L 0 10 z" />
</marker>

<path
  d={`M ${yArrow.x} ${yArrow.y} 
      L ${invOrigin.x} ${invOrigin.y} 
      L ${xArrow.x} ${xArrow.y}`}
  stroke="black"
  stroke-width={strokeWidth}
  fill="none"
  marker-start="url(#arrow)"
  marker-end="url(#arrow)"
/>

<text x={xLabel.x} y={xLabel.y}>X</text>
<text x={yLabel.x} y={yLabel.y}>Y</text>

<style>
  text {
    user-select: none;
  }
</style>
