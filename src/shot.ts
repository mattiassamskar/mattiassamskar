import { GameImage } from "./utils";

export class Shot implements GameImage {
  image: HTMLImageElement;
  audio: HTMLAudioElement;
  readonly name: string;
  readonly width: number;
  readonly height: number;
  left: number;
  top: number;
  isVisible: boolean;

  constructor(name: string, audioName: string, x: number, y: number) {
    this.name = "shot";
    this.left = x;
    this.top = y;
    this.width = 9;
    this.height = 50;
    this.image = new Image(this.width, this.height);
    this.image.src = name;
    this.audio = new Audio(audioName);

    this.isVisible = false;
  }

  get right() {
    return this.left + this.width;
  }

  get bottom() {
    return this.top + this.height;
  }

  move() {
    this.top -= 12;
    if (this.bottom < 0) {
      this.isVisible = false;
    }
  }
}
