<script lang="ts">
  import PanZoomSvg from './PanZoomSvg.svelte';
  import Sidebar from './Sidebar.svelte';
</script>

<main>
  <Sidebar />
  <PanZoomSvg />
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
  }
</style>
