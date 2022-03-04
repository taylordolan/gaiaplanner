<script>
  let turns = [
    {
      description: "",
      resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
    },
    {
      description: "",
      resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
    },
    {
      description: "",
      resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
    },
    {
      description: "",
      resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
    },
  ]

  const getTotal = (turns, type) => {
    let total = 0;
    for (let i = 0; i < turns.length; i++) {
      total += turns[i]["resources"][type];
    }
    return total;
  }

  const modify = (turn, type, amount) => {
    turns[turn]["resources"][type] += amount;
    turns = turns;
    console.log(turn)
  }

  const addTurn = (t) => {
    t = [...t, {
      description: "",
      resources: { credits: 0, ore: 0, knowledge: 0, qic: 0, vp: 0 }
    }];
    turns = t;
  }
</script>

<main>
  <div class="plan">
    {#each turns as turn, i}
    <div class="turn">
      <input class="description" bind:value={turn.description}>
      {#each Object.entries(turn.resources) as resource}
        <span class="resource">
          <button on:click={() => modify(i, resource[0], -1)}>-</button>
          <span>{turn.resources[resource[0]]}{resource[0][0]}</span>
          <button on:click={() => modify(i, resource[0], 1)}>+</button>
        </span>
      {/each}
    </div>
    {/each}
    <div class="footer">
      <button on:click={addTurn(turns)}>add turn</button>
      <span class="resource">{getTotal(turns, "credits")}c</span>
      <span class="resource">{getTotal(turns, "ore")}o</span>
      <span class="resource">{getTotal(turns, "knowledge")}k</span>
      <span class="resource">{getTotal(turns, "qic")}q</span>
      <span class="resource">{getTotal(turns, "vp")}v</span>
    </div>
  </div>
</main>

<style>
  main {
    /* font-family: monospace; */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    display: flex;
    justify-content: center;
    padding: 30px;
  }

  .turn {
    display: flex;
  }

  .turn + .turn {
    margin-top: 10px;
  }

  .description {
    width: 240px;
  }

  .resource {
    width: 90px;
    display: flex;
    align-items: center;
    margin-left: 30px;
    justify-content: center;
    text-align: center;
  }

  .resource span {
    flex: 1 1 auto;
  }

  .footer {
    margin-top: 10px;
    display: flex;
  }

  .footer button {
    flex: 1 1 auto;
  }
</style>
