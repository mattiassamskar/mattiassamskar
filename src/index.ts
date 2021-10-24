import { Cannon } from "./cannon";
import { Invader } from "./invader";
import { Message } from "./message";
import { Shot } from "./shot";
import { Star } from "./star";
import { getGradient, randomInt } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
context.font = "48px Arcade Classic";

const invaders = ["github.svg", "gmail.svg", "linkedin.svg", "youtube.svg"].map(
  (name) => new Invader(name, randomInt(0, canvas.width), -100)
);

const stars = Array.from(Array(120).keys()).map(
  (_) => new Star(window.screen.width, window.screen.height)
);

const message = new Message(
  canvas.width,
  canvas.height - 20,
  getGradient(context, canvas.width, canvas.height)
);
message.width = context.measureText(message.text).width;

const cannon = new Cannon("cannon.svg", canvas.width / 3, canvas.height - 130);

const shot = new Shot("shot.svg", "shot.wav", 0, 0);

window.onclick = () => {
  shot.left = cannon.middle - shot.width / 2;
  shot.top = cannon.top - shot.height + 10;
  shot.isVisible = true;
  console.log(shot);
  shot.audio.play();
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

  if (shot.isVisible) {
    context.drawImage(shot.image, shot.left, shot.top, shot.width, shot.height);
    shot.move();
  }

  context.fillStyle = message.gradient;
  context.fillText(message.text, message.x, message.y);
  message.move(canvas.width);

  requestAnimationFrame(draw);
})(startTime);
