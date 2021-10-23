import { randomInt } from "./utils";

export class Star {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: {
    red: number;
    green: number;
    blue: number;
    opacity: number;
  };

  constructor(xMax: number, yMax: number) {
    this.size = randomInt(1, 3);
    const gray = 90 + 40 * this.size;
    this.x = randomInt(0, xMax);
    this.y = randomInt(0, yMax);
    this.speed = this.size;
    this.color = {
      red: gray,
      green: gray,
      blue: gray,
      opacity: 255,
    };
  }

  move(imageData: ImageData, xMax: number, yMax: number, canvasWidth: number) {
    this.x = this.x + this.speed;
    if (this.x > xMax) {
      this.x = 0;
      this.y = randomInt(0, yMax);
    }
    putPixel(imageData, this.x, this.y, this.color, canvasWidth);
    putPixel(imageData, this.x, this.y + 1, this.color, canvasWidth);
    putPixel(imageData, this.x + 1, this.y, this.color, canvasWidth);
    putPixel(imageData, this.x + 1, this.y + 1, this.color, canvasWidth);
    if (this.size > 1) {
      putPixel(imageData, this.x, this.y + 2, this.color, canvasWidth);
      putPixel(imageData, this.x + 2, this.y, this.color, canvasWidth);
      putPixel(imageData, this.x + 2, this.y + 2, this.color, canvasWidth);
    }
    if (this.size > 2) {
      putPixel(imageData, this.x, this.y + 3, this.color, canvasWidth);
      putPixel(imageData, this.x + 3, this.y, this.color, canvasWidth);
      putPixel(imageData, this.x + 3, this.y + 3, this.color, canvasWidth);
    }
  }
}

const putPixel = (
  imageData: ImageData,
  x: number,
  y: number,
  color: { red: number; green: number; blue: number; opacity: number },
  yMax: number
) => {
  const i = (x + y * yMax) * 4;
  imageData.data[i] = color.red;
  imageData.data[i + 1] = color.green;
  imageData.data[i + 2] = color.blue;
  imageData.data[i + 3] = color.opacity;
};
