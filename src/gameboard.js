import Ship from "./ship.js";
import { logError } from "./utils.js";

export default class Gameboard{
    #ships;
    constructor(size){
        this.#ships = [5,4,3,3,2];
        this.aliveShipsCount = 0;
        this.accurateShots = 0;
        this.innacurateShots = 0;
        this.size = size;
        this.board = [];
        for(let y = 0; y < size[1]; y++){
            this.board[y] = [];
            for(let x = 0; x < size[0]; x++){
                this.board[y][x] = null;
            }
        }
    }

    placeShipHorizontally(startCords, ship){
        if(startCords[0] + ship.length - 1 > this.size[0] - 1) logError("Cordinates out of range!");
        for(let i = 0; i < ship.length; i++){
            if(this.board[startCords[1]][startCords[0] + i] !== null) logError("This place is already occupied!");
        }

        for(let i = 0; i < ship.length; i++){
            this.board[startCords[1]][startCords[0] + i] = ship;
        }
        
        this.aliveShipsCount++;
    }

    placeShipVertically(startCords, ship){
        if(startCords[1] + ship.length - 1 > this.size[1] - 1) logError("Cordinates out of range!");
        for(let i = 0; i < ship.length; i++){
            if(this.board[startCords[1] + i][startCords[0]] !== null) logError("This place is already occupied");
        }

        for(let i = 0; i < ship.length; i++){
            this.board[startCords[1] + i][startCords[0]] = ship;
        }
        this.aliveShipsCount++;
    }

    receiveAttack([x,y]){
        if(this.board[y][x] === null) {
            this.board[y][x] = "M";
            this.innacurateShots++;
            return;
        }
        else if(this.board[y][x] instanceof Ship){
            this.board[y][x].hit();
            if(this.board[y][x].isSunk()){
                this.aliveShipsCount--;
            }
            this.accurateShots++;
            this.board[y][x] = "H";
        }
    }

    isBoardEmpty(){
        return this.aliveShipsCount === 0;
    }

    clear(){
        this.aliveShipsCount = 0;
        this.accurateShots = 0;
        this.innacurateShots = 0;
        this.board = [];
        for(let y = 0; y < this.size[1]; y++){
            this.board[y] = [];
            for(let x = 0; x < this.size[0]; x++){
                this.board[y][x] = null;
            }
        }
    }

    populateBoard(){
        let func;
        let x;
        let length;
        let y;
        
        while(this.#ships.length !== 0){
            try{
                func = Math.round(Math.random());
                x = Math.round((Math.random() * 100) % 10);
                y = Math.round((Math.random() * 100) % 10);
                length = this.#ships[0];
                if(func === 1) this.placeShipHorizontally([x,y], new Ship(length));
                if(func === 0) this.placeShipVertically([x,y], new Ship(length));
                this.#ships.shift();
            }
            catch(err){
                console.log(err.message);
            }
        }
        this.#ships = [5,4,3,3,2];
        console.log(this.printBoard());
    }

    printBoard(){
        let str = "";
        for(let row of this.board){
            for(let col of row){
                str += col === null ? "X" : col instanceof Ship ? col.length : col;
            }
            str += "\n";
        }     

        return str + `\nAccurate shots: ${this.accurateShots}\nInnaccurate shots: ${this.innacurateShots}\nAlive ships: ${this.aliveShipsCount}\n`;
    }
}