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
    color: #333;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 16px;
    justify-content: center;
    padding: 30px;
  }
</style>
