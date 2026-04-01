import "./style.css"

import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
import Player from "./player.js";

const ship_lengths = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2
}

const body = document.querySelector("body");

const h2_orientation = document.querySelector(".orientation");

const div_player_board = document.querySelector(".player-board");
const div_computer_board = document.querySelector(".computer-board");

const div_ship_selector = document.querySelector(".ship-selector");

const div_carrier = document.querySelector(".carrier");
const div_battleship = document.querySelector(".battleship");
const div_cruiser = document.querySelector(".cruiser");
const div_submarine = document.querySelector(".submarine");
const div_destroyer = document.querySelector(".destroyer");

const button_start = document.querySelector(".start-game");

const dialog_winner = document.querySelector("dialog");

const h1_winner = document.querySelector(".winner-header");
const h3_player_total_shots = document.querySelector(".left .total-shots");
const h3_computer_total_shots = document.querySelector(".right .total-shots");
const h3_player_accurate_shots = document.querySelector(".left .accurate-shots");
const h3_computer_accurate_shots = document.querySelector(".right .accurate-shots");
const h3_player_accuracy = document.querySelector(".left .accuracy-percentage");
const h3_computer_accuracy = document.querySelector(".right .accuracy-percentage");

// INIT PLAYERS
const player = new Player([10,10], "real");
const computer = new Player([10,10], "ai");

//INIT DOM BOARDS
function updatePlayerBoard(){
    div_player_board.innerHTML = "";
    for(let i = 0; i < player.board.size[0]; i++){
        for(let j = 0; j < player.board.size[1]; j++){
            const div_space = document.createElement("div");
            if(player.board.board[i][j] instanceof Ship){
                div_space.classList.add("occupied");
            }
            if(player.board.board[i][j] === "H") div_space.classList.add("hit");
            if(player.board.board[i][j] === "M") div_space.classList.add("miss");
            div_space.classList.add("space");
            div_space.setAttribute("data-x", j);
            div_space.setAttribute("data-y", i);
            div_player_board.append(div_space);
        }
    }
}

function updateEnemyBoard(){
    // for(let row of computer.board.board){
    //     for(let col of row){
    //         const div_space = document.createElement("div");
    //         div_space.classList.add("space");
    //         div_computer_board.append(div_space);
    //     }
    // }
    div_computer_board.innerHTML = "";
    for(let i = 0; i < computer.board.size[0]; i++){
        for(let j = 0; j < computer.board.size[1]; j++){
            const div_space = document.createElement("div");
            if(computer.board.board[i][j] === "H") div_space.classList.add("hit");
            if(computer.board.board[i][j] === "M") div_space.classList.add("miss");
            div_space.classList.add("space");
            div_space.setAttribute("data-x", j);
            div_space.setAttribute("data-y", i);
            div_computer_board.append(div_space);
        }
    }
}

function toggleSelected(selected){
    div_carrier.classList.remove("selected");
    div_battleship.classList.remove("selected");
    div_cruiser.classList.remove("selected");
    div_submarine.classList.remove("selected");
    div_destroyer.classList.remove("selected");

    if(selected !== undefined)selected.classList.add("selected");
}

updatePlayerBoard();
updateEnemyBoard();

