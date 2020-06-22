// const cards = require('./Media/Images/cards.js');
const numberOfCards = 30;
const theme = new Audio('Media/Music/theme.mp3');
const win = new Audio('Media/Music/win.mp3');
const lose = new Audio('Media/Music/lose.mp3');
theme.volume = 0.5;
lose.volume = 0.2;
win.volume = 0.4;

let numberOfClicks = 0;
let firstImageId = 0;
let secondImageId = 0;
let startMusic = true;
let shuffledCards = [];
var myCounter;
var myTimeout;
var modal;
    
window.addEventListener('popstate', () => {
    theme.pause();
    win.pause();
    lose.pause();
});

window.onload = () => {
    shuffledCards = shuffle(easyCards);
    let content = document.getElementById("cards");
    content.style.pointerEvents = "none";

    for (i = 0; i < numberOfCards; i++) {
        let card = document.createElement("div");
        card.className = "card";

        let innerCard = document.createElement("div");
        innerCard.className = "card-inner";
        innerCard.setAttribute("id", shuffledCards[i].id);
        setTimeout(() => {
            innerCard.addEventListener('click', swapCardFace);
        }, 3000)

        let frontCard = document.createElement("div")
        frontCard.className = "card-front";
        frontCard.dataset.row = Math.floor(i / 6);

        let backCard = document.createElement("div");
        backCard.className = "card-back";
        backCard.style.backgroundImage = shuffledCards[i].path;

        card.appendChild(innerCard);
        innerCard.appendChild(frontCard);
        innerCard.appendChild(backCard);

        document.getElementById("cards").appendChild(card);
    }
    modal = document.getElementById("myModal");
}

window.onclick = (event) => {
    if (event.target == modal) {
        closeModal();
    }
}

const openModal = (type) => {
    modal.style.display = "block";
    let status = document.getElementsByClassName("status")[0];
    clearTimeout(myTimeout);
    clearInterval(myCounter);
    if(type === "Lost") {
        status.textContent = "You Lost!";
        stopThemeSong();
        lose.play();
    } else if (type === "Win") {
        status.textContent = "You Win!";
        stopThemeSong();
        win.play();
    }
}

const closeModal = () => {
    modal.style.display = "none";
    let fog = document.getElementsByClassName("fog")[0];
    let content = document.getElementById("cards");
    let pauseText = document.getElementsByClassName("buttons-style")[1];
    let startText = document.getElementsByClassName("buttons-style")[0];
    fog.style.pointerEvents = "none";
    content.style.pointerEvents = "none";
    pauseText.style.pointerEvents = "none";
    startText.style.pointerEvents = "auto";
}

const stopThemeSong = () => {
    if (!theme.paused) {
        theme.pause();
    }
}

const shuffle = (array) => {
    return array.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
}

const checkMatchingImages = () => {
    let score = document.getElementById("score");
    const firstImageCard = document.getElementById(firstImageId);
    const secondImageCard = document.getElementById(secondImageId);

    const firstImageIndex = shuffledCards.findIndex(x => x.id === firstImageId);
    const secondImageIndex = shuffledCards.findIndex(x => x.id === secondImageId);

    const sameImages = firstImageCard.childNodes[1].style.backgroundImage 
                     === secondImageCard.childNodes[1].style.backgroundImage;
    if(!sameImages) {
        if(!shuffledCards[firstImageIndex].flipped) {
            firstImageCard.style.transform = "none";
        }
        if(!shuffledCards[secondImageIndex].flipped) {
            secondImageCard.style.transform = "none";
        }
    } else {
        shuffledCards[firstImageIndex].flipped = true;
        shuffledCards[secondImageIndex].flipped = true;
        score.textContent = parseInt(score.textContent) + 1;
        if (parseInt(score.textContent) === 15) {
            openModal("Win");
        }
    }
    numberOfClicks = 0;
}

const swapCardFace = (event) => {
    if(startMusic) {
        theme.play();
        startMusic = false;
    }
    let innerCard = event.target.parentNode;
    if(numberOfClicks === 0) {
        firstImageId = innerCard.id;
        innerCard.style.transform = "rotateY(180deg)";
        numberOfClicks++;
    } else if(numberOfClicks === 1 && firstImageId !== innerCard.id) {
        secondImageId = innerCard.id;
        innerCard.style.transform = "rotateY(180deg)";
        numberOfClicks++;
        setTimeout(checkMatchingImages, 700);
    }
}

const restartGame = () => {
    location.reload();
    modal.style.display = "none";
}

const startTimer = () =>{
    let timer = document.getElementById("timer");
    let content = document.getElementById("cards");
    content.style.pointerEvents = "auto";
    if(theme.paused) {
        theme.volume = 0.5;
        theme.play();
        myCounter = setInterval(() => { 
            timer.textContent = timer.textContent - 1;
        }, 1000)

        myTimeout = setTimeout(() => {
            if(parseInt(timer.textContent) === 0) {
                openModal("Lost");
            }
        }, timer.textContent * 1000)
    }
}

const toggleGame = () => {
    let startText = document.getElementsByClassName("buttons-style")[0];
    let pauseText = document.getElementsByClassName("buttons-style")[1];
    if (startText.textContent.includes("Start")) {
        pauseText.style.pointerEvents = "auto";
        startText.textContent = "Restart";
        startTimer();
    } else if(startText.textContent.includes("Restart")) {
        restartGame();
    }
}

const toggleCounter = () => {
    let content = document.getElementById("cards");
    let pauseText = document.getElementsByClassName("buttons-style")[1];
    if(pauseText.textContent.includes("Resume")) {
        pauseText.textContent = "Pause";
        startTimer();
    } else if(pauseText.textContent.includes("Pause")) {
        theme.pause();
        pauseText.textContent = "Resume";
        content.style.pointerEvents = "none";
        clearInterval(myCounter);
    }
}


