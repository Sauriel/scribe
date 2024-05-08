<template>
  <div class="settings">
    <div class="actions">
      <heading small>{{ $t("dandd-monster-wizard.actions.actions.header") }}</heading>
      <sortable-list
        expandable
        :items="actions.actions"
        @list:change="onActionListChange"
        @item:delete="onActionDelete"
        @item:duplicate="onActionDuplicate"
      >
        <template #item="{ element }">
          <span v-if="element.ability">
            {{ element.ability.name }}
            <small> ({{ $t("dandd-monster-wizard.actions.actions.ability.label") }}) </small>
          </span>
          <span v-if="element.attack">
            {{ element.attack.name }}
            <small> ({{ $t("dandd-monster-wizard.actions.actions.attack.label") }}) </small>
          </span>
        </template>
        <template #expandHeader>
          <font-awesome-icon icon="edit" />
          {{ $t("dandd-monster-wizard.actions.actions.edit") }}
        </template>
        <template #expand="{ element }">
          <div v-if="element.ability" class="edit-field">
            <div class="edit-field-row">
              <label class="label">
                {{ $t("dandd-monster-wizard.actions.actions.ability.name") }}
              </label>
              <input-field v-model="element.ability.name" />
            </div>
            <tip-tap v-model="element.ability.description" :defaults="defaults" :config="config" />
          </div>
          <div v-if="element.attack" class="edit-field edit-field--attack">
            <div class="edit-field-row">
              <label class="label">
                {{ $t("dandd-monster-wizard.actions.actions.attack.name") }}
              </label>
              <input-field v-model="element.attack.name" />
              <label class="label">
                {{ $t("dandd-monster-wizard.actions.actions.attack.attackType") }}
              </label>
              <input-field v-model="element.attack.attackType" />
            </div>
            <div class="edit-field-row">
              <label class="label">
                {{ $t("dandd-monster-wizard.actions.actions.attack.attack") }}
              </label>
              <input-field v-model="element.attack.attack" />
            </div>
            <div class="edit-field-row">
              <label class="label">
                {{ $t("dandd-monster-wizard.actions.actions.attack.damage") }}
              </label>
              <input-field v-model="element.attack.damage" />
            </div>
          </div>
        </template>
      </sortable-list>
      <div class="add-action-buttons">
        <btn outline full-width @click="addActionAbility">
          <font-awesome-icon icon="plus" />
          {{ $t("dandd-monster-wizard.actions.actions.add.ability") }}
        </btn>
        <btn outline full-width @click="addActionAttack">
          <font-awesome-icon icon="plus" />
          {{ $t("dandd-monster-wizard.actions.actions.add.attack") }}
        </btn>
      </div>
    </div>
    <div class="bonus-actions">
      <heading small>{{ $t("dandd-monster-wizard.actions.bonusActions.header") }}</heading>
      <sortable-list
        expandable
        :items="actions.bonusActions"
        @list:change="onBonusActionListChange"
        @item:delete="onBonusActionDelete"
        @item:duplicate="onBonusActionDuplicate"
      >
        <template #item="{ element }">
          {{ element.name }}
        </template>
        <template #expandHeader>
          <font-awesome-icon icon="edit" />
          {{ $t("dandd-monster-wizard.actions.bonusActions.edit") }}
        </template>
        <template #expand="{ element }">
          <div class="edit-field">
            <div class="edit-field-row">
              <label class="label">
                {{ $t("dandd-monster-wizard.actions.bonusActions.name") }}
              </label>
              <input-field v-model="element.name" />
            </div>
            <tip-tap v-model="element.description" :defaults="defaults" :config="config" />
          </div>
        </template>
      </sortable-list>
      <btn outline full-width @click="addBonusAction">
        <font-awesome-icon icon="plus" />
        {{ $t("dandd-monster-wizard.actions.bonusActions.add") }}
      </btn>
    </div>
    <div class="reactions">
      <heading small>{{ $t("dandd-monster-wizard.actions.reactions.header") }}</heading>
      <sortable-list
        expandable
        :items="actions.reactions"
        @list:change="onReactionListChange"
        @item:delete="onReactionDelete"
        @item:duplicate="onReactionDuplicate"
      >
        <template #item="{ element }">
          {{ element.name }}
        </template>
        <template #expandHeader>
          <font-awesome-icon icon="edit" />
          {{ $t("dandd-monster-wizard.actions.reactions.edit") }}
        </template>
        <template #expand="{ element }">
          <div class="edit-field">
            <div class="edit-field-row">
              <label class="label">
                {{ $t("dandd-monster-wizard.actions.reactions.name") }}
              </label>
              <input-field v-model="element.name" />
            </div>
            <tip-tap v-model="element.description" :defaults="defaults" :config="config" />
          </div>
        </template>
      </sortable-list>
      <btn outline full-width @click="addReaction">
        <font-awesome-icon icon="plus" />
        {{ $t("dandd-monster-wizard.actions.reactions.add") }}
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
import { Monster, Actions, dndMonsterDefaults, Action, Ability } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";

