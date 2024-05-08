<template>
  <div class="settings">
    <section class="section">
      <header class="header">{{ $t("dandd-monster-wizard.basic.name") }}</header>
      <input-field v-model="basics.name" />
    </section>
    <section class="section">
      <dropdown v-model="size" :items="sizes" />
      <dropdown v-model="type" :items="types" />
      <div class="sub-type">
        <span>(</span>
        <input-field
          v-model="subType"
          :placeholder="$t('dandd-monster-wizard.basic.subType.placeholder')"
        />
        <span>)</span>
      </div>
    </section>
    <section class="section align-top">
      <header class="header">{{ $t("dandd-monster-wizard.basic.alignment") }}</header>
      <dropdown v-model="alignment" :items="alignments" />
    </section>
    <div class="stats">
      <div class="stat">
        <span class="label">
          {{ $t("module.dandd.rules.stats.strength.short") }}
        </span>
        <input-field ref="strInput" type="numer" v-model="stats.strength" @blur="reload" />
        <span class="modifier">
          {{ strMod }}
        </span>
      </div>
      <div class="stat">
        <span class="label">
          {{ $t("module.dandd.rules.stats.dexterity.short") }}
        </span>
        <input-field ref="dexInput" type="numer" v-model="stats.dexterity" @blur="reload" />
        <span class="modifier">
          {{ dexMod }}
        </span>
      </div>
      <div class="stat">
        <span class="label">
          {{ $t("module.dandd.rules.stats.constitution.short") }}
        </span>
        <input-field ref="conInput" type="numer" v-model="stats.constitution" @blur="reload" />
        <span class="modifier">
          {{ conMod }}
        </span>
      </div>
      <div class="stat">
        <span class="label">
          {{ $t("module.dandd.rules.stats.intelligence.short") }}
        </span>
        <input-field ref="intInput" type="numer" v-model="stats.intelligence" @blur="reload" />
        <span class="modifier">
          {{ intMod }}
        </span>
      </div>
      <div class="stat">
        <span class="label">
          {{ $t("module.dandd.rules.stats.wisdom.short") }}
        </span>
        <input-field ref="wisInput" type="numer" v-model="stats.wisdom" @blur="reload" />
        <span class="modifier">
          {{ wisMod }}
        </span>
      </div>
      <div class="stat">
        <span class="label">
          {{ $t("module.dandd.rules.stats.charisma.short") }}
        </span>
        <input-field ref="chaInput" type="numer" v-model="stats.charisma" @blur="reload" />
        <span class="modifier">
          {{ chaMod }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import InputField from "@/components/app/ui/input-field/InputField.vue";
import { WizardStepModel } from "@/components/app/ui/wizard/Wizard.vue";
import EnumHelper from "@/helper/EnumHelper";
import { isEmpty } from "lodash";
import { Options, Vue, Prop, Ref } from "vue-property-decorator";
import {
  Alignment,
  BasicInfo,
  calculateMod,
  Monster,
  Size,
  StatValues,
  Type,
} from "@/modules/dandd/elements/monster/DandDMonsterElementModel";

@Options({
  emits: ["step:reload"],
})
export default class DandDMonsterBasics extends Vue {
  @Ref()
  private readonly strInput!: InputField;

  @Ref()
  private readonly dexInput!: InputField;

  @Ref()
  private readonly conInput!: InputField;

  @Ref()
  private readonly intInput!: InputField;

  @Ref()
  private readonly wisInput!: InputField;

  @Ref()
  private readonly chaInput!: InputField;

  @Prop({ type: Object, required: true })
  private readonly model!: WizardStepModel<Monster>;

  private reload() {
    this.$emit("step:reload");
  }

  mounted() {
    const focus = this.model.focus;
    if (focus === "STR") {
      this.strInput.focus();
    } else if (focus === "DEX") {
      this.dexInput.focus();
    } else if (focus === "CON") {
      this.conInput.focus();
    } else if (focus === "INT") {
      this.intInput.focus();
    } else if (focus === "WIS") {
      this.wisInput.focus();
    } else if (focus === "CHA") {
      this.chaInput.focus();
    }
  }

  private get stats(): StatValues {
    return this.model.model.stats;
  }

  private get strMod(): string {
    return calculateMod(this.stats.strength);
  }

  private get dexMod(): string {
    return calculateMod(this.stats.dexterity);
  }

  private get conMod(): string {
    return calculateMod(this.stats.constitution);
  }

  private get intMod(): string {
    return calculateMod(this.stats.intelligence);
  }

  private get wisMod(): string {
    return calculateMod(this.stats.wisdom);
  }

  private get chaMod(): string {
    return calculateMod(this.stats.charisma);
  }

  private get basics(): BasicInfo {
    return this.model.model.basic;
  }

  private get size(): string {
    return this.basics.size;
  }

  private set size(value: string) {
    const size = EnumHelper.getByValueWithFallback<Size>(Size, value, Size.TINY);
    this.basics.size = size;
    this.reload();
  }

  private get sizes(): DropdownItem[] {
    return Object.values(Size).map((size) => ({
      name: this.$t("module.dandd.rules.size." + size),
      value: size,
    }));
  }

  private get type(): string {
    return this.basics.type;
  }

  private set type(value: string) {
    const type = EnumHelper.getByValueWithFallback<Type>(Type, value, Type.UNKNOWN);
    this.basics.type = type;
    this.reload();
  }

  private get types(): DropdownItem[] {
    return Object.values(Type).map((type) => ({
      name: this.$t("module.dandd.rules.monster.type." + type),
      value: type,
    }));
  }

  private get subType(): string {
    return this.basics.subType || "";
  }

  private set subType(value: string) {
    this.basics.subType = isEmpty(value) ? null : value;
  }

  private get alignment(): string {
    return this.basics.alignment || Alignment.UNALIGNED;
  }

  private set alignment(value: string) {
    const alignment = EnumHelper.getByValueWithFallback<Alignment>(
      Alignment,
      value,
      Alignment.UNALIGNED
    );
    this.basics.alignment = alignment === Alignment.UNALIGNED ? null : alignment;
    this.reload();
  }

  private get alignments(): DropdownItem[] {
    return Object.values(Alignment).map((alignment) => ({
      name: this.$t("module.dandd.rules.alignment." + alignment),
      value: alignment,
    }));
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

    .sub-type {
      display: flex;
      justify-content: center;
      align-items: center;

      .input-wrapper {
        flex-grow: 1;
      }
    }

    .select-bar:deep(.alignment-entry) {
      flex-basis: calc(100% / 3);
      padding: 1em 0.5em;
      font-size: 0.9em;
    }

    .select-bar:deep(.alignment-entry--full-width) {
      flex-basis: 100%;
      padding: 1em 0.5em;
      font-size: 0.9em;
    }
  }
  .stats {
    display: flex;
    gap: 1em;

    .stat {
      border: 1px solid var(--color-foreground--dark);
      border-radius: var(--border-radius);
      position: relative;
      aspect-ratio: 3/4;
      padding: 1.5em 1em 1em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin-top: 1em;

      .label {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 1.5em;
      }

      .input-wrapper {
        font-size: 1.5em;

        &:deep(input) {
          text-align: center;
          padding-bottom: 0;
        }
      }

      .modifier {
        position: absolute;
        top: -1em;
        left: 50%;
        width: 50%;
        transform: translateX(-50%);
        background-color: var(--color-foreground--dark);
        border-radius: var(--border-radius);
        padding: 0.5em;
        color: var(--color-background);
        text-align: center;
        font-weight: bold;
      }
    }
  }
}
</style>
