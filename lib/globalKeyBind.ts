const globalKeyBind = instance => {
  const _globalCallbacks = {};
  const _originalStopCallback = instance.prototype.stopCallback;

  instance.prototype.stopCallback = function (e, element, combo, sequence) {
    let self = this;

    if (self.paused) {
      return true;
    }

    if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
      return false;
    }

    return _originalStopCallback.call(self, e, element, combo);
  };

  instance.prototype.bindGlobal = function (keys, callback, action) {
    let self = this;

    self.bind(keys, callback, action);

    if (keys instanceof Array) {
      for (let i = 0; i < keys.length; i++) {
        _globalCallbacks[keys[i]] = true;
      }
      return;
    }

    _globalCallbacks[keys] = true;
  };

  instance.prototype.unbindGlobal = function (keys, action) {
    let self = this;
    self.unbind(keys, action);

    if (keys instanceof Array) {
      for (let i = 0; i < keys.length; i++) {
        _globalCallbacks[keys[i]] = false;
      }
      return;
    }

    _globalCallbacks[keys] = false;
  };

  instance.init();
};

export default globalKeyBind;
