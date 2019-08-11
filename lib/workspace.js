import path from 'path'
import os from 'os'


export function appdata() {
  if (process.platform === 'darwin')
    return path.join(os.homedir(), 'Library', 'Application Support', 'passionfruit')

  if (process.platform === 'win32')
    return path.join(process.env.APPDATA, 'passionfruit')
  
  return path.join(os.homedir(), '.local', 'share', 'passionfruit')
}
