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

export interface Cannon {
  image: HTMLImageElement;
  x: number;
  y: number;
  direction: "left" | "right";
  isShooting: boolean;
}

export interface Shot {
  image: HTMLImageElement;
  x: number;
  y: number;
  isShooting: boolean;
}
