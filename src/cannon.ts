export class Cannon {
  image: HTMLImageElement;
  readonly width: number;
  readonly height: number;
  left: number;
  top: number;
  direction: "left" | "right";

  constructor(name: string, x: number, y: number) {
    this.left = x;
    this.top = y;
    this.width = 75;
    this.height = 49;
    this.image = new Image(this.width, this.height);
    this.image.src = name;
    this.direction = "right";
  }

  get right() {
    return this.left + this.width;
  }

  get bottom() {
    return this.top + this.height;
  }

  get middle() {
    return this.left + this.width / 2;
  }

  move(xMax: number) {
    this.left = this.direction === "left" ? this.left - 5 : this.left + 5;
    if (this.left <= 50) {
      this.direction = "right";
    }
    if (this.right > xMax - 50) {
      this.direction = "left";
    }
  }
}
