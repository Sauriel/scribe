/* eslint-disable max-lines */ // ToDo [2023-07-01]: remove when the default document is empty
import { defineStore } from 'pinia';
import type ScribeDoc from '~~/models/document/document';
import type TestElement from '~~/models/elements/test';
import { Helper } from '~~/models/global';

export const useDocumentStore = defineStore('document-store', () => {
  const document = ref<ScribeDoc>({
    name: 'Test document',
    private: false,
    allowComments: true,
    unit: 'mm',
    width: Helper.toPixel(210, 'mm'),
    height: Helper.toPixel(297, 'mm'),
    margin: {
      top: Helper.toPixel(12, 'mm'),
      right: Helper.toPixel(20, 'mm'),
      bottom: Helper.toPixel(18, 'mm'),
      left: Helper.toPixel(20, 'mm')
    },
    cols: {
      quantity: 2,
      gap: Helper.toPixel(8, 'mm'),
    },
    style: {
      background: '/doc-assets/dnd5e/background/bg01.jpg'
    },
    pages: 7,
    content: [
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#1',
        color: '#1297e2'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#2',
        color: '#1a90f8'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#3',
        color: '#7d3096'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#4',
        color: '#2b01be'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#5',
        color: '#bfc8c7'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#6',
        color: '#d892cc'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#7',
        color: '#5c83ee'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#8',
        color: '#96eb88'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#9',
        color: '#af391c'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#10',
        color: '#f63e97'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#11',
        color: '#ac0e4f'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#12',
        color: '#080b5a'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#13',
        color: '#806738'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#14',
        color: '#54fcef'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: 'inside',
        marginBottom: 20,
        content: 'Test-#15',
        color: '#f9d77c'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#16',
        color: '#917a70'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#17',
        color: '#39d816'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#18',
        color: '#c59e8a'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#19',
        color: '#62b27f'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#20',
        color: '#c9a016'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#21',
        color: '#6a43c5'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#22',
        color: '#8a729e'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#23',
        color: '#1ea227'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#24',
        color: '#49f2d7'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#25',
        color: '#4ab196'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#26',
        color: '#f67f97'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#27',
        color: '#69af95'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#28',
        color: '#be7ace'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: 'inside',
        marginBottom: 20,
        content: 'Test-#29',
        color: '#5f9beb'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#30',
        color: '#7cef1d'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#31',
        color: '#175fb4'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#32',
        color: '#242c52'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#33',
        color: '#b186f9'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#34',
        color: '#e50b2e'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#35',
        color: '#f5d9f7'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#36',
        color: '#cc3d17'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#37',
        color: '#5469dc'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#38',
        color: '#1f328d'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#39',
        color: '#095890'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#40',
        color: '#a64e45'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#41',
        color: '#9adbec'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#42',
        color: '#46796e'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#43',
        color: '#567141'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: 'inside',
        marginBottom: 20,
        content: 'Test-#44',
        color: '#eb3787'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#45',
        color: '#52747b'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#46',
        color: '#312dcb'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#47',
        color: '#b7cc2b'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#48',
        color: '#f1ff9e'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#49',
        color: '#2b06ea'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#50',
        color: '#4c3155'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#51',
        color: '#87d6c9'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#52',
        color: '#eb0d66'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#53',
        color: '#60f45a'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#54',
        color: '#0df3c1'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#55',
        color: '#9483cb'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#56',
        color: '#3ffb39'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#57',
        color: '#ab6f5a'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: 'inside',
        marginBottom: 20,
        content: 'Test-#58',
        color: '#0def4b'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#59',
        color: '#945a68'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#60',
        color: '#5909db'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#61',
        color: '#09e046'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#62',
        color: '#9421c7'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#63',
        color: '#d22974'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#64',
        color: '#075cfe'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#65',
        color: '#549983'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#66',
        color: '#07d874'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#67',
        color: '#fe6c51'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#68',
        color: '#5a11f9'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#69',
        color: '#078427'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#70',
        color: '#a90b7b'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#71',
        color: '#b8a942'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#72',
        color: '#80c295'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: 'inside',
        marginBottom: 20,
        content: 'Test-#73',
        color: '#771672'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#74',
        color: '#43435d'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#75',
        color: '#e44e55'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#76',
        color: '#352b2d'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#77',
        color: '#76432d'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#78',
        color: '#95d4bf'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#79',
        color: '#a423d4'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#80',
        color: '#634a1c'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#81',
        color: '#670bd1'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#82',
        color: '#a4e3d7'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#83',
        color: '#e54508'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#84',
        color: '#766790'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#85',
        color: '#8bd9c8'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#86',
        color: '#566681'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: 'inside',
        marginBottom: 20,
        content: 'Test-#87',
        color: '#a2bc22'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#88',
        color: '#f0a244'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#89',
        color: '#14026e'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#90',
        color: '#0e829d'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#91',
        color: '#9869cf'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#92',
        color: '#ea75f4'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#93',
        color: '#656452'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#94',
        color: '#0c8ac7'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#95',
        color: '#123938'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#96',
        color: '#cf76c3'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#97',
        color: '#1311d7'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#98',
        color: '#010cf3'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#99',
        color: '#5d23b2'
      },
      {
        name: 'test-element',
        wrappable: true,
        pageBreak: null,
        marginBottom: 20,
        content: 'Test-#100',
        color: '#6f6586'
      }
    ] as TestElement[]
  });

  return {
    document
  };
})