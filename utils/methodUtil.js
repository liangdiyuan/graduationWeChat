const method = {
  debounce: function(method, delay = 500) {
    let timer = null;
    return function () {
      let self = this,
        argu = arguments;
      timer && clearTimeout(timer);
      timer = setTimeout(function () {
        method.apply(self, argu);
      }, delay)
    }
  },
  throttle: function(method, mustRunDelay) {
    let timer,
        start;
    return function loop() {
      let self = this,
          args = arguments,
          now = Date.now();
      if (!start) {
        start = now;
      }

      timer && clearTimeout(timer);

      if (now - start >= (mustRunDelay || 400)) {
        method.apply(self, args);
        start = now;
      } else {
        timer = setTimeout(function () {
          loop.apply(self, args);
        }, 50);
      }
    }
  },
}

export default method

