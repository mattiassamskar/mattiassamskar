import { GameImage, randomInt } from "./utils";

export class Invader implements GameImage {
  readonly name: string;
  readonly url: string;
  readonly width: number;
  readonly height: number;
  left: number;
  top: number;
  image: HTMLImageElement;
  xDirection: "left" | "right";
  yDirection: "up" | "down";
  xSpeed: number;
  ySpeed: number;
  timeout: number;

  constructor(name: string, url: string, x: number, y: number) {
    this.name = name;
    this.url = url;
    this.left = x;
    this.top = y;
    this.width = 74;
    this.height = 63;
    this.xSpeed = 15;
    this.ySpeed = 6;
    this.image = new Image(this.width, this.height);
    this.image.src = name;
    this.xDirection = "right";
    this.yDirection = "down";
    this.timeout = randomInt(1, 20);
  }

  get right() {
    return this.left + this.width;
  }

  get bottom() {
    return this.top + this.height;
  }

  private toggleXDirection = () =>
    (this.xDirection = this.xDirection === "left" ? "right" : "left");

  private toggleYDirection = () =>
    (this.yDirection = this.yDirection === "up" ? "down" : "up");

  move(xMax: number, yMax: number) {
    if (this.timeout-- > 0) return;

    this.xDirection =
      this.left < 0
        ? "right"
        : this.right > xMax
        ? "left"
        : randomInt(0, 100) > 97
        ? this.toggleXDirection()
        : this.xDirection;

    this.yDirection =
      this.top < 0
        ? "down"
        : this.bottom > yMax
        ? "up"
        : randomInt(0, 100) > 95
        ? this.toggleYDirection()
        : this.yDirection;

    this.left =
      this.xDirection === "left"
        ? this.left - this.xSpeed
        : this.left + this.xSpeed;
    this.top =
      this.yDirection === "up"
        ? this.top - this.ySpeed
        : this.top + this.ySpeed;

    this.timeout = 20;
  }
}
