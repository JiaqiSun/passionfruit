const exported = new Map()

export function register(func, name) {
  if (typeof func !== 'function')
    throw new Error(`Invalid argument: ${func}`)

  const key = name || func.name
  if (exported.has(key))
    throw new Error(`Name collinsion: ${key}`)

  exported.set(key, func)
}

export function invoke(name, args) {
  const { NSAutoreleasePool } = ObjC.classes
  const pool = NSAutoreleasePool.alloc().init()
  try {
    return exported.get(name).apply(null, args)
  } finally {
    pool.release()
  }
}

export function interfaces() {
  return [...exported.keys()]
}
