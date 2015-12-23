$(document).ready(function() {

  var Qplayer = null;
  var Qenemy = null;
  var Qtower = null;
  var QEnemyScale = 0.2;
  var isPaused = false;
  var maxEnemyType = 2;
  var win = false;
  var score = 0;
  var level = 1;
  var maxLevel = 5;
  var startTime = 10000;
  var maxTime = 30000;
  var period = null;

  var winLabel = 'Vainqueur !';
  var loseLabel = 'Game Over';

  var createHack = false;
  if ($('body').attr('data-hacked') != null) {
    createHack = true;
  }

  var isMuted = false;
  if ($('body').attr('data-sound') == 'off') {
    isMuted = true;
  }
  $(document).on('click', '#mute', function() {
    if (!isMuted) {
      $(this).attr('src', '../assets/img/sound_off.png');
      $('#audio_level > audio').each(function() {
        $(this)[0].pause();
      })
      isMuted = true;
      $.ajax({
        url: "../controller/soundController.php",
        method: "POST",
        data: {
          sound: 'off'
        }
      });
    } else {
      $(this).attr('src', '../assets/img/sound_on.png');
      $('#audio_level .active')[0].play();
      isMuted = false;
      $.ajax({
        url: "../controller/soundController.php",
        method: "POST",
        data: {
          sound: 'on'
        }
      });
    }
    $('canvas').focus();
  })

  // Timer
  var chrono = new (function() {
    // Stopwatch element on the page
    var $countdown = $('#timer .display');
    // Timer speed in milliseconds
    var incrementTime = 50;
    // Current timer position in milliseconds
    var currentTime = 10000; // 10s

    $(function() {
      // Setup the timer
      chrono.Timer = $.timer(updateTimer, incrementTime, true);
    });

    function updateTimer() {
      // If timer is complete, trigger alert
      if (currentTime <= 0 && Qplayer != null && Qplayer.isAlive) {
        chrono.Timer.stop();
        win = false;
        $('#timer #progress').css('width', '0%');
        currentTime = 0;
        $countdown.html(formatTime(currentTime));
        Q.stageScene("endGame",1, { label: loseLabel });
      } else if (currentTime >= maxTime) {
        win = true;
        $('#timer #progress').css('width', '100%');
        currentTime = maxTime;
        // Output timer position
        $countdown.html(formatTime(currentTime));
        Q.stageScene("endGame",1, { label: winLabel });
      } else if (currentTime <= 0) { // Decrement timer position
        currentTime = 0;
      } else {
        // Output timer position
        $countdown.html(formatTime(currentTime));
        currentTime -= incrementTime;
        $('#timer #progress').css('width', (currentTime/maxTime*100)+'%');
      }
    }

    this.resetCountdown = function() {
      currentTime = startTime;
      chrono.Timer.stop().once();
    };

    this.decTime = function(milliseconds){
      currentTime -= milliseconds;
    };

    this.incTime = function(milliseconds){
      currentTime += milliseconds;
    }

    this.getCurrentTime = function(){
      return currentTime;
    }
  });


function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {str = '0' + str;}
  return str;
}

function formatTime(time) {
  time = time / 10;
  var min = parseInt(time / 6000),
  sec = parseInt(time / 100) - (min * 60),
  hundredths = pad(time - (sec * 100) - (min * 6000), 2);
  return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}

window.addEventListener("load",function() {
  // Set up an instance of the Quintus engine  and include
  // the Sprites, Scenes, Input and 2D module. The 2D module
  // includes the `TileLayer` class as well as the `2d` componet.
  var Q = window.Q = Quintus({
    imagePath: "./../assets/img/",
    audioPath: "./../assets/audio/",
    dataPath:  "./../assets/json/"
  })
  .include("Sprites, Scenes, Input, 2D, Touch, Anim, UI")
  .setup({
    width: 1024,
    height: 600,
    // scaleToFit: true
  })
  .controls() // And turn on default input controls and touch input (for UI)
  .touch();

  Q.input.touchControls({
    controls: [
    ['left','<' ],
    ['right','>' ],
    [],
    ['action','^'],
    ['p', 'p' ]]
  });

  Q.animations('player', {
    run_left: { frames: [4,5,6,7,8], next: 'stand_left', rate: 1/20},
    run_right: { frames: [4,5,6,7,8], next: 'stand_right', rate: 1/20},
    stand_left: { frames: [0,1,2,3,4], rate: 1/10},
    stand_right: { frames: [0,1,2,3,4], rate: 1/10},
    jump: { frames: [9], loop:false, rate: 1/10},
  });

  // ## Player Sprite
  // The very basic player sprite, this is just a normal sprite
  // using the player sprite sheet with default controls added to it.
  Q.Sprite.extend("Player",{
    isAlive: true,
    // the init constructor is called on creation
    init: function(p) {
      // You can call the parent's constructor with this._super(..)
      this._super(p, {
        sheet: "player:"+p,  // Setting a sprite sheet sets sprite width and height
        sprite: "player",   // Animationsheet
        x: 400,            // You can also set additional properties that can
        y: 100,           // be overridden on object creation
        scale: 0.2,      // scale sprite to right size
        jumpSpeed: -450
      });

      // Add in pre-made components to get up and running quickly
      // The `2d` component adds in default 2d collision detection
      // and kinetics (velocity, gravity)
      // The `platformerControls` makes the player controllable by the
      // default input actions (left, right to move,  up or action to jump)
      // It also checks to make sure the player is on a horizontal surface before
      // letting them jump.
      this.add("2d, platformerControls, animation");

      // Write event handlers to respond hook into behaviors.
      // hit.sprite is called everytime the player collides with a sprite
      this.on("hit.sprite",function(collision) {
        // Check the collision, if it's the Tower, you win!
        if(collision.obj.isA("Tower")) {
          win = true;
          Q.stageScene("endGame",1, { label: winLabel }); 
          Qtower.destroyTower();
          this.destroy();
        }
      });
    }, step: function(p) {
      if(Q.inputs['up']) {
        $('#audio_fx #jump')[0].play();
        this.play("jump",1);
      } else if(this.p.vx > 0) {
        this.p.flip="";
        this.play("run_right");
      } else if(this.p.vx < 0) {
        this.p.flip="x";
        this.play("run_left");
      }
      else {
        this.play("stand_" + this.p.direction);
      }
    }, diePlayer: function() {
      this.destroy();
      this.isAlive = false;
    }
  });

  // ## Tower Sprite
  // Sprites can be simple, the Tower sprite just sets a custom sprite sheet
  Q.Sprite.extend("Tower", {
    init: function(p) {
      this._super(p, {
        sheet: 'tardis',
        scale: 0.2
      });
    }, destroyTower: function() {
      this.destroy();
    }
  });

  // ## Enemy Sprite
  // Create the Enemy class to add in some baddies
  Q.Sprite.extend("Enemy",{
    init: function(p) {
      this._super(p, {
        sheet: 'enemy:'+period+randomBetween(1, maxEnemyType),
        scale: QEnemyScale,
        vx: 100
      });

      // Enemies use the Bounce AI to change direction 
      // whenver they run into something.
      this.add('2d, aiBounce');

      // Listen for a sprite collision, if it's the player,
      // end the game unless the enemy is hit on top
      this.on("bump.left,bump.right",function(collision) {
        if(collision.obj.isA("Player")) {
          $('#audio_fx #getHit')[0].play();
          chrono.decTime(2000)
          if (score >= 5) {
            score -= 5;
            $('#score .display').html(score);
          }
          
          // Q.stageScene("endGame",1, { label: loseLabel }); 
          // collision.obj.destroy();
          // chrono.Timer.toggle();
        }
      });

      // If the enemy gets hit on the top, destroy it
      // and give the user a "hop"
      this.on("bump.top",function(collision) {
        if(collision.obj.isA("Player")) {
          $('#audio_fx #hitEnemy')[0].play();
          this.destroy();
          collision.obj.p.vy = -300;
          chrono.incTime(4000);
          score += 10;
          $('#score .display').html(score);
          Qenemy.addEnemy();
        }
      });
    }, step: function(p) {
      if(this.p.vx > 0) {
        this.p.flip="";
      } else if(this.p.vx < 0) {
        this.p.flip="x";
      }
    }, addEnemy : function(p){
      Q.stage().insert(new Q.Enemy({ x: randomBetween(100, 900), y: 0 }));
    }
  });

  // ## Level1 scene
  // Create a new scene called level 1
  Q.scene("level1",function(stage) {
    period = 'prehistory';
    // Play audio ambiance
    if (!isMuted) {
      $('#'+period+'_audio')[0].play();
    }
    $('#'+period+'_audio').addClass('active');

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level.json',
      sheet:     'empty_tile'
    }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    // stage.add("viewport").follow(player);

    // Add in a couple of enemies
    QEnemyScale = 0.37;
    Qenemy = stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 600, y: 0 }));
    stage.insert(new Q.Enemy({ x: 900, y: 0 }));

    // Finally add in the tower goal
    if (createHack) {
      Qtower = stage.insert(new Q.Tower({ x: 50, y: 455 }));
    }
  });

