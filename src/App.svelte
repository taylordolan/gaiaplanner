<script>
  import Game from "./Game.svelte";
  import { games } from './stores.js';
</script>

<main>
  {#each $games as game}
    <Game bind:game={game}/>
  {/each}
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    display: flex;
    justify-content: center;
    padding: 30px;
    font-size: 16px;
    color: #333;
  }
</style>
