const PROPERTIES = ['version', 'name', 'value', 'domain', 'path']

export function list() {
  const jar = ObjC.classes.NSHTTPCookieStorage.sharedHTTPCookieStorage().cookies()
  const result = new Array(jar.count())

  for (let i = 0; i < jar.count(); i++) {
    const cookie = jar.objectAtIndex_(i)
    const entry = {}
    for (const prop of PROPERTIES) {
      entry[prop] = cookie[prop]().toString()
      entry.isSecure = cookie.isSecure()
    }
    result[i] = entry
  }

  return result
}

// to mute eslint "Prefer default export"
export function write() {

}
