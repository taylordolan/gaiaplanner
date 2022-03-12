<script>
  import Plan from "./Plan.svelte";
  export let game;
</script>

{#each game as plan}
  <Plan bind:plan={plan}/>
{/each}

<style>
</style>
