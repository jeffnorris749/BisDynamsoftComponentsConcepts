<template>
  <v-app>
    <navBar></navBar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import navBar from './navBar.vue';

export default Vue.extend({
  name: 'App',
  components: {
    navBar
  },

  data: () => ({
    //
  }),
});
</script>
