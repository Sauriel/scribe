<template>
  <div class="about-us">
    <heading>{{ $t("about-us.header", { appName: $t("global.app.name") }) }}</heading>
    <p class="roadmap" v-html="$t('about-us.roadmap')" />
    <div class="about-us-content">
      <heading small>{{ $t("about-us.3rd-party.header") }}</heading>
      <article class="license">
        <header class="license-header">{{ $t("about-us.3rd-party.mask-brushes.header") }}</header>
        <p class="license-info" v-html="$t('about-us.3rd-party.mask-brushes.text')" />
      </article>
    </div>
    <footer>
      <btn outline @click="$emit('close')">{{ $t("about-us.footer.close") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-property-decorator";

@Options({
  emits: ["close"],
})
export default class AboutModalContent extends Vue {}
</script>

<style lang="scss" scoped>
.about-us {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &-content {
    display: flex;
    flex-direction: column;
    max-width: 560px;

    .license {
      &-header {
        font-size: 1.2em;
        font-weight: bold;
      }

      &-info {
        margin: 0.2em 0;
        padding-left: 1em;

        &:deep(a) {
          color: inherit;
        }
      }
    }
  }

  .roadmap {
    &:deep(a) {
      color: var(--color-secondary);
    }
  }

  footer {
    display: flex;
    justify-content: space-between;
    margin: 0 -10px -10px;

    & > button {
      flex-grow: 0;
    }
  }
}
</style>
