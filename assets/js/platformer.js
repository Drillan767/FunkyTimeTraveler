$(document).ready(function() {
  var player_name = 'Nom';
  var Qplayer = null;
  var Qenemy = null;
  var win = false;
  var score = 0;
  var level = 1;
  var maxLevel = 5;
  var startTime = 10000;
  var maxTime = 20000;
  var period = null;

  var winLabel = 'Gagné !';
  var loseLabel = 'Game Over';

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
      // Output timer position
      var timeString = formatTime(currentTime);
      $countdown.html(timeString);

      // If timer is complete, trigger alert
      if (currentTime == 0  && Qplayer.isAlive) {
        chrono.Timer.stop();
        win = false;
        Q.stageScene("endGame",1, { label: loseLabel });
      }
      if (currentTime >= maxTime) {
        win = true;
        Q.stageScene("endGame",1, { label: winLabel });
      }

      // Decrement timer position
      if (currentTime <= 0) {
        currentTime = 0;
      } else {
        currentTime -= incrementTime;
        $('#timer #progress').css('width', (currentTime/maxTime*100)+'%');
        $('#score .display').html(score);
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
    imagePath: "../assets/img/",
    audioPath: "../assets/audio/",
    dataPath:  "../assets/json/"
  })
  .include("Audio, Sprites, Scenes, Input, 2D, Touch, Anim, UI")
  .setup({
    width: 1024,
    height: 600,
    // scaleToFit: true
  })
  .controls() // And turn on default input controls and touch input (for UI)
  .touch()
  .enableSound();

  Q.animations('player', {
    run_left: { frames: [4,5,6,7,8], next: 'stand_left', rate: 1/20},
    run_right: { frames: [4,5,6,7,8], next: 'stand_right', rate: 1/20},
    stand_left: { frames: [0,1,2,3,4], rate: 1/10},
    stand_right: { frames: [0,1,2,3,4], rate: 1/10},
    jump: { frames: [9], loop:false, rate: 1},
  });

  // ## Player Sprite
  // The very basic player sprite, this is just a normal sprite
  // using the player sprite sheet with default controls added to it.
  Q.Sprite.extend("Player",{
    isAlive: true,
    // the init constructor is called on creation
    init: function(name) {
      // You can call the parent's constructor with this._super(..)
      this._super(name, {
        sheet: "player:"+name,  // Setting a sprite sheet sets sprite width and height
        sprite: "player",   // Animationsheet
        x: 400,           // You can also set additional properties that can
        y: 100,             // be overridden on object creation
        scale: 0.2,        // scale sprite to right size
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
          this.destroy();
        }
      });
    }, step: function(p) {
      if(Q.inputs['up']) {
        this.play("jump",1);
      } else if(this.p.vx > 0) {
        this.p.flip="";
        this.play("run_right");
      } else if(this.p.vx < 0) {
        this.p.flip="x";
        this.play("run_left");
      } else {
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
      this._super(p, { sheet: 'tower' });
    }
  });

  // ## Enemy Sprite
  // Create the Enemy class to add in some baddies
  Q.Sprite.extend("Enemy",{
    init: function(p) {
      this._super(p, { sheet: 'enemy', vx: 100 });

      // Enemies use the Bounce AI to change direction 
      // whenver they run into something.
      this.add('2d, aiBounce');

      // Listen for a sprite collision, if it's the player,
      // end the game unless the enemy is hit on top
      this.on("bump.left,bump.right",function(collision) {
        if(collision.obj.isA("Player")) {
          chrono.decTime(2000)
          if (score >= 5) {
            score -= 5;
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
          this.destroy();
          collision.obj.p.vy = -300;
          chrono.incTime(4000);
          score += 10;
          Qenemy.addEnemy();
        }
      });
    }, addEnemy : function(){
      Q.stage().insert(new Q.Enemy({ x: Math.floor(Math.random()*(900-100+1)+100), y: 0 }));
    }
  });

  // ## Level1 scene
  // Create a new scene called level 1
  Q.scene("level1",function(stage) {
    period = 'prehistory';
    // Play audio ambiance
    Q.audio.play(period+'.mp3',{ loop: true });

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 900, y: 0 }));

    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 71, y: 501 }));
  });

  Q.scene("level2",function(stage) {
    period = 'middle_age';
    // Play audio ambiance
    Q.audio.play(period+'.mp3',{ loop: true });

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));


    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 81, y: 501 }));
  });

  Q.scene("level3",function(stage) {
    period = 'renaissance';
    // Play audio ambiance
    Q.audio.play(period+'.mp3',{ loop: true });

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));


    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 81, y: 501 }));
  });

