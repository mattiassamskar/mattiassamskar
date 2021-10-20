export interface Enemy {
  name: string;
  image: HTMLImageElement;
  x: number;
  y: number;
  xd: number;
  yd: number;
  timeout: number;
}

export interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: Color;
}

export type Color = {
  red: number;
  green: number;
  blue: number;
  opacity: number;
};

export interface Message {
  text: string;
  x: number;
  y: number;
}
