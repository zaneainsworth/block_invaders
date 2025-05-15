//Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const levelMessage = document.getElementById('levelMessage');
const countdownDisplay = document.getElementById('countdownDisplay');
const button = document.getElementById('startBtn');

const player = { x: 180, y: 600, width: 40, height: 10, color: 'white' };
const enemyWidth = 40, enemyHeight = 20;
const bullets = [];
const enemies = [];
const enemyBullets = [];
const keys = {};

let enemyRows = 2, enemyCols = 5, score = 0, level = 0;
let gameOver = false, paused = false;
let enemyDirection = 1, enemySpeed = 0.3, enemyShootInterval = 0.01;


//Game Initialization
function startGame() {
    let timer = 3;

    countdownDisplay.textContent = timer;
    levelMessage.textContent = `Level ${level + 1}`;
    const countdown = setInterval(() => {
        timer--;
        countdownDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(countdown);
            countdownDisplay.textContent = "Go!";
            setTimeout(() => {
                countdownDisplay.display = 'none';
                countdownDisplay.textContent = '';
                levelMessage.style.display = 'none';
                levelMessage.textContent = '';
            }, 2000);

            update();
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    button.addEventListener('click', function() {
        startGame();
        button.remove();
    });
});

function pauseGame() {
    if (!gameOver && !paused) {
        paused = true;
        if (confirm("Game Paused. Press OK to resume. Cancel to quit.")) {
            resumeGame();
        } else handleGameOver();
    }
}

function resumeGame() {
    paused = false;
}

//Controls for PC
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && !gameOver) {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, color: 'yellow' });
    }

    if (e.key === 'Escape') {
        pauseGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Touch controls for mobile

    let touchStartX = null;

    canvas.addEventListener('touchstart', (e) => {
        if (gameOver) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;

        // Fire bullet on tap (single touch)
        if (e.touches.length === 1) {
            bullets.push({ x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 10,
                color: 'yellow' });
        }
    });

    canvas.addEventListener('touchmove', (e) => {
        if (gameOver) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const targetX = Math.min(Math.max(touch.clientX - rect.left - player.width / 2, 0), canvas.width - player.width);
        if (Math.abs(player.x - targetX) > 3) {
            player.x += (player.x < targetX ? 3 : -3);
        } else {
            player.x = targetX;
        }
        e.preventDefault();
    });

    canvas.addEventListener('touchend', (e) => {
        touchStartX = null;
    });


//Smooth Movement
function handlePlayerMovement() {
    if (keys['ArrowLeft'] && player.x > 0) player.x -= 3;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 3;
}


//Draw Functions
function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawScore() {
    document.getElementById("score").innerText = `${score}`;
}

function drawLevel() {
    document.getElementById("level").innerText = `${level}`;
}


//Game Mechanics
function destroyAllBullets() { 
    bullets.forEach((bullet, index) => {
        bullets.splice(index, 999);
    });
    enemyBullets.forEach((bullet, index) => {
        enemyBullets.splice(index, 999);
    });
}

function spawnEnemies() {
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({ x: col * 60 + 20, y: row * 40 + 20, width: enemyWidth, height: enemyHeight, color: 'darkred' });
        }
    }
}

function levelTransition() {
    let timer = 3;

    paused = true;

    levelMessage.style.display = 'block';
    levelMessage.textContent = `Level ${level}`;
    countdownDisplay.style.display = 'block';
    countdownDisplay.textContent = timer;

    const countdown = setInterval(() => {
        timer--;
        countdownDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(countdown);
            spawnEnemies();
            countdownDisplay.textContent = "Go!";
            resumeGame();
            setTimeout(() => {
                countdownDisplay.display = 'none';
                countdownDisplay.textContent = '';
                levelMessage.style.display = 'none';
                levelMessage.textContent = '';
            }, 2000);
        }
    }, 1000);
}

