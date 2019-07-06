class KnownError extends Error {}

class DeviceNotFoundError extends KnownError {
  constructor(id) {
    super(`can not find device id: ${id}`)
  }
}

class AppNotFoundError extends KnownError {
  constructor(target) {
    super(`${target} not found`)
  }
}

class VersionMismatchError extends KnownError {}

class InvalidDeviceError extends KnownError {
  constructor(id) {
    super(`${id} is not an iOS device, or you have not installed frida on it`)
  }
}

class AppAttachError extends KnownError {
  constructor(bundle) {
    super(`unable to attach to ${bundle}`)
  }
}

class EarlyInstrumentError extends KnownError {
  constructor(bundle) {
    super(`early instrument for ${bundle} failed`)
  }
}

module.exports = {
  DeviceNotFoundError,
  AppNotFoundError,
  AppAttachError,
  VersionMismatchError,
  InvalidDeviceError,
  KnownError,
}
