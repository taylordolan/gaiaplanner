<script>
  import Plan from "./Plan.svelte";
  import { plans, newPlan } from './stores.js';

  const addPlan = () => {
    $plans = [...$plans, $newPlan()];
  }
</script>

<main>
  {#each $plans as plan}
    <Plan bind:plan={plan}/>
  {/each}
  <button class="button" on:click={addPlan}>new plan</button>
</main>

<style>
  main {
    color: #333;
    display: flex;
    flex-direction: column;
    font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 14px;
    justify-content: center;
    padding: 30px;
  }
</style>
