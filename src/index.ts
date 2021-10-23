import { Invader } from "./invader";
import { Cannon, Color, Enemy, Message, Shot, Star } from "./types";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

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

const getStars = () => {
  const stars = [];
  for (let x = 0; x < 120; x++) {
    const size = randomInt(1, 3);
    const gray = 90 + 40 * size;
    stars.push({
      y: randomInt(0, canvas.height),
      x: randomInt(0, canvas.width),
      size,
      speed: size * 1,
      color: {
        red: gray,
        green: gray,
        blue: gray,
        opacity: 255,
      },
    });
  }
  return stars;
};

const moveStar = (imageData: ImageData, star: Star) => {
  star.x = star.x + star.speed;
  if (star.x >= canvas.width) {
    star.x = 0;
    star.y = randomInt(0, canvas.width);
  }

  putPixel(imageData, star.x, star.y, star.color);
  putPixel(imageData, star.x, star.y + 1, star.color);
  putPixel(imageData, star.x + 1, star.y, star.color);
  putPixel(imageData, star.x + 1, star.y + 1, star.color);
  if (star.size > 1) {
    putPixel(imageData, star.x, star.y + 2, star.color);
    putPixel(imageData, star.x + 2, star.y, star.color);
    putPixel(imageData, star.x + 2, star.y + 2, star.color);
  }
  if (star.size > 2) {
    putPixel(imageData, star.x, star.y + 3, star.color);
    putPixel(imageData, star.x + 3, star.y, star.color);
    putPixel(imageData, star.x + 3, star.y + 3, star.color);
  }
};

const putPixel = (imageData: ImageData, x: number, y: number, color: Color) => {
  const i = (x + y * canvas.width) * 4;
  imageData.data[i] = color.red;
  imageData.data[i + 1] = color.green;
  imageData.data[i + 2] = color.blue;
  imageData.data[i + 3] = color.opacity;
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

const stars = getStars();
const message = getMessage();
const cannon = getCannon(message.y);
const shot = getShot(cannon.y);

const invaders = ["github.svg", "gmail.svg", "linkedin.svg", "youtube.svg"].map(
  (name) => new Invader(name, randomInt(0, canvas.width), -100)
);

const context = canvas.getContext("2d");
context.font = "48px Arcade Classic";
context.fillStyle = getGradient(message);

document.onclick = () => {
  if (shot.isShooting === true) return;

  shot.x = cannon.x + cannon.image.width / 6 - 5;
  shot.isShooting = true;
  audio.play();
};

const startTime = performance.now();

(function draw(timestamp) {
  // const elapsedTimeUnits = (timestamp - startTime);
  const imageData = context.createImageData(canvas.width, canvas.height);

  stars.forEach((star) => moveStar(imageData, star));
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
