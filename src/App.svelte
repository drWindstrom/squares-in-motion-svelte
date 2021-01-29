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
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
  }
</style>
