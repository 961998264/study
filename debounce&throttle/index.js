// 重在清零  清空定时器
// 函数防抖是指在函数被高频触发时当停止触发后延时n秒再执行函数（即每次触发都清理延时函数再次开始计时），一般用于resize，scroll，mousemove等
function debounce (fun, delay) {
  let timer;
  return function () {
    let that = this
    let _args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fun.apply(that, _args)
    }, delay)
  }
}

// 节流  控制水量
function throttle (f, wait) {
  let timer;
  return function () {
    let that = this
    let _args = arguments
    console.log("throttle -> _args", _args)
    if (timer) { return }
    timer = setTimeout(() => {
      f.apply(that, _args)
      timer = null
    }, wait)
  }

}
const test = (aa, bb) => {
  console.log('22')
  console.log('22222', aa)
}
const fn = debounce(test, 1000)
const fn1 = throttle(test, 1000)
document.getElementById('debounce').onclick = function () {
  fn('a', 'b')
  fn1('aaaa', 'bmmm')
}