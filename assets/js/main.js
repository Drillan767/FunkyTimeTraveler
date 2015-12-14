var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var edgeRight = canvas.width;
var edgeBottom = canvas.height;
var ground = edgeBottom - 40;
var velocityXSpeed = 8.0;

var pause = false;
var positionX = 100.0;
var positionY = ground;
var velocityX = 0.0;
var velocityY = 0.0;
var gravity = 0.5;
var onGround = false;
var heroImg = new Image();
heroImg.src = './assets/img/hero/main.gif';
var pausePic = '';

window.addEventListener("keydown", StartJump, false);
window.addEventListener("keyup", EndJump, false);

Animate();

function StartJump(keypressed)
{
    // console.log(keypressed);
    switch(keypressed.keyCode)
    {
        case 39: case 68: /* Right arrow or d */
        heroImg.src = './assets/img/hero/walkLeft.gif';
        velocityX = velocityXSpeed;
        break;
        case 37: case 81: /* Left arrow or q */
        heroImg.src = './assets/img/hero/walkLeft.gif';
        velocityX = -velocityXSpeed;
        break;
        case 65: /* a / run / fire */
        break;
        case 40: case 83: /* Down arrow or s */
        break;
        case 38: case 90: /* Up arrow or z */
        if(onGround)
        {
            velocityY = -12.0;
            onGround = false;
        }
        break;
        case 80: /* p : PAUSE */
        if (pause) {
            pause = false;
            heroImg.src = pausePic;
        } else {
            pause = true;
            pausePic = heroImg.src;
            heroImg.src = './assets/img/hero/main.gif';
        }
        break;
        case 13: /* Enter */
        break;
    }
}

function EndJump(keypressed)
{
    switch(keypressed.keyCode)
    {
        case 39: case 68: /* Right arrow or d */
        if(onGround)
        {
            heroImg.src = './assets/img/hero/main.gif';
            velocityX = 0.0;
        }
        break;
        case 37: case 81: /* Left arrow or q */
        if(onGround)
        {
            heroImg.src = './assets/img/hero/main.gif';
            velocityX = 0.0;
        }
        break;
        case 65: /* a / run / fire */
        break;
        case 40: case 83: /* Down arrow or s */
        break;
        case 38: case 90: /* Up arrow or z */
        if(velocityY < -6.0)
            velocityY = -6.0;
        break;
        case 13: /* Enter */
        break;
    }
    
}

function Animate()
{
    if (!pause) {
        Update();
    }
    Render();
    window.setTimeout(Animate, 33);
}

function Update()
{
    // Hurt the left or right edges
    if(positionX + velocityX <= 0 || positionX + velocityX >= (edgeRight - heroImg.width)) {

    } else {
        velocityY += gravity;
        positionY += velocityY;
        positionX += velocityX;
    }

    // Hurt the ground
    if(positionY > ground)
    {
        positionY = ground;
        velocityY = 0.0;
        if(!onGround) {
            heroImg.src = './assets/img/hero/main.gif';
            velocityX = 0.0;
            onGround = true;
        }
    }
}

function Render()
{
    ctx.clearRect(0, 0, edgeRight, edgeBottom);
    ctx.beginPath();
    ctx.moveTo(0,ground);
    ctx.lineTo(edgeRight, ground);
    ctx.stroke();
    ctx.drawImage(heroImg, positionX, positionY - heroImg.height);
}