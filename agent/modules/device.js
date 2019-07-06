const { UIDevice } = ObjC.classes


export function info() {
  const keys = ['name', 'systemVersion', 'buildVersion', 'systemName', 'model', 'localizedModel']
  const device = UIDevice.currentDevice()
  const result = {}
  for (const key of keys)
    result[key] = device[key]() + ''
  return result
}