Q.scene("level2",function(stage) {
  period = 'middle_age';
    // Play audio ambiance
    if (!isMuted) {
      $('#'+period+'_audio')[0].play();
    }
    $('#'+period+'_audio').addClass('active');

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level.json',
      sheet:     'empty_tile'
    }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Add in a couple of enemies
    QEnemyScale = 0.4;
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));

    // Finally add in the tower goal
    if (createHack) {
      Qtower = stage.insert(new Q.Tower({ x: 50, y: 455 }));
    }
  });

Q.scene("level3",function(stage) {
  period = 'renaissance';
    // Play audio ambiance
    if (!isMuted) {
      $('#'+period+'_audio')[0].play();
    }
    $('#'+period+'_audio').addClass('active');

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level.json',
      sheet:     'empty_tile'
    }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Add in a couple of enemies
    QEnemyScale = 1.6;
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));

    // Finally add in the tower goal
    if (createHack) {
      Qtower = stage.insert(new Q.Tower({ x: 50, y: 455 }));
    }
  });

Q.scene("level4",function(stage) {
  period = "80s";
    // Play audio ambiance
    if (!isMuted) {
      $('#'+period+'_audio')[0].play();
    }
    $('#'+period+'_audio').addClass('active');

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level.json',
      sheet:     'empty_tile'
    }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Add in a couple of enemies
    QEnemyScale = 0.3;
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));

    // Finally add in the tower goal
    if (createHack) {
      Qtower = stage.insert(new Q.Tower({ x: 50, y: 455 }));
    }
  });

