<script>
  import Header from "../components/Header.svelte";
  import ModListView from "../components/ModListView/ModListView.svelte";

</script>
  

<div class="pt-2">
  <Header/>

  <div class="bg-white h-1.5 rounded-md my-2"/>
</div>

  
  <div class="grid lg:grid-cols-3 grid-cols-1 min-h-0">
    
    <div class="flex flex-col min-h-0">
      <div class="h-full">
        <div class="overflow-y-scroll scroll-smooth h-full">
          <div class="h-[200vh]">
            <ModListView/>
          </div>
        </div>
      </div>
    </div>


  </div>

<!--  
  <div class="grid lg:grid-cols-3 grid-cols-1 h-full">
    <section class="overflow-y-scroll h-full">
      <ModListView/>
    </section> 
    <section>
  s
    </section>
    <section>
  s
    </section>
  </div> -->
