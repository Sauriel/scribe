<template>
  <div class="settings">
    <div class="special-traits">
      <sortable-list
        expandable
        :items="specialTraits"
        @list:change="onListChange"
        @item:delete="onItemDelete"
        @item:duplicate="onItemDuplicate"
      >
        <template #item="{ element }">
          {{ element.name }}
        </template>
        <template #expandHeader>
          <font-awesome-icon icon="edit" />
          {{ $t("dandd-monster-wizard.specialTraits.edit") }}
        </template>
        <template #expand="{ element }">
          <div class="edit-field">
            <div class="edit-field-name">
              <label class="label">
                {{ $t("dandd-monster-wizard.specialTraits.name") }}
              </label>
              <input-field v-model="element.name" />
            </div>
            <tip-tap v-model="element.description" :defaults="defaults" :config="config" />
          </div>
        </template>
      </sortable-list>
      <btn outline full-width @click="addSpecialTrait">
        <font-awesome-icon icon="plus" />
        {{ $t("dandd-monster-wizard.specialTraits.add") }}
      </btn>
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
import { Monster, Ability, dndMonsterDefaults } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";

@Options({
  emits: ["step:reload"],
})
export default class DandDMonsterSpecialTraits extends Vue {
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

  private get specialTraits(): Ability[] {
    return this.model.model.specialTraits;
  }

  private addSpecialTrait() {
    this.specialTraits.push({
      name: "Special Trait",
      description: "Lorem ipsum dolor sit amet.",
    });
    this.reload();
  }

  private onListChange(event: DragAndDropEvent<Ability>) {
    if (event.moved) {
      const element = cloneDeep(this.specialTraits[event.moved.oldIndex]);
      this.specialTraits.splice(event.moved.oldIndex, 1); // delete from: oldIndex
      this.specialTraits.splice(event.moved.newIndex, 0, element); // insert into: newIndex
      this.reload();
    }
  }

  private onItemDelete(event: SortableListEvent<Ability>) {
    this.specialTraits.splice(event.index, 1);
    this.reload();
  }

  private onItemDuplicate(event: SortableListEvent<Ability>) {
    const clone = cloneDeep(event.element);
    this.specialTraits.splice(event.index, 0, clone);
    this.reload();
  }
}
</script>

<style lang="scss" scoped>
.settings {
  .edit-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &-name {
      display: flex;
      align-items: center;
      gap: 1em;
      padding: 0 1em;

      > .label {
        font-weight: bold;
      }

      > .input-wrapper {
        flex: 1 0 auto;
      }
    }
  }
}
</style>
