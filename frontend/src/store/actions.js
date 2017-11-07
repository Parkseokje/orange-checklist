import { createActionHelpers } from 'vuex-loading'
const { startLoading, endLoading } = createActionHelpers({
  moduleName: 'loading'
})

const startLoader = ({ dispatch }) => {
  startLoading(dispatch, 'worker')
}

const endLoader = ({ dispatch }) => {
  setTimeout(() => {
    endLoading(dispatch, 'worker')
  }, 500)
}

export {
  startLoader,
  endLoader
}
