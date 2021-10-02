const rules_btn = document.getElementById('rules-btn');
const CloseBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const gameArea = document.getElementById('canvas');
const gamedisplay = gameArea.getContext('2d');

// Intially the Score done by a user will be

let score = 0;

// No. of Rows and Columns in which each brick is placed will be here

const brickColumn = 6;
const brickRow = 10;

// Ball Needed to Break Bricks its properties

const hammer = {
    x : gameArea.width / 2,
    y : gameArea.height /2,
    size : 10,  speed:4,  dx:4,  dy:-4
}

// Let's Make Paddle Properties

const slide = {
    x: gameArea.width / 2-40, y: gameArea.height -20,w : 80, h:10, speed: 8, dx: 0
}

// Create Brick Properties It's size

const brickInfo = {
    w: 70, h: 20, padding: 10, offsetX: 45, offsetY: 60, visible: true
}

// Make Bricks

const bricks = [];
for (let i=0;i<brickRow;i++){
    bricks[i] = [];
    for (let j=0;j<brickColumn;j++){
        const row = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const column = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] ={ row, column, ...brickInfo};
    }
}

// Create Ball on Canvas

function createball(){
    gamedisplay.beginPath();
    gamedisplay.arc(hammer.x, hammer.y, hammer.speed , 0, Math.PI*2);
    gamedisplay.fillStyle = '#21272AFF';
    gamedisplay.fill();
    gamedisplay.closePath();
}

// Make Paddle

function slider(){
    gamedisplay.beginPath();
    gamedisplay.rect(slide.x,slide.y,slide.w,slide.h);
    gamedisplay.fillStyle = '#ffe200';
    gamedisplay.fill();
    gamedisplay.closePath();
}

// Add Score to Score Board

function makescore(){
    gamedisplay.font = '20px Arial';
    gamedisplay.fillText(`Score: ${score}`,gamedisplay.width-100,30);
}

// Draw Bricks on Canvas

function drawbricks(){
    bricks.forEach(column => {
    column.forEach(brick=>{
        gamedisplay.beginPath();
        gamedisplay.rect(brick.x,brick.y,brick.w,brick.h);
        gamedisplay.fillStyle = brick.visible ? '#ff0023' : 'transparent';
        gamedisplay.fill();
        gamedisplay.closePath();
    });
    });
}

// Move Slider on Canvas

function moveslide(){
    slide.x +=slide.dx;
    if (slide.x+slide.w>gameArea.width){
        slide.x =gameArea.width - slide.w;
    }
    if (slide.x<0){
        slide.x = 0;
    }
}

// move Hammer on Canvas

function movehammer(){
    hammer.x += hammer.dx;
    hammer.y += hammer.dy;

    // Wall collision (right/left)
    if (hammer.x + hammer.size > gameArea.width || hammer.x - hammer.size < 0) {
        hammer.dx *= -1; // ball.dx = ball.dx * -1
    }

    // Wall collision (top/bottom)
    if (hammer.y + hammer.size > gameArea.height || hammer.y - hammer.size < 0) {
        hammer.dy *= -1;
    }
    if (
        hammer.x - hammer.size > slide.x &&
        hammer.x + hammer.size < slide.x + slide.w &&
        hammer.y + hammer.size > slide.y
    ) {
        hammer.dy = -hammer.speed;
    }

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    hammer.x - hammer.size > brick.x && // left brick side check
                    hammer.x + hammer.size < brick.x + brick.w && // right brick side check
                    hammer.y + hammer.size > brick.y && // top brick side check
                    hammer.y - hammer.size < brick.y + brick.h // bottom brick side check
                ) {
                    hammer.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        });
    });
    // Hit bottom wall - Lose
    if (hammer.y + hammer.size > gameArea.height) {
        showAllBricks();
        score = 0;
    }
}

// Increase Score

function increaseScore(){
    score++;
    if (score % (brickRow * brickRow)===0){
        showAllBricks();
    }
}

// Making all Bricks Visible

function showAllBricks(){
    bricks.forEach(column => {
        column.forEach(brick => (brick.visible = true));
    });
}

function draw(){
    gamedisplay.clearRect(0,0,gameArea.width,gameArea.height);
    createball();
    slider();
    makescore();
    drawbricks();
}

function update(){
    moveslide();
    movehammer();

    draw();
    requestAnimationFrame(update);

}
update();

// Keydown Event

function keydown(e){
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        slide.dx = slide.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        slide.dx = -slide.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        slide.dx = 0;
    }
}

// Keyboard event handlers
document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rules_btn.addEventListener('click', () => rules.classList.add('show'));
CloseBtn.addEventListener('click', () => rules.classList.remove('show'));
