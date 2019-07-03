function uniqueAndDemangle(list) {
  const set = new Set()

  return list.filter((symbol) => {
    const key = symbol.address
    if (set.has(key))
      return false
    set.add(key)
    return true
  }).map((symbol) => {
    if (symbol.name.startsWith('_Z')) {
      const demangled = DebugSymbol.fromAddress(symbol.address).name
      return Object.assign(symbol, { demangled })
    }
    return symbol
  })
}

export function modules() {
  return Process.enumerateModules()
}

export function imports(name) {
  const mod = name || Process.enumerateModules()[0].name
  return uniqueAndDemangle(Module.enumerateImports(mod))
}

export function exports(name) {
  const mod = name || Process.enumerateModules()[0].name
  return uniqueAndDemangle(Module.enumerateExports(mod))
}
