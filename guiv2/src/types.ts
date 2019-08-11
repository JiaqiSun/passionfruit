export interface DeviceInfo {
  icon: IconInfo;
  id: string;
  name: string;
}

export interface IconInfo {
  width: number;
  height: number;
  pixels: string;
}

export interface AppInfo {
  identifier: string;
  largeIcon: IconInfo;
  name: string;
  smallIcon: IconInfo;
}
