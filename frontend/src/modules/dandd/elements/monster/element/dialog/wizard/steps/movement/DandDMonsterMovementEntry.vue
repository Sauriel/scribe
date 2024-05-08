<template>
  <div class="movement">
    <dropdown v-model="type" :items="types" />
    <input-field type="number" v-model="modelValue.value" />
    <dropdown v-model="unit" :items="units" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from "vue-property-decorator";
import { Movement, MovementType, Unit } from "@/modules/dandd/elements/monster/DandDMonsterElementModel";
import EnumHelper from "@/helper/EnumHelper";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";

export default class DandDMonsterMovementEntry extends Vue {
  @Prop({ type: Object, required: true })
  private readonly modelValue!: Movement;

  private get type(): string {
    return this.modelValue.type;
  }

  private set type(value: string) {
    const type = EnumHelper.getByValueWithFallback<MovementType>(
      MovementType,
      value,
      MovementType.WALK
    );
    this.modelValue.type = type;
    this.$emit("update:modelValue", this.modelValue);
  }

  private get types(): DropdownItem[] {
    return Object.values(MovementType).map((type) => ({
      name: this.$t(
        "module.dandd.rules.movement." + (type === MovementType.WALK ? "walk_alternate" : type)
      ),
      value: type,
    }));
  }

  private get unit(): string {
    return this.modelValue.unit;
  }

  private set unit(value: string) {
    const unit = EnumHelper.getByValueWithFallback<Unit>(Unit, value, Unit.FEET);
    this.modelValue.unit = unit;
    this.$emit("update:modelValue", this.modelValue);
  }

  private get units(): DropdownItem[] {
    return Object.values(Unit).map((unit) => ({
      name: unit,
      value: unit,
    }));
  }
}
</script>

<style lang="scss" scoped>
.movement {
  display: flex;
  gap: 1em;
  align-items: center;
}
</style>
