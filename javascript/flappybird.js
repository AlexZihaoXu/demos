console.log("FlappyBird Programmed by Alex Xu!!");
document.body.style.background="#444444";
document.body.style.margin='0';
document.head.title="Flappy Bird!";
const canvas = document.createElement("canvas");
canvas.style.paddingLeft = '0';
canvas.style.paddingRight = '0';
canvas.style.marginLeft = 'auto';
canvas.style.marginRight = 'auto';
canvas.style.display = 'block';
let ctx = canvas.getContext('2d');

let scale = 3;
canvas.width = 143 * scale;
canvas.height = 255 * scale;

const NUMBER_POSES = [
    [288, 100, 294, 109],
    [291, 118, 295, 127],
    [289, 134, 295, 143],
    [289, 150, 295, 159],
    [287, 173, 293, 182],
    [287, 185, 293, 194],
    [165, 245, 171, 254],
    [175, 245, 181, 254],
    [185, 245, 191, 254],
    [195, 245, 201, 254]
]
const MEDAL_POSES = [
    [302, 137],
    [266, 299],
    [242, 229],
    [220, 144]
]

document.body.appendChild(canvas);
const RES = new Image();
RES.src = "https://www.spriters-resource.com/resources/sheets/56/59537.png";
const AUDIO_HIT = new Audio("https://raw.githubusercontent.com/HipByte/motion-game/master/samples/FlappyBird/resources/sfx_hit.wav");
const AUDIO_POINT = new Audio("https://raw.githubusercontent.com/HipByte/motion-game/master/samples/FlappyBird/resources/sfx_point.wav");
const AUDIO_TAP = new Audio("https://raw.githubusercontent.com/HipByte/motion-game/master/samples/FlappyBird/resources/sfx_wing.wav");
const AUDIO_DIE = new Audio("https://raw.githubusercontent.com/FelgoSDK/FlappyBird/master/assets/audio/sfx_die.wav");
const AUDIO_SWOOTHING = new Audio("https://raw.githubusercontent.com/FelgoSDK/FlappyBird/master/assets/audio/sfx_swooshing.wav");

window.onscroll = function () {
    window.scrollTo(0, 0);
}

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;
let gameRunning = false;
let gameFrame = 0;
let gameOver = false;
let score = 0;


canvas.addEventListener("touchstart",  () => {
    mouseDown = true
}, false);
canvas.addEventListener("mousedown", () => {mouseDown = true})

canvas.addEventListener("touchend", () => {mouseDown = false}, false);
canvas.addEventListener("mouseup", () => {mouseDown = false;})

canvas.addEventListener("mousemove", function (evt) {
    let rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
});
window.addEventListener('resize', function(e){
    ctx.imageSmoothingEnabled = false;
}, false)
canvas.onselectstart = function () { return false; }

class Bird {
    constructor() {
        this.y = 150;
        this.deltaY = 0;
        this.tapped = false;
    }

    tap() {
        if (!gameOver) {
            AUDIO_TAP.currentTime = 0;
            AUDIO_TAP.play();
            this.deltaY = -4.3;
            gameRunning = true;
        }
    }

    draw() {
        switch (Math.floor(gameFrame / 10) % 4) {
            case 0: // Down
                ctx.drawImage(RES, 223, 124, 17, 12, 25 * scale, this.y * scale, 17 * scale, 12 * scale);
                break;
            case 1: // Mid
                ctx.drawImage(RES, 264, 90, 17, 12, 25 * scale, this.y * scale, 17 * scale, 12 * scale);
                break;
            case 2: // Up
                ctx.drawImage(RES, 264, 64, 17, 12, 25 * scale, this.y * scale, 17 * scale, 12 * scale);
                break;
            case 3: // Mid
                ctx.drawImage(RES, 264, 90, 17, 12, 25 * scale, this.y * scale, 17 * scale, 12 * scale);
                break;
            default:
                break
        }
    }

    update() {
        if (true) {
            if (mouseDown && !this.tapped) {
                this.tap();
                this.tapped = true;
            }
            if (!mouseDown) {
                this.tapped = false;
            }
            if (gameRunning && !gameOver) {
                this.y += this.deltaY;
                this.deltaY += 0.31;
                this.deltaY = Math.min(12, this.deltaY);
                if (this.y * scale > canvas.height - 33 * scale) {
                    this.y = canvas.height / scale - 33;
                    gameRunning = false;
                    this.deltaY = 0;
                    gameOver = true;
                }
                if (this.y < 0){
                    gameRunning = false;
                    this.deltaY = 0;
                    gameOver = true;
                }
            }
            if (gameOver) {
                this.y += this.deltaY;
                this.deltaY += 0.31;
                this.deltaY = Math.min(12, this.deltaY);
                if (this.y * scale > canvas.height - 33 * scale) {
                    this.y = canvas.height / scale - 33;
                    this.deltaY = 0;
                }
            }

        }

    }
}

let pipes = [null, null, null];
let pops = 0;
bird = new Bird();


class Pipe {
    constructor() {
        this.x = canvas.width / scale;
        this.y = (Math.round(Math.random() * 4) - 2) * 20 - 2;
        this.scored = false;
    }

    draw() {
        ctx.drawImage(RES, 302, 0, 26, 135, this.x * scale, (this.y - 40) * scale, 26 * scale, 135 * scale);
        ctx.drawImage(RES, 330, 0, 26, 120, this.x * scale, (this.y + 160) * scale, 26 * scale, 120 * scale)
    }

