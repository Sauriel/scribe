<template>
  <div class="add-dandd-monster">
    <heading>{{ $t("add-dandd-monster.header") }}</heading>
    <div class="entries">
      <div class="entry" @click="addEmpty">
        <font-awesome-icon :icon="['far', 'star']" />
        <span class="entry-title">
          {{ $t("add-dandd-monster.preset.empty") }}
        </span>
      </div>
      <div class="entry" @click="addNorn">
        <font-awesome-icon icon="users" />
        <span class="entry-title">
          {{ $t("add-dandd-monster.preset.norn") }}
        </span>
      </div>
      <div class="entry" @click="openWizard">
        <font-awesome-icon icon="book-dead" />
        <span class="entry-title">
          {{ $t("add-dandd-monster.preset.wizard") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from "vue-property-decorator";
import DocumentModel from "@/models/document";
import DandDMonsterElementModel, {
  Monster,
  create as createMonster,
  MONSTER_PRESET_NORN,
  MONSTER_PRESET_DEFAULT,
} from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import { DialogUpdateEvent, DIALOG_UPDATE_EVENT_NAME } from "@/events/dialog";
import {
  DandDMonsterWizardPayload,
  DANDD_MONSTER_WIZARD_TAG,
} from "@/modules/dandd/elements/monster/element/dialog/wizard/DandDMonsterWizardDialogContent.vue";
import emitter from "@/emitter";
import { LayoutElementModel } from "@/modules/ElementModel";

export const ADD_DANDD_MONSTER_TAG = "add-dandd-monster";

export interface AddDanddMonsterPayload {
  document: DocumentModel;
  callback: (model: DandDMonsterElementModel) => void;
  layout?: LayoutElementModel;
}

@Options({
  emits: ["close"],
})
export default class AddDandDMonsterDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: AddDanddMonsterPayload;

  private addEmpty() {
    const model = createMonster(this.payload.document, MONSTER_PRESET_DEFAULT);
    this.payload.callback(model);
    this.$emit("close");
  }

  private addNorn() {
    const model = createMonster(this.payload.document, MONSTER_PRESET_NORN);
    this.payload.callback(model);
    this.$emit("close");
  }

  private openWizard() {
    const model = createMonster(this.payload.document, MONSTER_PRESET_DEFAULT, undefined);
    const event: DialogUpdateEvent<DandDMonsterWizardPayload> = {
      name: DIALOG_UPDATE_EVENT_NAME,
      payload: {
        component: DANDD_MONSTER_WIZARD_TAG,
        visible: true,
        payload: {
          edit: false,
          document: this.payload.document,
          model: model,
          callback: this.payload.callback,
        },
      },
    };
    this.$emit("close");
    emitter.$emit(DIALOG_UPDATE_EVENT_NAME, event);
  }
}
</script>

<style lang="scss" scoped>
.add-dandd-monster {
  max-width: 460px;

  .entries {
    display: flex;
    flex-wrap: wrap;
    margin: -0.5rem;
    justify-content: center;
    align-items: center;

    .entry {
      height: 140px;
      width: 140px;
      background-color: var(--color-background--light);
      display: flex;
      margin: 0.5rem;
      opacity: 0.5;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5em;

      &:hover {
        opacity: 1;
      }

      &-title {
        font-size: 1.5em;
      }

      > .svg-inline--fa {
        font-size: 3em;
      }
    }
  }
}
</style>
