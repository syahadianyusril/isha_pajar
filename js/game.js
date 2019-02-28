// declare movement var 
var left1, left2, right1, right2, super1, super2;
left1 = false;
right1 = false;
left2 = false;
right2 = false;
super1 = false;
super2 = false;

// declare character var
var myGamePiece1;
var myGamePiece2;

// declare limit var 
var myObstacle1;
var myObstacle2;

// declare player score
var count1 = 0;
var count2 = 0;

// declare sound component var
var myMusic;
var mySound1;
var mySound2;
var mySuper1;
var mySuper2;
var myPlayer1Win;
var myPlayer2Win;
var myDraw;

// declare game time var as timeLeft
var timeLeft = 10;
var elem = document.getElementById('jam');
var timerId = setInterval(countdown, 1000);

// start the game
function startGame() {
    // call myGameArea func
    myGameArea.start();

    // create all components and sound items
    myGamePiece1 = new component(300, 130, "image/kame.gif", 250, 125, "image");
    myGamePiece2 = new component(300, 130, "image/hame.gif", 550, 127, "image");
    myObstacle1 = new component(1, 300, "green", 0, 120); 
    myObstacle2 = new component(1, 300, "green", 1104, 120);
    myMusic = new sound("sound/match.mp3");
    myMusic.play(); 
    mySound1 = new sound("sound/hadouken.wav");
    mySound2 = new sound("sound/chunli.wav");
    mySuper1 = new sound("sound/super1.wav");
    mySuper2 = new sound("sound/super2.wav");
    myPlayer1Win = new sound("sound/player1.mp3");
    myPlayer2Win = new sound("sound/player2.mp3");
    myDraw = new sound("sound/draw.wav");
}

// function to start the game when "play button" clicked
function btnStart() {
    document.getElementById('ac-wrapper').style.display="none";
    startGame();
}

// create gamearea as canvas
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1105;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");

        // place the canvas inside id=container
        document.getElementById('container').appendChild(this.canvas)

        this.interval = setInterval(updateGameArea, 20);
        // add key event
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener("keyup", onKeyUp, false);
    },
    // clear the canvas 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // stop the func
    stop : function() {
        clearInterval(this.interval);
    }
}

// create func to call image to the components 
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;
        }
        return crash;
    }
}
// create supepower function condition
function superPower() {
    if (count1 == 29) {
        // superPower();
        count1 += 1
        // console.log("Jalankan berapa kali")
        document.getElementById("super1").innerHTML="Active! Press A";
    }
    if (count2 == 29) {
        // superPower();
        count2 += 1
        // console.log("Jalankan berapa kali")
        document.getElementById("super2").innerHTML="Active! Press =>"
    }
    
};

// create func to update game area
function updateGameArea() {
    myGameArea.clear();
    myGamePiece1.speedX = 0;
    myGamePiece2.speedX = 0;
    myGamePiece1.speedY = 0;    
    myGamePiece2.speedY = 0;

    // create condition when the key pressed    
    if (myGameArea.key && myGameArea.key == 37 && !left1) {myGamePiece1.speedX = -20; left1 = true; count2++; mySound1.play()
    }
    if (myGameArea.key && myGameArea.key == 68 && !right1) {myGamePiece1.speedX = 20; right1 = true; count1++; mySound2.play()
    }
    if (myGameArea.key && myGameArea.key == 37 && !left2) {myGamePiece2.speedX = -20; left2 = true}
    if (myGameArea.key && myGameArea.key == 68 && !right2) {myGamePiece2.speedX = 20; right2 = true}

    //create condition when the key pressed and the score is equal/above 30
    if (count1 >= 30) {
        if (myGameArea.key && myGameArea.key == 65 && !super1) {myGamePiece1.speedX = 150; super1 = true; count1++; myGamePiece2.speedX = 150; document.getElementById("super1").innerHTML="Chi Depleted";mySuper1.play()}
    }
    if (count2 >= 30) {
        if (myGameArea.key && myGameArea.key == 39 && !super2) {myGamePiece2.speedX = -150; super2 = true; count2++; myGamePiece1.speedX = -150; document.getElementById("super2").innerHTML="Chi Depleted";mySuper2.play()}
    }

    // get element id to replace the html value
    document.getElementById("score1").innerHTML=count1;
    document.getElementById("score2").innerHTML=count2;

    // create condition when the character hit the limit
    //if player 1 hit te limit, player 2 wins
    if (myGamePiece1.crashWith(myObstacle1)) {
        myPlayer2Win.play()
        alert("PLAYER 2 WIN")
        myGameArea.stop(); window.location.reload(false); 
    }     

    //if player 2 hit te limit, player 1 wins
    else if (myGamePiece2.crashWith(myObstacle2)) {
        myPlayer1Win.play()
        alert("PLAYER 1 WIN")
        myGameArea.stop(); window.location.reload(false); 
    }
    // --
    else {
        myGameArea.clear();
        myGamePiece1.newPos();    
        myGamePiece2.newPos();    
        myGamePiece1.update();
        myGamePiece2.update();
        myObstacle1.update();
        myObstacle2.update();
    
    // call the func so it can trigger the value on superpower func
    superPower();}
}

// create func to reject second keypress to superpower key
function onKeyUp(event) {
    if (event.keyCode == "37") {
      left1 = false;
    }
    if (event.keyCode == "68") {
      right1 = false;
    }
    if (event.keyCode == "37") {
      left2 = false;
    }
    if (event.keyCode == "68") {
      right2 = false;
    }
}

// create sound func to call the sound components
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

// create game time func
function countdown() {
    updateGameArea();
    // create the condition when the time is 0
    if (timeLeft == 0) {
      clearTimeout(timerId);
        // condition
        if (count1 > count2) {
            myPlayer1Win.play()
            alert("PLAYER 1 WIN")
            myGameArea.stop(); window.location.reload(false); 
        }
        else if (count2 > count1) {
            myPlayer2Win.play()
            alert("PLAYER 2 WIN")
            myGameArea.stop(); window.location.reload(false); 
        }
        else if (count2 == count1) {
            myDraw.play()
            alert("MATCH DRAW")
            myGameArea.stop(); window.location.reload(false); 
        }
    } else {
      elem.innerHTML = timeLeft;
      timeLeft--;
    }
  }