export function timeAgo (datetime) {
  const time = new Date(datetime).getTime()
  const between = (new Date().getTime() - time) / 1000

  console.log(datetime, time, between)

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
