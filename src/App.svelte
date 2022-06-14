<script>
  import Plan from "./Plan.svelte";
  import { plans, newPlan } from './stores.js';

  let showModal = false;

  const addPlan = () => {
    $plans = [...$plans, $newPlan()];
  }

  const deletePlan = (plan) => {
    let index = $plans.indexOf(plan);
    if (index !== -1) {
      $plans.splice(index, 1);
      $plans = $plans;
    }
  }

  const duplicatePlan = (plan) => {
    let index = $plans.indexOf(plan);
    if (index !== -1) {
      $plans.splice(index, 0, structuredClone(plan));
      $plans = $plans;
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      showModal = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<main class:no-scroll={showModal}>
  <div class="plans">
    {#each $plans as plan}
    <Plan
      bind:plan={plan}
      {deletePlan}
      {duplicatePlan}
    />
    {/each}
    <div class="plan">
      <div class="row">
        <button class="btn btn-new" on:click={addPlan}>
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M12.5,7H9V3.5a1,1,0,0,0-2,0V7H3.5a1,1,0,0,0,0,2H7v3.5a1,1,0,0,0,2,0V9h3.5a1,1,0,0,0,0-2Z"/></svg>
          New Plan
        </button>
        <button
          class="btn btn-icon btn-close"
          on:mousedown={() => showModal = true}
        >
          ?
        </button>
      </div>
    </div>
  </div>
  {#if showModal}
  <div class="modal plan">
    <div class="row row-header bold">
      Keyboard Shortcuts
      <button
        class="btn btn-icon btn-close"
        on:mousedown={() => showModal = false}
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.41,8l3.29-3.29c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-3.29,3.29-3.29-3.29c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l3.29,3.29-3.29,3.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29,3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41l-3.29-3.29Z"/></svg>
      </button>
    </div>
    <ol class="list-shortcuts">
      <li class="row row-shortcut">
        New turn
        <span class="key">enter</span>
      </li>
      <li class="row row-shortcut">
        Focus previous turn
        <span class="key key-square"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29L8.71,2.29c-.09-.09-.2-.17-.33-.22-.24-.1-.52-.1-.76,0-.12,.05-.23,.12-.33,.22L2.29,7.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29v7.59c0,.55,.45,1,1,1s1-.45,1-1V5.41l3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41Z"/></svg></span>
      </li>
      <li class="row row-shortcut">
        Focus next turn
        <span class="key key-square"><svg class="icon flip-y" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29L8.71,2.29c-.09-.09-.2-.17-.33-.22-.24-.1-.52-.1-.76,0-.12,.05-.23,.12-.33,.22L2.29,7.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29v7.59c0,.55,.45,1,1,1s1-.45,1-1V5.41l3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41Z"/></svg></span>
      </li>
      <li class="row row-shortcut">
        Move turn up
        <span class="key">alt</span>
        <span class="key key-square"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29L8.71,2.29c-.09-.09-.2-.17-.33-.22-.24-.1-.52-.1-.76,0-.12,.05-.23,.12-.33,.22L2.29,7.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29v7.59c0,.55,.45,1,1,1s1-.45,1-1V5.41l3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41Z"/></svg></span>
      </li>
      <li class="row row-shortcut">
        Move turn down
        <span class="key">alt</span>
        <span class="key key-square"><svg class="icon flip-y" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.71,7.29L8.71,2.29c-.09-.09-.2-.17-.33-.22-.24-.1-.52-.1-.76,0-.12,.05-.23,.12-.33,.22L2.29,7.29c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29l3.29-3.29v7.59c0,.55,.45,1,1,1s1-.45,1-1V5.41l3.29,3.29c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29c.39-.39,.39-1.02,0-1.41Z"/></svg></span>
      </li>
      <li class="row row-shortcut">
        Exclude turn from plan
        <span class="key">alt</span>
        <span class="key key-square">,</span>
      </li>
      <li class="row row-shortcut">
        Mark turn done
        <span class="key">alt</span>
        <span class="key key-square">.</span>
      </li>
      <li class="row row-shortcut">
        Delete turn
        <span class="key">alt</span>
        <span class="key key-square">/</span>
      </li>
      <li class="row row-shortcut">
        Show keyboard shortcuts
        <span class="key key-square">?</span>
      </li>
    </ol>
    <div class="row">
      <p>Hi, I’m <a href="https://twitter.com/taylordolan">@taylordolan</a>! I made this tool to help with planning turns in <a href="https://boardgamegeek.com/boardgame/220308/gaia-project">Gaia Project</a>, a brilliant game by Helge Ostertag and Jens Drögemüller. If you want to play, come join me on <a href="https://www.boardgamers.space/user/coyboy">BGS</a>!</p>
    </div>
  </div>
  {/if}
</main>

<style>
  main {
    color: var(--gray-6);
    font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-size: var(--font-size);
  }

  .no-scroll {
    height: 100vh;
    overflow: hidden;
  }

  .modal {
    background-color: var(--white);
    height: 100vh;
    line-height: 28px;
    position: absolute;
    top: 0;
  }

  .btn-close {
    border-radius: 50%;
    margin-left: auto;
  }

  .list-shortcuts {
    border-top: var(--border) solid var(--gray-2);
    margin-bottom: 28px;
    margin-top: 28px;
    max-width: 100%;
  }

  .row-header {
    margin-top: var(--sz-4);
  }

  .row-shortcut {
    border-bottom: var(--border) solid var(--gray-2);
    padding-top: var(--sz-3);
    padding-bottom: var(--sz-3);
  }

  .key {
    align-items: center;
    border-radius: var(--radius);
    border: 2px solid var(--gray-2);
    display: flex;
    justify-content: center;
    line-height: calc(28px - 2px * 2);
    margin-left: auto;
    padding: 0 8px;
  }

  .key + .key {
    margin-left: var(--sz-2);
  }

  .key-square {
    height: 28px;
    padding: 0;
    width: 28px;
  }

  a {
    color: var(--blue);
  }
</style>
