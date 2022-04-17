<script>
  import Turn from "./Turn.svelte";
  import { newTurn, newPlan } from './stores.js';
  export let plan;

  let activeIndex = null;
  let activeElement = null;

  const addTurn = () => {
    // make sure the new turn's id is unique
    let greatest = 0;
    for (var i = 0; i < plan.length; i++) {
      let next = plan[i].id;
      if (next > greatest) {
        greatest = next;
      }
    }
    plan = [...plan, $newTurn(greatest + 1)];
  }

  const moveTurn = (index, dir) => {
    const dest = index + dir;
    var turn = plan[index];
    plan.splice(index, 1);
    plan.splice(dest, 0, turn);
    plan = plan;
    activeIndex += dir;
    setTimeout(() => {
      activeElement.focus();
    }, 1);
  }

  let toggleTurn = (index) => {
    plan[index].enabled = !plan[index].enabled;
    plan = plan;
  }

  const deleteTurn = (index) => {
    plan.splice(index, 1);
    plan = plan;
  }

  const reset = () => {
    plan = $newPlan();
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

  $: totalC = getTotal(plan.turns, "c");
  $: totalO = getTotal(plan.turns, "o");
  $: totalK = getTotal(plan.turns, "k");
  $: totalQ = getTotal(plan.turns, "q");
  $: totalV = getTotal(plan.turns, "v");
</script>

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
    bind:activeIndex={activeIndex}
    bind:activeElement={activeElement}
    bind:turn={turn}
    turnIndex={i}
  />
  {/each}
  <div class="row totals">
    <span class="totals-label">Totals:</span>
    <span class="total">{totalC}c</span>
    <span class="total">{totalO}o</span>
    <span class="total">{totalK}k</span>
    <span class="total">{totalQ}q</span>
    <span class="total">{totalV}vp</span>
  </div>
  <div class="row footer">
    <button class="btn btn-new" on:click={addTurn}>New Turn</button>
    <button disabled={activeIndex === 0} class:hide={activeIndex === null} class="btn btn-icon" on:mousedown={(event) => event.preventDefault()} on:click={(event) => moveTurn(activeIndex, -1)}>
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L7,5.41V13a1,1,0,0,0,2,0V5.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,13.71,7.29Z"/></svg>
    </button>
    <button disabled={activeIndex === plan.length - 1} class:hide={activeIndex === null} class="btn btn-icon" on:mousedown={(event) => event.preventDefault()} on:click={moveTurn(activeIndex, 1)}>
      <svg class="icon flip-y" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L7,5.41V13a1,1,0,0,0,2,0V5.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,13.71,7.29Z"/></svg>
    </button>
    <button class:hide={activeIndex === null} class="btn btn-icon" on:mousedown={(event) => event.preventDefault()} on:click={toggleTurn(activeIndex)}>
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.73,6.69c-1.27-2.58-3.85-4.19-6.73-4.19S2.55,4.11,1.27,6.69c-.4,.82-.4,1.8,0,2.62,1.27,2.58,3.85,4.19,6.73,4.19s5.45-1.6,6.73-4.19c.4-.82,.4-1.8,0-2.62Zm-1.79,1.74c-.93,1.9-2.82,3.07-4.93,3.07s-4-1.18-4.93-3.07c-.13-.27-.13-.59,0-.86,.93-1.9,2.82-3.07,4.93-3.07s4,1.18,4.93,3.07c.13,.27,.13,.59,0,.86Z"/><circle cx="8" cy="8" r="2"/></svg>
    </button>
    <button class:hide={activeIndex === null} class="btn btn-icon" on:mousedown={(event) => event.preventDefault()} on:click={deleteTurn(activeIndex)}>
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.41,8l3.29-3.29c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-3.29,3.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l3.29,3.29-3.29,3.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29,3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41l-3.29-3.29Z"/></svg>
    </button>
    <button class="btn btn-icon">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
    </button>
  </div>
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

  .btn-new {
    margin-right: auto;
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

  .icon {
    fill: hsl(0, 0%, 30%);
    height: 16px;
    width: 16px;
  }

  .flip-y {
    transform: scaleY(-100%);
  }

  .hide {
    display: none;
  }
</style>
