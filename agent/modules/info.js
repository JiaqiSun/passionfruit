import { valueOf } from '../lib/dict'
import { NSTemporaryDirectory, NSHomeDirectory } from '../lib/foundation'

const { NSBundle, NSUserDefaults } = ObjC.classes


export function info() {
  const mainBundle = NSBundle.mainBundle()
  const json = valueOf(mainBundle.infoDictionary())
  const result = {
    tmp: NSTemporaryDirectory(),
    home: NSHomeDirectory(),
    json,
    urls: []
  }
  
  const BUNDLE_ATTR_MAPPING = {
    id: 'bundleIdentifier',
    bundle: 'bundlePath',
    binary: 'executablePath'
  }

  for (let [key, method] of Object.entries(BUNDLE_ATTR_MAPPING))
    result[key] = mainBundle[method]().toString()

  if ('CFBundleURLTypes' in json) {
    result.urls = json['CFBundleURLTypes'].map(item => ({
      name: item['CFBundleURLName'],
      schemes: item['CFBundleURLSchemes'],
      role: item['CFBundleTypeRole']
    }))
  }

  const READABLE_NAME_MAPPING = {
    name: 'CFBundleDisplayName',
    version: 'CFBundleVersion',
    semVer: 'CFBundleShortVersionString',
    minOS: 'MinimumOSVersion'
  }

  for (let [key, label] of Object.entries(READABLE_NAME_MAPPING))
    result[key] = json[label] || 'N/A'

  return result
}


export function userDefaults() {
  return valueOf(NSUserDefaults.alloc().init().dictionaryRepresentation())
}
