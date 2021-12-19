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
      "Welcome to my version of Space Invaders - click or tap screen to fire - shoot invader and get link to web page";
  }

  move(xMax: number, secondsPassed: number) {
    this.x -= 250 * secondsPassed;
    if (this.x + this.width < -500) {
      this.x = xMax;
    }
  }
}
