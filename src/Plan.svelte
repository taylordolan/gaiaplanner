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
  <div class="footer">
    <div class="buttons-wrapper">
      <button class="button-add" on:click={addTurn}>add turn</button>
      <button class="button-reset" on:click={reset}>reset</button>
    </div>
    <span class="total">{totalC}c</span>
    <span class="total">{totalO}o</span>
    <span class="total">{totalK}k</span>
    <span class="total">{totalQ}q</span>
    <span class="total">{totalV}vp</span>
  </div>
</div>

<style>
  .plan {
    margin-top: 60px;
  }

  .buttons-wrapper {
    width: 240px;
  }

  .total {
    width: 48px;
    margin-left: 12px;
  }

  .footer {
    margin-top: 10px;
    display: flex;
  }

  .total {
    padding: 0 5px;
  }

  .button-reset {
    margin-left: 12px;
  }
</style>
