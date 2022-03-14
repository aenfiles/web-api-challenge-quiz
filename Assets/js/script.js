
// get some important elements and define them globally
const introScreen = document.getElementById("intro-page");
const startQuizBtn = document.getElementById("start-quiz");
const highScoresBtn = document.getElementById("high-scores-button");
const submitBtn = document.getElementById("submit-button");
const questionScreen = document.getElementById("question-screen");
const timerLabel = document.querySelector(".header-bar p");
const quizEndScreen = document.querySelector(".end-screen");
const answerChoiceContainer = document.querySelector("#question-screen ul");
const highScoresScreen = document.getElementById("high-scores");
const initialsTextBox = quizEndScreen.querySelector("input");

// keep track of the currently visible screen and the last visible screen
let currentScreen = introScreen;
let previousScreen = introScreen;

// global variables for keeping track of question status 
let timeLeft = 60; // time left (in seconds)
let currentQuestionNumber = 0; // the current question index inside the questionsList
let finalScore; // represent the time left when the user finished the quiz
let timerRoutine; // represents the setInterval() for the timer (not yet defined)

let questionsList = [
    // question 0
    {
        title: "If you're level 113 in Elden Ring, you might be: ____",
        choices: ["James", "someone with no life", "tired", "hungry"],
        rightAnswer: "James"
    },

    // question 1
    {
        title: "Why did the founder of the Ackland Museum of Art choose the University of Chapel Hill to place his art?",
        choices: ["He was an alumni", "He was born there", "They agreed to have his body in a crypt in the museum", "He raised his family there"],
        rightAnswer: "They agreed to have his body in a crypt in the museum"
    },

    // question 2
    {
        title: "What does T.A.R.D.I.S. stand for?",
        choices: ["Tomatoes and rice don't insult science", "Time and Relative Dimensions in Space"],
        rightAnswer: "Time and Relative Dimensions in Space"
    },

    // question 3
    {
        title: "Which CEO Entrepreneur was born in 1964?",
        choices: ["Bo Burnham", "Jeffery Bezos", "Will"],
        rightAnswer: "Jeffery Bezos"
    },

    // question 4
    {
        title: "Which season of Game of Thrones did those brothers mess up the most?",
        choices: ["Season 4", "Season 7", "Season 8"],
        rightAnswer: "Season 8"
    },
]

function switchToScreen(screen) {
    screen.style.display = "block"; // set a given screen to visible
    currentScreen.style.display = "none"; // set current screen to invisible
    previousScreen = currentScreen; // the new previous screen is the invisible screen
    currentScreen = screen; // the new current screen is the visible screen
}

// update timer label text to current time
function updateTimerText() {
    timerLabel.textContent = "Time Left: " + timeLeft;
}

// clear all of the elements in a container we call "element"
function clearElements(element) {
    const children = element.children;
    for (let i = children.length - 1; i >= 0; i--) {
        children[i].remove();
    }
}

function generateNextQuestion() {

    // if there is no next question, end the quiz
    if (currentQuestionNumber >= questionsList.length) {
        onQuizFinished();
        return;
    }

    // get the elements that we need
    const questionTitleLabel = document.querySelector("#question-screen h2");

    // get next question data from questions list
    const currentQuestion = questionsList[currentQuestionNumber];
    const questionChoices = currentQuestion.choices;

    // set the question title 
    questionTitleLabel.textContent = currentQuestion.title;

    // clear the previous answer choices from the answer choice container
    clearElements(answerChoiceContainer);

    // generate the NEW question answer choices
    for (let i = 0; i < questionChoices.length; i++) {
        // get the current choice
        let currentChoice = questionChoices[i];

        // make the answer choice elements
        let li = document.createElement("li");
        let button = document.createElement("button");

        // give the answer button the choice text
        button.textContent = currentChoice;

        // add the button to the li
        li.appendChild(button);
        // add the li to the answerChoiceContainer
        answerChoiceContainer.appendChild(li);
    }

    // increase question index to get next question in the list
    currentQuestionNumber++;
}

// everything that happens after the quiz is finished
function onQuizFinished() {
    // switch to the end screen
    switchToScreen(quizEndScreen);

    // update the score element with the time left
    const scoreTitle = quizEndScreen.querySelector("p");
    scoreTitle.textContent = "Your Score: " + timeLeft;
    finalScore = timeLeft;

    // stop the timer
    clearInterval(timerCounter);

}


function startQuiz() {
    // switch to the answer screen
    switchToScreen(questionScreen);

    // start the timer countdown
    timerCounter = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timerCounter);
            onQuizFinished();
        }
        updateTimerText();
    }, 1000); // do something every second

    // generate the next question
    generateNextQuestion();
}

function highScores() {
    // switch to high scores screen
    switchToScreen(highScoresScreen);
}

function viewHighScores() {
    // view high scores
    let highScoresContainer = highScoresScreen.querySelector("ol");

    // get localstorage data
    let highScoresData = localStorage.getItem("highscore-data");
    if (!highScoresData) {
        highScoresData = [];
    } else {
        highScoresData = JSON.parse(highScoresData);
    }

    clearElements(highScoresContainer);

    for (let i = 0; i < highScoresData.length; i++) {
        let highScoreObject = highScoresData[i];
        let highScoreLi = document.createElement("li");
        highScoreLi.textContent = highScoreObject.initials + " - " + highScoreObject.score;

        highScoresContainer.appendChild(highScoreLi);
    }

}

function onSubmitClick() {
    // add initials to score
    if (!initialsTextBox.value) {
        return;
    }

    let oldData = localStorage.getItem("highscore-data");
    let dataToSave = {
        score: finalScore,
        initials: initialsTextBox.value
    }

    if (!oldData) {
        oldData = [];
    } else {
        console.log("old data is:", oldData);
        oldData = JSON.parse(oldData);
    }

    oldData.push(dataToSave);
    localStorage.setItem("highscore-data", JSON.stringify(oldData));

    switchToScreen(highScoresScreen);
    viewHighScores();
}


// handle when the user clicks on the answer choice container
function answerChoiceClicked(event) {

    // get the element clicked
    let buttonSelected = event.target;
    const currentQuestion = questionsList[currentQuestionNumber - 1];
    const answerFeedbackLabel = questionScreen.querySelector("p");

    // if the element clicked was an answer choice button, then...
    if (buttonSelected.matches("button")) {
        if (buttonSelected.textContent === currentQuestion.rightAnswer) {
           answerFeedbackLabel.textContent = "You are correct!";
        } else {
            answerFeedbackLabel.textContent = "You are wrong and you should feel bad";
            timeLeft -= 10; // take 10 seconds away if they get the answer wrong
            updateTimerText();
        }
        setTimeout(function() {
            answerFeedbackLabel.textContent = "";
        }, 1500);
        generateNextQuestion();
    }
}

// set the event listeners
startQuizBtn.addEventListener("click", startQuiz);
highScoresBtn.addEventListener("click", highScores);
submitBtn.addEventListener("click", onSubmitClick);
answerChoiceContainer.addEventListener("click", answerChoiceClicked)
