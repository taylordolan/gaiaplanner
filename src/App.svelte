<script>
  import Plan from "./Plan.svelte";
  import { plans, newPlan } from './stores.js';
  import { sineOut } from 'svelte/easing';

  let showModal = false;

  const enter = () => {
    return {
      duration: 200,
      easing: sineOut,
      css: (t, u) => `opacity: ${t}; transform: translateY(${u * 40}px) scale(${.95 + t * 0.05})`
    }
  }

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

  const openModal = () => {
    // get width of body without scrollbar
    const bodyWidth = document.documentElement.clientWidth;

    // get current scroll position
    const scrollY = window.scrollY;

    // set `position: fixed` with scroll position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;

    // `position: fixed` removes from document flow, so we have to set the width manually.
    // we got width without scrollbar earlier so the content won't change its x position.
    document.body.style.width = `${bodyWidth}px`;

    showModal = true;
  }

  const closeModal = () => {
    const modalEl = document.getElementsByClassName("modal")[0];
    // similar to when we opened the modal, now we get the width of the modal without scrollbar
    const modalWidth = modalEl.clientWidth;

    // get target scroll position (of body)
    const scrollY = document.body.style.top;

    // undo the changes we made to the body when we opened the modal
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    // apply the width we got earlier to the modal, again to prevent the content from changing
    // its x position during the transition
    modalEl.style.width = `${modalWidth}px`;
    modalEl.style.overflow = "hidden";

    // reset the scroll position to the where it was before we opened the modal
    window.scrollTo(0, parseInt(scrollY || '0') * -1);

    showModal = false;
  }

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<main>
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
          on:click={openModal}
        >
          ?
        </button>
      </div>
    </div>
  </div>
  {#if showModal}
  <div
    class="modal"
    transition:enter
  >
    <div class="row row-header bold">
      Keyboard Shortcuts
      <button
        class="btn btn-icon btn-close"
        on:click={closeModal}
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

  .plans {
    padding: var(--sz-3) 0;
  }

  .modal {
    align-items: center;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
    height: 100vh;
    line-height: 28px;
    overflow: auto;
    padding: 44px 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
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
