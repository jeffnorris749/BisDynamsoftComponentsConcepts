<template>
  <div>
    <v-app-bar dense fixed id="mainNavBar">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="white"></v-app-bar-nav-icon>
    </v-app-bar>
     <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="blue--text text--accent-6"
        >
          <v-list-item 
          v-for="(page,index) in pageFocus" :key="index"
          @click="changePageFocus(page.routeName)"
          >
            <v-list-item-title>{{page.pageFocusName}}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>

export default {
  data: () => ({
      drawer: false,
      group: null,
      pageFocus: [
        {
          pageFocusName: "Scanning Components",
          icon: "bi bi-upc-scan",
          routeName: "scanningcomponents"
        },
        {
          pageFocusName: "Personalized Plates",
          icon: "bi bi-card-heading",
          routeName: "personalizedplates"
        },
        {
          pageFocusName: "Dynamsoft Image Scanner",
          icon: "bi bi-card-heading",
          routeName: "imagescanner"
        }
      ]
  }),
  methods:{
    changePageFocus(routeName){
      this.$router.push({name: routeName})
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  }
}
</script>

<style scoped lang="scss">

#nav-view {
  height: 100vh;
}

#mainNavBar {
  position: fixed;
  top: 0;
  background-color: black;
}
</style>
