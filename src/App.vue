<template>
  <div id="app">
    <router-view />
    <blibli v-if="blibli" />
  </div>
</template>

<script>
import blibli from "@/components/blibli";
import defaultSettings from "@/settings";
export default {
  name: "App",
  components: { blibli },
  data() {
    return { blibli: defaultSettings.bulletChat };
  }
};
</script>
