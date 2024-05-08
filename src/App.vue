<template>
  <div class="app">
    <div class="app-info" v-if="showInfo">
      <div class="welcome">
        <h1>
          <font-awesome-icon icon="exclamation-circle" color="#f14235" />
          ATTENTION: Norn becomes Scribe
        </h1>
        <div class="info">
          <p>
            Hello dear Norn users.
          </p>
          <p>
            Norn will be shut down on July 1, 2022 and replaced by <a href="https://scribe.sauriel.net" target="_blank">Scribe</a>!
          </p>
          <p>
            You have until then to save your Norn documents and import them into Scribe.
          </p>
          <p>
            And please join us in our <a href="https://discord.gg/JDxGbK8f3n" target="_blank">DISCORD community</a> where we discuss future plans.
          </p>
          <a href="https://scribe.sauriel.net" target="_blank">
            <img :src="scribePreview" />
          </a>
        </div>
      </div>
      <font-awesome-icon icon="times" @click="showInfo = false"/>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VuexHelper from "@/helper/VuexHelper";
import AppDocument from "@/models/AppDocument";
import { LS_SAVE_SLOT } from "@/components/ui/SaveAndLoadButtons.vue";
import { LAYOUT_ELEMENT_CACHE } from '@/chaches';
import * as DEFAULT_DOCUMENT from "@/assets/default_document.json";

const appStore = VuexHelper.createNamespace("appStore");

@Component
export default class App extends Vue {

  private scribePreview = require("./assets/scribe_preview.png");
  private showInfo = true;

  created() {
    const documentFromLS = localStorage.getItem(LS_SAVE_SLOT);
    if (documentFromLS) {
      const appDocument: AppDocument = JSON.parse(documentFromLS);
      appStore.commit("setDocument", appDocument);
      LAYOUT_ELEMENT_CACHE.build();
    } else {
      this.createDefaultDocument();
    }
  }

  private createDefaultDocument() {
    // @ts-ignore
    const appDocument: AppDocument = DEFAULT_DOCUMENT.default as AppDocument;
    appStore.commit("setDocument", appDocument);
    LAYOUT_ELEMENT_CACHE.build();
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap');
@import "@/style/colors.scss";

body {
  margin: 0;
  background-color: $background;
  color: $foreground;
  font-family: 'Fira Sans', sans-serif;

  @media print {
    background-color: transparent;
  }
}

* {
  box-sizing: border-box;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: transparent;
}

*::-webkit-scrollbar {
  width: 10px;
  background-color: $backgroundLight;
}

*::-webkit-scrollbar-thumb {
  background-color: $foreground;
}

h1 {
  position: relative;
  margin: 0 0 10px;
  z-index: 1;
  text-shadow: -4px -4px 0 $background, 4px -4px 0 $background, -4px 4px 0 $background, 4px 4px 0 $background;

  &::before {
    content: "";
    border-bottom: 2px solid $primary;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1px;
    z-index: -1;
  }
}

#popup-backdrop {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
}

.vm--container {
  .vm--overlay {
    background: rgba(0, 0, 0, .65);
  }

  .vm--modal {
    background-color: $background;
  }
}

.app-info {
  display: flex;
  position: fixed;
  top: 100px;
  left: 100px;
  right: 100px;
  width: calc(100vw - 200px);
  padding: 10px;
  background-color: $background;
  z-index: 9999;
  border: 2px solid $primary;
  box-shadow: 4px 4px 8px 0 $backgroundDark;
  cursor: help;
  user-select: none;
  font-size: 2rem;

  img {
    flex: 0 0 auto;
    height: 460px;
    width: auto;
  }

  .welcome {
    margin-left: 10px;
    width: 100%;

    h1 {
      margin-bottom: 0;
    }

    .info {
      font-size: 1em;
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      align-items: center;

      > div {
        display: flex;
        margin-top: 10px;

        svg {
          color: $alert;
          font-size: 2rem;
          margin-right: 10px;
          flex-grow: 0;
        }
      }

      p {
        margin: .2rem 0;

        a {
          color: $info;

          &:hover {
            color: $primaryLight;
          }
        }
      }
    }
  }

  svg {
    margin-left: auto;
    cursor: pointer;
  }

  @media print {
    display: none;
  }
}
</style>
