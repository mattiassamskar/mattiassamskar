import { Cannon } from "./cannon";
import { Invader } from "./invader";
import { Message } from "./message";
import { Star } from "./star";
import { Shot } from "./types";
import { randomInt } from "./utils";

const getShot = (y: number): Shot => {
  const image = new Image();
  image.src = "shot.svg";

  return {
    image,
    x: 0,
    y: y - image.height + 70,
    isShooting: false,
  };
};

const moveShot = (context: CanvasRenderingContext2D, shot: Shot) => {
  if (!shot.isShooting) return;

  context.drawImage(shot.image, shot.x, shot.y, 25 - 16, 120 - 70);

  shot.y -= 12;
  if (shot.y <= 0) {
    shot.y = cannon.left - shot.image.height + 70;
    shot.isShooting = false;
  }
};

const getGradient = () => {
  const gradient = context.createRadialGradient(
    canvas.width * 0.3,
    canvas.height,
    30,
    canvas.width * 0.8,
    canvas.height,
    canvas.width
  );
  gradient.addColorStop(0, "orange");
  gradient.addColorStop(0.2, "yellow");
  gradient.addColorStop(0.4, "orange");
  gradient.addColorStop(0.6, "yellow");
  gradient.addColorStop(0.8, "orange");
  gradient.addColorStop(1, "yellow");

  return gradient;
};

const audio = new Audio("shot.wav");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "black";

const context = canvas.getContext("2d");
context.font = "48px Arcade Classic";

const invaders = ["github.svg", "gmail.svg", "linkedin.svg", "youtube.svg"].map(
  (name) => new Invader(name, randomInt(0, canvas.width), -100)
);
const stars = Array.from(Array(120).keys()).map(
  (_) => new Star(window.screen.width, window.screen.height)
);

const message = new Message(canvas.width, canvas.height - 20, getGradient());
message.width = context.measureText(message.text).width;
const cannon = new Cannon("cannon.svg", canvas.width / 3, canvas.height - 130);

const shot = getShot(cannon.left);

window.onclick = () => {
  if (shot.isShooting === true) return;

  shot.x = cannon.left + cannon.image.width / 6 - 5;
  shot.isShooting = true;
  audio.play();
};

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.font = "48px Arcade Classic";
});

const startTime = performance.now();

(function draw(timestamp) {
  // const elapsedTimeUnits = (timestamp - startTime);

  context.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    context.beginPath();
    context.arc(star.x, star.y, star.size * 0.75, 0, Math.PI * 2);
    context.fillStyle = star.color;
    context.fill();
    star.move(window.screen.width, window.screen.height);
  });

  invaders.forEach((invader) => {
    context.drawImage(
      invader.image,
      invader.left,
      invader.top,
      invader.width,
      invader.height
    );
    invader.move(canvas.width, canvas.height / 2);
  });

  context.drawImage(
    cannon.image,
    cannon.left,
    cannon.top,
    cannon.width,
    cannon.height
  );
  cannon.move(canvas.width);

  context.fillStyle = message.gradient;
  context.fillText(message.text, message.x, message.y);
  message.move(canvas.width);

  moveShot(context, shot);

  requestAnimationFrame(draw);
})(startTime);
