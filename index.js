/*
Player Color: #FF5858

*/

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d")

//SET OF VARIABLES

let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

//EVENT LISTENERS
document.addEventListener("keydown", function (even) {
  keys[even.code] = true;
});

document.addEventListener("keyup", function (even){
  keys[even.code] = false;
})

// X AXIS, Y AXIS, WIDTH, HEIGHT, COLOUR, DIRECTION Y FORECE
class Player {
  constructor (x, y, width, height, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.dirY = 0; //Maybe I could also use it for the jumping velocity
    this.jumpForce = 15; //remeber to check
    this.originalHeight = height;
    this.jumpTimer = 0;
  }

  animation() {

    //JUMP MECHANICS
    //Para saltar más alto
    if (keys["Space"] || keys["KeyW"]) { //Quitar la tecla W
      console.log("Jumping");
      this.jump();
    } else {
        this.jumpTimer = 0; //Para saltar más alto o más bajo
      }

      //Para agacharnos
      if (keys['ShiftLeft'] || keys['KeyS']) {
        this.height = this.originalHeight / 2;
      } else {
        this.height = this.originalHeight;
      }
    
      this.y += this.dirY;

    //GRAVITY SISTEM. StackOverFlow
    if (this.y + this.height < canvas.height) {
      this.dirY += gravity;
      this.grounded = false;
    } else {
      this.dirY = 0;
      this.grounded = true;
      this.y = canvas.height - this.height;
    }  

    this.draw()
  }

  //JUMP MECHANICS
  jump() {
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.dirY = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {       
        this.jumpTimer++;
        this.dirY = -this.jumpForce - (this.jumpTimer /50);
      }
    }

  


  draw(){
    ctx.beginPath();
    ctx.fillStyle = this.colour
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.closePath();
  }
  
}

class Obstacles {
  constructor (x, y, width, height, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;

    this.dirX = -gameSpeed;
  }

  update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw () {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}


//ALL FUNCTIONS
function createEnemies(){ //RANDOM SIZE
  let size = randomRange(20, 70) // Function
  console.log(size)
  let type = RandomIntInRange(0, 1);
  let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');

  if (type == 1) {
    obstacle.y -= player.originalHeight - 10;
  }
  obstacles.push(obstacle);
}

function randomRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//INITIALIZE THE GAME

function startGame(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.font = "20px sans-serif"; //Probar a ponerlo en Global
  gameSpeed = 3; //Probar a ponerlo directamente en las variables de arriba
  gravity = 1; //Probar a ponerlo directamente en las variables de arriba
  score = 0; //Probar a ponerlo directamente en las variables de arriba
  highscore = 0; //Probar a ponerlo directamente en las variables de arriba

  player = new Player(25, canvas.height - 900, 50, 50, "#FF5858" )
  //AQUI ESTÁN LOS DATOS DEL JUGADOR, PROBAR A PONERLOS EN VARIABLE
  requestAnimationFrame(update)
  
}

function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height) //Clear the canvas every time, si no todo se quedará

  player.animation();
  
}

startGame();




