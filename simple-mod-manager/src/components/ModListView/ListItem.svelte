<script lang="ts">
    import ModTypeChip from "../ModTypeChip.svelte";
import { type ModInfo } from "./types"
    export let data: ModInfo;
    

</script>


<div class="flex flex-row bg-slate-900/90 p-4 rounded-md hover:bg-slate-900/60 transition-all duration-200 gap-4 relative max-h-28 overflow-hidden">
    <img class="h-20 aspect-square" src={data.imageUrl} alt={data.title}/>
    <div>
        <div class="flex flex-row gap-2 items-center">
            <h1 class="text-2xl font-bold">{data.title}</h1>
            <img class=" w-8 aspect-square" src={data.icon == "curseforge" ? "curseforge.svg" : "modrinth.svg"} alt="curseforge"/>
            <ModTypeChip type={data.type}/>
        </div>  
        <p class="text-sm">
            {data.description}
        </p>
    </div>
    <a class="flex-1 flex justify-between gap-4 items-center min-w-20" href={data.link} target="_blank">
        <div class="border-2 ml-auto cursor-pointer hover:text-slate-950 duration-200 relative after:absolute font-semibold after:top-0 after:bg-white after:right-full after:w-full after:h-full after:duration-200 hover:after:translate-x-full after:z-[1] overflow-hidden rounded-md p-1">
            <p class="relative z-[5]">Go to &rarr;</p>
        </div>
    </a>    
</div>  