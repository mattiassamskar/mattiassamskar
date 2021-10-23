import { randomInt } from "./utils";

export class Star {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;

  constructor(xMax: number, yMax: number) {
    this.x = randomInt(0, xMax);
    this.y = randomInt(0, yMax);
    this.size = randomInt(1, 3);
    this.speed = this.size;
    this.color = "#DDDDDD";
  }

  move(xMax: number, yMax: number) {
    this.x = this.x + this.speed;
    if (this.x > xMax) {
      this.x = 0;
      this.y = randomInt(0, yMax);
    }
  }
}
