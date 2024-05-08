<template>
  <div>
    Element is disabled
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TextEditor from '@/components/ui/TextEditor.vue';

@Component({ components: { TextEditor }})
export default class ElementSettingsDisabledNote extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
