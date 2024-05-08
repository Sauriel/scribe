<template>
  <div class="settings">
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.combat.armor") }}</header>
      <input-field type="number" v-model="combat.armorClass" class="input-small" />
      <div class="armor-type">
        <span>(</span>
        <input-field
          v-model="combat.armorClassType"
          :placeholder="$t('dandd-monster-wizard.combat.armorType.placeholder')"
        />
        <span>)</span>
      </div>
    </section>
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.combat.hitPoints") }}</header>
      <input-field
        type="number"
        v-model="hitDices"
        class="input-small hit-dices-input"
        :hint="$t('dandd-monster-wizard.combat.hints.diceCount')"
      />
      <dropdown v-model="diceType" :items="diceTypes" />
      <span class="center">
        <font-awesome-icon icon="plus" />
      </span>
      <input-field
        type="number"
        v-model="hitPointModifier"
        class="input-small hit-point-mod-input"
        :hint="$t('dandd-monster-wizard.combat.hints.hitPointsMod')"
      />
      <span class="center">
        <font-awesome-icon icon="equals" />
      </span>
      <span>{{ averageHealth }}</span>
    </section>
    <section class="section align-top">
      <header class="header">{{ $t("dandd-monster-wizard.combat.movements.header") }}</header>
      <div class="movements">
        <div class="movement-list">
          <sortable-list
            :items="combat.movements"
            @list:change="onListChange"
            @item:delete="onItemDelete"
            @item:duplicate="onItemDuplicate"
          >
            <template #item="{ element }">
              <DandDMonsterMovementEntry :model-value="element" @update:modelValue="reload" />
            </template>
          </sortable-list>
        </div>
        <btn outline full-width @click="addMovement">
          <font-awesome-icon icon="plus" />
          {{ $t("dandd-monster-wizard.combat.movements.add") }}
        </btn>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { SortableListEvent } from "@/components/app/ui/sortable-list/SortableList.vue";
import { WizardStepModel } from "@/components/app/ui/wizard/Wizard.vue";
import VuexHelper from "@/helper/VuexHelper";
import { DragAndDropEvent } from "@/models";
import DocumentModel from "@/models/document";
import { Units } from "@/models/document/pageFormat";
import { DocumentStoreGetters } from "@/store/document/documentStoreGetters";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { Vue, Options, Prop } from "vue-property-decorator";
import DandDMonsterMovementEntry from "@/modules/dandd/elements/monster/element/dialog/wizard/steps/movement/DandDMonsterMovementEntry.vue";
import {
  CombatStats,
  DiceType,
  Monster,
  Movement,
  calculateAverageHealth,
  MovementType,
  Unit,
} from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import { cloneDeep } from "lodash";

const documentStorage = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  components: {
    DandDMonsterMovementEntry,
  },
  emits: ["step:reload"],
})
export default class DandDMonsterCombat extends Vue {
  @Prop({ type: Object, required: true })
  private readonly model!: WizardStepModel<Monster>;

  private get document(): DocumentModel {
    return documentStorage.getters(DocumentStoreGetters.DOCUMENT);
  }

  private get unit(): Unit {
    const documentUnit = this.document.format.unit;
    if (documentUnit === Units.MILLIMETER) {
      return Unit.METER;
    } else {
      return Unit.FEET;
    }
  }

  private reload() {
    this.$emit("step:reload");
  }

  private get combat(): CombatStats {
    return this.model.model.combat;
  }

  private get hitDices(): number {
    return this.combat.hitDices;
  }

  private set hitDices(value: number) {
    this.combat.hitDices = value;
    this.reload();
  }

  private get hitPointModifier(): number {
    return this.combat.hitPointModifier;
  }

  private set hitPointModifier(value: number) {
    this.combat.hitPointModifier = value;
    this.reload();
  }

  private get diceType(): number {
    return this.combat.hitDiceType;
  }

  private set diceType(value: number) {
    const diceType = Object.values(DiceType)
      .filter((dice) => Number.isInteger(dice))
      .find((dice) => dice == value) as DiceType;
    this.combat.hitDiceType = diceType || DiceType.D4;
    this.reload();
  }

  private get diceTypes(): DropdownItem[] {
    return Object.values(DiceType)
      .filter((dice) => Number.isInteger(dice))
      .map((dice) => ({
        name: this.$t("module.dandd.rules.dice", { eyes: dice }),
        value: dice,
      }));
  }

  private get averageHealth(): number {
    return calculateAverageHealth(
      this.combat.hitDices,
      this.combat.hitDiceType,
      this.combat.hitPointModifier
    );
  }

  private addMovement() {
    const movement: Movement = {
      type: MovementType.WALK,
      value: 5,
      unit: this.unit,
    };
    this.combat.movements.push(movement);
    this.reload();
  }

  private onListChange(event: DragAndDropEvent<Movement>) {
    if (event.moved) {
      const element = cloneDeep(this.combat.movements[event.moved.oldIndex]);
      this.combat.movements.splice(event.moved.oldIndex, 1); // delete from: oldIndex
      this.combat.movements.splice(event.moved.newIndex, 0, element); // insert into: newIndex
      this.reload();
    }
  }

  private onItemDelete(event: SortableListEvent<Movement>) {
    this.combat.movements.splice(event.index, 1);
    this.reload();
  }

  private onItemDuplicate(event: SortableListEvent<Movement>) {
    const clone = cloneDeep(event.element);
    this.combat.movements.splice(event.index, 0, clone);
    this.reload();
  }
}
</script>

<style lang="scss" scoped>
.settings {
  .section {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    &.align-top {
      align-items: flex-start;
    }

    & > *:not(.header) {
      flex: 1 1 auto;
    }

    .header {
      flex: 0 0 auto;
      width: 120px;
      padding-top: 0.25rem;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .input-small {
      width: 8em;
      flex-grow: 0;

      &.hit-dices-input {
        width: 6ch;
      }

      &.hit-point-mod-input {
        width: 20ch;
      }
    }

    .center {
      text-align: center;
    }

    .armor-type {
      display: flex;
      justify-content: center;
      align-items: center;

      .input-wrapper {
        flex-grow: 1;
      }
    }

    .movements {
      .movement-list {
        max-height: 200px;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
