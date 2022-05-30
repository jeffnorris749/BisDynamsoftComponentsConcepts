<template>
  <div class="componentGrid">
    <v-btn 
      v-for="(component,index) in componentSelectors" 
      :key="index" class="componentButtons"
      @click = "component.show = true"
    >
      {{component.componentName}}
      <v-dialog
        v-model="component.show"
        scrollable
      >
        <v-card class = "pa-5 componentCard">
          <h1 class="mb-1">{{component.componentName}} Component</h1>
          <v-divider></v-divider>
          <component v-bind:is="component.componentName"></component>
        </v-card>
    </v-dialog>
    </v-btn>
  </div>
</template>

<script>
import BulkScanning from '@/components/BulkScanning.vue'
export default ({
  components: {
    BulkScanning,
  },
  data: () => ({
    componentSelectors: [
      {
        componentName: 'BulkScanning',
        show: false
      },
    ]
  })
  
});
</script>

<style>
.componentGrid{
  margin-top: 3%;
  display:block;
}
.componentButtons{
  margin-left: 10px;
  margin-top: 10px;
  width: 10%;
}
.componentCard{
  flex: auto;
}
</style>
