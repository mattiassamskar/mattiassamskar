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
