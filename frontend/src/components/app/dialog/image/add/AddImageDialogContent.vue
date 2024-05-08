<template>
  <div class="add-image">
    <div class="add-image-content">
      <section>
        <header>{{ $t("add-image.url.label") }}</header>
        <image-input v-model="image" />
      </section>
      <section>
        <header>{{ $t("add-image.size") }}</header>
        <div class="add-image-size">
          <div>
            <input-field
              type="number"
              v-model="width"
              class="small-input"
              :placeholder="$t('add-image.width-placeholder')"
            />
            &times;
            <input-field
              type="number"
              v-model="height"
              class="small-input"
              :placeholder="$t('add-image.height-placeholder')"
            />
            <dropdown v-model="unit" :items="units" />
          </div>
          <small class="hint">{{ $t("add-image.hint") }}</small>
        </div>
      </section>
      <section>
        <header>{{ $t("add-image.float.label") }}</header>
        <select-bar round shadow-border alternate-colors v-model="float" :items="floats" />
      </section>
      <section>
        <header>{{ $t("add-image.extra") }}</header>
        <ul class="extra-list">
          <li class="extra-list-entry">
            <input-switch v-model="noBg" class="switch">
              {{ $t("add-image.no-bg.label") }}
            </input-switch>
            <tooltip position="bottom-left">
              <template #tooltip>
                {{ $t("add-image.no-bg.info") }}
              </template>
              <font-awesome-icon icon="info-circle" />
            </tooltip>
          </li>
          <li class="extra-list-entry">
            <input-switch v-model="pngMask" class="switch">
              {{ $t("add-image.png-mask.label") }}
            </input-switch>
            <tooltip position="bottom-left">
              <template #tooltip>
                {{ $t("add-image.png-mask.info") }}
              </template>
              <font-awesome-icon icon="info-circle" />
            </tooltip>
          </li>
        </ul>
      </section>
    </div>
    <footer class="footer">
      <btn outline @click="$emit('close')">{{ $t("add-image.close") }}</btn>
      <btn @click="applyChanges">{{ $t("add-image.apply") }}</btn>
    </footer>
  </div>
</template>

<script lang="ts">
import { Unit, Units } from "@/models/document/pageFormat";
import { Vue, Prop, Options } from "vue-property-decorator";
import { DropdownItem } from "@/components/app/ui/dropdown/Dropdown.vue";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";
import { ImageInputImage } from "@/components/app/ui/image-input/ImageInput.vue";
import { ImageSource } from "@/models/";

export enum ImageFloat {
  LEFT = "left",
  NONE = "none",
  RIGHT = "right",
}

export interface UnitValue {
  value: number;
  unit: Unit;
}

export interface AddImageConfig {
  image: ImageSource;
  name: string;
  float: ImageFloat;
  noBg: boolean;
  pngMask: boolean;
  width?: UnitValue;
  height?: UnitValue;
}

export interface AddImagePayload {
  addImageConfig: AddImageConfig;
  callback: (config: AddImageConfig) => void;
}

@Options({
  emits: ["close"],
})
export default class AddImageDialogContent extends Vue {
  @Prop({ type: Object, required: true })
  private readonly payload!: AddImagePayload;

  private float = ImageFloat.NONE;
  private unit = Units.PIXEL.suffix;
  private width?: number;
  private height?: number;

  private get image(): ImageInputImage {
    return {
      src: this.payload.addImageConfig.image,
      name: this.payload.addImageConfig.name,
      width: 0,
      height: 0,
    };
  }

  private set image(value: ImageInputImage) {
    this.payload.addImageConfig.image = value.src;
    this.payload.addImageConfig.name = value.name;
  }

  created() {
    this.float = this.payload.addImageConfig.float;
    if (this.payload.addImageConfig.width) {
      this.width = this.payload.addImageConfig.width.value;
      this.unit = this.payload.addImageConfig.width.unit.suffix;
    }
    if (this.payload.addImageConfig.height) {
      this.height = this.payload.addImageConfig.height.value;
      this.unit = this.payload.addImageConfig.height.unit.suffix;
    }
  }

  private get noBg(): boolean {
    return this.payload.addImageConfig.noBg;
  }

  private set noBg(value: boolean) {
    this.payload.addImageConfig.noBg = value;
  }

  private get pngMask(): boolean {
    return this.payload.addImageConfig.pngMask;
  }

  private set pngMask(value: boolean) {
    this.payload.addImageConfig.pngMask = value;
  }

  private get floats(): SelectBarEntry<ImageFloat>[] {
    return [
      {
        name: this.$t("add-image.float.left"),
        data: ImageFloat.LEFT,
      },
      {
        name: this.$t("add-image.float.none"),
        data: ImageFloat.NONE,
      },
      {
        name: this.$t("add-image.float.right"),
        data: ImageFloat.RIGHT,
      },
    ];
  }

  private get units(): DropdownItem<string, string> {
    return Object.values(Units).map((unit) => ({ name: unit.suffix, value: unit.suffix }));
  }

  private applyChanges() {
    this.payload.addImageConfig.float = this.float;
    const unit: Unit =
      Object.values(Units).find((unit) => unit.suffix === this.unit) || Units.PIXEL;
    if (this.height) {
      this.payload.addImageConfig.height = {
        value: this.height,
        unit: unit,
      };
    } else {
      this.payload.addImageConfig.height = undefined;
    }
    if (this.width) {
      this.payload.addImageConfig.width = {
        value: this.width,
        unit: unit,
      };
    } else {
      this.payload.addImageConfig.width = undefined;
    }
    this.payload.callback(this.payload.addImageConfig);
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.add-image {
  section {
    display: flex;
    margin-bottom: 2rem;

    & > *:not(header) {
      flex: 1 1 auto;
    }

    header {
      flex: 0 0 auto;
      width: 120px;
      padding-top: 0.25rem;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .switch:deep(input) {
      margin-right: 0.5rem;
    }

    .extra-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1em;

      &-entry {
        display: flex;
        gap: 1em;
        justify-content: space-between;
        flex-wrap: nowrap;

        &:deep(.tooltip) {
          min-width: 40ch;
        }
      }
    }
  }

  &-size {
    .small-input {
      width: 5rem;
    }

    .hint {
      padding-top: 0.5rem;
      color: var(--color-foreground--dark);
      display: inline-block;
    }
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  margin: -10px;
}
</style>
