<template>
  <div class="editor-menu">
    <div class="actions">
      <ScTextareaActionFontFamily />
      <span class="separator" />
      <ScTextareaActionFontSize v-model="test" />
      <span class="separator" />
      <ScTextareaMenuButton
        icon="ic:round-format-bold"
        :tooltip="$t('tiptap.menu.actions.bold.tooltip')"
        :position="fullscreen ? 'bottom' : 'top'"
      />
      <ScTextareaMenuButton
        icon="ic:round-format-italic"
        :tooltip="$t('tiptap.menu.actions.italic.tooltip')"
        :position="fullscreen ? 'bottom' : 'top'"
      />
      <ScTextareaMenuGroup
        icon="ic:round-format-underlined"
        :expanded="fullscreen"
      >
        <ScTextareaMenuButton
          icon="ic:round-format-underlined"
          :tooltip="$t('tiptap.menu.actions.underline.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
        <ScTextareaMenuButton
          icon="ic:round-strikethrough-s"
          :tooltip="$t('tiptap.menu.actions.strikethrough.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
        <!-- capitalize, uppercase, lowercase -->
        <ScTextareaMenuButton
          icon="ic:round-format-size"
          :tooltip="$t('tiptap.menu.actions.style.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
      </ScTextareaMenuGroup>
      <ScTextareaActionColor />
      <span class="separator" />
      <ScTextareaMenuGroup
        icon="ic:round-format-align-left"
        :expanded="fullscreen"
      >
        <ScTextareaMenuButton
          icon="ic:round-format-align-left"
          :tooltip="$t('tiptap.menu.actions.align-left.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
        <ScTextareaMenuButton
          icon="ic:round-format-align-center"
          :tooltip="$t('tiptap.menu.actions.align-center.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
        <ScTextareaMenuButton
          icon="ic:round-format-align-right"
          :tooltip="$t('tiptap.menu.actions.align-right.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
        <ScTextareaMenuButton
          icon="ic:round-format-align-justify"
          :tooltip="$t('tiptap.menu.actions.align-justify.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
      </ScTextareaMenuGroup>
      <span class="separator" />
      <!-- list -->
      <ScTextareaMenuButton
        icon="ic:round-format-line-spacing"
        :tooltip="$t('tiptap.menu.actions.line-height.tooltip')"
        :position="fullscreen ? 'bottom' : 'top'"
      />
      <span class="separator" />
      <ScTextareaMenuGroup
        icon="ic:round-format-list-bulleted"

        :expanded="fullscreen"
      >
        <ScTextareaMenuButton
          icon="ic:round-format-list-bulleted"
          :tooltip="$t('tiptap.menu.actions.bullet-list.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
        <!-- list -->
        <ScTextareaMenuButton
          icon="ic:round-format-list-numbered"
          :tooltip="$t('tiptap.menu.actions.ordered-list.tooltip')"
          :position="fullscreen ? 'bottom' : 'top'"
        />
      </ScTextareaMenuGroup>
      <span class="separator" />
      <ScTextareaMenuButton
        icon="mdi:table"
        :tooltip="$t('tiptap.menu.actions.table.tooltip')"
        :position="fullscreen ? 'bottom' : 'top'"
      />
      <span class="separator" />
      <ScTextareaMenuButton
        icon="ic:round-link"
        :tooltip="$t('tiptap.menu.actions.link.tooltip')"
        :position="fullscreen ? 'bottom' : 'top'"
      />
      <ScTextareaMenuButton
        icon="ic:round-image"
        :tooltip="$t('tiptap.menu.actions.image.tooltip')"
        :position="fullscreen ? 'bottom' : 'top'"
      />
      <!-- columns, first-line, first-letter -->
      <ScTextareaMenuButton
        icon="fa6-solid:wand-magic-sparkles"
        :tooltip="$t('tiptap.menu.actions.optimize.tooltip')"
        :position="fullscreen ? 'bottom' : 'top'"
      />
    </div>
    <ScTextareaMenuButton
      :icon="fullscreen ? 'bx:collapse' : 'bx:expand'"
      :tooltip="$t('tiptap.menu.actions.fullscreen.tooltip')"
      position="left"
      @click="emit('fullscreen:toggle')"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  compact?: boolean;
  fullscreen: boolean;
}

type Emits = {
  'fullscreen:toggle': [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const test = ref(12);
</script>

<style scoped>
.editor-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em;
  background-color: var(--color-background-900);
  color: var(--color-foreground-500);
  border-radius: var(--border-radius);
}
.actions {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.expanded {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

.separator {
  display: inline-block;
  height: 1.2em;
  width: 1px;
  background-color: var(--color-background-400);
  flex: 0 0 auto;
  margin: 0 0.25em;
}
</style>