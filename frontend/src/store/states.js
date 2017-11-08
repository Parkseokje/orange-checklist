export default {
  userTypes: [
    { text: '선택하세요', value: null },
    { text: '슈퍼바이져', value: 'supervisor' },
    { text: '미스테리 쇼퍼', value: 'shopper' },
    { text: '모니터링 요원', value: 'agent' },
    { text: '컨설턴트', value: 'consultant' },
    { text: '점주', value: 'shopkeeper' },
    { text: '전체 관리자', value: 'admin' }
  ],
  checkListTypes: [
    { text: '선택하세요', value: null },
    { text: '슈퍼바이져용', value: 'supervisor' },
    { text: '미스터리 쇼퍼용', value: 'shopper' },
    { text: '교육기관 현장점검용', value: 'agent' }
  ],
  modalVariants: {
    headerBgVariant: 'dark',
    headerTextVariant: 'light'
  },
  categoryTypes: {
    big: { key: 'A', value: '업종' },
    middle: { key: 'B', value: '대분류' },
    small: { key: 'C', value: '중분류' }
  },
  messages: {
    emptyText: '자료가 존재하지 않습니다'
  },
  spinner: {
    color: '#3AB982',
    height: '35px',
    width: '4px'
  },
  editorOption: {
    // theme: 'bubble',
    placeholder: '텍스트를 입력하세요',
    modules: {
      toolbar: [
        ['bold', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }],
        // [{ 'font': [] }],
        [{ 'size': ['small', false, 'large'] }],
        [{ 'align': [] }]
        // ['link']
        // ['image'],
        // ['clean']
      ]
    }
  }
}
