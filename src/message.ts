export class Message {
  text: string;
  x: number;
  y: number;
  width: number;
  gradient: CanvasGradient;

  constructor(x: number, y: number, gradient: CanvasGradient) {
    this.x = x;
    this.y = y;
    this.gradient = gradient;
    this.text =
      "Welcome to my version of Space Invaders - click or tap screen to fire";
  }

  move(xMax: number) {
    this.x -= 3;
    if (this.x + this.width < 0) {
      this.x = xMax;
    }
  }
}
