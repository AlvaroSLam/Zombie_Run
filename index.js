/*
Player Color: #4a823e
color enemies: #bf1313

*/

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d")
canvas.style.border = '2px solid black';

//SET OF VARIABLES

let score; //0
let scoreText;
let highscore; // 0
let highscoreText;
let player;
let gravity; //1
let enemies = [];
let gameSpeed; //3
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
    this.originalHeight = height; //Only for shrinking the character
    this.grounded = false;
    this.jumpTimer = 0; //salto de supermario
  }

  animation() {

    //JUMP MECHANICS DEL PLAYER
    //Para saltar más alto
    if (keys["Space"]) { //Quitar la tecla W
      console.log("Jumping");
      this.jump();
    } else {
        this.jumpTimer = 0; //Para saltar más alto o más bajo
      }

      //Para agacharnos
      if (keys['KeyS']) {
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

  
  draw(){ //CREA EL JUGADOR
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }  
}


//ENEMIES
class Enemy {
  constructor (x, y, width, height, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;

    this.dirX = -gameSpeed;
  }

  update() {
    this.x += this.dirX;
    this.draw();
    this.dirX = -gameSpeed;
  }

  draw() { //Crea el enemigo
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }
}


//SCORE
class Statistics {
  constructor(text, x, y, alignment, colour, size) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.alignment = alignment;
    this.colour = colour;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.font = this.size +"px sans-serif";
    ctx.textAlign = this.alignment
    ctx.fillText(this.text, this.x, this.y);
    ctx.closePath();
  }
}


//ALL FUNCTIONS
function createEnemies(){ //CREATE ENEMIES WITH RANDOM SIZE
  let size = randomRange(20, 70) // Function debajo, el player es 50x50
  let type = randomRange(0, 1); //Dos tipos de enemigos
  let enemy = new Enemy(canvas.width + size, canvas.height - size, size, size, '#bf1313');

  if (type == 1) {
    enemy.y -= player.originalHeight - 10; //Para hacerlo un poco más alto que el jugador
  }
  enemies.push(enemy);
}



function randomRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//INITIALIZE THE GAME

function startGame(){
  //canvas.width = window.innerWidth; //con estas lineas las puedo hacer pantalla completa, recordar quitar
  //canvas.height = window.innerHeight;

  //CARACTERÍSTICAS BÁSICAS

  ctx.font = "20px sans-serif"; //Probar a ponerlo en Global
  gameSpeed = 3; 
  gravity = 1; 
  score = 0; 
  highscore = 0; 

  //DATOS DEL JUGADOR
  player = new Player(25, canvas.height - 900, 50, 50, "#4a823e " );

  //DATOS DE LOS STATISTICS
  scoreText = new Statistics("Score: " + score, 25, 25, "left", "#000000")




  requestAnimationFrame(update)
  
}

//Timer enemies
let initialSpawnTimer = 200;
let spawnTimer = 100;


function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height) //Clear the canvas every time, si no todo se quedará

  //SPAWING ENEMIES
spawnTimer--;
if (spawnTimer <= 0) {
  createEnemies();
  spawnTimer = initialSpawnTimer - gameSpeed * 8; //for comming

  if (spawnTimer < 60) {
    spawnTimer = 60;
  }
}

//CREACIÓN DE ENEMIGOS
for (let i = 0; i < enemies.length; i ++) { 
  let e = enemies[i];

  //COLLISION SYSTEM
  //IMPORTANTE!! Eliminar los enemigos que salgan de la pantalla
  if (e.x + e.width < 0) {
    enemies.splice(i, 1);
  }

  //COLLISION
  if (
    player.x < e.x + e.width && 
    player.x + player.width > e.x &&
    player.y < e.y + e.height &&
    player.y + player.height > e.y
    ){
      //INCLUIR AQUI EL GAME OVER
      alert("GAME OVER");
      enemies = []; //Resetear enemigos
      score = 0; //Resetear el score
      spawnTimer = initialSpawnTimer; //Velocidad original
      gameSpeed = 3; //La velocidad original
      

  }

  e.update()
}

  player.animation();

  gameSpeed += 0.003; // Increase every frame hasta llegar a 60 del spawnTimer

  score ++;
  scoreText.text = "Score: " + score;
  scoreText.draw();
  
}

startGame();




