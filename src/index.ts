import { Invader } from "./invader";
import { Star } from "./star";
import { Cannon, Message, Shot } from "./types";
import { randomInt } from "./utils";

const getMessage = (): Message => ({
  text: "Welcome to my version of Space Invaders - click or tap screen to fire",
  x: canvas.width,
  y: canvas.height - 10,
});

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

const getCannon = (bottomMargin: number): Cannon => {
  const image = new Image();
  image.src = "cannon.svg";

  return {
    image,
    x: canvas.width / 3,
    y: bottomMargin - 120,
    direction: "right",
    isShooting: false,
  };
};

const moveText = (context: CanvasRenderingContext2D, message: Message) => {
  context.fillText(message.text, message.x, message.y);
  const textWidth = context.measureText(message.text).width;
  message.x -= 4;
  if (message.x + textWidth < 0) {
    message.x = canvas.width;
  }
};

const moveCannon = (context: CanvasRenderingContext2D, cannon: Cannon) => {
  context.drawImage(cannon.image, cannon.x, cannon.y, 225 / 3, 146 / 3);

  cannon.x = cannon.direction === "left" ? cannon.x - 5 : cannon.x + 5;
  if (cannon.x <= 50) {
    cannon.x = 50;
    cannon.direction = "right";
  }
  if (cannon.x >= canvas.width - 225 / 3 - 50) {
    cannon.x = canvas.width - 225 / 3 - 50;
    cannon.direction = "left";
  }
};

const moveShot = (context: CanvasRenderingContext2D, shot: Shot) => {
  if (!shot.isShooting) return;

  context.drawImage(shot.image, shot.x, shot.y, 25 - 16, 120 - 70);

  shot.y -= 12;
  if (shot.y <= 0) {
    shot.y = cannon.y - shot.image.height + 70;
    shot.isShooting = false;
  }
};

const getGradient = (message: Message) => {
  const gradient = context.createRadialGradient(
    canvas.width * 0.3,
    message.y,
    30,
    canvas.width * 0.8,
    message.y,
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

const message = getMessage();
const cannon = getCannon(message.y);
const shot = getShot(cannon.y);

const invaders = ["github.svg", "gmail.svg", "linkedin.svg", "youtube.svg"].map(
  (name) => new Invader(name, randomInt(0, canvas.width), -100)
);
const stars = Array.from(Array(120).keys()).map(
  (_) => new Star(canvas.width, canvas.height)
);

const context = canvas.getContext("2d");
context.font = "48px Arcade Classic";
context.fillStyle = getGradient(message);

window.onclick = () => {
  if (shot.isShooting === true) return;

  shot.x = cannon.x + cannon.image.width / 6 - 5;
  shot.isShooting = true;
  audio.play();
};

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const startTime = performance.now();

(function draw(timestamp) {
  // const elapsedTimeUnits = (timestamp - startTime);
  const imageData = context.createImageData(canvas.width, canvas.height);

  stars.forEach((star) =>
    star.move(imageData, canvas.width, canvas.height, canvas.width)
  );
  context.putImageData(imageData, 0, 0);

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
  moveCannon(context, cannon);
  moveText(context, message);
  moveShot(context, shot);

  requestAnimationFrame(draw);
})(startTime);
