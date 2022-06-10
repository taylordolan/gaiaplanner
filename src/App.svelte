<script>
  import Plan from "./Plan.svelte";
  import { plans, newPlan } from './stores.js';

  const addPlan = () => {
    $plans = [...$plans, $newPlan()];
  }

  const deletePlan = (plan) => {
    let index = $plans.indexOf(plan);
    if (index !== -1) {
      $plans.splice(index, 1);
      $plans = $plans;
    }
  }

  const duplicatePlan = (plan) => {
    let index = $plans.indexOf(plan);
    if (index !== -1) {
      $plans.splice(index, 0, structuredClone(plan));
      $plans = $plans;
    }
  }
</script>

<main>
  {#each $plans as plan}
  <Plan
    bind:plan={plan}
    {deletePlan}
    {duplicatePlan}
  />
  {/each}
  <div class="plan">
    <div class="row">
      <button class="btn btn-new" on:click={addPlan}>
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M12.5,7H9V3.5a1,1,0,0,0-2,0V7H3.5a1,1,0,0,0,0,2H7v3.5a1,1,0,0,0,2,0V9h3.5a1,1,0,0,0,0-2Z"/></svg>
        New Plan
      </button>
    </div>
  </div>
</main>

<style>
  main {
    color: var(--gray-6);
    font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: var(--font-size);
  }
</style>
