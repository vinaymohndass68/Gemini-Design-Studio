
export enum DesignType {
  BANNER = 'BANNER',
  LOGO = 'LOGO'
}

export interface DesignState {
  type: DesignType;
  width: number;
  height: number;
  purpose: string;
  themeColor: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
