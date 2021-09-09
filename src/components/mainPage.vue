<template>
  <div>
      <manager-main-page></manager-main-page>
  </div>
</template>

<script>
import ManagerMainPage from './managerPanel/managerMainPage.vue';
export default {
    components: { ManagerMainPage },
  data() {
    return {  
      selectedItem:0,
    }
  }

}
</script>

<style>

</style>