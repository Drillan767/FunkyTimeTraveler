$(document).ready(function() {
  
  // Timer
  var chrono = new (function() {
    // Stopwatch element on the page
    var $countdown = $('#countdown');
    // Timer speed in milliseconds
    var incrementTime = 70;
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
      if (currentTime == 0) {
        chrono.Timer.stop();
        win = false;
        Q.stageScene("endGame",1, { label: "Game Over" });
        return;
      }

      // Increment timer position
      currentTime -= incrementTime;
      if (currentTime < 0) currentTime = 0;
    }

    this.resetCountdown = function() {
        currentTime = 10000;

        // Stop and reset timer
        chrono.Timer.stop().once();
    };

    this.minTime = function(milliseconds){
      currentTime -= milliseconds;
    };

    this.addTime = function(milliseconds){
      currentTime += milliseconds;
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
  var win = false;
  var level = 1;
  var maxLevel = 5;

  // Set up an instance of the Quintus engine  and include
  // the Sprites, Scenes, Input and 2D module. The 2D module
  // includes the `TileLayer` class as well as the `2d` componet.
  var Q = window.Q = Quintus()
  .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
          // Maximize this game to whatever the size of the browser is
          .setup({
            width: 1024,
            height: 600,
            maximize: "touch"
          })
          // And turn on default input controls and touch input (for UI)
          .controls().touch()

          Q.options = {
            imagePath: "assets/img/",
            audioPath: "assets/audio/",
            dataPath:  "assets/json/"
          };

  // ## Player Sprite
  // The very basic player sprite, this is just a normal sprite
  // using the player sprite sheet with default controls added to it.
  Q.Sprite.extend("Player",{

    // the init constructor is called on creation
    init: function(p) {

      // You can call the parent's constructor with this._super(..)
      this._super(p, {
        sheet: "player",  // Setting a sprite sheet sets sprite width and height
        x: 410,           // You can also set additional properties that can
        y: 90             // be overridden on object creation
      });

      // Add in pre-made components to get up and running quickly
      // The `2d` component adds in default 2d collision detection
      // and kinetics (velocity, gravity)
      // The `platformerControls` makes the player controllable by the
      // default input actions (left, right to move,  up or action to jump)
      // It also checks to make sure the player is on a horizontal surface before
      // letting them jump.
      this.add('2d, platformerControls');

      // Write event handlers to respond hook into behaviors.
      // hit.sprite is called everytime the player collides with a sprite
      this.on("hit.sprite",function(collision) {

        // Check the collision, if it's the Tower, you win!
        if(collision.obj.isA("Tower")) {
          win = true;
          Q.stageScene("endGame",1, { label: "Gagné !" }); 
          this.destroy();
        }
      });
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
      this.on("bump.left,bump.right,bump.bottom",function(collision) {
        if(collision.obj.isA("Player")) {
          chrono.minTime(2000)
          // Q.stageScene("endGame",1, { label: "Game Over" }); 
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
          chrono.addTime(4000);
        }
      });
    }
  });

  // ## Level1 scene
  // Create a new scene called level 1
  Q.scene("level1",function(stage) {

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: "background/prehistory.png"}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));


    // Create the player and add them to the stage
    var player = stage.insert(new Q.Player());

    diePlayer = function() {
      player.destroy();
    }

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));

    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 71, y: 501 }));
  });

  Q.scene("level2",function(stage) {

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: "background/middle_age.png"}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));


    // Create the player and add them to the stage
    var player = stage.insert(new Q.Player());

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));


    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 81, y: 501 }));
  });

  Q.scene("level3",function(stage) {

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: "background/renaissance.png"}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));


    // Create the player and add them to the stage
    var player = stage.insert(new Q.Player());

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));


    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 81, y: 501 }));
  });

  Q.scene("level4",function(stage) {

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: "background/disco.png"}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));


    // Create the player and add them to the stage
    var player = stage.insert(new Q.Player());

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));


    // Finally add in the tower goal
    stage.insert(new Q.Tower({ x: 81, y: 501 }));
  });

  Q.scene("level5",function(stage) {

    // Add in a repeater for a little parallax action
    stage.insert(new Q.Repeater({ asset: "background/futur.png"}));

    // Add in a tile layer, and make it the collision layer
    stage.collisionLayer(new Q.TileLayer({
     dataAsset: 'level.json',
     sheet:     'tiles' }));


    // Create the player and add them to the stage
    var player = stage.insert(new Q.Player());

    // Give the stage a moveable viewport and tell it
    // to follow the player.
    //stage.add("viewport").follow(player);

    // Add in a couple of enemies
    stage.insert(new Q.Enemy({ x: 700, y: 0 }));
    stage.insert(new Q.Enemy({ x: 750, y: 0 }));
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    stage.insert(new Q.Enemy({ x: 200, y: 0 }));
    stage.insert(new Q.Enemy({ x: 400, y: 0 }));
    stage.insert(new Q.Enemy({ x: 500, y: 0 }));


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

    var restartLabel = '';
    if (level >= maxLevel) {
      restartLabel = 'Recommencer le jeu';
      level = 1;
      win = false;
    } else if (win) {
      restartLabel = 'Niveau suivant';
      level++;
      win = false;
    } else {
      restartLabel = 'Recommencer le Niveau';
      diePlayer();
    }

    var restartButton = container.insert(new Q.UI.Button({
      x: 0,
      y: 0,
      fill: "#CCCCCC",
      label: restartLabel
    }))
    
    var label = container.insert(new Q.UI.Text({
      x: 4,
      y: -20 - restartButton.p.h, 
      label: stage.options.label,
      color: "#FFF"
    }));
    var menuButton = container.insert(new Q.UI.Button({
      x: 0,
      y: 20 + label.p.h, 
      fill: "#CCCCCC",
      label: "Menu"
    }))  
    // When the button is clicked, clear all the stages
    // and restart the game.
    restartButton.on("click",function() {
      Q.clearStages();
      if (level != 0) {
        Q.stageScene('level'+level);
      }
      chrono.resetCountdown();
      chrono.Timer.toggle();
    });

    menuButton.on("click",function() {
      window.location = location.protocol + '//' + location.host + location.pathname;
    });

    // Expand the container to visibily fit it's contents
    // (with a padding of 20 pixels)
    container.fit(30);
  });

  // ## Asset Loading and Game Launch
  // Q.load can be called at any time to load additional assets
  // assets that are already loaded will be skipped
  // The callback will be triggered when everything is loaded
  Q.load("sprites.png, sprites.json, level.json, tiles.png, background/prehistory.png, background/middle_age.png, background/renaissance.png, background/disco.png, background/futur.png", function() {
    // Sprites sheets can be created manually
    Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

    // Or from a .json asset that defines sprite locations
    Q.compileSheets("sprites.png","sprites.json");

    // Finally, call stageScene to run the game
    Q.stageScene('level'+level);
  });

});
});