<script lang="ts">

    export let type: string;

</script>


{#if type == "texture pack"}
    <div class="border border-green-600 bg-green-600/50 text-xs p-0.5 rounded-md m-2 text-center font-bold">
        Texture Pack
    </div>
{:else if type == "mod"}
    <div class="border border-red-600 bg-red-600/50 text-xs p-0.5 rounded-md m-2 text-center font-bold">
        Mod
    </div>
{/if}