Q.scene("level4",function(stage) {
  period = "80's";
    // Play audio ambiance
    Q.audio.play(period+'.mp3',{ loop: true });

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));


    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 81, y: 501 }));
  });

Q.scene("level5",function(stage) {
  period = 'futur';
    // Play audio ambiance
    Q.audio.play(period+'.mp3',{ loop: true });

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: 'background/'+period+'.png'}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));

    // Create the player and add them to the stage
    Qplayer = stage.insert(new Q.Player(period));

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    Qenemy = stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));
    stage.insert(new Q.Enemy({ x: 600, y: 0 }));


    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 81, y: 501 }));
  });

  // To display a game over / game won popup box, 
  // create a endGame scene that takes in a `label` option
  // to control the displayed message.
  Q.scene('endGame',function(stage) {
    chrono.Timer.toggle();

    var container = stage.insert(new Q.UI.Container({
      x: Q.width/2,
      y: Q.height/2,
      fill: "rgba(0,0,0,0.5)"
    }));

    var actual_level = level;

    var restartLabel = '';
    if (level >= maxLevel) {
      restartLabel = 'Recommencer le jeu';
      level = 1;
      win = false;

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

    } else if (win) {
      restartLabel = 'Niveau suivant';
      level++;
      win = false;
    } else {
      restartLabel = 'Recommencer le Niveau';
    }
    Qplayer.diePlayer();

    var restartButton = container.insert(new Q.UI.Button({
      x: 0,
      y: 25,
      fill: "#CCCCCC",
      label: restartLabel
    }))
    
    var label = container.insert(new Q.UI.Text({
      x: 4,
      y: -20 - restartButton.p.h, 
      label: stage.options.label+'\nNiveau : '+actual_level+'  Score : '+score,
      color: "#FFF"
    }));

    var menuButton = container.insert(new Q.UI.Button({
      x: 0,
      y: 20 + label.p.h, 
      fill: "#CCCCCC",
      label: "Menu"
    }))

    if (restartLabel == 'Recommencer le jeu') {
      score = 0;
    }
    // When the button is clicked, clear all the stages
    // and restart the game.
    restartButton.on("click",function() {
      if (stage.options.label == winLabel) {
        Q.audio.stop(period+".mp3")
      }
      Q.clearStages();
      if (level != 0) {
        Q.stageScene('level'+level);
      }
      chrono.resetCountdown();
      chrono.Timer.toggle();
    });

    menuButton.on("click",function() {
      window.parent.location = (location.protocol + '//' + location.host + location.pathname).replace('view/gameframe.html', '');
    });

    // Expand the container to visibily fit it's contents
    // (with a padding of 30 pixels)
    container.fit(30);
  });

  // ## Asset Loading and Game Launch
  // Q.load can be called at any time to load additional assets
  // assets that are already loaded will be skipped
  // The callback will be triggered when everything is loaded
  Q.load("sprites.png, sprites.json, level.json, tiles.png, hero/prehistory.png, hero/middle_age.png, hero/renaissance.png, hero/80's.png, hero/futur.png, background/prehistory.png, background/middle_age.png, background/renaissance.png, background/80's.png, background/futur.png, prehistory.mp3, prehistory.ogg, middle_age.mp3, middle_age.ogg, renaissance.mp3, renaissance.ogg, 80's.mp3, 80's.ogg, futur.mp3, futur.ogg", function() {
    // Sprites sheets can be created manually
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

    // Or from a .json asset that defines sprite locations
    Q.compileSheets("sprites.png","sprites.json");
    Q.sheet("player:prehistory","hero/prehistory.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:middle_age","hero/middle_age.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:renaissance","hero/renaissance.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:80's","hero/80's.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});
    Q.sheet("player:futur","hero/futur.png", { "tilew": 368, "tileh": 552,"sx": 0,"sy": 0});

    // Q.sheet("enemy:prehistory1","hero/moveL.gif", { "tilew": 111, "tileh": 160,"sx": 0,"sy": 0);

    // Q.preload("80's", [ "80's.mp3", "80's.ogg" ]);

    // Finally, call stageScene to run the game
    Q.stageScene('level'+level);

    chrono.resetCountdown();
    chrono.Timer.toggle();
  });
});
});