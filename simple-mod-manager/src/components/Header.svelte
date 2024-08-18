<script lang="ts">
  import { invoke } from '@tauri-apps/api';
    import { open } from '@tauri-apps/api/dialog';

    async function import_file() {
                       
        const selected = await open({
        multiple: false,
        filters: [{
            name: 'Markdown',
            extensions: ['md'],
           
        }]
        });

        if (selected !== null){
            await invoke("load_file",{filePath:selected});
        }
         
    }
// Open a selection dialog for image files

</script>

<section class="grid grid-cols-3">

    <center class="col-start-2">
      <h1 class="text-3xl font-thin font-mono">
        Simple Mod Manager
      </h1>
    </center>
    <div class="flex flex-row justify-end w-full">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded max-h-12 text-nowrap" on:click={import_file}>
            Import Mod List
        </button>
    </div>
</section>