let userScore = 0;
let AIscore = 0;
let choices = document.querySelectorAll(".choice");
let msg = document.querySelector("#msg");
let userScorepara = document.querySelector("#user-score");
let compScorepara = document.querySelector("#AI-score");

choices.forEach((choice) => {
  // console.log(choice);
  choice.addEventListener("click", () => {
    let userChoice = choice.getAttribute("id");
    // console.log("choice was click, id is", userChoice);
    playGame(userChoice);
  });
});

let AIchoice = () => {
  const option = ["rock", "paper", "scissor"];
  const random = Math.floor(Math.random() * 3);
  return option[random];
};

let playGame = (userChoice) => {
  console.log("user choice= ", userChoice);
  const compchoice = AIchoice();
  console.log("comp choice= ", compchoice);

  if (userChoice === compchoice) {
    drawGame();
  } else {
    let userWin = true;
    if (userChoice === "rock") {
      //scissor, paper
      userWin = compchoice === "paper" ? false : true;
    } else if (userChoice === "paper") {
      //rock, scissor
      userWin = compchoice === "scissor" ? false : true;
    } else {
      //rock, paper
      userWin = compchoice === "rock" ? false : true;
    }
    ShowWinner(userWin, userChoice, compchoice);
  }
};

let drawGame = () => {
  console.log("game was draw.");
  msg.textContent = "Game was draw";
  msg.style.background = "#081b31";
};

let ShowWinner = (userWin, userChoice, compchoice) => {
  if (userWin) {
    userScore++;
    userScorepara.textContent = userScore;
    console.log("You win");
    msg.textContent = `You win! Your ${userChoice} beats ${compchoice}`;
    msg.style.background = "green";
  } else {
    AIscore++;
    compScorepara.textContent = AIscore;
    console.log("You lose");
    msg.textContent = `You lose! ${compchoice} beats Your ${userChoice}`;
    msg.style.background = "red";
  }
};
