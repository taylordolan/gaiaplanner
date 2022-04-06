<script>
  export let turn;
  export let moveUp;
  export let moveDown;
  export let deleteTurn;

  let toggle = () => {
    turn.enabled = !turn.enabled;
  }
</script>

<div class="turn">
  <input class:disabled={!turn.enabled} class="input input-desc" bind:value={turn.description}>
  {#each Object.entries(turn.resources) as resource}
    <input class:disabled={!turn.enabled} class="input input-num" type="number" bind:value={turn.resources[resource[0]]}>
  {/each}
  <button class="button" on:click={moveUp}>up</button>
  <button class="button" on:click={moveDown}>dn</button>
  <button class="button" on:click={toggle}>t</button>
  <button class="button" on:click={deleteTurn}>x</button>
</div>

<style>
  .turn {
    display: flex;
    flex: 0 1 auto;
  }

  .turn:not(:first-child) {
    margin-top: 10px;
  }

  .button,
  .input {
    min-width: 0;
  }

  .input-desc {
    width: 240px;
  }

  .input-num {
    margin-left: 8px;
    padding-right: 0;
    flex: 0 1 48px;
  }

  .disabled {
    opacity: .25;
  }

  .button {
    margin-left: 8px;
    min-width: 0;
  }
</style>
