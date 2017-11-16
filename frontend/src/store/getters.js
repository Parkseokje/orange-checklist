const userTypes = state => state.userTypes
const modalVariants = state => state.modalVariants
const categoryTypes = state => state.categoryTypes
const messages = state => state.messages
const checkListTypes = state => state.checkListTypes
const checkListTypeByValue = state => {
  return value => state.checkListTypes.filter(checklistType => {
    return checklistType.value === value
  })
}
const spinner = state => state.spinner
const editorOption = state => state.editorOption
const editorOption2 = state => state.editorOption2
const datePickerOptions = state => state.datePickerOptions

export {
  userTypes,
  modalVariants,
  categoryTypes,
  messages,
  checkListTypes,
  checkListTypeByValue,
  spinner,
  editorOption,
  editorOption2,
  datePickerOptions
}
