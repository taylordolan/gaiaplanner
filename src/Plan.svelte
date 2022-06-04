<script>
  import Turn from "./Turn.svelte";
  import { newTurn } from './stores.js';
  import autosize from 'svelte-autosize';
  export let plan;
  export let deletePlan;
  export let duplicatePlan;

  let activeTurnIndex = null;
  let activeElement = null;
  let upElement = null;
  let downElement = null;
  let showMenu = false;

  const addTurn = (index) => {
    // make sure the new turn's id is unique
    let greatest = 0;
    for (var i = 0; i < plan.turns.length; i++) {
      let next = plan.turns[i].id;
      if (next > greatest) {
        greatest = next;
      }
    }
    // plan.turns = [...plan.turns, $newTurn(greatest + 1)];
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
      upElement = activeElement.parentElement.parentElement.previousElementSibling.children[0].children[0];
    }
    if (activeTurnIndex !== plan.turns.length - 1) {
      downElement = activeElement.parentElement.parentElement.nextElementSibling.children[0].children[0];
    }
  }

  let toggleTurnExclude = (index) => {
    plan.turns[index].excluded = !plan.turns[index].excluded;
    plan.turns = plan.turns;
  }

  let toggleTurnComplete = (index) => {
    plan.turns[index].completed = !plan.turns[index].completed;
    plan.turns = plan.turns;
  }

  const deleteTurn = (index) => {
    let nextTurn = null;
    if (index !== plan.turns.length - 1) {
      nextTurn = activeElement.parentElement.parentElement.nextElementSibling.children[0].children[0];
    }
    plan.turns.splice(index, 1);
    plan.turns = plan.turns;
    if (nextTurn) {
      setTimeout(() => {
        nextTurn.focus();
      }, 1);
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

  function handleKeydown(event) {
		const key = event.key;
    // `activeTurnIndex` is null for plans that don't have focus.
    // If I don't check this value, keyboard events will be repeated for each plan that exists.
    // I'm using `!== null` because `activeTurnIndex` is 0 when it's the first turn in the plan.
    if (activeTurnIndex !== null) {
      // move turns
      if (event.altKey) {
        if (key === "ArrowUp" && activeTurnIndex !== 0) {
          event.preventDefault();
          moveTurnUp(activeTurnIndex);
        }
        else if (key === "ArrowDown" && activeTurnIndex !== plan.turns.length - 1) {
          event.preventDefault();
          moveTurnDown(activeTurnIndex);
        }
      }
      else if (key === "Enter") {
        const index = activeElement;
        addTurn(activeTurnIndex + 1);
        setTimeout(() => {
          const newTurn = index.parentElement.parentElement.nextElementSibling.children[0].children[0];
          newTurn.focus();
        }, 1);
      }
      // move cursor
      else if (activeElement && activeElement.classList.contains("input-desc")) {
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
  <div class="row header">
    <input bind:value={plan.label} class="input input-title">
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 12V18C28 22.42 22.18 26 15 26C7.82 26 2 22.42 2 18V12C2 7.58 7.82 4 15 4C22.18 4 28 7.58 28 12Z" fill="#FFF799"/>
        <path d="M2 12V18C2 22.42 7.82 26 15 26C22.18 26 28 22.42 28 18V12C28 16.42 22.18 20 15 20C7.82 20 2 16.42 2 12Z" fill="#EDD55E"/>
        <path d="M28 12V18C28 22.42 22.18 26 15 26C7.82 26 2 22.42 2 18V12C2 7.58 7.82 4 15 4C22.18 4 28 7.58 28 12Z" stroke="#CCAC33" stroke-miterlimit="10"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.5 4L28 20L27.5 26H2.5L2 20L4.5 4H25.5Z" fill="white"/>
        <path d="M28 20L27.5 26H2.5L2 20H28Z" fill="#E8E6E3"/>
        <path d="M25.5 4L28 20L27.5 26H2.5L2 20L4.5 4H25.5Z" stroke="#AFABA1" stroke-miterlimit="10"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 9L9.5 4H20.5L28 9V21L20.5 26H9.5L2 21V9Z" fill="#C2F1FF"/>
        <path d="M28 15V21L20.5 26V20L28 15Z" fill="#7DD3E8"/>
        <path d="M2 15V21L9.5 26V20L2 15Z" fill="#7DD3E8"/>
        <path d="M20.5 20H9.5V26H20.5V20Z" fill="#9CE6FC"/>
        <path d="M2 9L9.5 4H20.5L28 9V21L20.5 26H9.5L2 21V9Z" stroke="#53ADC6" stroke-miterlimit="10"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.73828 21.505V8.505L9.36828 11.755V18.255L14.9983 21.505V28.005L3.73828 21.505Z" fill="#6CC17B"/>
        <path d="M14.9983 2.005L26.2583 8.505L20.6283 11.755L14.9983 8.505L9.36828 11.755L3.73828 8.505L14.9983 2.005Z" fill="#B7EBC0"/>
        <path d="M26.26 21.505L15 28.005V21.505L20.63 18.255V11.755L26.26 8.505V21.505Z" fill="#8BDA99"/>
        <path d="M20.6272 18.255L14.9972 15.005L9.36719 18.255L14.9972 21.505L20.6272 18.255Z" fill="#B7EBC0"/>
        <path d="M9.36719 18.255L14.9972 15.005V8.505L9.36719 11.755V18.255Z" fill="#8BDA99"/>
        <path d="M15 8.505V15.005L20.63 18.255V11.755L15 8.505Z" fill="#6CC17B"/>
        <path d="M14.9983 2.005L3.73828 8.505V21.505L14.9983 28.005L26.2583 21.505V8.505L14.9983 2.005Z" stroke="#609F7C" stroke-miterlimit="10"/>
      </svg>
    </div>
    <div class="resource-icon-wrapper">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26 3H4C3.44772 3 3 3.44772 3 4V26C3 26.5523 3.44772 27 4 27H26C26.5523 27 27 26.5523 27 26V4C27 3.44772 26.5523 3 26 3Z" fill="#D2A36A" stroke="#B3854D" stroke-miterlimit="10"/>
        <path d="M18.7405 8.50999C20.9805 9.80999 22.4905 12.22 22.4905 15C22.4905 19.14 19.1305 22.5 14.9905 22.5C10.8505 22.5 7.49047 19.14 7.49047 15C7.49047 12.22 9.00047 9.80999 11.2405 8.50999L9.60047 5.67999C7.11047 7.38999 5.48047 10.26 5.48047 13.5C5.48047 18.75 9.73047 23 14.9805 23C20.2305 23 24.4805 18.75 24.4805 13.5C24.4805 10.25 22.8505 7.38999 20.3605 5.67999L18.7405 8.50999Z" fill="#EBE3DB" stroke="#EBE3DB" stroke-miterlimit="10"/>
        <path d="M12.7568 14.9178L12.7431 15L12.7568 15.0822L14.5068 25.5822H15.4932L17.2432 15.0822L17.2569 15L17.2432 14.9178L15.4932 4.4178H14.5068L12.7568 14.9178Z" fill="#FFF4D1" stroke="#D2A36A"/>
        <path d="M15 13L9.5 15L15 17L20.5 15L15 13Z" fill="#FFF4D1"/>
        <path d="M13.5894 13.59L11.1094 18.89L16.4094 16.41L18.8894 11.11L13.5894 13.59Z" fill="#FFF4D1"/>
        <path d="M16.4094 13.59L18.8894 18.89L13.5894 16.41L11.1094 11.11L16.4094 13.59Z" fill="#FFF4D1"/>
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
  <div class="row totals">
    <span class="totals-label">Totals:</span>
    <span class="total" class:negative-total={totalC < 0}>{totalC}c</span>
    <span class="total" class:negative-total={totalO < 0}>{totalO}o</span>
    <span class="total" class:negative-total={totalK < 0}>{totalK}k</span>
    <span class="total" class:negative-total={totalQ < 0}>{totalQ}q</span>
    <span class="total" class:negative-total={totalV < 0}>{totalV}vp</span>
  </div>
  <div class="row footer">
    <button
      class="btn btn-new"
      on:click={addTurn(plan.turns.length)}
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M12.5,7H9V3.5a1,1,0,0,0-2,0V7H3.5a1,1,0,0,0,0,2H7v3.5a1,1,0,0,0,2,0V9h3.5a1,1,0,0,0,0-2Z"/></svg>
      New Turn
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      class:hide={activeTurnIndex === null}
      disabled={activeTurnIndex === 0}
      on:mousedown={(event) => event.preventDefault()}
      on:click={moveTurnUp(activeTurnIndex)}
      data-tooltip="Move up"
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L7,5.41V13a1,1,0,0,0,2,0V5.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,13.71,7.29Z"/></svg>
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      class:hide={activeTurnIndex === null}
      disabled={activeTurnIndex === plan.turns.length - 1}
      on:mousedown={(event) => event.preventDefault()}
      on:click={moveTurnDown(activeTurnIndex)}
      data-tooltip="Move down"
    >
      <svg class="icon flip-y" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L7,5.41V13a1,1,0,0,0,2,0V5.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,13.71,7.29Z"/></svg>
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      class:hide={activeTurnIndex === null}
      disabled={activeTurnIndex && plan.turns[activeTurnIndex].completed}
      on:mousedown={(event) => event.preventDefault()}
      on:click={toggleTurnExclude(activeTurnIndex)}
      data-tooltip={activeTurnIndex && plan.turns[activeTurnIndex].excluded ? "Include in plan" : "Exclude from plan"}
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.73,6.69c-1.27-2.58-3.85-4.19-6.73-4.19S2.55,4.11,1.27,6.69c-.4,.82-.4,1.8,0,2.62,1.27,2.58,3.85,4.19,6.73,4.19s5.45-1.6,6.73-4.19c.4-.82,.4-1.8,0-2.62Zm-1.79,1.74c-.93,1.9-2.82,3.07-4.93,3.07s-4-1.18-4.93-3.07c-.13-.27-.13-.59,0-.86,.93-1.9,2.82-3.07,4.93-3.07s4,1.18,4.93,3.07c.13,.27,.13,.59,0,.86Z"/><circle cx="8" cy="8" r="2"/></svg>
    </button>
    <button
      class="btn btn-icon btn-tooltip"
      class:hide={activeTurnIndex === null}
      disabled={activeTurnIndex && plan.turns[activeTurnIndex].excluded}
      on:mousedown={(event) => event.preventDefault()}
      on:click={toggleTurnComplete(activeTurnIndex)}
      data-tooltip={activeTurnIndex && plan.turns[activeTurnIndex].completed ? "Mark not done" : "Mark done"}
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.21,3.79c-.39-.39-1.02-.39-1.41,0l-6.29,6.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l4,4c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l7-7c.39-.39,.39-1.02,0-1.41Z"/></svg>
    </button>
    <button
      class:hide={activeTurnIndex === null}
      class="btn btn-icon btn-tooltip"
      on:mousedown={(event) => event.preventDefault()}
      on:click={deleteTurn(activeTurnIndex)}
      data-tooltip="Delete"
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.41,8l3.29-3.29c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-3.29,3.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l3.29,3.29-3.29,3.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29,3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41l-3.29-3.29Z"/></svg>
    </button>
    <button
      class="btn btn-icon"
      on:click={() => showMenu = !showMenu}
    >
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
    </button>
    <ul class="menu" class:hide={!showMenu}>
      {#if !plan.showNotes}
      <li><button class="btn btn-menu" on:click={() => {plan.showNotes = true; showMenu = false}}>Show Notes</button></li>
      {:else}
      <li><button class="btn btn-menu" on:click={() => {plan.showNotes = false; showMenu = false}}>Hide Notes</button></li>
      {/if}
      <li><button class="btn btn-menu" on:click={() => {duplicatePlan(plan); showMenu = false}}>Duplicate Plan</button></li>
      <li><button class="btn btn-menu" on:click={() => {deletePlan(plan); showMenu = false}}>Delete Plan</button></li>
    </ul>
  </div>
  {#if plan.showNotes}
  <div class="row">
    <textarea bind:value={plan.notes} rows="2" use:autosize class="input input-area"></textarea>
  </div>
  {/if}
</div>

<style>
  .plan {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 45px 0;
    width: 100%;
    position: relative;
  }

  .plan:first-child {
    margin-top: 15px;
  }

  .plan:not(:first-child):before {
    content: "";
    width: 700px;
    max-width: 100%;
    border-top: 2px solid hsl(0, 0%, 96%);
    position: relative;
    top: -45px;
  }

  /* header */

  .header {
    padding-top: 5px;
    padding-bottom: 5px;
    align-items: center;
  }

  .input-title {
    flex: 1 1 240px;
    font-weight: 500;
  }

  .input-title:not(:hover) {
    border-color: transparent;
  }

  .resource-icon-wrapper {
    align-items: center;
    display: flex;
    height: 30px;
    justify-content: center;
    margin-left: 8px;
    width: 54px;
  }

  /* totals */

  .totals-label {
    flex: 1 1 240px;
    min-width: 0;
  }

  .totals-label,
  .total {
    line-height: 36px;
    padding: 0 12px;
  }

  .totals {
    padding-bottom: 5px;
    padding-top: 5px;
  }

  .total {
    margin-left: 8px;
    width: 54px;
  }

  /* footer */

  .footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 5px;
  }

  .btn-icon {
    align-items: center;
    display: flex;
    height: 36px;
    justify-content: center;
    padding: 0;
    width: 36px;
  }

  .btn-icon + .btn-icon {
    margin-left: 8px;
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
  }

  .btn-tooltip:hover::before,
  .btn-tooltip:hover::after {
    opacity: 1;
    visibility: visible;
  }

  .btn-tooltip::before {
    background-color: hsl(0, 0%, 20%);
    border-radius: 4px;
    color: white;
    content: attr(data-tooltip);
    font-size: 13px;
    line-height: 24px;
    padding: 0 8px;
    position: absolute;
    bottom: -36px;
    white-space: nowrap;
  }

  .btn-tooltip::after {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid hsl(0, 0%, 20%);
    content: "";
    height: 0;
    position: absolute;
    bottom: -12px;
    width: 0;
  }

  .flip-y {
    transform: scaleY(-100%);
  }

  /* menu */

  .menu {
    background-color: hsl(0, 0%, 100%);
    border-radius: 4px;
    border: 1px solid hsl(0, 0%, 92%);
    box-shadow: 0 2px 6px hsl(0, 0%, 0%, 5%);
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 6px;
    position: absolute;
    top: 48px;
    width: 168px;
    z-index: 1;
  }

  li {
    list-style-type: none;
  }

  .btn-menu {
    background-color: hsl(0, 0%, 96%);
    text-align: left;
    width: 100%;
  }

  .btn-menu:not(:hover) {
    background-color: white;
  }

  .hide {
    display: none;
  }

  /* notes */

  .input-area {
    line-height: 24px;
    margin-top: 16px;
    padding-bottom: 5px;
    padding-top: 5px;
    resize: none;
    width: 100%;
  }
</style>
