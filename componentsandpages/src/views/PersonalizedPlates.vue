<template>
  <div class="componentGrid">
    <v-btn v-for="(component,index) in componentSelectors" :key="index" class="componentButtons">{{component.componentName}}
    </v-btn>
  </div>
</template>

<script>

export default ({
  data: () => ({
    componentSelectors: [{componentName: 'PersonalizedPlates'}
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
</style>
