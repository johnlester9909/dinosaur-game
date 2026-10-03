// =========================
// ELEMENTS
// =========================

const dinoArea =
    document.getElementById("dino-area");

const dino =
    document.getElementById("dino");

const cactus =
    document.getElementById("cactus");

const scoreDisplay =
    document.getElementById("score");

const finalScore =
    document.getElementById("final-score");

const gameOverScreen =
    document.getElementById("game-over");

const restartBtn =
    document.getElementById("restartBtn");

const speech =
    document.getElementById("speech");

const speechBubble =
    document.getElementById("speechbubble");


// =========================
// VARIABLES
// =========================

let score = 0;

let gameRunning = true;

let jumping = false;

let onCloud = false;

let speechTimer;


// Mobile swipe
let touchStartY = 0;

let touchStartX = 0;

let touchEndY = 0;


// =========================
// NORMAL JUMP
// =========================

function normalJump() {

    if (!gameRunning) {
        return;
    }

    if (jumping) {
        return;
    }

    if (onCloud) {
        return;
    }


    jumping = true;


    dinoArea.classList.add(
        "normal-jump"
    );


    setTimeout(function() {

        dinoArea.classList.remove(
            "normal-jump"
        );

        jumping = false;

    }, 1000);
}


// =========================
// CLOUD RIDE
// =========================

function rideCloud() {

    if (!gameRunning || jumping || onCloud) {
        return;
    }
    
    jumping = true;

    dinoArea.classList.remove("normal-jump",
         "leaving-cloud",
         "riding",
         "on-cloud");
    dinoArea.classList.add("cloud-jump");

    setTimeout(function() {

        if (!gameRunning) {
            return;
        }

        dinoArea.classList.remove("cloud-jump");
        dinoArea.classList.add("on-cloud");

        onCloud = true;
        jumping = false;

        speech.style.display = "block";
        speechBubble.style.display = "block";

        clearTimeout(speechTimer);

        speechTimer = setTimeout(function() {
            speech.style.display = "none";
            speechBubble.style.display = "none";
        }, 5000);

    }, 800);
}

function leaveCloud() {
    if (!gameRunning || !onCloud) {
        return;
    }

    onCloud = false;
    jumping = true;

    dinoArea.classList.remove("on-cloud");
    dinoArea.classList.add("leaving-cloud");

    speech.style.display = "none";
    speechBubble.style.display = "none";

    setTimeout(function () {
        dinoArea.classList.remove("leaving-cloud");
        jumping = false;
    }, 600);
}


// =========================
// KEYBOARD
// =========================

// Space / Arrow Up
// = NORMAL JUMP

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();

            normalJump();
        }

    }
);


// =========================
// MOBILE TOUCH
// =========================




document.addEventListener("touchstart", function(event) {

    // Huwag galawin ang swipe kapag button ang pinindot
    if (event.target.closest("button")) {
        return;
    }

    const touch = event.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

}, { passive: true });


document.addEventListener("touchend", function(event) {

    // Huwag galawin ang Restart button
    if (event.target.closest("button")) {
        return;
    }

    const touch = event.changedTouches[0];

    const deltaY = touchStartY - touch.clientY;
    const deltaX = Math.abs(touchStartX - touch.clientX);


    // SWIPE UP → RIDE CLOUD
    if (deltaY > 50 && deltaY > deltaX) {

        event.preventDefault();

        rideCloud();

        return;
    }


    // SWIPE DOWN → BABA SA CLOUD
    if (deltaY < -50 && Math.abs(deltaY) > deltaX) {

        event.preventDefault();

        leaveCloud();

        return;
    }


    // TAP → NORMAL JUMP
    if (Math.abs(deltaY) < 30 && deltaX < 30) {

        event.preventDefault();

        normalJump();
    }

}, { passive: false });


// =========================
// COLLISION
// =========================

setInterval(function() {

    if (!gameRunning || jumping || onCloud) {
    return;
}

    // Kapag nasa cloud,
    // walang cactus collision

    if (onCloud) {
        return;
    }


    const dinoRect =
        dino.getBoundingClientRect();

    const cactusRect =
        cactus.getBoundingClientRect();


    const hit =

        dinoRect.right - 15 >
        cactusRect.left + 10 &&

        dinoRect.left + 15 <
        cactusRect.right - 10 &&

        dinoRect.bottom - 10 >
        cactusRect.top + 10;


    if (hit) {

        gameOver();

    }

}, 10);


// =========================
// GAME OVER
// =========================

function gameOver() {

    gameRunning = false;


    cactus.style.animationPlayState =
        "paused";


    dinoArea.classList.remove(
        "normal-jump"
    );

    dinoArea.classList.remove(
        "cloud-jump"
    );

    dinoArea.classList.remove(
        "on-cloud"
    );


    speech.style.display = "none";

    speechBubble.style.display = "none";


    finalScore.textContent =
        score;


    gameOverScreen.style.display =
        "block";
}


// =========================
// RESTART
// =========================

function restartGame() {

    score = 0;

    gameRunning = true;

    jumping = false;

    onCloud = false;


    scoreDisplay.textContent = "0";


    gameOverScreen.style.display =
        "none";


    dinoArea.classList.remove(
        "normal-jump"
    );

    dinoArea.classList.remove(
        "cloud-jump"
    );

    dinoArea.classList.remove(
        "on-cloud"
    );


    // Hide speech
    speech.style.display = "none";

    speechBubble.style.display = "none";


    // Restart cactus

    cactus.style.animation = "none";


    void cactus.offsetWidth;


    cactus.style.animation =
        "cactusMove 2s linear infinite";
}


// =========================
// RESTART BUTTON
// =========================

restartBtn.addEventListener(
    "click",
    restartGame
);
