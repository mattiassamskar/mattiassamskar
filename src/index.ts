import { Cannon } from "./cannon";
import { Invader } from "./invader";
import { Message } from "./message";
import { Shot } from "./shot";
import { Star } from "./star";
import { detectCollision, getGradient, randomInt } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
context.font = "48px Arcade Classic";

const invaders = [
  new Invader(
    "github.svg",
    "https://www.github.com/mattiassamskar",
    randomInt(0, canvas.width),
    -100
  ),
  new Invader(
    "gmail.svg",
    "mailto:mattias.samskar@gmail.com",
    randomInt(0, canvas.width),
    -100
  ),
  new Invader(
    "linkedin.svg",
    "https://www.linkedin.com/in/mattiassamskar/",
    randomInt(0, canvas.width),
    -100
  ),
  new Invader(
    "youtube.svg",
    "https://www.youtube.com/channel/UCpLdQ69TRVNUtxdssKbT8aQ",
    randomInt(0, canvas.width),
    -100
  ),
];

const stars = Array.from(Array(100).keys()).map(
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

canvas.onclick = () => {
  if (shot.isVisible) return;
  shot.left = cannon.middle - shot.width / 2;
  shot.top = cannon.top - shot.height + 10;
  shot.isVisible = true;
  shot.audio.play();
};

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.font = "48px Arcade Classic";
});

let secondsPassed = 0;
let oldTimeStamp = 0;
const startTime = performance.now();

(function draw(timeStamp) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  context.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.move(
      Math.max(window.screen.width, window.screen.height),
      Math.max(window.screen.width, window.screen.height),
      secondsPassed
    );
    context.beginPath();
    context.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2);
    context.fillStyle = star.color;
    context.fill();
  });

  invaders.forEach((invader) => {
    invader.move(canvas.width, canvas.height / 2, secondsPassed);
    context.drawImage(
      invader.image,
      invader.left,
      invader.top,
      invader.width,
      invader.height
    );
  });

  cannon.move(canvas.width, secondsPassed);
  context.drawImage(
    cannon.image,
    cannon.left,
    cannon.top,
    cannon.width,
    cannon.height
  );

  if (shot.isVisible) {
    shot.move(secondsPassed);
    context.drawImage(shot.image, shot.left, shot.top, shot.width, shot.height);
  }

  message.move(canvas.width, secondsPassed);
  context.fillStyle = message.gradient;
  context.fillText(message.text, message.x, message.y);

  invaders.forEach((invader) => {
    if (shot.isVisible && detectCollision(invader, shot)) {
      shot.isVisible = false;
      window.open(invader.url, "_blank");
    }
  });

  requestAnimationFrame(draw);
})(startTime);
