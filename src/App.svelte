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
  <div class="row">
    <button class="btn" on:click={addPlan}>New Plan</button>
  </div>
</main>

<style>
  main {
    align-items: center;
    color: #333;
    display: flex;
    flex-direction: column;
    font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 14px;
  }

  .btn {
    align-self: flex-start;
    margin-top: 60px;
  }
</style>
