
// initializing the directions
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

class Game {
    Main(){
        // setting the canvas and the context of the image
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        // setting the width and height of the canvas
        this.canvas.width = 1400;
        this.canvas.height = 1000;

        // setting the style of the canvas
        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';



    }

    resetGame(victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();

        victor.score++;
    }
}

class Paddle{
    _width = 0;
    _height = 0;
    _x = 0;
    _y = 0;
    _score = 0;
    _move = 0;
    _speed = 0;
    _playerName = '';

    constructor(width=18, height=180, x = 0, y = 0, score=0,
                move=DIRECTION.IDLE, speed=8, playerName='Foo'){
        this._width = width;
        this._height = height;
        this._x = x - 150;
        this._y = (y / 2) - 35;
        this._score = score;
        this._move = move;
        this._speed = speed;
        this._playerName = playerName;
    }

    Up(){
        // updates the y
        this._y -= this._speed;
    }
    Down(){
        this._y += this._speed;
    }
    Reset(height){
        this._y = (height / 2) - 35;
    }


}

class Ball{
    _x = 0;
    _y = 0;
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    UpdateBall(){

    }
}