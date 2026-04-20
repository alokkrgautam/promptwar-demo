const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over-screen");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let dx = 0;
let dy = 0;
let foodX;
let foodY;
let hurdles = [];
let score = 0;
let highScore = localStorage.getItem("cmdSnakeHighScore") || 0;
highScoreElement.textContent = highScore;

let gameLoopTimeout;
let isGameOver = false;
let lastInputTime = 0;

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    dx = 0;
    dy = -1;
    score = 0;
    scoreElement.textContent = score;
    hurdles = [];
    isGameOver = false;
    gameOverScreen.classList.add("hidden");
    spawnFood();
    clearTimeout(gameLoopTimeout);
    gameLoop();
}

function spawnFood() {
    let onSnakeOrHurdle = true;
    while(onSnakeOrHurdle) {
        onSnakeOrHurdle = false;
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
        
        for (let segment of snake) {
            if (segment.x === foodX && segment.y === foodY) onSnakeOrHurdle = true;
        }
        for (let hurdle of hurdles) {
            if (hurdle.x === foodX && hurdle.y === foodY) onSnakeOrHurdle = true;
        }
    }
}

function spawnHurdle() {
    let hX = Math.floor(Math.random() * tileCount);
    let hY = Math.floor(Math.random() * tileCount);
    
    // Don't spawn near snake head to avoid unfair instant death
    let distToHeadX = Math.abs(hX - snake[0].x);
    let distToHeadY = Math.abs(hY - snake[0].y);
    
    if (distToHeadX < 4 && distToHeadY < 4) return;

    for (let segment of snake) {
        if (segment.x === hX && segment.y === hY) return;
    }
    if (hX === foodX && hY === foodY) return;

    for (let hurdle of hurdles) {
        if (hurdle.x === hX && hurdle.y === hY) return;
    }

    let hurdle = {x: hX, y: hY, state: 'warning', createdTime: Date.now()};
    hurdles.push(hurdle);
    
    // Manage hurdle count
    if (hurdles.length > 10 + Math.floor(score/30)) {
        // Remove oldest solid hurdle
        const solidIndex = hurdles.findIndex(h => h.state === 'solid');
        if (solidIndex !== -1) {
            hurdles.splice(solidIndex, 1);
        } else {
            hurdles.shift();
        }
    }
}

function update() {
    if (isGameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wrap around walls
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    // Check collision with self
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Process hurdles
    let now = Date.now();
    for (let i = 0; i < hurdles.length; i++) {
        // After 1.5 seconds, a warning hurdle becomes solid
        if (hurdles[i].state === 'warning' && now - hurdles[i].createdTime > 1500) {
            hurdles[i].state = 'solid';
        }
    }

    // Check collision with solid hurdles
    for (let i = 0; i < hurdles.length; i++) {
        if (hurdles[i].state === 'solid' && head.x === hurdles[i].x && head.y === hurdles[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 10;
        scoreElement.textContent = score;
        spawnFood();
        
        // Spawn an unexpected hurdle every few points
        if (Math.random() < 0.4 + (score * 0.002)) {
            spawnHurdle();
        }
        if (score % 50 === 0) {
            // Spawn multiple on milestones
            spawnHurdle();
            spawnHurdle();
        }
    } else {
        snake.pop();
    }
    
    // Rare chance to spawn a hurdle randomly without eating
    if (Math.random() < 0.015) {
        spawnHurdle();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for terminal feel
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1;
    for(let i=0; i<tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i*gridSize, 0);
        ctx.lineTo(i*gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i*gridSize);
        ctx.lineTo(canvas.width, i*gridSize);
        ctx.stroke();
    }

    // Draw hurdles
    ctx.font = "20px VT323";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let now = Date.now();
    for (let i = 0; i < hurdles.length; i++) {
        if (hurdles[i].state === 'warning') {
            // Blinking warning effect
            if (Math.floor(now / 150) % 2 === 0) {
                ctx.fillStyle = "rgba(255, 100, 0, 0.8)";
                ctx.fillRect(hurdles[i].x * gridSize + 2, hurdles[i].y * gridSize + 2, gridSize - 4, gridSize - 4);
                ctx.fillStyle = "#ffffff";
                ctx.fillText("!", hurdles[i].x * gridSize + gridSize/2, hurdles[i].y * gridSize + gridSize/2 + 2);
            }
        } else {
            ctx.fillStyle = "#444444";
            ctx.fillRect(hurdles[i].x * gridSize, hurdles[i].y * gridSize, gridSize, gridSize);
            ctx.fillStyle = "#ffffff";
            ctx.fillText("X", hurdles[i].x * gridSize + gridSize/2, hurdles[i].y * gridSize + gridSize/2 + 2);
            // Shadow effect for solid block
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(hurdles[i].x * gridSize + 2, hurdles[i].y * gridSize + 2, gridSize - 4, gridSize - 4);
        }
    }

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            ctx.fillStyle = "#00ff00"; // Head brighter
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00ff00";
        } else {
            ctx.fillStyle = "#00aa00";
            ctx.shadowBlur = 0;
        }
        ctx.fillRect(snake[i].x * gridSize + 1, snake[i].y * gridSize + 1, gridSize - 2, gridSize - 2);
        
        // Head details
        if (i === 0) {
            ctx.fillStyle = "#000";
            ctx.shadowBlur = 0;
            let eyeX = snake[i].x * gridSize + gridSize/2;
            let eyeY = snake[i].y * gridSize + gridSize/2;
            ctx.fillRect(eyeX - 2, eyeY - 2, 4, 4);
        }
    }
    ctx.shadowBlur = 0; // Reset shadow

    // Draw food
    ctx.fillStyle = "#ff0000";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0000";
    ctx.font = "bold 20px VT323";
    ctx.fillText("@", foodX * gridSize + gridSize/2, foodY * gridSize + gridSize/2 + 2);
    ctx.shadowBlur = 0; // Reset
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
        let speed = Math.max(60, 150 - (score * 0.4));
        gameLoopTimeout = setTimeout(gameLoop, speed);
    }
}

function gameOver() {
    isGameOver = true;
    gameOverScreen.classList.remove("hidden");
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("cmdSnakeHighScore", highScore);
        highScoreElement.textContent = highScore;
    }
}

window.addEventListener("keydown", e => {
    // Prevent rapid multiple key presses
    let now = Date.now();
    if (now - lastInputTime < 40) return;
    lastInputTime = now;

    // We only change direction if the new direction isn't the direct opposite
    // and we also need to prevent reversing into our own body if snake > 1 length
    
    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            if (dy !== 1) { dx = 0; dy = -1; e.preventDefault(); }
            break;
        case "ArrowDown":
        case "s":
        case "S":
            if (dy !== -1) { dx = 0; dy = 1; e.preventDefault(); }
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            if (dx !== 1) { dx = -1; dy = 0; e.preventDefault(); }
            break;
        case "ArrowRight":
        case "d":
        case "D":
            if (dx !== -1) { dx = 1; dy = 0; e.preventDefault(); }
            break;
        case " ":
            if (isGameOver) {
                resetGame();
            }
            e.preventDefault();
            break;
    }
});

// Start game initially
resetGame();
