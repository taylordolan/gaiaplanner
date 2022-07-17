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

  const vocab = {
    c: "credits",
    o: "ore",
    k: "knowledge",
    q: "qic",
    p1: "power bowl 1",
    p2: "power bowl 2",
    p3: "power bowl 3",
    pg: "gaia bowl",
    v: "vp",
  }
</script>

<div
  class="row"
  class:in-active-row={thisTurnIndex === activeTurnIndex}
  title={`turn ${thisTurnIndex}`}
>
  <svg class="icon" class:in={turn.completed} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.21,3.79c-.39-.39-1.02-.39-1.41,0l-6.29,6.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l4,4c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l7-7c.39-.39,.39-1.02,0-1.41Z"/></svg>
  <input
    bind:value={turn.description}
    class="input input-col-1"
    class:completed={turn.completed}
    class:excluded={turn.excluded}
    class:in-active-row={thisTurnIndex === activeTurnIndex}
    data-turn={thisTurnIndex}
    title="description"
    on:blur={handleBlur}
    on:focus={handleFocus}
  >
  {#each Object.entries(turn.resources) as resource}
  <input
    bind:value={turn.resources[resource[0]]}
    class="input input-num"
    class:color-red={!turn.excluded && turn.resources[resource[0]] < 0 && runningTotals[resource[0]] < 0}
    class:border-red={!turn.excluded && turn.resources[resource[0]] < 0 && runningTotals[resource[0]] < 0}
    class:excluded={turn.excluded}
    class:in-active-row={thisTurnIndex === activeTurnIndex}
    data-turn={thisTurnIndex}
    title={vocab[resource[0]]}
    on:blur={handleBlur}
    on:focus={handleFocus}
    type="number"
  >
  {/each}
</div>

<style>
  .input.in-active-row:not(:focus) {
    border-color: hsl(210, 100%, 60%);
  }

  .input-col-1 {
    transition: padding-left .1s ease-out;
  }

  .input-num {
    margin-left: var(--input-margin);
    padding-right: 0;
    flex: 0 0 var(--width-input-num);
  }

  .excluded {
    color: var(--gray-4);
  }

  .completed {
    padding: 0 calc(var(--input-padding) - var(--border) + var(--sz-icon-1) + var(--check-margin));
    text-decoration: line-through;
  }

  .icon {
    fill: currentColor;
    height: var(--sz-icon-1);
    opacity: 0;
    position: absolute;
    top: calc(var(--height-input) / 2 - var(--sz-icon-1) / 4);
    transform: translateX(calc((var(--sz-icon-1) - var(--input-padding) + var(--check-margin) + var(--border)) * -1));
    transition: opacity .1s ease-out, transform .1s ease-out;
    width: var(--sz-icon-1);
  }

  .icon.in {
    opacity: 1;
    transform: translateX(calc(var(--input-padding) - var(--border)));
  }
  </style>
