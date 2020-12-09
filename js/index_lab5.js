function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const btnOpenAnim = document.getElementById('btnOpenAnim');
const textArea = document.getElementById('text-area');
const body = document.body;

let isCanvas = false;
let isAnimating = false;

class Ball {
    constructor(isHorizontal, size = 30) {
        this.isHorizontal = isHorizontal
        this.name = isHorizontal ? "Horizontal Circle" : "Vertical Circle";
        this.x = isHorizontal ? random(0, anim.clientWidth - size) : 0;
        this.y = isHorizontal ? 0 : random(0, anim.clientHeight - size);
        this.size = size;
        this.velocity = random(1, 10);
        this.layout = document.createElement('div');
        this.layout.classList += 'circle';
        this.layout.style.backgroundColor = isHorizontal ? 'chartreuse' : 'red';
        this.layout.style.width = this.size;
        this.layout.style.height = this.size;
    }

    draw = () => {
        this.layout.style.left = `${Math.floor(this.x)}px`;
        this.layout.style.top  = `${this.y}px`;
    }

    drawCanvas = (ctx) => {
        ctx.beginPath();
        ctx.fillStyle = this.layout.style.backgroundColor;
        if (this.isHorizontal) {
            ctx.arc(this.x, this.y + this.size, this.size, 0, 2 * Math.PI);
        } else {
            ctx.arc(this.x + this.size, this.y, this.size, 0, 2 * Math.PI);
        }
        ctx.fill();
    }
}

let horizontalBall, verticalBall = undefined;

const workSection = document.createElement('div');
const anim = document.createElement(`${isCanvas ? 'canvas': 'div'}`);
const controls = document.createElement('div');
const textMsg = document.createElement('div');
const btnCloseAnim = document.createElement('button');
const btnControl = document.createElement('button');
let canvas = undefined;
let interval = undefined;

workSection.classList += 'work-section';
anim.classList += 'anim';
controls.classList += 'controls';
textMsg.classList += 'text-msg';
btnCloseAnim.textContent = 'close';
btnControl.textContent = 'start';

controls.appendChild(textMsg);
controls.appendChild(btnControl);
controls.appendChild(btnCloseAnim);
workSection.appendChild(controls);
workSection.appendChild(anim);

btnOpenAnim.addEventListener('click', () => {
    saveMessage("Work-section opened")
    body.appendChild(workSection);
});

btnCloseAnim.addEventListener('click', () => {
    body.removeChild(workSection);
    if (isAnimating) {
        controlAnimation();
    }
    saveMessage('Work-section closed');
    localStorage.animationStatus.split('%').forEach(item => {
        if (item) {
            textArea.appendChild(document.createElement('br'));
            textArea.appendChild(document.createTextNode(item));
        }
    });
    delete localStorage.animationStatus;
});

const postMessage = msg => {
    textMsg.textContent = msg;
    saveMessage(msg);
}

const saveMessage = msg => {
    const date = new Date();
    localStorage.animationStatus = `${localStorage.animationStatus || ''}${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}:
    :${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} -- ${msg}%`;
}

const controlAnimation = () => {
    if (isAnimating) {
        clearInterval(interval);
        btnControl.textContent = 'start';
        isAnimating = false;
    } else {
        interval = setInterval(animate, 1);
        btnControl.textContent = 'stop';
        isAnimating = true;
    }
};

const animate = () => {
    const animWidth = anim.offsetWidth;
    const animHeigh = anim.offsetHeight;
    
    const dx = horizontalBall.x - verticalBall.x;
    const dy = horizontalBall.y - verticalBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < horizontalBall.size) {
        postMessage('Circles bounced')
        controlAnimation();
        btnControl.textContent = 'reload';
        btnControl.onclick = initAnimation;
        return;
    }
    
    horizontalBall.y += horizontalBall.velocity;
    if (horizontalBall.y < 0 || horizontalBall.y >= animHeigh - horizontalBall.size) {
        postMessage(`${horizontalBall.name} touched ${horizontalBall.y <= 0 ? 'top' : 'bottom'} wall`);
        horizontalBall.y -= horizontalBall.velocity;
        horizontalBall.velocity = -horizontalBall.velocity;
    }
    verticalBall.x += verticalBall.velocity;
    if (verticalBall.x < 0 || verticalBall.x >= animWidth - verticalBall.size) {
        postMessage(`${verticalBall.name} touched ${verticalBall.x <= 0 ? 'left' : 'right'} wall`);
        verticalBall.x -= verticalBall.velocity;
        verticalBall.velocity = -verticalBall.velocity;
    }
    
    if (isCanvas) {
        canvas.clearRect(0, 0, animWidth, animHeigh);
        horizontalBall.drawCanvas(canvas);
        verticalBall.drawCanvas(canvas);
    } else {
        verticalBall.draw();
        horizontalBall.draw();
    }
};

const initAnimation = () => {
    if (verticalBall !== undefined && horizontalBall !== undefined) {
        if (!isCanvas) {
            anim.removeChild(horizontalBall.layout);
            anim.removeChild(verticalBall.layout);
        }
    }
    verticalBall = new Ball(false);
    horizontalBall = new Ball(true);

    if (isCanvas) {
        canvas = anim.getContext('2d');
        anim.width = anim.offsetWidth;
        anim.height = anim.offsetHeight;
        verticalBall.drawCanvas(canvas);
        horizontalBall.drawCanvas(canvas);
    } else {
        anim.append(horizontalBall.layout, verticalBall.layout);
        verticalBall.draw();
        horizontalBall.draw();
    }

    btnControl.textContent = 'start';
    btnControl.onclick = controlAnimation;
}

workSection.addEventListener('DOMNodeInsertedIntoDocument', initAnimation);