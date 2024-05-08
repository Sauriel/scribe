<template>
  <div class="settings">
    <div class="legendary-switch">
      <input-switch v-model="isLegendary">
        {{ $t("dandd-monster-wizard.legendary.switch") }}
      </input-switch>
    </div>
    <div v-if="isLegendary" class="legendary">
      <tip-tap v-model="legendary.description" :defaults="defaults" :config="config" />
      <div class="special-traits">
        <sortable-list
          expandable
          :items="legendary.actions"
          @list:change="onListChangeLegendary"
          @item:delete="onItemDeleteLegendary"
          @item:duplicate="onItemDuplicateLegendary"
        >
          <template #item="{ element }">
            {{ element.name }}
          </template>
          <template #expandHeader>
            <font-awesome-icon icon="edit" />
            {{ $t("dandd-monster-wizard.legendary.edit") }}
          </template>
          <template #expand="{ element }">
            <div class="edit-field">
              <div class="edit-field-name">
                <label class="label">
                  {{ $t("dandd-monster-wizard.legendary.name") }}
                </label>
                <input-field v-model="element.name" />
              </div>
              <tip-tap v-model="element.description" :defaults="defaults" :config="config" />
            </div>
          </template>
        </sortable-list>
        <btn outline full-width @click="addSpecialTraitLegendary">
          <font-awesome-icon icon="plus" />
          {{ $t("dandd-monster-wizard.legendary.add") }}
        </btn>
      </div>
    </div>
    <div class="mythic-switch">
      <input-switch v-model="isMythic">
        {{ $t("dandd-monster-wizard.mythic.switch") }}
      </input-switch>
    </div>
    <div v-if="isMythic" class="mythic">
      <tip-tap v-model="mythic.description" :defaults="defaults" :config="config" />
      <div class="special-traits">
        <sortable-list
          expandable
          :items="mythic.actions"
          @list:change="onListChangeMythic"
          @item:delete="onItemDeleteMythic"
          @item:duplicate="onItemDuplicateMythic"
        >
          <template #item="{ element }">
            {{ element.name }}
          </template>
          <template #expandHeader>
            <font-awesome-icon icon="edit" />
            {{ $t("dandd-monster-wizard.mythic.edit") }}
          </template>
          <template #expand="{ element }">
            <div class="edit-field">
              <div class="edit-field-name">
                <label class="label">
                  {{ $t("dandd-monster-wizard.mythic.name") }}
                </label>
                <input-field v-model="element.name" />
              </div>
              <tip-tap v-model="element.description" :defaults="defaults" :config="config" />
            </div>
          </template>
        </sortable-list>
        <btn outline full-width @click="addSpecialTraitMythic">
          <font-awesome-icon icon="plus" />
          {{ $t("dandd-monster-wizard.mythic.add") }}
        </btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SortableListEvent } from "@/components/app/ui/sortable-list/SortableList.vue";
import { TipTapMenuConfig } from "@/components/app/ui/tiptap/menu/TipTapMenu.vue";
import { WizardStepModel } from "@/components/app/ui/wizard/Wizard.vue";
import { DragAndDropEvent } from "@/models";
import { cloneDeep } from "lodash";
import { Options, Vue, Prop } from "vue-property-decorator";
import { Monster, LegendaryInfo, dndMonsterDefaults, Ability } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";

@Options({
  emits: ["step:reload"],
})
export default class DandDMonsterLegendary extends Vue {
  private readonly defaults = dndMonsterDefaults;
  private readonly config: TipTapMenuConfig = [
    "Font",
    "Size",
    "Color",
    "Bold",
    "Italic",
    "Underline",
    "Strike",
  ];

  @Prop({ type: Object, required: true })
  private readonly model!: WizardStepModel<Monster>;

  private reload() {
    this.$emit("step:reload");
  }

  private get legendary(): LegendaryInfo | null {
    return this.model.model.legendary;
  }

  private set legendary(value: LegendaryInfo | null) {
    this.model.model.legendary = value;
  }

  private get isLegendary(): boolean {
    return this.legendary !== null;
  }

  private set isLegendary(value: boolean) {
    if (value) {
      this.legendary = {
        description: "Lorem ipsum dolor sit amet.",
        actions: [],
      };
    } else {
      this.legendary = null;
    }
    this.reload();
  }

  private addSpecialTraitLegendary() {
    this.legendary?.actions.push({
      name: "Legendary ability",
      description: "Lorem ipsum dolor sit amet.",
    });
    this.reload();
  }

  private onListChangeLegendary(event: DragAndDropEvent<Ability>) {
    if (event.moved && this.legendary) {
      const element = cloneDeep(this.legendary.actions[event.moved.oldIndex]);
      this.legendary.actions.splice(event.moved.oldIndex, 1); // delete from: oldIndex
      this.legendary.actions.splice(event.moved.newIndex, 0, element); // insert into: newIndex
      this.reload();
    }
  }

  private onItemDeleteLegendary(event: SortableListEvent<Ability>) {
    this.legendary?.actions.splice(event.index, 1);
    this.reload();
  }

  private onItemDuplicateLegendary(event: SortableListEvent<Ability>) {
    const clone = cloneDeep(event.element);
    this.legendary?.actions.splice(event.index, 0, clone);
    this.reload();
  }

  private get mythic(): LegendaryInfo | null {
    return this.model.model.mythic;
  }

  private set mythic(value: LegendaryInfo | null) {
    this.model.model.mythic = value;
  }

  private get isMythic(): boolean {
    return this.mythic !== null;
  }

  private set isMythic(value: boolean) {
    if (value) {
      this.mythic = {
        description: "Lorem ipsum dolor sit amet.",
        actions: [],
      };
    } else {
      this.mythic = null;
    }
    this.reload();
  }

  private addSpecialTraitMythic() {
    this.mythic?.actions.push({
      name: "Mythic ability",
      description: "Lorem ipsum dolor sit amet.",
    });
    this.reload();
  }

  private onListChangeMythic(event: DragAndDropEvent<Ability>) {
    if (event.moved && this.mythic) {
      const element = cloneDeep(this.mythic.actions[event.moved.oldIndex]);
      this.mythic.actions.splice(event.moved.oldIndex, 1); // delete from: oldIndex
      this.mythic.actions.splice(event.moved.newIndex, 0, element); // insert into: newIndex
      this.reload();
    }
  }

  private onItemDeleteMythic(event: SortableListEvent<Ability>) {
    this.mythic?.actions.splice(event.index, 1);
    this.reload();
  }

  private onItemDuplicateMythic(event: SortableListEvent<Ability>) {
    const clone = cloneDeep(event.element);
    this.mythic?.actions.splice(event.index, 0, clone);
    this.reload();
  }
}
</script>

<style lang="scss" scoped>
.settings {
  .legendary-switch,
  .mythic-switch {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;

    &:deep(input) {
      margin-right: 0.5em;
    }
  }

  .legendary,
  .mythic {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