@Options({
  emits: ["step:reload"],
})
export default class DandDMonsterActions extends Vue {
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

  private get actions(): Actions {
    return this.model.model.actions;
  }

  private addActionAbility() {
    this.actions.actions.push({
      ability: {
        name: "Action Ability",
        description: "Lorem ipsum dolor sit amet.",
      },
    });
    this.reload();
  }

  private addActionAttack() {
    this.actions.actions.push({
      attack: {
        name: "Action Attack",
        attackType: "Melee Weapon Attack",
        attack: "+1 to hit, range 5 ft., one target",
        damage: "4 (1d4+2) slashing damage",
      },
    });
    this.reload();
  }

  private onActionListChange(event: DragAndDropEvent<Action>) {
    if (event.moved) {
      const element = cloneDeep(this.actions.actions[event.moved.oldIndex]);
      this.actions.actions.splice(event.moved.oldIndex, 1); // delete from: oldIndex
      this.actions.actions.splice(event.moved.newIndex, 0, element); // insert into: newIndex
      this.reload();
    }
  }

  private onActionDelete(event: SortableListEvent<Action>) {
    this.actions.actions.splice(event.index, 1);
    this.reload();
  }

  private onActionDuplicate(event: SortableListEvent<Action>) {
    const clone = cloneDeep(event.element);
    this.actions.actions.splice(event.index, 0, clone);
    this.reload();
  }

  private addReaction() {
    this.actions.reactions.push({
      name: "Reaction",
      description: "Lorem ipsum dolor sit amet.",
    });
    this.reload();
  }

  private onReactionListChange(event: DragAndDropEvent<Ability>) {
    if (event.moved) {
      const element = cloneDeep(this.actions.reactions[event.moved.oldIndex]);
      this.actions.reactions.splice(event.moved.oldIndex, 1); // delete from: oldIndex
      this.actions.reactions.splice(event.moved.newIndex, 0, element); // insert into: newIndex
      this.reload();
    }
  }

  private onReactionDelete(event: SortableListEvent<Ability>) {
    this.actions.reactions.splice(event.index, 1);
    this.reload();
  }

  private onReactionDuplicate(event: SortableListEvent<Ability>) {
    const clone = cloneDeep(event.element);
    this.actions.reactions.splice(event.index, 0, clone);
    this.reload();
  }

  private addBonusAction() {
    this.actions.bonusActions.push({
      name: "Bonus Action",
      description: "Lorem ipsum dolor sit amet.",
    });
    this.reload();
  }

  private onBonusActionListChange(event: DragAndDropEvent<Ability>) {
    if (event.moved) {
      const element = cloneDeep(this.actions.bonusActions[event.moved.oldIndex]);
      this.actions.bonusActions.splice(event.moved.oldIndex, 1); // delete from: oldIndex
      this.actions.bonusActions.splice(event.moved.newIndex, 0, element); // insert into: newIndex
      this.reload();
    }
  }

  private onBonusActionDelete(event: SortableListEvent<Ability>) {
    this.actions.bonusActions.splice(event.index, 1);
    this.reload();
  }

  private onBonusActionDuplicate(event: SortableListEvent<Ability>) {
    const clone = cloneDeep(event.element);
    this.actions.bonusActions.splice(event.index, 0, clone);
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

    &-row {
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

    &--attack {
      padding-bottom: 0.5em;

      .label {
        white-space: nowrap;
      }

      .input-wrapper {
        flex-shrink: 1;
      }
    }
  }

  .add-action-buttons {
    display: flex;
    gap: 1rem;
  }
}
</style>
