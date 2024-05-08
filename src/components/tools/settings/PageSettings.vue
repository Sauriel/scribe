<template>
  <div>
    <h1>PageSettings</h1>
    <background />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Background from "@/components/tools/page/Background.vue";

@Component({ components: { Background }})
export default class PageSettings extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
