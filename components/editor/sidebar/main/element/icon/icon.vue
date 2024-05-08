<template>
  <div
    class="element"
    draggable="true"
    :class="{
      'has-variants': !groupVariants && hasVariants,
      'expanded': expanded,
      'favorite': item.favorite,
      'group': (expanded && !groupVariants) || isExpandedVariant,
      'disabled': isNotAvailable
    }"
    @click="onElementClick"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <Icon
      :name="item.icon"
      class="element-icon"
    />
    <caption class="element-caption">
      {{ $t(`elements.list.${item.name}`) }}
    </caption>
    <Icon
      :name="item.favorite ? 'mdi:heart' : 'mdi:heart-outline'"
      class="fav"
      @click="onFavoriteClick"
    />
  </div>
  <template v-if="groupVariants || expanded">
    <EditorSidebarMainElementIcon
      v-for="(element, index) of item.variants"
      :key="index"
      :item="element"
      :group-variants="groupVariants"
      :is-expanded-variant="expanded && !groupVariants"
    />
  </template>
</template>

<script setup lang="ts">
  import type LayoutElement from './models';
  import { useElementsStore } from '~~/store/elements';
  import { ELEMENT_FUNCTIONS } from '~~/models/elements/elements';

  type Props = {
    item: LayoutElement;
    groupVariants: boolean;
    isExpandedVariant?: boolean;
  }

  const props = defineProps<Props>();

  const elementsStore = useElementsStore();

  const expanded = ref(false);
  const hasVariants = computed(() => props.item.variants?.length || 0 > 0);
  const isNotAvailable = computed(() => !ELEMENT_FUNCTIONS[props.item.name]);

  function onElementClick() {
    if (hasVariants.value) {
      expanded.value = !expanded.value;
    }
  }

  function onFavoriteClick() {
    // eslint-disable-next-line vue/no-mutating-props
    props.item.favorite = !props.item.favorite; // ToDo [2023-07-01]: replace with logic
  }

  function onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('action', 'create');
    }
    elementsStore.dragging = props.item;
  }

  function onDragEnd() {
    elementsStore.dragging = null;
  }

</script>

<style scoped>
.element {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-background-500);
  border-radius: var(--border-radius);
  position: relative;
  cursor: move;
}

.element.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.element:hover {
  color: var(--color-primary-400);
  box-shadow:  1px 1px 2px 0px #111;
}

.element:hover > .fav {
  display: block;
}

.element-icon {
  font-size: 2.5rem;
}

.element-caption {
  font-size: 0.8em;
}

.element.has-variants::after {
  content: "";
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  border: 0.25rem solid transparent;
  border-bottom-color: var(--color-foreground-500);
  border-right-color: var(--color-foreground-500);
  border-bottom-right-radius: calc(var(--border-radius) / 2);
  transition: transform var(--animation);
}

.element.has-variants:hover::after {
  border-bottom-color: var(--color-primary-400);
  border-right-color: var(--color-primary-400);
}

.element.has-variants.expanded::after {
  transform: rotate(45deg);
}

.element.group {
  outline: 1px solid var(--color-background-700)
}

.element > .fav {
  display: none;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
}

.element.favorite > .fav {
  color: var(--color-alert-500);
}
</style>