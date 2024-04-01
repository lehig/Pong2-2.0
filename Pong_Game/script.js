// Global Variables
const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};


const colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];

// Ball object (The cube that bounces back and forth)
const Ball = {
    new: function (canvasWidth, canvasHeight, incrementedSpeed) {
        return {
            width: 20,
            height: 20,
            x: (canvasWidth / 2) - 9,
            y: (canvasHeight / 2) - 9,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 10
        };
    }
};

// Player object (The two lines that move up and down)
const Player = {
    new: function (side, startX, startY) {
        return {
            width: 18,
            height: 180,
            x: startX,
            y: startY,
            move: DIRECTION.IDLE,
            speed: 8,
            side: side
        };
    }
};
const Player2 = {
    new: function (side, startX, startY) {
        return {
            width: 180,
            height: 18,
            x: startX,
            y: startY,
            move: DIRECTION.IDLE,
            speed: 8,
            side: side
        };
    }
};

const Border = {
    new: function (side, startX, startY) {
        return {
            width:  30,
            height: 400,
            x: startX,
            y: startY,
            move: DIRECTION.IDLE,
            speed: 8,
            side: side
        };
    }
};

const Border2 = {
    new: function (side, startX, startY) {
        return {
            width: 480,
            height: 30,
            x: startX,
            y: startY,
            move: DIRECTION.IDLE,
            speed: 8,
            side: side
        };
    }
};


const Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 1200;
        this.canvas.height = 1000

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';

        // create left border with a gap    
        this.border_left_top = Border.new.call(this, 'left', 0, 0, 20, this.canvas.height / 2 - 100);
        this.border_left_bottom = Border.new.call(this, 'left', 0, this.canvas.height / 2 + 170, 20, this.canvas.height / 2 - 100);

        // Create right border with a gap
        this.border_right_top = Border.new.call(this, 'right', this.canvas.width - 20, 0, 20, this.canvas.height / 2 - 100);
        this.border_right_bottom = Border.new.call(this, 'right', this.canvas.width - 20, this.canvas.height / 2 + 170, 20, this.canvas.height / 2 - 100);



        //Create top border with a gap
        this.border_top_left = Border2.new.call(this, 'top', 0, 0, this.canvas.width / 2 - 100, 20);
        this.border_top_right = Border2.new.call(this, 'top', this.canvas.width / 2 + 170, 0, this.canvas.width / 2 - 100, 20);

        // Create bottom border with a gap
        this.border_bottom_left = Border2.new.call(this, 'bottom', 0, this.canvas.height - 20, this.canvas.width / 2 - 100, 20);
        this.border_bottom_right = Border2.new.call(this, 'bottom', this.canvas.width / 2 + 170, this.canvas.height - 20, this.canvas.width / 2 - 100, 20);




        this.player1 = Player.new.call(this, 'left', 50, (this.canvas.height / 2) - 35);
        this.player2 = Player.new.call(this, 'right', this.canvas.width - 50, (this.canvas.height / 2) - 35);
        this.player3 = Player2.new.call(this, 'top', (this.canvas.width / 2) - 25, 50);
        this.player4 = Player2.new.call(this, 'bottom', (this.canvas.width / 2) - 35, this.canvas.height - 50);
        this.ball = Ball.new.call(this, this.canvas.width, this.canvas.height);

        this.player1.speed = 5;
        this.running = this.over = false;
        this.turn = this.player1;
        this.timer = this.round = 0;
        this.color = '#8c52ff';

        Pong.menu();
        Pong.listen();
    },

    endGameMenu: function (text) {
        // Change the canvas font size and color
        Pong.context.font = '45px Courier New';
        Pong.context.fillStyle = this.color;

        // Draw the rectangle behind the 'Press any key to begin' text.
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        );

        // Change the canvas color;
        Pong.context.fillStyle = '#000000';

        // Draw the end game menu text ('Game Over' and 'Winner')
       

        setTimeout(() => {
            Pong = Object.assign({}, Game);
            Pong.initialize();
        }, 3000);
    },

    menu: function () {
        // Draw all the Pong objects in their current state
        Pong.draw();

        // Change the canvas font size and color
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;

        // Draw the rectangle behind the 'Press any key to begin' text.
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        // Change the canvas color;
        this.context.fillStyle = '#ffffff';

        // Draw the 'press any key to begin' text
        this.context.fillText('Press any key to begin',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    // Update all objects (move the player, ai, ball, increment the score, etc.)
    update: function () {
        if (!this.paused && !this.over) {
        if (!this.over) {

            if (this.ball.x <= 0 || this.ball.x >= this.canvas.width - this.ball.width ||
                this.ball.y <= 0 || this.ball.y >= this.canvas.height - this.ball.height) {
                Pong._resetTurn.call(this, this.player2, this.player1, this.player3, this.player4);
            }

            if (this.player1.move === DIRECTION.UP) this.player1.y -= this.player1.speed;
            else if (this.player1.move === DIRECTION.DOWN) this.player1.y += this.player1.speed;

            if (this.player2.move === DIRECTION.UP) this.player2.y -= this.player2.speed;
            else if (this.player2.move === DIRECTION.DOWN) this.player2.y += this.player2.speed;

            if (this.player3.move === DIRECTION.RIGHT) this.player3.x -= this.player3.speed;
            else if (this.player3.move === DIRECTION.LEFT) this.player3.x += this.player3.speed;

            if (this.player4.move === DIRECTION.RIGHT) this.player4.x -= this.player4.speed;
            else if (this.player4.move === DIRECTION.LEFT) this.player4.x += this.player4.speed;

            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 150) + 250;
                this.turn = null;
            }

            if (this.player1.y <= 0) this.player1.y = 0;
            else if (this.player1.y >= (this.canvas.height - this.player1.height)) this.player1.y = (this.canvas.height - this.player1.height);

            if (this.player2.y <= 0) this.player2.y = 0;
            else if (this.player2.y >= (this.canvas.height - this.player2.height)) this.player2.y = (this.canvas.height - this.player2.height);

            if (this.player3.x <= 0) this.player3.x = 0;
            else if (this.player3.x >= (this.canvas.width - this.player3.width)) this.player3.x = (this.canvas.width - this.player3.width);

            if (this.player4.x <= 0) this.player4.x = 0;
            else if (this.player4.x >= (this.canvas.width - this.player4.width)) this.player4.x = (this.canvas.width - this.player4.width);


            if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            // Handle Player-Ball collisions
            if (this._checkBallCollision(this.player1)) {
                this.ball.x = (this.player1.x + this.ball.width);
                this.ball.moveX = DIRECTION.RIGHT;
            }
            if (this._checkBallCollision(this.player2)) {
                this.ball.x = (this.player2.x - this.ball.width);
                this.ball.moveX = DIRECTION.LEFT;
            }
            if (this._checkBallCollision2(this.player3)) {
                this.ball.y = (this.player3.y + this.ball.height);
                this.ball.moveY = DIRECTION.DOWN;
            }
            if (this._checkBallCollision2(this.player4)) {
                this.ball.y = (this.player4.y - this.ball.height);
                this.ball.moveY = DIRECTION.UP;
            }

            // collision with top and bottom borders 
            if (this._checkBallCollisionBorder(this.border_bottom_left)) {
                this.ball.y = (this.border_bottom_left.y - this.ball.height);
                this.ball.moveY = DIRECTION.UP;
            }
            if (this._checkBallCollisionBorder(this.border_bottom_right)) {
                this.ball.y = (this.border_bottom_right.y - this.ball.height);
                this.ball.moveY = DIRECTION.UP;
            }
            if (this._checkBallCollision2(this.border_top_right)) {
                this.ball.y = (this.border_top_right.y + this.ball.height);
                this.ball.moveY = DIRECTION.DOWN;
            }
            if (this._checkBallCollision2(this.border_top_left)) {
                this.ball.y = (this.border_top_left.y + this.ball.height);
                this.ball.moveY = DIRECTION.DOWN;
            }

            // collision with right and left borders 
            if (this._checkBallCollision(this.border_left_top)) {
                this.ball.x = (this.border_left_top.x + this.ball.width);
                this.ball.moveX = DIRECTION.RIGHT;
            }
            if (this._checkBallCollision(this.border_left_bottom)) {
                this.ball.x = (this.border_left_bottom.x + this.ball.width);
                this.ball.moveX = DIRECTION.RIGHT;
            }
            if (this._checkBallCollisionBorder2(this.border_right_bottom)) {
                this.ball.x = (this.border_right_bottom.x - this.ball.width);
                this.ball.moveX = DIRECTION.LEFT;
            }
            if (this._checkBallCollisionBorder2(this.border_right_top)) {
                this.ball.x = (this.border_right_top.x - this.ball.width) ;
                this.ball.moveX = DIRECTION.LEFT;
            }


        }
    }
    },

    // Draw the objects on the canvas element
    draw: function () {
        if (!this.paused && !this.over) {
        // Clear the Canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Set the fill style to black
        this.context.fillStyle = this.color;

        // Draw the background
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set the fill style to white (For the paddles and the ball)
        this.context.fillStyle = '#ffffff';


        // Draw the Players
        this.context.fillRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height);
        this.context.fillRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height);
        this.context.fillRect(this.player3.x, this.player3.y, this.player3.width, this.player3.height);
        this.context.fillRect(this.player4.x, this.player4.y, this.player4.width, this.player4.height);

        // Draw the Borders 
        this.context.fillRect(this.border_bottom_left.x, this.border_bottom_left.y, this.border_bottom_left.width, this.border_bottom_left.height);
        this.context.fillRect(this.border_bottom_right.x, this.border_bottom_right.y, this.border_bottom_right.width, this.border_bottom_right.height);
        this.context.fillRect(this.border_left_bottom.x, this.border_left_bottom.y, this.border_left_bottom.width, this.border_left_bottom.height);
        this.context.fillRect(this.border_left_top.x, this.border_left_top.y, this.border_left_top.width, this.border_left_top.height);
        this.context.fillRect(this.border_right_bottom.x, this.border_right_bottom.y, this.border_right_bottom.width, this.border_right_bottom.height);
        this.context.fillRect(this.border_right_top.x, this.border_right_top.y, this.border_right_top.width, this.border_right_top.height);
        this.context.fillRect(this.border_top_left.x, this.border_top_left.y, this.border_top_left.width, this.border_top_left.height);
        this.context.fillRect(this.border_top_right.x, this.border_top_right.y, this.border_top_right.width, this.border_top_right.height);


        // Draw the Ball
        if (Pong._turnDelayIsOver.call(this)) {
            this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        }

        // Draw the net (Line in the middle)


        // Set the default canvas font and align it to the center
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';



    }
    },

    // Add a boolean variable to track pause state
    paused: false,

    loop: function () {
        Pong.update();
        Pong.draw();
        
        // Continue the game loop
        requestAnimationFrame(Pong.loop);
    },
    
    

    listen: function () {
        document.addEventListener('keydown', function (key) {
            // Handle the 'Press any key to begin' function and start the game.
            if (Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }

            // Handle up arrow and w key events
            if (key.keyCode === 38 ) Pong.player1.move = DIRECTION.UP;


            if (key.keyCode === 40 ) Pong.player1.move = DIRECTION.DOWN;

            if (key.keyCode === 87 ) Pong.player2.move = DIRECTION.UP;


            if (key.keyCode === 83) Pong.player2.move = DIRECTION.DOWN;


            if (key.keyCode === 88) Pong.player3.move = DIRECTION.LEFT;

            if (key.keyCode === 90) Pong.player3.move = DIRECTION.RIGHT;

            if (key.keyCode === 80) Pong.player4.move = DIRECTION.LEFT;


            if (key.keyCode === 79) Pong.player4.move = DIRECTION.RIGHT;

            // Pause/unpause the game if the 't' key is pressed
            if (key.keyCode === 84) {
                Pong.paused = !Pong.paused; // Toggle pause state
            }
        });

        document.addEventListener('keyup', function (key) {
            // Stop the player from moving when there are no keys being pressed.
            Pong.player1.move = DIRECTION.IDLE;
            Pong.player2.move = DIRECTION.IDLE;
            Pong.player3.move = DIRECTION.IDLE;
            Pong.player4.move = DIRECTION.IDLE;
        });
    },

    // Reset the ball location, the player turns and set a delay before the next round begins.
    _resetTurn: function (victor, loser) {
        this.ball = Ball.new.call(this, this.canvas.width, this.canvas.height, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();


    },

    // Wait for a delay to have passed after each turn.
    _turnDelayIsOver: function () {
        return ((new Date()).getTime() - this.timer >= 1000);
    },

    // Select a random color as the background of each level/round.
    _generateRoundColor: function () {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return Pong._generateRoundColor();
        return newColor;
    },

    // Check for collisions between the ball and a player
    _checkBallCollision: function (player) {
        return (
            this.ball.x - this.ball.width <= player.x &&
            this.ball.x >= player.x - player.width &&
            this.ball.y <= player.y + player.height &&
            this.ball.y + this.ball.height >= player.y
        );
    },

    _checkBallCollision2: function (player) {
        return (
            this.ball.x + this.ball.width >= player.x &&
            this.ball.x <= player.x + player.width &&
            this.ball.y >= player.y - player.height &&
            this.ball.y - this.ball.height <= player.y
        );
    },

    _checkBallCollisionBorder: function (border) {
        return (
            this.ball.x - this.ball.width <= border.x + border.width &&
            this.ball.x >= border.x &&
            this.ball.y <= border.y + border.height &&
            this.ball.y + this.ball.height >= border.y
        );
    },


    _checkBallCollisionBorder2: function (border) {
        return (
            this.ball.x + this.ball.width >= border.x &&
            this.ball.x <= border.x + border.width &&
            this.ball.y >= border.y &&
            this.ball.y - this.ball.height <= border.y + border.height
        );
    }

};

// Initialize the game
const Pong = Object.create(Game);
Pong.initialize();