const {getState, beginGame, changeCurrentShip, getCurrentShip, getOrientation, changeOrientation, placeShip, getPlacedShips, changeTurn, getTurn, resetGame} = (() => {
    let state = "choosing";
    let orientation = "hor"
    let current_ship = null;
    let ships_placed = 0;
    let game_turn;

    function getOrientation(){
        return orientation;
    }

    async function changeTurn(){
        game_turn = game_turn === player ? computer : player;
        if(player.board.isBoardEmpty()){
            announceWinner(computer);
            return;
        };
        if(computer.board.isBoardEmpty()){
            announceWinner(player);
            return;
        } 
        if(game_turn.type === "ai"){ 
            let cords = await game_turn.simulate_move();
            console.log(cords);
            player.board.receiveAttack(cords);
            updatePlayerBoard();
            changeTurn();
        }
    }

    function getTurn(){
        return game_turn;
    }

    function placeShip(){
        ships_placed++;
    }

    function getPlacedShips(){
        return ships_placed;
    }

    function changeOrientation(){
        orientation = orientation === "hor" ? "ver" : "hor"; 
    }

    function changeCurrentShip(ship_name){
        current_ship = ship_name;
        console.log(current_ship);
    }

    function getCurrentShip(){
        return current_ship;
    }

    function getState(){
        return state;
    }

    function beginGame(){
        state = "ingame";
        game_turn = player;
    }
    
    function resetGame(){
        player.board.clear();
        computer.board.clear();
        state = "choosing";
        game_turn = player;
        ships_placed = 0;
        current_ship = null;

        button_start.disabled = false;
        div_battleship.classList.remove("disabled");
        div_carrier.classList.remove("disabled");
        div_cruiser.classList.remove("disabled");
        div_destroyer.classList.remove("disabled");
        div_submarine.classList.remove("disabled");

        updateEnemyBoard();
        updatePlayerBoard();
    }

    function announceWinner(winner){
        h1_winner.innerText = `Winner: ${winner.type}`;

        h3_computer_total_shots.innerText = `Total shots: ${player.board.accurateShots + player.board.innacurateShots}`
        h3_player_total_shots.innerText = `Total shots: ${computer.board.accurateShots + computer.board.innacurateShots}`

        h3_computer_accurate_shots.innerText = `Accurate shots: ${player.board.accurateShots}`
        h3_player_accurate_shots.innerText = `Accurate shots: ${computer.board.accurateShots}`

        h3_computer_accuracy.innerText = `Accuracy: ${Math.round((player.board.accurateShots / (player.board.accurateShots + player.board.innacurateShots))*100)}%`
        h3_player_accuracy.innerText = `Accuracy: ${Math.round((computer.board.accurateShots / (computer.board.accurateShots + computer.board.innacurateShots))*100)}%`

        dialog_winner.showModal();
    }

    return {getState, beginGame, changeCurrentShip, getCurrentShip, getOrientation, changeOrientation, placeShip, getPlacedShips, changeTurn, getTurn, resetGame}
})();

document.addEventListener("DOMContentLoaded", e => {
    h2_orientation.innerText = "Orientation: " + getOrientation();
});

document.addEventListener("keyup", e => {
    if(e.key === "r"){
        changeOrientation();
        h2_orientation.innerText = "Orientation: " + getOrientation();
    }
});

div_ship_selector.addEventListener("click", e => {
    if(e.target.classList.contains("ship") && !e.target.classList.contains("disabled")){
        toggleSelected(e.target);
        changeCurrentShip(e.target);
    }
})

div_player_board.addEventListener("click", e => {
    if(e.target.classList.contains("space")){
        if(getState() === "choosing" && getCurrentShip() !== null){
            try {
                let startCords = [Number(e.target.getAttribute("data-x")), Number(e.target.getAttribute("data-y"))]
                console.log(startCords);
                console.log(ship_lengths[getCurrentShip().getAttribute("data-ship")]);
                if(getOrientation() === "hor") player.board.placeShipHorizontally(startCords, new Ship(ship_lengths[getCurrentShip().getAttribute("data-ship")]));
                if(getOrientation() === "ver") player.board.placeShipVertically(startCords, new Ship(ship_lengths[getCurrentShip().getAttribute("data-ship")]));
                updatePlayerBoard();
                getCurrentShip().classList.add("disabled");
                changeCurrentShip(null);
                placeShip();
                toggleSelected();
            } catch (error) {   
                alert(error.message);
            }
            
        }
    }
})

div_computer_board.addEventListener("click", e => {
    if(e.target.classList.contains("space")){
        if(getState() === "ingame" && getTurn() === player){
            let cords = [e.target.getAttribute("data-x"), e.target.getAttribute("data-y")]
            computer.board.receiveAttack([cords[0], cords[1]]);
            updateEnemyBoard();
            changeTurn();
        }
    }
})

body.addEventListener("click", e => {
    if(e.target.classList.contains("start-game")){
        if(getPlacedShips() === 5){
            beginGame();
            computer.board.populateBoard();
            e.target.disabled = true;
        }
    }
    if(e.target.classList.contains("reset-game")){
        resetGame();
    }
})






