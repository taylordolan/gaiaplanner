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
    <input on:focus={()=>console.log(this)} class:disabled={!turn.enabled} class="input input-num" type="number" bind:value={turn.resources[resource[0]]}>
  {/each}
  <button class="btn" on:click={moveUp}>up</button>
  <button class="btn" on:click={moveDown}>dn</button>
  <button class="btn" on:click={toggle}>t</button>
  <button class="btn" on:click={deleteTurn}>x</button>
</div>

<style>
  .turn {
    display: flex;
    flex: 0 1 auto;
  }

  .turn:not(:first-child) {
    margin-top: 10px;
  }

  .input,
  .btn {
    min-width: 0;
  }

  .input-desc {
    width: 240px;
  }

  .input-num {
    margin-left: 8px;
    padding-right: 0;
    flex: 0 1 54px;
  }

  .btn {
    margin-left: 8px;
    min-width: 0;
  }

  .disabled {
    opacity: .25;
  }
</style>
