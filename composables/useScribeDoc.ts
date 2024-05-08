import type ScribeDoc from '@/models/document/document';

export default function () {
  function createNew(): ScribeDoc {
    return {
      name: '',
      description: {},
      private: false,
      allowComments: true,
      unit: 'px',
      width: 0,
      height: 0,
      margin: 0,
      pages: 1,
      content: []
    }
  }
  return { createNew };
}