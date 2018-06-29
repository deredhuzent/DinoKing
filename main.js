//canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
//constants
var interval;
var frames = 0;
var images = {
    tero1: "./images/teroup-pixilart.png",
    tero2: "./images/terodown-pixilart (2).png",
    enem1: "./images/TeroEnemUp.png", 
    enem2: "./images/TeroEnemDown.png",
    enem3: "./images/TeroEnem2Up.png",
    enem4: "./images/TeroEnem2Down.png",
    pipeTop: './images/cloud1.png',
    pipeBottom: './images/cloud2.png',
    bg: './images/backg.png',
    bgCloud: './images/cloudsBckg.png',
    fire: './images/Fireball.png',
    muerte: ""
}

var grito = new Audio();
grito.src = "./sounds/zapsplat_animals_birds_cockatoo_squawk_slight_distance_17619.mp3";
var sound = new Audio();
sound.src = "./sounds/y2mate.com - spyro_the_dragon_artisans_home_mp3_LDgkZ2vqYpo.mp3";
sound.loop = true;
sound.currentTime = 0
var pipes = [];
var jerks = [];

//class
class Board{
    constructor(m, s){
        this.x = 0;
        this.y = 0;
        this.speed = s;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image();
        this.image.src = m;
        this.image.onload = function(){
            this.draw();
        }.bind(this)
    }

    gameOver(){
        ctx.font = "80px Avenir";
        ctx.fillText("Game Over", 20,100);
        ctx.font = "20px Serif";
        ctx.fillStyle = 'peru';
        ctx.fillText("Press 'Esc' to reset", 20,150);
    }

    draw(){
        this.x -= this.speed;  //this.x--;
        // console.log(this.s);
        if(this.x === -this.width) this.x = 0;
        ctx.drawImage(this.image, this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image, this.x + this.width,this.y,this.width,this.height);
        ctx.fillStyle = "white";
        ctx.font = '50px Avenir';
        ctx.fillText(Math.floor(frames / 60), this.width -100, 50 )
        
    }
}

class Flappy{
    constructor(){
        this.which = true;
        this.width = 32;
        this.height = 25;
        this.x = 50;
        this.y = 100;
        
        this.image1 = new Image();
        this.image1.src = images.tero1;
        this.image2 = new Image();
        this.image2.src = images.tero2;
        
        this.gravity = 1.5;
        this.draw = function(){
            this.y+=this.gravity;
            var img = this.which ? this.image1:this.image2;
            ctx.drawImage(img,this.x,this.y,this.width,this.height);
            if(frames%10===0) this.toggleWhich();
        }

        this.drawDeath = function() {
            var img = this.which ? this.image1:this.image2;
            ctx.drawImage(img,this.x,this.y,this.width,this.height);

        }
  
        this.toggleWhich = function(){
            this.which = !this.which;
        }      
    }

    rise(){
        this.y-=25;
        
    }

    isTouching(item){
        return  (this.x < item.x + item.width) &&
                (this.x + this.width > item.x) &&
                (this.y < item.y + item.height) &&
                (this.y + this.height > item.y);
      }
    
}


class Enemy{
    constructor(){
        this.which = true;
        this.width = 50;
        this.height = 40;
        this.x = 512;
        this.y = Math.floor((Math.random() *canvas.height -this.height )) + (this.width/2);
        this.image1 = new Image();
        this.image1.src = images.enem1;
        this.image2 = new Image();
        this.image2.src = images.enem2;
        this.bullets = [];
        
        
        this.draw = function(){
            // this.y+=this.gravity;
            var img = this.which ? this.image1:this.image2;
            ctx.drawImage(img,this.x,this.y,this.width,this.height);
            if(frames%15===0) this.toggleWhich();
        }
  
        this.toggleWhich = function(){
            this.which = !this.which;
        }

        this.shootNrunAway = function(){
            this.x-=5;
        }
    }
}

class Bullet {
    constructor(character) {
      this.width = 20;
      this.height = 20;
      this.x = character.x + (character.width/2) - (this.width / 2);
      console.log(character.x);
      this.y = character.y //- this.height;
      console.log(character.y);
      console.log(this.height );
      console.log(this.y);
      this.vX = -10;
      this.imagee = new Image();
      this.imagee.src = images.fire;
      this.imagee.onload = function(){
        this.draw();
      }.bind(this);
    }

    draw() {
      this.x += this.vX;
      
      ctx.drawImage(this.imagee,this.x,this.y, this.width, this.height)
    }

    
  }
  

//instances
var board = new Board(images.bg, 1);
var cloud = new Board(images.bgCloud, 2);
var flappy = new Flappy();



//mainFunctions
function update(){
    frames++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    board.draw();
    cloud.draw();
    generateFlyingEnemy();
    drawEnemies();
    flappy.draw();
    if(flappy.y >= 235){
        finishHim();}
        
}

function start(){
    if(interval) return;
    interval = setInterval(update, 1000/60);
    sound.play();
}

//aux functions

function generateBullet(enemy) {
    var bullet = new Bullet(enemy);
    enemy.bullets.push(bullet);
    console.log(enemy.bullets);
  }
  
  function drawBullets(enemy) {
    enemy.bullets.forEach(function(b){
      b.draw();
      if(flappy.isTouching(b)){
        finishHim();
    }
      
    })
  }


function generateFlyingEnemy(){
    if(!(frames%150===0) ) return;
    //var y = Math.floor((Math.random() *canvas.height * .7 )  /* +enemy.height*/ ); //var height = Math.floor((Math.random() *canvas.height * .6 ) + 30 );
    var enemG = new Enemy();
    pipes.push(enemG);

    var enemJ = new Enemy();
    enemJ.image1.src = images.enem3;
    enemJ.image2 .src = images.enem4;
    enemJ.x = canvas.width - 60;
    jerks.push(enemJ);
    generateBullet(enemG);
    generateBullet(enemJ);
    
}



function drawEnemies(){
    pipes.forEach(function(enemG){
        enemG.draw(); 
        
        
        enemG.shootNrunAway();
        if(flappy.isTouching(enemG)){
            finishHim();
        }
        
        drawBullets(enemG);
    });
    jerks.forEach(function(enemJ){
        enemJ.draw();
        drawBullets(enemJ);
    })  
}


function finishHim(){
    clearInterval(interval);
    interval = undefined;
    board.gameOver();
    cloud.gameOver();
    grito.play();
    sound.pause();
    sound.currentTime = 0;
}

function restart(){
    if(interval) return;
    pipes = [];
    jerks = [];
    frames = 0;
    flappy.x = 50;
    flappy.y = 100;
    start();
}

//listeners
// addEventListener('keydown', function(e){
//     if(e.keyCode === 66 || e.keyCode === 32 || e.keyCode === 38){
//         flappy.rise();
//         sound.play();
//     }else if(e.keyCode === 27){
//         restart();
//     }
// })



addEventListener('keydown', function(e){
    switch(e.keyCode) {
    case 32:
    sound.play();
    if(flappy.y <= 20) return;
    // console.log(flappy.y);
    flappy.y-=25;
    break;

    case 27:
    restart();
    break;
}})

/*addEventListener('keydown', function(e){
  switch(e.keyCode) {
    case 37:
    if(mario.x ===0) return;
    mario.x-=64;
    // mario.x-=64;
    break;
    case 39:
    if(mario.x === canvas.width - mario.width) return;
    mario.x+=64;
    break;
    case 32:
    generateBullet();
  }
})
*/

start();