function increaseLevel(){
    level++;
    drawLevel();
    switch(level) {
        case 1:
            enemyShootInterval = 0.001;
            enemySpeed = 0.3;
            enemyRows = 2;
            enemyCols = 5;
            spawnEnemies();
            break;
        case 2:
            levelTransition();
            score += 50;
            drawScore();
            enemyShootInterval = 0.002;
            enemySpeed = 0.33;
            enemyRows = 3;
            enemyCols = 5;
            break;
        case 3:
            levelTransition();
            score += 100;
            drawScore();
            enemyShootInterval = 0.003;
            enemySpeed = 0.36;
            enemyRows = 3;
            enemyCols = 6;
            break;
        case 4:
            levelTransition();
            score += 150;
            drawScore();
            enemyShootInterval = 0.005;
            enemySpeed = 0.39;
            enemyRows = 4;
            enemyCols = 6;
            break;
        case 5:
            levelTransition();
            score += 200;
            drawScore();
            enemyShootInterval = 0.007;
            enemySpeed = 0.42;
            enemyRows = 4;
            enemyCols = 7;
            break;
        case 6:
            levelTransition();
            score += 250;
            drawScore();
            enemyShootInterval = 0.01;
            enemySpeed = 0.45;
            enemyRows = 5;
            enemyCols = 7;
            break;
        case 7:
            levelTransition();
            score += 300;
            drawScore();
            enemyShootInterval = 0.015;
            enemySpeed = 0.5;
            enemyRows = 5;
            enemyCols = 8;
            break;
        default:
            break;
    }
    if (level > 7) {
        levelTransition();
        score += 500;
        enemyShootInterval += 0.015;
        enemySpeed += 0.05;
    }
}

function playerShoot() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
        drawRect(bullet);
    });
}

function moveEnemies() {
    let shouldReverse = false;
    enemies.forEach(enemy => {
        enemy.x += enemyDirection * enemySpeed;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            shouldReverse = true;
        }
    });
    if (shouldReverse) {
        enemyDirection *= -1;
    }
}

function handlePlayerBullets() {
    enemies.forEach((enemy, eIndex) => {
        drawRect(enemy);
        bullets.forEach((bullet, bIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
                score += 10;
                drawScore();
            }
        });
    });
}

function enemyShoot() {
    if (enemies.length === 0) return;
    // Randomly pick an enemy to shoot
    if (Math.random() < enemyShootInterval) {
        const shooters = enemies.filter((enemy, idx, arr) => {
            // Only allow bottom-most enemies in each column to shoot
            return !arr.some(e => e.x === enemy.x && e.y > enemy.y);
        });
        if (shooters.length > 0) {
            const shooter = shooters[Math.floor(Math.random() * shooters.length)];
            enemyBullets.push({
                x: shooter.x + shooter.width / 2 - 2,
                y: shooter.y + shooter.height,
                width: 4,
                height: 10,
                color: 'red'
            });
        }
    }
}

function handleEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.y += 4;
        drawRect(bullet);
        // Remove bullet if off screen
        if (bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
            return;
        }
        // Collision with player
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) handleGameOver();
    });
}

async function handleGameOver() {
    gameOver = true;

    const playerName = prompt(`Game Over!\nFinal Score: ${score}\n\nEnter your name to save your score:`);

    if (playerName) {
        try {
            const { db, collection, addDoc } = window.firestore;
            await addDoc(collection(db, "leaderboard"), {
                name: playerName,
                score: score
            });
            alert("Score submitted!");
        } catch (e) {
            console.error("Error adding score: ", e);
            alert("Failed to submit score.");
        }
    }

    if (confirm("Do you want to restart?")) {
        window.location.reload();
    }
}

//Game Loop
function update() {
    if (gameOver) return;

    if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawRect(player);
        handlePlayerMovement();
        playerShoot();
        handlePlayerBullets();

        moveEnemies();
        enemyShoot();
        handleEnemyBullets();
        
        if (enemies.length === 0) {
            increaseLevel();
            destroyAllBullets();
        }
    }
    
    requestAnimationFrame(update);
}
