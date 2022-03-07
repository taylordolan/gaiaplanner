<script>
  import { turns, newTurn, defaultTurns } from './stores.js';

  const addTurn = () => {
    // make sure the new turn's id is unique
    let greatest = 0;
    for (var i = 0; i < $turns.length; i++) {
      let next = $turns[i].id;
      if (next > greatest) {
        greatest = next;
      }
    }
    $turns = [...$turns, $newTurn(greatest + 1)];
    console.log($turns);
  }

  const moveTurn = (arr, index, dir) => {
    const dest = index + dir;
    var element = arr[index];
    arr.splice(index, 1);
    arr.splice(dest, 0, element);
    $turns = arr;
  }

  const deleteTurn = (arr, index) => {
    arr.splice(index, 1);
    $turns = arr;
  }

  const toggleTurn = (arr, index) => {
    arr[index]["enabled"] = !arr[index]["enabled"];
    $turns = arr;
  }

  const resetTurns = () => {
    $turns = $defaultTurns();
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
</script>

<main>
  <div class="plan">
    {#each $turns as turn, i (turn.id)}
    <div class="turn">
      <input class:dim={!turn.enabled} class="input input-description" bind:value={turn.description}>
      {#each Object.entries(turn.resources) as resource}
        <input class:dim={!turn.enabled} class="input input-resource" type="number" bind:value={turn.resources[resource[0]]}>
      {/each}
      <button class="button-function" on:click={moveTurn($turns, i, -1)}>up</button>
      <button class="button-function" on:click={moveTurn($turns, i, 1)}>dn</button>
      <button class="button-function" on:click={toggleTurn($turns, i)}>t</button>
      <button class="button-function" on:click={deleteTurn($turns, i)}>x</button>
    </div>
    {/each}
    <div class="footer">
      <div class="buttons-wrapper">
        <button class="button-add" on:click={addTurn}>add turn</button>
        <button class="button-reset" on:click={resetTurns}>reset</button>
      </div>
      <span class="total">{getTotal($turns, "credits")}c</span>
      <span class="total">{getTotal($turns, "ore")}o</span>
      <span class="total">{getTotal($turns, "knowledge")}k</span>
      <span class="total">{getTotal($turns, "qic")}q</span>
      <span class="total">{getTotal($turns, "vp")}vp</span>
    </div>
  </div>
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

  .turn {
    display: flex;
  }

  .turn + .turn {
    margin-top: 10px;
  }

  .input {
    border: 1px solid #ddd;
    line-height: 30px;
    padding: 0 4px;
    color: inherit;
    border-radius: 4px;
  }

  .input-description,
  .buttons-wrapper {
    width: 240px;
  }

  .input-resource {
    padding-right: 0;
  }

  .input-resource,
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

  .button-reset,
  .button-function {
    margin-left: 12px;
  }

  .dim {
    opacity: .2;
  }
</style>
