<template>
  <button
    class="font-select"
    @click="onButtonClick"
  >
    <span
      class="selected-font"
      :style="{ fontFamily: selectedFont }"
    >{{ selectedFont }}</span>
    <Icon name="charm:chevron-down" />
    <ul
      v-if="open"
      class="font-list"
    >
      <li
        v-for="(font, index) in fonts"
        :key="index"
        :style="{ fontFamily: font }"
        class="font-item"
        @click="selectedFont = font"
      >
        {{ font }}
      </li>
    </ul>
  </button>
</template>

<script setup lang="ts">
import { useStyleTag } from '@vueuse/core'
declare type GoogleFontVariantRegular = '100' | '200' | '300' | 'regular' | '500' | '600' | '700' | '800' | '900';
declare type GoogleFontVariantItalic = '100italic' | '200italic' | '300italic' | 'italic' | '500italic' | '600italic' | '700italic' | '800italic' | '900italic';
declare type GoogleFontVariant = GoogleFontVariantRegular | GoogleFontVariantItalic;

declare type GoogleFont = {
  family: string;
  files: Record<GoogleFontVariant, string>;
}

declare type GoogleFontsApiResponse = {
  items: GoogleFont[];
}

// type Props = {
//   value: string;
// }

// type Emits = {
//   (e: 'update', payload: string): void;
// }

// const props = defineProps<Props>();
// const emit = defineEmits<Emits>();

const runtimeConfig = useRuntimeConfig();

const { css } = useStyleTag('', { id: 'google-fonts' });

const selectedFont = ref('Fira Sans');
const fonts = ref<string[]>([]);
const open = ref(false);

// ToDo [2023-07-07] Use virtual scroller

onMounted(loadGoogleFonts);

function addFont(font: GoogleFont): string[] {
  const fontList: string[] = [];
  for (const [variant, url] of Object.entries(font.files)) {
    let style = 'normal';
    let weight = '400';
    if (variant.includes('italic')) {
      style = 'italic';
      if (variant !== 'italic') {
        weight = variant.replace('italic', '');
      }
    } else {
      weight = variant;
    }
    const fontFaceStyle = `@font-face {
  font-family: '${font.family}';
  font-style: ${style};
  font-weight: ${weight};
  src: local(''), url('${url}') format('woff2');
}
`;
    fontList.push(fontFaceStyle);
  }
  return fontList;
}

function loadGoogleFonts() {
  const apiEndpoint = 'https://www.googleapis.com/webfonts/v1/webfonts';
  const params = {
    key: runtimeConfig.public.apiKeys.googleFonts,
    sort: 'alpha',
    fields: 'items(family,files)',
    capability: 'WOFF2',
  };
  const url = `${apiEndpoint}?${new URLSearchParams(params)}`;
  $fetch<GoogleFontsApiResponse>(url)
    .then((response) => {
      if (response) {
        const fontList: string[] = [];
        for (const font of response.items) {
          fontList.push(...addFont(font));
          fonts.value.push(font.family);
        }
        css.value = fontList.join('');
      }
    });
}

function onButtonClick() {
  open.value = !open.value;
}
</script>

<style scoped>
.font-select {
  display: flex;
  gap: 00.25em;
  background-color: var(--color-background-600);
  border: none;
  padding: 0.25em 0.5em;
  border-radius: var(--border-radius);
  color: var(--color-foreground-500);
  position: relative;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.selected-font {
  font-size: 0.75em;
  white-space: nowrap;
}

.font-list {
  position: absolute;
  top: calc(100% + 0.25em);
  left: 0;
  background-color: var(--color-background-600);
  border-radius: var(--border-radius);
  padding: 0.25em 0;
  margin: 0;
  list-style: none;
  z-index: 1;
  max-height: 20em;
  max-width: 26ch;
  overflow-y: auto;
  font-size: 0.75em;
}

.font-item {
  padding: 0.25em 0.5em;
  white-space: nowrap;
  text-align: left;
}

.font-item:hover {
  background-color: var(--color-background-700);
}
</style>