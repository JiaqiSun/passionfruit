import { NSHomeDirectory, attrs } from '../lib/foundation'
import { open } from '../lib/libc'
import { valueOf } from '../lib/dict'

const { NSBundle, NSFileManager, NSString, NSDictionary } = ObjC.classes


export function readdir(path) {
  const pError = Memory.alloc(Process.pointerSize)
  Memory.writePointer(pError, NULL)

  const list = NSFileManager.defaultManager().contentsOfDirectoryAtPath_error_(path, pError)
  const err = Memory.readPointer(pError)

  if (!err.isNull())
    throw new Error(new ObjC.Object(err).localizedDescription())

  const isDir = Memory.alloc(Process.pointerSize)
  const count = list.count()
  const result = new Array(count)
  for (let i = 0; i < count; i++) {
    const filename = list.objectAtIndex_(i).toString()
    const absolute = [path, filename].join('/')
    result[i] = {
      type: Memory.readPointer(isDir).isNull() ? 'file' : 'directory',
      name: filename,
      path: absolute.toString(),
      attribute: attrs(absolute) || {}
    }
  }

  return result
}


export function resolve(root, path = '') {
  if (!['home', 'bundle'].includes(root))
    throw new Error('Invalid root')

  const prefix = root === 'home' ?
    NSHomeDirectory() :
    NSBundle.mainBundle().bundlePath()

  return [prefix, path].join('/')
}


export function ls(root, path = '') {
  return readdir(resolve(root, path))
}


export function plist(path) {
  const info = NSDictionary.dictionaryWithContentsOfFile_(path)
  if (!info)
    throw new Error(`"${path}" is not valid plist format`)
  return valueOf(info)
}


export async function text(path) {
  const name = Memory.allocUtf8String(path)
  const SIZE = 10 * 1024 // max read size: 10k
  const fd = open(name, 0, 0)
  if (fd === -1)
    throw new Error(`unable to open file ${path}`)

  const stream = new UnixInputStream(fd, { autoClose: true })
  return Buffer.from(await stream.read(SIZE)).toString()
}