Q.scene("level5",function(stage) {
  period = 'futur';
    // Play audio ambiance
    if (!isMuted) {
      $('#'+period+'_audio')[0].play();
    }
    $('#'+period+'_audio').addClass('active');

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
      dataAsset: 'level.json',
      sheet:     'empty_tile'
    }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Add in a couple of enemies
    QEnemyScale = 0.3;
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));
    stage.insert(new Q.Enemy({ x: 600, y: 0 }));


    // Finally add in the tower goal
    if (createHack) {
      Qtower = stage.insert(new Q.Tower({ x: 50, y: 455 }));
    }
  });

  // To display a game over / game won popup box, 
  // create a endGame scene that takes in a `label` option
  // to control the displayed message.
  Q.scene('endGame',function(stage) {
    chrono.Timer.toggle();
    $('#score .display').html(score);

    var container = stage.insert(new Q.UI.Container({
      x: Q.width/2,
      y: Q.height/2,
      fill: "rgb(0,0,0)",
      radius: 0
    }));

    var actual_level = level;
    var restartLabel = '';
    if (level >= maxLevel) {
      $('#audio_fx #loose')[0].play();
      restartLabel = 'Recommencer le jeu';
      level = 1;
      win = false;

      if (stage.options.label == winLabel) {
        var player_name = prompt("Jeu terminé !\nEntrez votre pseudo pour rentrer dans le classement", "");
        if (player_name != null) {
          $.ajax({
            url: "../controller/scoreController.php",
            method: "POST",
            data: {
              name: player_name,
              score: score,
              time: chrono.getCurrentTime
            }
          }).success(function(msg) {
            // console.log(msg);
          });
        }
      }
    } else if (win) {
      $('#audio_fx #nextLevel')[0].play();
      restartLabel = 'Niveau suivant';
      level++;
      win = false;
      $('#audio_level > audio').removeClass('active');
    } else {
      $('#audio_fx #loose')[0].play();
      restartLabel = 'Recommencer le niveau';
    }
    Qplayer.diePlayer();

    var restartButton = container.insert(new Q.UI.Button({
      x: 0,
      y: 25,
      fill: "#CCCCCC",
      label: restartLabel,
      family: "dos"
    }))
    
    var label = container.insert(new Q.UI.Text({
      x: 4,
      y: -20 - restartButton.p.h, 
      label: stage.options.label+'\nNiveau : '+actual_level+'  Score : '+score,
      color: "#FFF",
      family: "dos"
    }));

    var menuButton = container.insert(new Q.UI.Button({
      x: 0,
      y: 20 + label.p.h, 
      fill: "#CCCCCC",
      label: "Menu",
      family: "dos"
    }))

    // When the button is clicked, clear all the stages
    // and restart the game.
    restartButton.on("click",function() {
      if (restartLabel == 'Recommencer le jeu') {
        score = 0;
        window.location = window.location.pathname;
      }
      if (stage.options.label == winLabel || restartLabel == 'Recommencer le jeu') {
        $('#score .display').html(score);
        $('#'+period+'_audio')[0].pause();
      }
      Q.clearStages();
      if (level != 0) {
        Q.stageScene('level'+level);
      }
      chrono.resetCountdown();
      chrono.Timer.toggle();
    });

    menuButton.on("click",function() {
      window.parent.location = window.parent.location.protocol + '//' + window.parent.location.host + window.parent.location.pathname;
    });

    // Expand the container to visibily fit it's contents
    // (with a padding of 30 pixels)
    container.fit(30);
  });

  // ## Asset Loading and Game Launch
  // Q.load can be called at any time to load additional assets
  // assets that are already loaded will be skipped
  // The callback will be triggered when everything is loaded
  Q.load("empty_tile.png, tardis_by_derpyhoovesxdoctor.png, level.json, hero/prehistory.png, hero/middle_age.png, hero/renaissance.png, hero/80s.png, hero/futur.png, background/prehistory.png,background/middle_age.png, background/renaissance.png, background/80s.png, background/futur.png, enemy/prehistory1.gif, enemy/prehistory2.gif, enemy/middle_age1.gif, enemy/middle_age2.gif, enemy/renaissance1.gif, enemy/renaissance2.gif, enemy/80s1.gif, enemy/80s2.gif, enemy/futur1.gif, enemy/futur2.gif", function() {
    // Sprites sheets can be created manually
    Q.sheet("empty_tile","empty_tile.png", { "tilew": 32, "tileh": 32 });

    Q.sheet("tardis","tardis_by_derpyhoovesxdoctor.png", { "tilew": 317, "tileh": 573,"sx": 0,"sy": 0});
    Q.sheet("player:prehistory","hero/prehistory.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:middle_age","hero/middle_age.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:renaissance","hero/renaissance.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:80s","hero/80s.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:futur","hero/futur.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});

    Q.sheet("enemy:prehistory1","enemy/prehistory1.gif", { "tilew": 190, "tileh": 151,"sx": 0,"sy": 0});
    Q.sheet("enemy:prehistory2","enemy/prehistory2.gif", { "tilew": 190, "tileh": 151,"sx": 0,"sy": 0});
    Q.sheet("enemy:middle_age1","enemy/middle_age1.gif", { "tilew": 130, "tileh": 146,"sx": 0,"sy": 0});
    Q.sheet("enemy:middle_age2","enemy/middle_age2.gif", { "tilew": 130, "tileh": 146,"sx": 0,"sy": 0});
    Q.sheet("enemy:renaissance1","enemy/renaissance1.gif", { "tilew": 25, "tileh": 37,"sx": 0,"sy": 0});
    Q.sheet("enemy:renaissance2","enemy/renaissance2.gif", { "tilew": 25, "tileh": 37,"sx": 0,"sy": 0});
    Q.sheet("enemy:80s1","enemy/80s1.gif", { "tilew": 148, "tileh": 216,"sx": 0,"sy": 0});
    Q.sheet("enemy:80s2","enemy/80s2.gif", { "tilew": 148, "tileh": 216,"sx": 0,"sy": 0});
    Q.sheet("enemy:futur1","enemy/futur1.gif", { "tilew": 107, "tileh": 239,"sx": 0,"sy": 0});
    Q.sheet("enemy:futur2","enemy/futur2.gif", { "tilew": 107, "tileh": 239,"sx": 0,"sy": 0});

    // Finally, call stageScene to run the game
    Q.stageScene('level'+level);

    chrono.resetCountdown();
    chrono.Timer.toggle();
    $('#loading_container').hide();
  });
$('canvas').focus();

/* PAUSE */
$('#pause_container button').on("click",function() {
  window.parent.location = window.parent.location.protocol + '//' + window.parent.location.host + window.parent.location.pathname;
});
window.addEventListener("keydown", keyboardEvent, false);
function keyboardEvent(keypressed)
{
  switch(keypressed.keyCode)
  {
    case 80:
    if (!isPaused) {
      chrono.Timer.toggle();
      Q.pauseGame();
      $('#pause_container #level_display').html(level);
      $('#pause_container #score_display').html(score);
      $('#pause_container').show();
      isPaused = true;
    } else {
      $('#pause_container').hide();
      $('canvas').focus();
      Q.unpauseGame();
      chrono.Timer.toggle();
      isPaused = false;
    }
  }
}
});
});

/* RANDOM */
function randomBetween(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}