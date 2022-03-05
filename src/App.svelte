<script>
  import { turns } from './stores.js';

  const getTotal = (turns, type) => {
    let total = 0;
    for (let i = 0; i < turns.length; i++) {
      total += turns[i]["resources"][type];
    }
    return total;
  }

  // todo: create a ssot for what a turn looks like
  const addTurn = (t) => {
    t = [...t, {
      description: "",
      resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
      id: t.length,
    }];
    $turns = t;
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

  const resetTurns = (t) => {
    t = [
      {
        description: "current values",
        resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
        id: 0,
      },
      {
        description: "",
        resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
        id: 1,
      },
      {
        description: "",
        resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
        id: 2,
      },
      {
        description: "",
        resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 },
        id: 3,
      },
    ]
    $turns = t;
  }
</script>

<main>
  <div class="plan">
    {#each $turns as turn, i (turn.id)}
    <div class="turn">
      <input class="input input-description" bind:value={turn.description}>
      {#each Object.entries(turn.resources) as resource}
        <input class="input input-resource" type="number" bind:value={turn.resources[resource[0]]}>
      {/each}
      <button class="button-move" on:click={moveTurn($turns, i, -1)}>up</button>
      <button class="button-move" on:click={moveTurn($turns, i, 1)}>dn</button>
      <button class="button-move" on:click={deleteTurn($turns, i)}>x</button>
    </div>
    {/each}
    <div class="footer">
      <div class="buttons-wrapper">
        <button class="button-add" on:click={addTurn($turns)}>add turn</button>
        <button class="button-reset" on:click={resetTurns($turns)}>reset</button>
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
  .button-move {
    margin-left: 12px;
  }
</style>
