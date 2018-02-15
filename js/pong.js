// ASSIGN ANIMATE TO winnowd.requestAnimationFrame
// We also assign a call back after the (||) or operator for better brower compatibility.
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||

function (callback) {
  window.setTimeout(callback, 1000 / 60);
};


















// ASSIGNING VARIABLES FOR OUR CANVAS: AS WELL AS ASSIGNING THOSE VALUES CREATE AND TO SET HEIGHT AND WIDTH
// Now in order to perform rendering we’ll need to setup a canvas and grab its 2d context:

var canvas = document.createElement("canvas");  // now calling canvas is the same as creating a element "canvas"
var width = 400; // creating variables that will house our width and height
var height = 600; //
canvas.width = width; // now we have
canvas.height = height; // same for my height
var context = canvas.getContext('2d');
























// ASSIGNING VARIABLES FOR OUR ACTUALL GAME


var player = new Player(); // Player is created
var computer = new Computer(); //computer is created
var ball = new Ball(200, 300); //ball is created and given two values to dictate the position it's created at










var keysDown = {}; // We are going to store a object that hold the keys that are being pressed during the game.













// set the variable render to a function that will
var render = function () {
  context.fillStyle = "black"; //set the contents color
  context.fillRect(0, 0, width, height); // create a fill in rectangle within our canvas area.
  player.render(); // we use the render method on plater to see it appear within the canvas. Without the player render nothing will apprear within the canvas
  computer.render(); //renders the computers paddels
  ball.render(); //renders the ball
};








// creating the update variable
// update will update each position of the player,computer, and the ball at the same time when its called

var update = function () {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};











// creating the step variable
//this variable will call update on all the objects posito
//then it will render (display for the user)
//then it will use the animate(step) callback function to basically
//
var step = function () {
  update();
  render();
  animate(step);
};
















/////////////////////////////////////////////////////////////////////
///// PADDlES!
////////////////////////////////////////////////////////////////////

// LEts create the paddle objects so they can render on screen
function Paddle(x, y, width, height) { // We give it a x ,y position then a width and a height
 //We'll use "this" to assign x to the position x within the paddle function
  this.x = x;
  this.y = y;
  // We'll use the same method thoughout
  this.width = width;
  this.height = height;
  //Here we set the paddles x and y speed
  this.x_speed = 0;
  this.y_speed = 0;
}








// Next we are going to create a prototype for Paddle
// so to my understanding we can create a render method that will be a prototype of paddle so when we make new paddles they can all use the .render function.
Paddle.prototype.render = function () {
    context.fillStyle = "white"; //When this renders fill the content with the color white
    context.fillRect(this.x, this.y, this.width, this.height); //this will call the fillRect method and pass it some parameters... in this case paddle.x paddle.y paddle.width and paddle.height
};







// then we move to the next section... Prototyping the Paddle the




// we want to set the .move function to be a prototype of Paddle so any new Paddle that we create will have access to these methods without actually having to store the information within the object itself
Paddle.prototype.move = function (x, y) { //When we call the move function we will pass


  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if (this.x < 0) {
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) {
    this.x = 400 - this.width;
    this.x_speed = 0;
    }
};


// Here we are using a function to create a new object from Paddle and giving it its position to load on the screen
//
function Computer() {
  this.paddle = new Paddle(175, 10, 50, 10);
}


Computer.prototype.render = function () {
    this.paddle.render();
  };






//  Computers AI
//
//
Computer.prototype.update = function (ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);


    if (diff < 0 && diff < -4) {
      diff = -5;
    } else if (diff > 0 && diff > 4) {
      diff = 5;
    }

    this.paddle.move(diff, 0);

    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
        this.paddle.x = 400 - this.paddle.width;
    }
  };
  function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
  }

  Player.prototype.render = function () {
    this.paddle.render();
  };

  Player.prototype.update = function () {
    for (var key in keysDown) {
      var value = Number(key);
      if (value == 37) {
        this.paddle.move(-4, 0);
      } else if (value == 39) {
        this.paddle.move(4, 0);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fillStyle = "red";
    context.fill();
};








//  Collision with the ball




Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 400) {
        this.x = 395;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0 || this.y > 600) {
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 200;
        this.y = 300;
    }

    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

//This is calling on document and with document finding body using append child and pasing in our parameter of canvas, then we call the animate functiok
document.body.appendChild(canvas);
animate(step);

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
//
