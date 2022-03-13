<script>
  import Plan from "./Plan.svelte";
  import { newPlan } from './stores.js';
  export let game;

  const addPlan = () => {
    game = [...game, $newPlan()];
  }
</script>

{#each game as plan}
  <Plan bind:plan={plan}/>
{/each}
<button on:click={addPlan}>new plan</button>

<style>
</style>
