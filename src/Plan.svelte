<script>
  import Turn from "./Turn.svelte";
  import { newTurn } from './stores.js';
  import { sineOut } from 'svelte/easing';
  import autosize from 'svelte-autosize';
  export let plan;
  export let deletePlan;
  export let duplicatePlan;

  let activeTurnIndex = null;
  let activeElement = null;
  let upElement = null;
  let downElement = null;
  let showMenu = false;

  const menuEnter = () => {
    return {
      duration: 100,
      easing: sineOut,
      css: (t, u) => `
        opacity: ${t};
        transform: translateY(${u * 10}px) scale(${.95 + t * 0.05})
      `
    }
  }

  const addTurn = (index) => {
    // make sure the new turn's id is unique
    let greatest = 0;
    for (var i = 0; i < plan.turns.length; i++) {
      let next = plan.turns[i].id;
      if (next > greatest) {
        greatest = next;
      }
    }
    plan.turns.splice(index, 0, $newTurn(greatest + 1))
    plan.turns = plan.turns;
  }

  const moveTurnUp = (index) => {
    const dest = index - 1;
    var turn = plan.turns[index];
    plan.turns.splice(index, 1);
    plan.turns.splice(dest, 0, turn);
    plan.turns = plan.turns;
    activeTurnIndex--;
    setTimeout(() => {
      activeElement.focus();
    }, 1);
  }

  const moveTurnDown = (index) => {
    const dest = index + 1;
    var turn = plan.turns[index];
    plan.turns.splice(index, 1);
    plan.turns.splice(dest, 0, turn);
    plan.turns = plan.turns;
    activeTurnIndex++;
    setTimeout(() => {
      setAdjacentElements();
    }, 1);
  }

  let setAdjacentElements = () => {
    upElement = null;
    downElement = null;
    if (activeTurnIndex !== 0) {
      const prevRow = activeElement.parentElement.previousElementSibling;
      upElement = prevRow.getElementsByTagName("input")[0];
    }
    if (activeTurnIndex !== plan.turns.length - 1) {
      const nextRow = activeElement.parentElement.nextElementSibling;
      downElement = nextRow.getElementsByTagName("input")[0];
    }
  }

  let toggleTurnExclude = (index) => {
    plan.turns[index].completed = false;
    plan.turns[index].excluded = !plan.turns[index].excluded;
    plan.turns = plan.turns;
  }

  let toggleTurnComplete = (index) => {
    plan.turns[index].excluded = false;
    plan.turns[index].completed = !plan.turns[index].completed;
    plan.turns = plan.turns;
  }

  const deleteTurn = (index) => {
    let nextTurn = null;
    if (index !== plan.turns.length - 1) {
      const nextRow = activeElement.parentElement.nextElementSibling;
      nextTurn = nextRow.getElementsByTagName("input")[0];
    }
    plan.turns.splice(index, 1);
    plan.turns = plan.turns;
    if (nextTurn) {
      setTimeout(() => {
        nextTurn.focus();
      }, 1);
    } else {
      activeTurnIndex = null;
      activeElement = null;
    }
  }

  const getTotals = (turns, turnIndex) => {
    let totals = { c: 0, o: 0, k: 0, q: 0, v: 0 };
    // for every turn
    for (let j = 0; j <= turnIndex; j++) {
      // for every type of resource
      for (let i = 0; i < Object.entries(totals).length; i++) {
        let resourceType = Object.entries(totals)[i][0];
        if (!turns[j].excluded) {
          totals[resourceType] += turns[j]["resources"][resourceType];
        }
      }
    }
    return totals;
  }

  const handleOverflowMenuBlur = () => {
    const menu = document.getElementsByClassName("menu")[0];
    setTimeout(() => {
      if (!menu || !menu.contains(document.activeElement)) {
        showMenu = false;
      }
    }, 1);
  }

  // keyboard shortcuts
  const handleKeydown = (event) => {
		const key = event.key;
    const keyCode = event.keyCode;
    const commaCode = 188;
    const periodCode = 190;
    const slashCode = 191;
    // `activeTurnIndex` is null for plans that don't have focus.
    // If I don't check this value, keyboard events will be repeated for each plan that exists.
    // I'm using `!== null` because `activeTurnIndex` is 0 when it's the first turn in the plan.
    if (activeTurnIndex !== null) {
      // toggle turn exclude
      if (event.altKey && keyCode === commaCode) {
        event.preventDefault();
        toggleTurnExclude(activeTurnIndex);
      }
      // toggle turn complete
      else if (event.altKey && keyCode === periodCode) {
        event.preventDefault();
        toggleTurnComplete(activeTurnIndex);
      }
      // turn delete
      else if (event.altKey && keyCode === slashCode) {
        event.preventDefault();
        deleteTurn(activeTurnIndex);
      }
      // move turns
      else if (event.altKey) {
        if (key === "ArrowUp" && activeTurnIndex !== 0) {
          event.preventDefault();
          moveTurnUp(activeTurnIndex);
        }
        else if (key === "ArrowDown" && activeTurnIndex !== plan.turns.length - 1) {
          event.preventDefault();
          moveTurnDown(activeTurnIndex);
        }
      }
      // new turn
      else if (key === "Enter") {
        addTurn(activeTurnIndex + 1);
        setTimeout(() => {
          const newTurn = activeElement.parentElement.nextElementSibling.getElementsByTagName("input")[0];
          newTurn.focus();
        }, 1);
      }
      // move focus
      else if (activeElement && activeElement.classList.contains("input-col-1")) {
        if (upElement && key === "ArrowUp" && activeTurnIndex !== 0) {
          event.preventDefault();
          upElement.focus();
        }
        else if (downElement && key === "ArrowDown" && activeTurnIndex !== plan.turns.length - 1) {
          event.preventDefault();
          downElement.focus();
        }
      }
    }
	}

  $: grandTotals = getTotals(plan.turns, plan.turns.length - 1);
  $: totalC = grandTotals.c;
  $: totalO = grandTotals.o;
  $: totalK = grandTotals.k;
  $: totalQ = grandTotals.q;
  $: totalV = grandTotals.v;
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="plan">
  <div class="row">
    <input
      class="input input-title bold"
      bind:value={plan.label}
      title="plan title"
    >
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,27c-7.72,0-14-4.038-14-9v-6C1,7.038,7.28,3,15,3s14,4.038,14,9v6c0,4.962-6.28,9-14,9Z" style="fill:#fec900;"/>
        <path d="M15,27c-7.72,0-14-4.038-14-9v-6C1,7.038,7.28,3,15,3s14,4.038,14,9v6c0,4.962-6.28,9-14,9Z" style="fill:#ccac33;"/>
        <path d="M15,26c-7.047,0-13-3.664-13-8v-6C2,7.664,7.953,4,15,4s13,3.664,13,8v6c0,4.336-5.953,8-13,8Z" style="fill:#fff799;"/>
        <path d="M15,20c-7.168,0-13-3.589-13-8v6c0,4.411,5.832,8,13,8s13-3.589,13-8v-6c0,4.411-5.832,8-13,8Z" style="fill:#edd55e;"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="25.917 3 4.083 3 .997 19.974 1.537 27 28.463 27 29.003 19.974 25.917 3" style="fill:#c3c0b8;"/>
        <polygon points="4.917 4 2.008 20 27.992 20 25.083 4 4.917 4" style="fill:#fff;"/>
        <polygon points="2.003 20.026 2.463 26 27.537 26 27.997 20.026 27.992 20 2.008 20 2.003 20.026" style="fill:#e8e6e3;"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20.136 3 9.864 3 1 8.214 1 21.786 9.864 27 20.136 27 29 21.786 29 8.214 20.136 3" style="fill:#53adc6;"/>
        <polygon points="20 4 10 4 2 8.786 2 14.786 2 15.214 2 21.214 10 26 20 26 28 21.214 28 15.214 28 14.786 28 8.786 20 4" style="fill:#c2f1ff;"/>
        <polygon points="10 20 2 15.214 2 21.214 10 26 20 26 28 21.214 28 15.214 20 20 10 20" style="fill:#7dd3e8;"/>
        <rect x="10" y="20" width="10" height="6" style="fill:#9ce6fc;"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,1.144L3,8.071v13.857l12,6.928,12-6.928V8.071L15,1.144Z" style="fill:#609f7c;"/>
        <polygon points="4 21.351 4 8.649 15 2.298 26 8.649 26 21.351 15 27.702 4 21.351" style="fill:#6cc17b;"/>
        <polygon points="15 2.298 4 8.649 9.25 11.68 15 8.36 20.75 11.68 26 8.649 15 2.298" style="fill:#b7ebc0;"/>
        <polygon points="20.75 18.32 15 21.64 15 27.702 26 21.351 26 8.649 26 8.649 20.75 11.68 20.75 18.32" style="fill:#8bda99;"/>
        <polygon points="20.75 18.32 15 15 9.25 18.32 15 21.64 20.75 18.32" style="fill:#b7ebc0;"/>
        <polygon points="9.25 18.32 15 15 15 8.36 9.25 11.68 9.25 18.32" style="fill:#8bda99;"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="26" height="26" rx="1.5" ry="1.5" style="fill:#b3854d;"/>
        <rect x="3" y="3" width="24" height="24" rx=".5" ry=".5" style="fill:#d2a36a;"/>
        <path d="M24.98,13.5c0-3.29-1.622-6.367-4.337-8.232l-.448-.307-2.136,3.732,.43,.25c2.16,1.253,3.501,3.575,3.501,6.058,0,3.294-2.29,6.057-5.36,6.798l-.266,1.595c4.86-.678,8.616-4.849,8.616-9.893Z" style="fill:#ebe3db;"/>
        <path d="M7.99,15c0-2.483,1.342-4.804,3.501-6.058l.432-.251-2.161-3.729-.445,.306c-2.715,1.865-4.337,4.942-4.337,8.232,0,5.06,3.78,9.243,8.663,9.9l-.262-1.594c-3.085-.73-5.391-3.501-5.391-6.806Z" style="fill:#ebe3db;"/>
        <polygon points="17.568 16.066 20.5 15 17.568 13.934 18.889 11.11 16.303 12.32 15.07 4.918 14.93 4.918 13.697 12.321 11.109 11.11 12.431 13.934 9.5 15 12.431 16.066 11.109 18.89 13.697 17.679 14.93 25.082 15.07 25.082 16.303 17.68 18.889 18.89 17.568 16.066" style="fill:#fff4d1;"/>
      </svg>
    </div>
  </div>
  {#each plan.turns as turn, i (turn.id)}
  <Turn
    bind:activeTurnIndex={activeTurnIndex}
    bind:activeElement={activeElement}
    bind:turn={turn}
    runningTotals={getTotals(plan.turns, i)}
    {setAdjacentElements}
    thisTurnIndex={i}
  />
  {/each}
  <div class="row">
    <span class="totals-label">Totals:</span>
    <span class="totals-value" class:color-red={totalC < 0}>{totalC}c</span>
    <span class="totals-value" class:color-red={totalO < 0}>{totalO}o</span>
    <span class="totals-value" class:color-red={totalK < 0}>{totalK}k</span>
    <span class="totals-value" class:color-red={totalQ < 0}>{totalQ}q</span>
    <span class="totals-value" class:color-red={totalV < 0}>{totalV}vp</span>
  </div>
  <div class="row row-footer">
    <button
      class="btn btn-new"
      on:click={addTurn(plan.turns.length)}
    >
      <svg class="icon icon-new" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M12.5,7H9V3.5a1,1,0,0,0-2,0V7H3.5a1,1,0,0,0,0,2H7v3.5a1,1,0,0,0,2,0V9h3.5a1,1,0,0,0,0-2Z"/></svg>
      New Turn
    </button>
    {#if activeTurnIndex !== null}
    <button
      class="btn btn-icon btn-tooltip"
      disabled={activeTurnIndex === 0}
      on:mousedown={(event) => event.preventDefault()}
      on:click={moveTurnUp(activeTurnIndex)}
      data-tooltip="Move up"
      title="Move up"
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L7,5.41V13a1,1,0,0,0,2,0V5.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,13.71,7.29Z"/></svg>
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      disabled={activeTurnIndex === plan.turns.length - 1}
      on:mousedown={(event) => event.preventDefault()}
      on:click={moveTurnDown(activeTurnIndex)}
      data-tooltip="Move down"
      title="Move down"
    >
      <svg class="icon flip-y" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L7,5.41V13a1,1,0,0,0,2,0V5.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,13.71,7.29Z"/></svg>
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      on:mousedown={(event) => event.preventDefault()}
      on:click={toggleTurnExclude(activeTurnIndex)}
      data-tooltip={activeTurnIndex !== null && plan.turns[activeTurnIndex].excluded ? "Include in plan" : "Exclude from plan"}
      title={activeTurnIndex !== null && plan.turns[activeTurnIndex].excluded ? "Include in plan" : "Exclude from plan"}
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.73,6.69c-1.27-2.58-3.85-4.19-6.73-4.19S2.55,4.11,1.27,6.69c-.4,.82-.4,1.8,0,2.62,1.27,2.58,3.85,4.19,6.73,4.19s5.45-1.6,6.73-4.19c.4-.82,.4-1.8,0-2.62Zm-1.79,1.74c-.93,1.9-2.82,3.07-4.93,3.07s-4-1.18-4.93-3.07c-.13-.27-.13-.59,0-.86,.93-1.9,2.82-3.07,4.93-3.07s4,1.18,4.93,3.07c.13,.27,.13,.59,0,.86Z"/><circle cx="8" cy="8" r="2"/></svg>
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      on:mousedown={(event) => event.preventDefault()}
      on:click={toggleTurnComplete(activeTurnIndex)}
      data-tooltip={activeTurnIndex !== null && plan.turns[activeTurnIndex].completed ? "Mark not done" : "Mark done"}
      title={activeTurnIndex !== null && plan.turns[activeTurnIndex].completed ? "Mark not done" : "Mark done"}
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.21,3.79c-.39-.39-1.02-.39-1.41,0l-6.29,6.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l4,4c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l7-7c.39-.39,.39-1.02,0-1.41Z"/></svg>
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      on:mousedown={(event) => event.preventDefault()}
      on:click={deleteTurn(activeTurnIndex)}
      data-tooltip="Delete"
      title="Delete"
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.41,8l3.29-3.29c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-3.29,3.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l3.29,3.29-3.29,3.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29,3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41l-3.29-3.29Z"/></svg>
    </button>
    {/if}
    <button
      class="btn btn-icon"
      on:click={() => showMenu = !showMenu}
      on:blur={handleOverflowMenuBlur}
      title="Plan options"
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
    </button>
    {#if showMenu}
    <ul
      class="menu"
      transition:menuEnter
    >
      {#if !plan.showNotes}
      <li>
        <button
          class="btn btn-menu"
          on:click={() => {plan.showNotes = true; showMenu = false}}
          on:blur={handleOverflowMenuBlur}
        >
          Show Notes
        </button>
      </li>
      {:else}
      <li>
        <button
          class="btn btn-menu"
          on:click={() => {plan.showNotes = false; showMenu = false}}
          on:blur={handleOverflowMenuBlur}
        >
          Hide notes
        </button>
      </li>
      {/if}
      <li>
        <button
          class="btn btn-menu"
          on:click={() => {duplicatePlan(plan); showMenu = false}}
          on:blur={handleOverflowMenuBlur}
        >
          Duplicate plan
        </button>
      </li>
      <li>
        <button
          class="btn btn-menu color-red"
          on:click={() => {deletePlan(plan); showMenu = false}}
          on:blur={handleOverflowMenuBlur}
        >
          Delete plan
        </button>
      </li>
    </ul>
    {/if}
  </div>
  {#if plan.showNotes}
  <div class="row">
    <textarea
      class="input input-area"
      bind:value={plan.notes}
      use:autosize
      rows="3"
      placeholder="Notes"
    ></textarea>
  </div>
  {/if}
</div>

<style>
  .input-title {
    flex: 1 1 auto;
  }

  .input-title:not(:hover):not(:focus) {
    border-color: transparent;
  }

  .resource-icon-wrapper {
    align-items: center;
    display: flex;
    flex: 0 0 var(--width-input-num);
    height: var(--sz-icon-2);
    justify-content: center;
    margin-left: var(--input-margin);
    min-width: 0;
    padding: 0 calc(var(--input-padding) / 2); /* must equal input-num border + padding so they stay aligned when shrinking down */
  }

  /* totals */

  .totals-label,
  .totals-value {
    line-height: var(--sz-4);
    margin-top: calc((var(--height-input) - var(--sz-4)) / 2);
  }

  .totals-label {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 var(--input-padding); /* must equal input-col-1 border + padding so they stay aligned when shrinking down */
  }

  .totals-value {
    flex: 0 0 var(--width-input-num);
    margin-left: var(--input-margin);
    padding: 0 var(--border) 0 var(--input-padding); /* must equal input-num border + padding so they stay aligned when shrinking down */
  }

  /* footer */

  .row-footer {
    backdrop-filter: blur(4px);
    background-color: var(--footer-bg);
    bottom: 0;
    justify-content: flex-end;
    padding-bottom: var(--sz-3);
    padding-top: var(--sz-3);
    position: sticky;
    z-index: 1;
    margin-bottom: calc(var(--sz-2) * -1) /* offsets extra padding to match header padding of sz-1 */
  }

  .btn-tooltip {
    position: relative;
  }

  .btn-tooltip::before,
  .btn-tooltip::after {
    left: 50%;
    opacity: 0;
    transform: translateX(-50%);
    visibility: hidden;
    z-index: 1;
  }

  .btn-tooltip:hover:not(:disabled)::before,
  .btn-tooltip:hover:not(:disabled)::after {
    opacity: 1;
    visibility: visible;
  }

  .btn-tooltip::before {
    background-color: var(--gray-6);
    border-radius: var(--radius);
    color: var(--white);
    content: attr(data-tooltip);
    font-size: 13px;
    line-height: 24px;
    padding: 0 var(--sz-2);
    position: absolute;
    top: -38px;
    white-space: nowrap;
  }

  .btn-tooltip::after {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid var(--gray-6);
    content: "";
    height: 0;
    position: absolute;
    top: -14px;
    width: 0;
  }

  /* menu */

  .menu {
    background-color: var(--white);
    border-radius: 8px;
    border: var(--border) solid var(--gray-2);
    box-shadow: 0 2px 8px hsl(0, 0%, 0%, 4%);
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: var(--sz-2);
    position: absolute;
    bottom: calc(var(--sz-1) + var(--height-input) + var(--sz-4));
    width: 196px;
  }

  li {
    list-style-type: none;
  }

  .btn-menu {
    background-color: transparent;
    text-align: left;
    width: 100%;
  }

  .btn-menu:hover {
    background-color: var(--gray-1);
  }

  .btn-menu:active {
    background-color: var(--gray-2);
  }

  /* notes */

  .input-area {
    line-height: 24px;
    margin-top: var(--sz-2);
    padding-bottom: 5px;
    padding-top: 5px;
    resize: none;
    width: 100%;
  }

  .input-area::placeholder {
    color: hsl(0, 0%, 72%);
  }
</style>
