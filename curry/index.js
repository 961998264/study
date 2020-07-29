function curry (fn, args) {
  return function () {
    // 将类数组转换成数组
    let arg = [].slice.call(arguments)
    // 递归之后拼接参数
    if (args !== undefined) {
      arg = args.concat(arg)
    }

    if (arg.length < fn.length) {
      // 递归
      return curry(fn, arg)
    } else {
      return fn.apply(null, arg)
    }
  }
}

const fn11 = curry(function (a, b, c, d) {
  console.log(a, b, c, d, "a, b, c, d")
})
fn11('1')(2)(3)(55)