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
  <input class:dim={!turn.enabled} class="input input-description" bind:value={turn.description}>
  {#each Object.entries(turn.resources) as resource}
    <input class:dim={!turn.enabled} class="input input-resource" type="number" bind:value={turn.resources[resource[0]]}>
  {/each}
  <button class="button-function" on:click={moveUp}>up</button>
  <button class="button-function" on:click={moveDown}>dn</button>
  <button class="button-function" on:click={toggle}>t</button>
  <button class="button-function" on:click={deleteTurn}>x</button>
</div>

<style>
  .turn {
    display: flex;
  }

  .input {
    border: 1px solid #ddd;
    line-height: 30px;
    padding: 0 4px;
    color: inherit;
    border-radius: 4px;
  }

  .input-description {
    width: 240px;
  }

  .input-resource {
    padding-right: 0;
  }

  .input-resource {
    width: 48px;
    margin-left: 12px;
  }

  .button-function {
    margin-left: 12px;
  }

  .dim {
    opacity: .2;
  }
</style>
