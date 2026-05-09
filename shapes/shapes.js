const canvas = document.getElementById('gameCanvas');
const sidebarWidth = 200;
const ctx = canvas.getContext('2d');

const shapes = ['square', 'circle', 'triangle'];
const colors = ['red', 'green', 'blue', 'orange', 'purple'];
const objectSize = 80;
const objectCount = random(5,10);
const objects = [];
let baseSpeed = 5;
let shapeCount = objectCount;
const gravity = 0.1;
let rate = 60000;

let score = 0;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createObject() {
    const shape = shapes[random(0, shapes.length - 1)];
    const obj = {
        size: objectSize,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: colors[random(0, colors.length - 1)],
        speed: random(baseSpeed, baseSpeed * 1.5),
        shape,
        rotation: random(0, 360),
        rotationSpeed: random(-5, 5),
        direction: 0,
        swap: 0.1,
        loc: 0,
        dis: random(40, 60)
    };

    if (shape === 'square') {
        obj.direction = random(1, 4);
        if (obj.direction === 1) {
            obj.x = 0;
            obj.y = random(0, canvas.height - obj.size);
            obj.vx = obj.speed;
            obj.vy = 0;
        } else if (obj.direction === 2) {
            obj.x = canvas.width - obj.size;
            obj.y = random(0, canvas.height - obj.size);
            obj.vx = -obj.speed;
            obj.vy = 0;
        } else if (obj.direction === 3) {
            obj.x = random(0, canvas.width - obj.size);
            obj.y = canvas.height - obj.size;
            obj.vx = 0;
            obj.vy = -obj.speed;
        } else {
            obj.x = random(0, canvas.width - obj.size);
            obj.y = 0;
            obj.vx = 0;
            obj.vy = obj.speed;
        }
    } else if (shape === 'circle') {
        obj.x = random(0, canvas.width - obj.size);
        obj.y = random(-canvas.height, 0);
        obj.vx = 0;
        obj.vy = obj.speed;
    } else if (shape === 'triangle') {
        while (obj.rotationSpeed == 0) {
            obj.rotationSpeed = random(-5, 5);
        }
        obj.x = random(0, canvas.width - obj.size);
        obj.y = random(0, canvas.height - obj.size);
        obj.vx = random(-obj.speed, obj.speed);
        obj.vy = random(-obj.speed, obj.speed);
    }

    return obj;
}

function resetObject(obj) {
    const shape = obj.shape;
    obj.color = colors[random(0, colors.length - 1)];
    obj.speed = random(baseSpeed, baseSpeed * 1.5);
    obj.rotation = random(0, 360);
    obj.rotationSpeed = random(-5, 5);

    if (shape === 'square') {
        obj.direction = random(1, 4);
        if (obj.direction === 1) {
            obj.x = 0;
            obj.y = random(0, canvas.height - obj.size);
            obj.vx = obj.speed;
            obj.vy = 0;
        } else if (obj.direction === 2) {
            obj.x = canvas.width - obj.size;
            obj.y = random(0, canvas.height - obj.size);
            obj.vx = -obj.speed;
            obj.vy = 0;
        } else if (obj.direction === 3) {
            obj.x = random(0, canvas.width - obj.size);
            obj.y = canvas.height - obj.size;
            obj.vx = 0;
            obj.vy = -obj.speed;
        } else {
            obj.x = random(0, canvas.width - obj.size);
            obj.y = 0;
            obj.vx = 0;
            obj.vy = obj.speed;
        }
    } else if (shape === 'circle') {
        obj.direction = 0;
        obj.x = random(0, canvas.width - obj.size);
        obj.y = random(-canvas.height, 0);
        obj.vx = 0;
        obj.vy = obj.speed;
    } else {
        obj.direction = 0;
        obj.x = random(0, canvas.width - obj.size);
        obj.y = random(0, canvas.height - obj.size);
        obj.vx = random(-obj.speed, obj.speed);
        obj.vy = random(-obj.speed, obj.speed);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth - sidebarWidth;
    canvas.height = window.innerHeight;

    objects.forEach(obj => {
        obj.x = Math.max(0, Math.min(obj.x, canvas.width - obj.size));
    });
}

function drawObject(obj) {
    ctx.fillStyle = obj.color;

    if (obj.shape === 'square') {
        ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
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
    

    if (obj.shape === 'circle'){
        obj.loc += obj.speed * obj.swap;

        if (obj.loc > obj.dis || obj.loc < -obj.dis) {
            obj.swap *= -1;
        }
        obj.vx = obj.speed * obj.swap;
    }


    obj.x += obj.vx;
    obj.y += obj.vy;

    obj.rotation += obj.rotationSpeed;

    obj.vy += gravity;
    

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
    updateStatDisplays();
}, rate/3); // 1,000 ms = 1 second

setInterval(() => {
    objects.push(createObject());
    shapeCount++;
    updateStatDisplays();
}, rate); // 3,000 ms = 3 seconds

const speedDisplay = document.getElementById('currentSpeed');
const shapeCountDisplay = document.getElementById('shapeCount');
const scoreDisplay = document.getElementById('score');

function updateStatDisplays() {
    speedDisplay.textContent = `Current Speed: ${baseSpeed.toFixed(1)}`;
    shapeCountDisplay.textContent = `Shape Count: ${shapeCount}`;
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    objects.forEach(obj => {
        if (clickX > obj.x && clickX < obj.x + obj.size &&
            clickY > obj.y && clickY < obj.y + obj.size) {

            resetObject(obj);
            score++;
            updateScore();

        }
    });
});

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

updateStatDisplays();



animate();