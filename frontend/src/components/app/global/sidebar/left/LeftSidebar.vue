<template>
  <div class="sidebar sidebar--left">
    <element-toolbar small />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import ElementToolbar from "@/components/app/global/element-toolbar/ElementToolbar.vue";

@Options({
  components: {
    ElementToolbar,
  },
})
export default class LeftSidebar extends Vue {}
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: var(--color-background);
  border-right: 1px solid var(--color-background--dark);
}
</style>
