// import moment from 'moment'

export function timeAgo (datetime) {
  // console.log(datetime, ' | ', new Date())
  // console.log(datetime, moment(datetime))

  const time = new Date(datetime).getTime()
  const between = (new Date().getTime() - time) / 1000

  if (between < 3600) {
    return pluralize(~~(between / 60), '분')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), '시간')
  } else {
    return pluralize(~~(between / 86400), '일')
  }
}

function pluralize (time, label) {
  return time + label
}
