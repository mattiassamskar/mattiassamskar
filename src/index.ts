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

let oldTimeStamp = 0;

const draw = (timeStamp: number) => {
  const secondsPassed = (timeStamp - oldTimeStamp) / 1000;
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
    if (!invader.isAlive) {
      return;
    }
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
  context.font = "48px Arcade Classic";
  context.fillText(message.text, message.x, message.y);

  invaders.forEach((invader) => {
    if (shot.isVisible && invader.isAlive && detectCollision(invader, shot)) {
      shot.isVisible = false;
      invader.isAlive = false;

      const rootElement = document.getElementById("root");
      const linkElement = document.createElement("a");
      linkElement.href = invader.url;
      var text = document.createTextNode(invader.url);
      linkElement.appendChild(text);
      linkElement.style.position = "absolute";
      linkElement.style.top = invader.bottom + "px";
      linkElement.style.left = invader.left + "px";
      rootElement.appendChild(linkElement);
    }
  });

  requestAnimationFrame(draw);
};

draw(performance.now());
