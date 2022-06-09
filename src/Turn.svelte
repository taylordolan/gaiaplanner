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
    {#if turn.completed}
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.21,3.79c-.39-.39-1.02-.39-1.41,0l-6.29,6.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l4,4c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l7-7c.39-.39,.39-1.02,0-1.41Z"/></svg>
    {/if}
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
      class:negative-total={turn.resources[resource[0]] < 0 && runningTotals[resource[0]] < 0}
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
    padding: 4px 0;
    width: 100%;
  }

  .row {
    position: relative;
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
    padding-left: 32px;
    text-decoration: line-through;
  }

  .icon {
    fill: currentColor;
    height: 16px;
    position: absolute;
    top: 10px;
    transform: translateX(12px);
    width: 16px;
  }
  </style>
