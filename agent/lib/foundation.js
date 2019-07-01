function NSStringWrapper(name) {
  return function() {
    const func = new NativeFunction(Module.findExportByName(null, name), 'pointer', [])
    const result = func()
    return new ObjC.Object(result).toString()
  }
}

export const NSTemporaryDirectory = NSStringWrapper('NSTemporaryDirectory')
export const NSHomeDirectory = NSStringWrapper('NSHomeDirectory')
