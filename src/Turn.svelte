<script>
  export let turn;
  export let activeIndex;
  export let activeElement;
  export let turnIndex;

  let handleBlur = () => {
    activeIndex = null;
  }

  let handleFocus = (event) => {
    activeElement = event.target;
    activeIndex = turnIndex;
  }
</script>

<div class="turn">
  <div class="row" class:in-active-row={turnIndex === activeIndex}>
    <input class:in-active-row={turnIndex === activeIndex} on:blur={handleBlur} on:focus={handleFocus} class:disabled={!turn.enabled} class="input input-desc" bind:value={turn.description}>
    {#each Object.entries(turn.resources) as resource}
    <input class:in-active-row={turnIndex === activeIndex} on:blur={handleBlur} on:focus={handleFocus} class:disabled={!turn.enabled} class="input input-num" type="number" bind:value={turn.resources[resource[0]]}>
    {/each}
  </div>
</div>

<style>
  .turn {
    display: flex;
    justify-content: center;
    padding: 5px;
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

  .disabled {
    opacity: .25;
  }
</style>
