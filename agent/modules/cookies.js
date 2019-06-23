const PROPERTIES = ['version', 'name', 'value', 'domain', 'path']

export default function cookies() {
  const jar = ObjC.classes.NSHTTPCookieStorage.sharedHTTPCookieStorage().cookies()
  const result = new Array(jar.count())

  for (let i = 0; i < jar.count(); i++) {
    const cookie = jar.objectAtIndex_(i)
    const entry = {}
    for (let prop of PROPERTIES) {
      entry[prop] = cookie[prop]().toString()
      entry.isSecure = cookie.isSecure()
    }
    result[i] = entry
  }

  return result
}
