<template>
  <v-app>
     <component :is="currentHeader" v-if="currentHeader"/>
      <router-view/>
  </v-app>
</template>

<script>
import EmployeeHeaderComponent from './components/EmployeeHeaderComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import DiningHeaderComponent from './components/DiningHeaderComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    EmployeeHeaderComponent,
    DiningHeaderComponent
  },
  computed: {
    currentHeader() {
      const headerType = this.$route.meta?.header;
      if (headerType == null) {
        return null;
      }

      if (headerType === 'DiningHeaderComponent') {
        return DiningHeaderComponent;
      } else if (headerType === 'EmployeeHeaderComponent') {
        return EmployeeHeaderComponent;
      } else {
        return HeaderComponent;
      }
    }
  }
}
</script>

<style>

</style>