    update() {
        this.x -= 0.8;
        if (this.x < -26 * scale) {
            pops++;
        }
        // Collision Detection
        let box = {
            top: bird.y,
            bottom: bird.y + 12,
            left: 25,
            right: 40,
        }
        let self = {
            top: this.y + 95,
            bottom: this.y + 160,
            right: this.x + 26,
            left: this.x
        }
        if (
            (box.right > self.left && box.left < self.left && box.top < self.top) ||
            (box.left < self.right && box.right > self.right && box.top < self.top) ||
            (box.right > self.left && box.left < self.left && box.bottom > self.bottom) ||
            (box.left < self.right && box.right > self.right && box.bottom > self.bottom)
        ) {
            gameRunning = false;
            gameOver = true;
        }
        if (box.left > self.right && !this.scored) {
            score++;
            AUDIO_POINT.play();
            this.scored = true;
        }
    }
}

let flashed = 99;
let boardY = -100;

function drawNumber(deltaX = 0, deltaY = 0, absX = null) {
    let num = score;
    let width = 0;
    let count = 0;
    while (num !== 0) {
        let index = num - Math.floor(num / 10) * 10;
        num = Math.floor(num / 10);
        width += NUMBER_POSES[index][2] - NUMBER_POSES[index][0];
        count++;
    }
    let baseX;
    if (absX === null) {
        baseX = (canvas.width / scale - width) / 2;
    } else {
        baseX = absX - width;
    }
    num = score;
    let w, h, index;
    let i = 0;
    while (num !== 0) {
        index = num - Math.floor(num / 10) * 10;
        num = Math.floor(num / 10);
        w = NUMBER_POSES[index][2] - NUMBER_POSES[index][0] + 1;
        h = NUMBER_POSES[index][3] - NUMBER_POSES[index][1] + 1;
        i += w;
        ctx.drawImage(
            RES, NUMBER_POSES[index][0], NUMBER_POSES[index][1], w, h, (baseX + width - i + deltaX) * scale, (20 + deltaY) * scale, w * scale, h * scale
        )
    }
    if (score === 0) {
        index = 0;
        w = NUMBER_POSES[index][2] - NUMBER_POSES[index][0] + 1;
        h = NUMBER_POSES[index][3] - NUMBER_POSES[index][1] + 1;
        i += w;
        ctx.drawImage(
            RES, NUMBER_POSES[index][0], NUMBER_POSES[index][1], w, h, (baseX + width - i + deltaX) * scale, (20 + deltaY) * scale, w * scale, h * scale
        )
    }

}

function draw() {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(RES, 0, 0, 143, 255, 0, 0, 143 * scale, 255 * scale);

    for (const pipe of pipes) {
        if (pipe !== null)
            pipe.draw();
    }
    bird.draw();

    if (gameRunning) {
        ctx.drawImage(RES, 146, 0, 154, 56, -(gameFrame % 7 * scale), canvas.height - 22 * scale, 154 * scale, 56 * scale)

    } else {
        ctx.drawImage(RES, 146, 0, 154, 56, 0, canvas.height - 22 * scale, 154 * scale, 56 * scale);

        if (!gameOver)
            ctx.drawImage(RES, 170, 121, 45, 50, 55 * scale, 120 * scale, 45 * scale, 50 * scale);

    }
    if (gameOver && flashed > 20) {
        flashed -= 8;
        ctx.fillStyle = "#ffffff" + flashed.toString();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (!gameOver) {
        drawNumber()
    } else {
        ctx.drawImage(RES, 146, 58, 113, 58, (canvas.width / scale / 2 - 56) * scale, (boardY - 57) * scale, 112 * scale, 57 * scale)
        drawNumber(25, boardY - 60, 90);
        let i;
        if (score >= 40) {
            i = MEDAL_POSES[3];
        } else if (score >= 30) {
            i = MEDAL_POSES[2];
        } else if (score >= 20) {
            i = MEDAL_POSES[1];
        } else if (score >= 10) {
            i = MEDAL_POSES[0];
        } else {
            i = null;
        }
        if (i !== null)
            ctx.drawImage(RES, i[0], i[1], 23, 23, 28 * scale, (boardY - 36) * scale, 24 * scale, 24 * scale)
        ctx.drawImage(RES, 246, 134, 40, 14, (canvas.width / scale / 2 - 20) * scale, (canvas.height / scale - boardY * 0.7) * scale, 40 * scale, 14 * scale);
    }

}

function update() {
    scale = window.innerHeight / 255;
    canvas.width = 143 * scale;
    canvas.height = 255 * scale;
    gameFrame++;
    if (gameRunning) {
        for (const pipe of pipes) {
            if (pipe !== null)
                pipe.update();
        }
        if (gameFrame % 145 === 0) {
            pipes[2] = pipes[1];
            pipes[1] = pipes[0];
            pipes[0] = new Pipe();
        }
    }
    if (gameOver) {
        if (boardY === -100) {
            AUDIO_HIT.currentTime = 0;
            AUDIO_HIT.play();
        }
        if (140 - boardY < 5 && 140 - boardY > 4) {
            AUDIO_DIE.play();
            AUDIO_SWOOTHING.play();
        }
        let range = {
            left: (canvas.width / scale / 2 - 20) * scale,
            top: (canvas.height / scale - boardY * 0.7) * scale,
            right: (canvas.width / scale / 2 + 20) * scale,
            bottom: (canvas.height / scale - boardY * 0.7 + 14) * scale
        }
        if (mouseX > range.left && mouseX < range.right && mouseY > range.top && mouseY < range.bottom) {
            boardY += (138 - boardY) / 8;
            if (mouseDown) {
                location.reload(false);
            }
        } else {
            boardY += (140 - boardY) / 8;
        }
    }
    bird.update();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop()
