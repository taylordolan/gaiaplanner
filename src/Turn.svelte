<script>
  export let turn;
  export let thisTurnIndex;
  export let activeTurnIndex;
  export let activeElement;
  export let setAdjacentElements;

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
    <input data-turn={thisTurnIndex} class:in-active-row={thisTurnIndex === activeTurnIndex} on:blur={handleBlur} on:focus={handleFocus} class:excluded={!turn.enabled} class="input input-desc" bind:value={turn.description}>
    {#each Object.entries(turn.resources) as resource}
    <input data-turn={thisTurnIndex} class:in-active-row={thisTurnIndex === activeTurnIndex} on:blur={handleBlur} on:focus={handleFocus} class:excluded={!turn.enabled} class="input input-num" type="number" bind:value={turn.resources[resource[0]]}>
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
    color: hsl(0, 0%, 80%);
    text-decoration: line-through;
  }
</style>
