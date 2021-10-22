import { Color, Enemy, Message, Star } from "./types";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getMessage = (): Message => ({
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer viverra mollis tortor, at egestas magna finibus consectetur. Aenean rutrum mi vitae pretium placerat. Nullam auctor sapien et purus sollicitudin, quis molestie lectus bibendum. Suspendisse auctor purus quis accumsan gravida. Proin ultricies lacinia neque. Nullam et feugiat dui, et vulputate enim. Etiam malesuada varius felis, eu interdum nibh ullamcorper eu.",
  x: canvas.width,
  y: canvas.height - 50,
});

const getStars = () => {
  const stars = [];
  for (let x = 0; x < 120; x++) {
    const size = randomInt(1, 3);
    const gray = 127 + 40 * size;
    stars.push({
      y: randomInt(0, canvas.height),
      x: randomInt(0, canvas.width),
      size,
      speed: size * 1.5,
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

const getEnemies = (): Enemy[] => {
  return ["github.svg", "gmail.svg", "linkedin.svg", "youtube.svg"].map(
    (name) => {
      const image = new Image();
      image.src = name;

      return {
        name,
        image,
        x: randomInt(0, canvas.width - image.width),
        y: randomInt(0, canvas.height / 2),
        xd: randomInt(0, 1),
        yd: randomInt(0, 1),
        timeout: randomInt(1, 10),
      };
    }
  );
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

const moveEnemy = (context: CanvasRenderingContext2D, enemy: Enemy) => {
  context.drawImage(enemy.image, enemy.x, enemy.y, 49 * 1.5, 42 * 1.5);
  enemy.timeout--;
  if (enemy.timeout > 0) return;

  if (randomInt(0, 100) > 90) {
    enemy.xd = enemy.xd === 0 ? 1 : 0;
  }
  if (randomInt(0, 100) > 95) {
    enemy.yd = enemy.yd === 0 ? 1 : 0;
  }

  enemy.timeout = 15;
  enemy.x = enemy.xd === 0 ? enemy.x - 12 : enemy.x + 12;
  enemy.y = enemy.yd === 0 ? enemy.y - 6 : enemy.y + 6;
  if (enemy.x + enemy.image.width >= canvas.width) {
    enemy.x = canvas.width - enemy.image.width;
    enemy.xd = 0;
  }
  if (enemy.x <= 0) {
    enemy.x = 0;
    enemy.xd = 1;
  }
  if (enemy.y > canvas.height / 2) {
    enemy.yd = 0;
  }
  if (enemy.y <= 0) {
    enemy.yd = 1;
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

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "black";

const stars = getStars();
const enemies = getEnemies();
const message = getMessage();

const context = canvas.getContext("2d");
context.font = "48px Arcade Classic";
context.fillStyle = getGradient(message);

const startTime = performance.now();

(function draw(timestamp) {
  // const elapsedTimeUnits = (timestamp - startTime);
  const imageData = context.createImageData(canvas.width, canvas.height);

  stars.forEach((star) => moveStar(imageData, star));
  context.putImageData(imageData, 0, 0);

  enemies.forEach((enemy) => moveEnemy(context, enemy));
  moveText(context, message);

  requestAnimationFrame(draw);
})(startTime);
