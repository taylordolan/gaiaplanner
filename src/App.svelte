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
    color: hsl(0, 0%, 20%);
    display: flex;
    flex-direction: column;
    font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: 14px;
  }

  .row {
    padding-top: 45px;
    padding-bottom: 45px;
  }

  .row::before {
    content: "";
    width: 700px;
    max-width: 100%;
    border-top: 2px solid hsl(0, 0%, 96%);
    position: absolute;
    left: 0;
    top: 0;
  }

  .btn {
    align-self: flex-start;
  }
</style>
