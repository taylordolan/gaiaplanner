<script>
  export let turn;
  export let thisTurnIndex;
  export let activeTurnIndex;
  export let activeElement;
  export let setAdjacentElements;
  export let runningTotals;

  let handleBlur = (event) => {
    activeTurnIndex = null;
    if (!event.relatedTarget || (event.relatedTarget && !event.relatedTarget.classList.contains("input-desc") && !event.relatedTarget.classList.contains("input-num"))) {
      setAdjacentElements();
    }
  }

  let handleFocus = (event) => {
    activeTurnIndex = thisTurnIndex;
    activeElement = event.target;
    setAdjacentElements();
  }
</script>

<div class="turn">
  <div class="row" class:in-active-row={thisTurnIndex === activeTurnIndex}>
    <input
      bind:value={turn.description}
      class="input input-desc"
      class:completed={turn.completed}
      class:excluded={turn.excluded}
      class:in-active-row={thisTurnIndex === activeTurnIndex}
      data-turn={thisTurnIndex}
      on:blur={handleBlur}
      on:focus={handleFocus}
    >
    {#each Object.entries(turn.resources) as resource}
    <input
      bind:value={turn.resources[resource[0]]}
      class="input input-num"
      class:negative-total={runningTotals[resource[0]] < 0}
      class:excluded={turn.excluded}
      class:in-active-row={thisTurnIndex === activeTurnIndex}
      data-turn={thisTurnIndex}
      on:blur={handleBlur} on:focus={handleFocus}
      type="number"
    >
    {/each}
  </div>
</div>

<style>
  .turn {
    display: flex;
    justify-content: center;
    padding: 5px 0;
    width: 100%;
  }

  .row {
    position: relative;
  }

  .input {
    min-width: 0;
  }

  .input.in-active-row:not(:focus) {
    border-color: hsl(210, 100%, 60%);
  }

  .input-desc {
    flex: 1 1 240px;
  }

  .input-num {
    margin-left: 8px;
    padding-right: 0;
    flex: 0 1 54px;
  }

  .excluded {
    color: hsl(0, 0%, 86%);
  }

  .completed {
    text-decoration: line-through;
  }
</style>
