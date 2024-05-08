import { LayoutElements } from '~~/models/elements/layout';
import { TestLayoutElement } from '~~/models/elements/test';

type Design = 'general' | 'dnd5e';
type LayoutElementType = 'layout' | 'text' | 'template' | 'multimedia';

type LayoutElement = {
  name: string;
  icon: string;
  type: LayoutElementType;
  design: Design;
  favorite?: boolean;
  extends?: string;
  variants?: LayoutElement[];
}

type LayoutElementGroup = {
  type: LayoutElementType;
  elements: LayoutElement[];
}

const LAYOUT_ELEMENTS: LayoutElement[] = [
  TestLayoutElement,
  ...LayoutElements,
  {
    name: 'headline',
    icon: 'oi:header',
    type: 'text',
    design: 'dnd5e',
    favorite: true,
  },
  {
    name: 'paragraph',
    icon: 'fa-solid:paragraph',
    type: 'text',
    design: 'dnd5e',
    favorite: true,
  },
  {
    name: 'table',
    icon: 'ph:table',
    type: 'text',
    design: 'dnd5e',
    favorite: true,
  },
  {
    name: 'class-table',
    icon: 'ph:table-fill',
    type: 'text',
    design: 'dnd5e',
    extends: 'table',
  },
  {
    name: 'rollable-table',
    icon: 'ph:table-duotone',
    type: 'text',
    design: 'dnd5e',
    extends: 'table',
  },
  {
    name: 'table-of-contents',
    icon: 'carbon:table-of-contents',
    type: 'text',
    design: 'dnd5e',
  },
  {
    name: 'spell',
    icon: 'game-icons:magic-swirl',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'spell-list',
    icon: 'game-icons:spell-book',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'monster',
    icon: 'game-icons:spiked-dragon-head',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'cover', // chapter
    icon: 'game-icons:fire-shield',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'book-cover',
    icon: 'game-icons:book-cover',
    type: 'template',
    design: 'dnd5e',
    extends: 'cover',
  },
  {
    name: 'back-cover',
    icon: 'game-icons:black-book',
    type: 'template',
    design: 'dnd5e',
    extends: 'cover',
  },
  {
    name: 'race',
    icon: 'game-icons:orc-head',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'class', // name, hp, prof., equipment (like gm binder)
    icon: 'game-icons:swordwoman',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'background',
    icon: 'game-icons:scroll-quill',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'item',
    icon: 'game-icons:dragon-orb',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'character',
    icon: 'game-icons:wanted-reward',
    type: 'template',
    design: 'dnd5e',
  },
  {
    name: 'image',
    icon: 'fa-solid:image',
    type: 'multimedia',
    design: 'general',
    favorite: true,
  },
  {
    name: 'map',
    icon: 'game-icons:treasure-map',
    type: 'multimedia',
    design: 'general',
  },
  {
    name: 'video',
    icon: 'ic:round-ondemand-video',
    type: 'multimedia',
    design: 'general',
  },
  {
    name: 'music',
    icon: 'ion:musical-notes',
    type: 'multimedia',
    design: 'general',
  },
  {
    name: '3d-viewer',
    icon: 'file-icons:3d-model',
    type: 'multimedia',
    design: 'general',
  },
];

function getGroups(): LayoutElementGroup[] {
  const groups: LayoutElementGroup[] = [];
  const sortedElements = LAYOUT_ELEMENTS.sort((a, b) => {
    if (a.extends && !b.extends) {
      return 1;
    } else if (!a.extends && b.extends) {
      return -1;
    } else {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }
  });
  for (const element of sortedElements) {
    let group = groups.find(g => g.type === element.type);
    if (!group) {
      group = {
        type: element.type,
        elements: []
      };
      groups.push(group);
    }
    if (!element.extends) {
      group.elements.push(element);
    } else {
      const parent = group.elements.find(e => e.name === element.extends);
      if (!parent) {
        console.error('Could not find parent.', element);
      } else {
        if (!parent.variants) {
          parent.variants = [];
        }
        parent.variants.push(element);
      }
    }
  }
  return groups.sort((a, b) => a.type.localeCompare(b.type));
}

export default LayoutElement;
export {
  Design,
  LayoutElementType,
  LayoutElementGroup,
  getGroups
};