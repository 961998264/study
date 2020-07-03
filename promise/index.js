

// 基本promise 实现
// 1. 三种状态。
// 2. 保存执行结果
// 3. 定义reject resolve
class MyPromise {
  constructor(fun) {
    this.value = ''
    this.status = 'pendding'
    this.resolve = (val) => {
      if (this.status === 'pendding') {
        this.status = 'resolved'
        this.value = val
      }
    }

    this.reject = (val) => {
      if (this.status === 'pendding') {
        this.status = 'rejectd'
        this.value = val
      }
    }
    fun(this.resolve, this.reject)
  }
}

// 实现异步调用  利用发布订阅
// 新增 resolveQueue，rejectQueue，利用settimeout进行异步，也就是说resolve总是在事件队列末端，then会优先于resolve执行，执行then时候，会将then的onFullfilled和onRejected 存到对于的队列中
class MyPromise {
  constructor(fun) {
    this.value = ''
    this.status = 'pendding'
    this.resolveQueue = [] // 保存resolve回调
    this.rejectQueue = [] // 保存reject回调
    this.resolve = (val) => {
      // 利用
      setTimeout(() => {
        if (this.status === 'pendding') {
          this.status = 'resolved'
          this.value = val
        }
      });
    }

    this.reject = (val) => {
      setTimeout(() => {
        if (this.status === 'pendding') {
          this.status = 'rejectd'
          this.value = val
        }
      });
    }
    fun(this.resolve, this.reject)
  }
}
// 新增then
// then总是优先于resolve执行，所以在执行then之后，将对于的回调存在对于的队列中，在执行
// resolve或者reject的时候，遍历对应的对于，执行
class MyPromise {
  constructor(fun) {
    this.value = ''
    this.status = 'pendding'
    this.resolveQueue = [] // 保存resolve回调
    this.rejectQueue = [] // 保存reject回调
    this.resolve = (val) => {
      // 利用
      setTimeout(() => {
        if (this.status === 'pendding') {
          this.status = 'resolved'
          this.value = val
          this.resolveQueue.forEach(fun => fun())
        }

      });
    }

    this.reject = (val) => {
      setTimeout(() => {
        if (this.status === 'pendding') {
          this.status = 'rejectd'
          this.value = val
          this.rejectQueue.forEach(fun => fun())
        }
      });
    }
    fun(this.resolve, this.reject)
  }

  then (onFullfilled, onRejected) {
    this.resolveQueue.push(onFullfilled(this.value))
    this.rejectQueue.push(onRejected(this.value))
  }
}

// 实现链式调用
// 1. 每次then 都返回一个新的promise
// 2. then的两个参数可以传null
// 3. 如果传了null,就将当前的值作为新的promise的resolve参数
// 4. 如果传了，将回调函数的结果作为新的promise的resolve参数


class MyPromise {
  constructor(fun) {
    this.value = ''
    this.status = 'pendding'
    this.resolveQueue = [] // 保存resolve回调
    this.rejectQueue = [] // 保存reject回调
    this.resolve = (val) => {
      setTimeout(() => {
        if (this.status === 'pendding') {
          this.status = 'resolved'
          this.value = val
          this.resolveQueue.forEach(callback => this.handle(callback))
        }
      });
    }

    this.reject = (val) => {
      setTimeout(() => {
        if (this.status === 'pendding') {
          this.status = 'rejectd'
          this.value = val
          this.rejectQueue.forEach(callback => this.handle(callback))
        }
      });
    }
    fun(this.resolve, this.reject)
  }
  then (onFullfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handle({
        resolve, reject, onFullfilled, onRejected
      })
    })
  }
  handle (callbackOption) {
    const { resolve, reject, onFullfilled, onRejected } = callbackOption
    // callback是一个对象   resolve, reject, onFullfilled, onRejected
    if (this.status === 'pendding') {
      // 状态为pendding,说明是 then触发了handdle,将对象存入 队列
      if (callbackOption.onFullfilled) {
        this.resolveQueue.push(callbackOption)
      }
      if (callbackOption.onRejected) {
        this.rejectQueue.push(callbackOption)
      }
    }
    if (this.status === 'resolved') {
      // 说明是resolve中触发了handle，遍历执行回调队列
      if (onFullfilled && (typeof onFullfilled === 'function')) {
        const ret = onFullfilled(this.value)
        // 用当前then的resolve返回执行结果
        resolve(ret)
      } else {
        // 否则直接放value返回
        resolve(this.value)
      }
    } else if (this.status === 'rejectd') {
      if (onRejected && (typeof onRejected === 'function')) {
        const ret = onRejected(this.value)
        reject(ret)
      } else {
        reject(this.value)
      }
    }
  }
}