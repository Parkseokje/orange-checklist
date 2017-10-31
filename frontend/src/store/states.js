export default {
  userTypes: [
    { text: '구분을 선택하세요', value: null },
    { text: 'SV(Supervisor)', value: 'SV' },
    { text: 'MS(Mystery Shoper)', value: 'MS' },
    { text: 'ADMIN', value: 'ADMIN' },
    { text: 'USER', value: 'USER' }
  ],
  modalVariants: {
    headerBgVariant: 'dark',
    headerTextVariant: 'light'
  },
  categoryTypes: {
    big: { key: 'big', value: '대분류' },
    middle: { key: 'middle', value: '중분류' },
    small: { key: 'small', value: '소분류' }
  },
  messages: {
    emptyText: '자료가 존재하지 않습니다'
  }
}
