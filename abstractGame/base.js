const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const shapes = ['square', 'circle', 'triangle'];
const colors = ['#000000', '#6cff6c', '#6a6ad7', '#FFA500', '#b751b7'];
const objectSize = 50;
const objectCount = random(5,10);
const objects = [];
let baseSpeed = 1.5;
let shapeCount = objectCount;
const gravity = 0.015;
let rate = 60000;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initObjectMotion(obj) {
    const sizeRatio = (obj.size - 10) / 290; // 0 for smallest, 1 for largest
    const slowFactor = 1 - sizeRatio * 0.6; // bigger objects are up to 60% slower

    obj.vy = random(baseSpeed * 0.4, baseSpeed * 0.7) * slowFactor;
    obj.rotationSpeed = random(-1, 1) * slowFactor;
    obj.gravityFactor = 1 - sizeRatio * 0.3; // larger objects accelerate slightly less
}

function createObject() {
    const shape = shapes[random(0, shapes.length - 1)];
    const obj = {
        size: random(10, 300),
        x: 0,
        y: 0,
        color: colors[random(0, colors.length - 1)],
        shape,
        rotation: random(0, 360),
        direction: 0,
    };

    obj.x = random(0, canvas.width - obj.size);
    obj.y = -obj.size;
    initObjectMotion(obj);

    return obj;
}

function resetObject(obj) {
    obj.color = colors[random(0, colors.length - 1)];
    obj.size = random(10, 300);
    obj.rotation = random(0, 360);
    obj.x = random(0, canvas.width - obj.size);
    obj.y = -obj.size;
    initObjectMotion(obj);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    objects.forEach(obj => {
        obj.x = Math.max(0, Math.min(obj.x, canvas.width - obj.size));
        obj.y = Math.max(0, Math.min(obj.y, canvas.height - obj.size));
    });
}

function drawObject(obj) {
    ctx.fillStyle = obj.color;

    if (obj.shape === 'square') {
        ctx.save();
        ctx.translate(obj.x + obj.size / 2, obj.y + obj.size / 2);
        ctx.rotate(obj.rotation * Math.PI / 180);
        ctx.fillRect(-obj.size / 2, -obj.size / 2, obj.size, obj.size);
        ctx.restore();
    } else if (obj.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(obj.x + obj.size / 2, obj.y + obj.size / 2, obj.size / 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (obj.shape === 'triangle') {
        ctx.save();

        const side = obj.size;
        const height = side * Math.sqrt(3) / 2;
        ctx.translate(obj.x + side / 2, obj.y + side / 2);
        ctx.rotate(obj.rotation * Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(0, -height * 2 / 3);
        ctx.lineTo(-side / 2, height / 3);
        ctx.lineTo(side / 2, height / 3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

function updateObject(obj) {
    obj.y += obj.vy;

    obj.rotation += obj.rotationSpeed;

    obj.vy += gravity * obj.gravityFactor;
    

    const outOfBounds =
        obj.x + obj.size < 0 || obj.x > canvas.width ||
        obj.y > canvas.height || obj.y + obj.size < 0;

    if (outOfBounds) {
        resetObject(obj);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(drawObject);
}

function update() {
    objects.forEach(updateObject);
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
    rate--;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();


for (let i = 0; i < objectCount; i++) {
    objects.push(createObject());
}

setInterval(() => {
    baseSpeed += 0.1;
}, rate/3); // 1,000 ms = 1 second

setInterval(() => {
    objects.push(createObject());
    shapeCount++;
}, rate); // 3,000 ms = 3 seconds

animate();