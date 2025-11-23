let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msgContainer");
let main =document.querySelector("#main")
let msg = document.querySelector("#msg-p");
let o = document.querySelector(".oclass")
let x = document.querySelector(".xclass")

let turn0 = true; //playerx, playero

const win = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
]

boxes.forEach(
    (box) => {
        box.addEventListener("click", () => {
            console.log("box was clicked")
            if (turn0) {
                //playero
                box.innerText = "o"
                turn0 = false
                box.classList.add("oclass")
            }
            else {
                //playerx
                box.innerText = "x"
                turn0 = true
                box.classList.add("xclass")
            };
            box.disabled = true

            checkwinner();
        });
    });

const checkwinner = () => {
    for (pattern of win) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val != "" && pos2val != "" && pos3val != "") {
            if (pos1val === pos2val && pos2val === pos3val) {
                console.log("winner", pos1val)
                showWinner(pos1val);
            }
        }
    }
}

const showWinner = (winner) => {
    msg.innerText = `congratulations, winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableboxes()
}

const disableboxes = () => {
    for (let box of boxes) {
        box.disabled = true
    }
}

const enableboxes = () => {
    for (let box of boxes) {
        box.disabled = false
        box.innerText = ""
    }
}


const resetgame = () => {
    turn0 = true
    enableboxes();
    msgContainer.classList.add("hide");
}

newGameBtn.addEventListener("click", resetgame)
resetbtn.addEventListener("click", resetgame)
