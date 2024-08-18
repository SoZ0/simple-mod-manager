<script lang="ts">
    import { listen } from "@tauri-apps/api/event";
    import ListItem from "./ListItem.svelte";
    import type { ModInfo } from "./types";
    import { invoke } from "@tauri-apps/api";
  
    let data: ModInfo[] = [];
  
    listen("mod-list-update", (event) => {
      // Check if the payload is an array
      if (Array.isArray(event.payload)) {
          // Update the array reactively by creating a new array
          data = [
              ...data,
              ...event.payload.map((mod) => ({
                  imageUrl: mod.imageUrl || "default-image-url", // Replace with actual logic if needed
                  title: mod.name || "Unknown Mod",
                  description: mod.description || "No description available", // Replace with actual logic if needed
                  link: mod.link || "", // Provide a default link if not available
                  icon: mod.site || "unknown", // This assumes mod.site has the correct value
                  type: "mod",
              }))
          ];
          console.log("Updated data:", data);
      } else {
          console.error("Received payload is not an array:", event.payload);
      }
    });
  </script>
  
  <ul>
      {#each data as mod}
          <li>
              <ListItem data={mod}/>
          </li>
      {/each}     
  </ul>
  