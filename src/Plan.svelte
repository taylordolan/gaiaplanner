<script>
  import Turn from "./Turn.svelte";
  export let plan;
  import { newTurn, newPlan } from './stores.js';

  const addTurn = () => {
    // make sure the new turn's id is unique
    let greatest = 0;
    for (var i = 0; i < plan.length; i++) {
      let next = plan[i].id;
      if (next > greatest) {
        greatest = next;
      }
    }
    plan = [...plan, $newTurn(greatest + 1)];
  }

  const moveTurn = (index, dir) => {
    const dest = index + dir;
    var element = plan[index];
    plan.splice(index, 1);
    plan.splice(dest, 0, element);
    plan = plan;
  }

  const deleteTurn = (index) => {
    plan.splice(index, 1);
    plan = plan;
  }

  const reset = () => {
    plan = $newPlan();
  }

  const getTotal = (arr, type) => {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].enabled) {
        total += arr[i]["resources"][type];
      }
    }
    return total;
  }

  $: totalC = getTotal(plan, "c");
  $: totalO = getTotal(plan, "o");
  $: totalK = getTotal(plan, "k");
  $: totalQ = getTotal(plan, "q");
  $: totalV = getTotal(plan, "v");
</script>

<div class="plan">
  {#each plan as turn, i}
    <Turn
      bind:turn={turn}
      moveUp={() => moveTurn(i, -1)}
      moveDown={() => moveTurn(i, 1)}
      deleteTurn={() => deleteTurn(i)}
    />
  {/each}
  <div class="totals">
    <span class="totals-label">Totals:</span>
    <span class="total">{totalC}c</span>
    <span class="total">{totalO}o</span>
    <span class="total">{totalK}k</span>
    <span class="total">{totalQ}q</span>
    <span class="total">{totalV}vp</span>
  </div>
  <div class="footer">
    <button class="button" on:click={addTurn}>New Turn</button>
    <!-- <button class="button" on:click={reset}>reset</button> -->
  </div>
</div>

<style>
  .plan {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
  }

  .totals-label,
  .total {
    line-height: 36px;
    padding: 0 12px;
  }

  .totals {
    display: flex;
    margin-top: 10px;
  }

  .totals-label {
    flex: 0 1 240px;
    min-width: 0;
  }

  .total {
    width: 48px;
    margin-left: 8px;
  }

  .footer {
    margin-top: 10px;
  }
</style>
