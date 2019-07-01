const { NSArray, NSData, NSDictionary, NSNumber, NSPropertyListSerialization } = ObjC.classes


export function valueOf(value) {
  if (value === null || typeof value !== 'object')
    return value
  if (value.isKindOfClass_(NSArray))
    return arrayFromNSArray(value)
  if (value.isKindOfClass_(NSDictionary))
    return dictFromNSDictionary(value)
  if (value.isKindOfClass_(NSNumber))
    return value.floatValue()
  return value.toString()
}


export function dictFromNSDictionary(nsDict) {
  const jsDict = {}
  const keys = nsDict.allKeys()
  const count = keys.count()
  for (let i = 0; i < count; i++) {
    const key = keys.objectAtIndex_(i)
    const value = nsDict.objectForKey_(key)
    jsDict[key.toString()] = valueOf(value)
  }

  return jsDict
}


export function dictFromPlistCharArray(address, size) {
  const format = Memory.alloc(Process.pointerSize)
  const err = Memory.alloc(Process.pointerSize)
  const data = NSData.dataWithBytesNoCopy_length_freeWhenDone_(address, size, 0)
  const dict = NSPropertyListSerialization.propertyListFromData_mutabilityOption_format_errorDescription_(
    data,
    NSPropertyListImmutable,
    format,
    err,
  )

  const desc = Memory.readPointer(err)
  if (!desc.isNull())
    throw new Error(new ObjC.Object(desc))

  return dictFromNSDictionary(dict)
}


export function arrayFromNSArray(original, limit) {
  const arr = []
  const count = original.count()
  const len = Number.isNaN(limit) ? Math.min(count, limit) : count
  for (let i = 0; i < len; i++) {
    const val = original.objectAtIndex_(i)
    arr.push(valueOf(val))
  }
  return arr
}
