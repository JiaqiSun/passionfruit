import { valueOf } from './dict'

function NSStringWrapper(name) {
  return function() {
    const func = new NativeFunction(Module.findExportByName(null, name), 'pointer', [])
    const result = func()
    return new ObjC.Object(result).toString()
  }
}

export const NSTemporaryDirectory = NSStringWrapper('NSTemporaryDirectory')
export const NSHomeDirectory = NSStringWrapper('NSHomeDirectory')


export function attrs(path) {
  const { NSFileManager, NSString } = ObjC.classes
  const pError = Memory.alloc(Process.pointerSize)
  Memory.writePointer(pError, NULL)
  const attr = NSFileManager.defaultManager()
    .attributesOfItemAtPath_error_(NSString.stringWithString_(path), pError)

  const err = Memory.readPointer(pError)
  if (!err.isNull())
    throw new Error(new ObjC.Object(err).localizedDescription())

  const result = {}
  const lookup = {
    owner: 'NSFileOwnerAccountName',
    size: 'NSFileSize',
    creation: 'NSFileCreationDate',
    permission: 'NSFilePosixPermissions',
    type: 'NSFileType',
    group: 'NSFileGroupOwnerAccountName',
    modification: 'NSFileModificationDate',
    protection: 'NSFileProtectionKey'
  }

  for (const [jsKey, ocKey] of Object.entries(lookup))
    result[jsKey] = valueOf(attr.objectForKey_(ocKey))

  return result
}
