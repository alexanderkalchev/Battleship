import Gameboard from "./gameboard.js"

export default class Player{
    constructor(boardSize, type){
        this.board = new Gameboard(boardSize);
        this.type = type;
        this.moves = [];
    }

    simulate_move(){
        let x, y;
        while(true){
            x = Math.floor((Math.random() * 100) % 10);
            y = Math.floor((Math.random() * 100) % 10)
            if(this.moves.some(cords => cords[0] === x && cords[1] === y)) continue;
            this.moves.push([x,y]);
            break;
        }
        return new Promise((res, rej) =>{
            setTimeout(() => res([x,y]), 1000);
        });
    }
} 