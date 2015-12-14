<div id="content">
  <h2>Jeu</h2>
    <canvas id="canvas" width="1024" height="600"></canvas>
    <script type="text/javascript"></script>
  <!--<script type="text/javascript">
  /* Mario states */
var _IDLE          = 1;
var _WALKING       = 2;
var _JUMPING       = 3;

/* Mario/object size */
var _LARGE         = 1;
var _SMALL         = 2;

/* Direction */
var _RIGHT         = 1;
var _LEFT          = 2;
var _UP            = 3;
var _DOWN          = 4;

  function $(id)
{
  return document.getElementById(id);
}
  function play_sound(name, loop)
{ return;
  try
  {
    $((loop ? "music_" : "sound_") + name).Stop();
    if (loop)
    {
      /* Background music */
      $("music_" + name).PlayLoop();
    }
    else
    {
      /* Short sound */
      $("sound_" + name).Play();
    }
    
  }
  catch(e){ alert(e); }
}

function stop_sound(name, is_sound)
{ return;
  try
  {
    $((is_sound ? "sound_" : "music_") + name).Stop();
  }
  catch(e){ alert(e); }
}

  /* Create the Mario/player object */
var mario = {};
mario.state            = _IDLE;        // The current state (the pose we want to be in)
mario.direction        = _RIGHT;       // The current direction
mario.wanted_direction = _RIGHT;       // The wanted direction (set_pose sets .direction to .wanted_direction)
mario.cant_walk        = null;         // Did Mario walk against a solid material? (null/_RIGHT/_LEFT)
mario.jumping          = false;        // Is Mario jumping?
mario.jump_data        = 0;            // The current jump height data
mario.fall_data        = 0;            // The current fall height data
mario.standing_solid   = true;         // Is Mario standing on solid material?
mario.on_elevator      = null;         // On what elevator [index] is Mario standing? null = none
mario.done_jumping     = true;         // Did the player let go of the up key after jumping?
mario.bumps_up         = false;        // Is Mario bouncing on an enemy?
mario.size             = _SMALL;       // The current size
mario.pose             = _IDLE;        // The current pose
mario.position         = [0,0];        // The current position
mario.walk_speed       = 1.5;          // The walking speed (pixels per 15ms) of Mario
mario.run_speed        = 2.8;          // The running speed (pixels per 15ms) of Mario
mario.speed            = mario.walk_speed;
mario.invincible       = false;        // Is Mario invincible? (just got hit by an enemy)
mario.blink_state      = false;        // The state of the blinking scheme when Mario is hit
mario.firepower        = false;        // Does Mario has firepower?
mario.starman          = false;        // Has Mario captured a Starman?
mario.height           = [];           // Height constants for Mario
  mario.height[_LARGE] = 30;
  mario.height[_SMALL] = 16;
mario.image            = [];           // Image sources for Mario (image[state]_size_direction.gif)
  mario.image[_IDLE]    = "idle";
  mario.image[_WALKING] = "walk";
  mario.image[_JUMPING] = "jump";

mario.set_pose = function(force)
{
  if ((mario.pose != mario.state || mario.wanted_direction != mario.direction) || force)
  {
    /* Change Mario's pose */
    mario.pose = mario.state;
    mario.direction = mario.wanted_direction;
    
    $("mario").src = "./images/mario/" + (mario.image[mario.standing_solid && !mario.jumping ? mario.pose : _JUMPING]) + "_" + (mario.size == _LARGE ? "large" : "small") + "_" + (mario.direction == _LEFT ? "left" : "right") + (mario.starman ? "_star" : (mario.firepower ? "_fire" : "")) + ".gif";
  }
}

mario.move = function()
{
  if (mario.state == _WALKING)
  {
    var shoot_flameballs_limits = current_level.shoot_flameballs_limits;
    var bowser_pos = current_level.bowser_pos || null;
    var level_strip_length = current_level_data.length / 14;
    var block_count_x = ((Math.floor((mario.position[1] - 6) / 16) - 0) * level_strip_length);
    var bounce_material_low = block_count_x + (mario.direction == _LEFT ? Math.floor(mario.position[0] / 16) : Math.ceil(mario.position[0] / 16));
    var bounce_material_high = block_count_x - level_strip_length + (mario.direction == _LEFT ? Math.floor(mario.position[0] / 16) : Math.ceil(mario.position[0] / 16));
    bounce_material_high = mario.size == _LARGE ? bounce_material_high : bounce_material_low;
    
    if (mario.jump_data == 0 && mario.fall_data == 0)
    {
      if (key_state.run && (key_state.left || key_state.right))
      {
        if (mario.speed < mario.run_speed) mario.speed += 0.06;
      }
      else
      {
        if (mario.speed > mario.walk_speed) mario.speed -= 0.05;
      }
    }
    
    /* Mario walks agains a solid material */
    if (has_property("solid", bounce_material_low, bounce_material_high))
    {
      mario.cant_walk = mario.direction;
      $("mario").style.left = (mario.position[0] = (((bounce_material_low - (mario.direction == _RIGHT ? 1 : -1) - block_count_x) * 16) - (mario.direction == _RIGHT ? 0 : 1))) + "px";
      if (mario.fall_data == 0 && mario.jump_data == 0) mario.speed = 0;
      
      for (var i in current_level.tube_data)
      {
        if (mario.position[1] == current_level.tube_data[i].tube_position[1] && mario.position[0] == current_level.tube_data[i].tube_position[0] && current_level.tube_data[i].orientation == _HORIZONTAL)
        {
          /* Horizontal tube */
          mario.go_in_tube(current_level.tube_data[i]);
        }
      }
    }
    
    /* Check if Mario hits a solid material while walking/running */
    if (mario.cant_walk != mario.direction)
    {
      var left_pos = (mario.position[0] += (mario.speed * (mario.direction == _RIGHT ? 1 : -1)));
      var level_length = (current_level_data.length / 14) * 16;
      
      if (left_pos <= scroll_pos)
      {
        left_pos = scroll_pos;
        mario.cant_walk = _LEFT;
      }
      if (left_pos >= level_length - 16)
      {
        left_pos = level_length - 16;
        mario.cant_walk = _RIGHT;
      }
      $("mario").style.left = (mario.position[0] = left_pos) + "px";
    }
    else
    {
      mario.cant_walk = null;
    }
    
    if (has_property("flag_pole", bounce_material_low) && mario.position[0] % 16 > 7)
    {
      play_flag_ending(get_position(bounce_material_low)[0]);
    }
    
    if (typeof shoot_flameballs_limits != "undefined" && mario.position[0] > shoot_flameballs_limits[0] && mario.position[0] < shoot_flameballs_limits[1])
    {
      shoot_flameballs = true;
    }
    else
    {
      shoot_flameballs = false;
    }
    
    if (bowser_pos && mario.position[0] > (bowser_pos.x_start - 50) && !bowser_in_viewport)
    {
      stop_sound(background_music[_CASTLE]);
      play_sound("bowser_start");
      timer1 = setTimeout('play_sound("bowser_main", true);', 3100);
      bowser_in_viewport = true;
    }
  }
  else
  {
    if (mario.state == _IDLE)
    {
      mario.speed = 0;
    }
  }
}

mario.jump = function()
{
  if (!mario.jumping) return;
  if (mario.jump_data == 0)
  {
    mario.set_pose(true);
    play_sound("jump");
    mario.on_elevator = null;
  }
  
  var block_count_x = ((Math.floor((mario.position[1] - 3) / 16) - (mario.size == _LARGE ? 2 : 1)) * (current_level_data.length / 14));
  var material_left = block_count_x + Math.floor((mario.position[0] + 3) / 16);
  var material_right = block_count_x + Math.ceil((mario.position[0] - 3) / 16);
  var properties;
  var block;
  var check_enemy_bump = false;
  
  /* Mario hits a solid material with his head */
  if (properties = has_property("solid", material_left, material_right))
  {
    var block_edge = (mario.position[0] + 8) % 16; // Number of pixels between the middle of Mario and the edge of a brick
    
    if ((properties[0] && properties[1]) && (material_left != material_right))
    {
      /* Mario jumps against 2 blocks */
      var block = block_edge < 8 ? material_right : material_left;
    }
    else
    {
      var block = properties[0] ? material_left : material_right;
      var material_position = get_position(block);
      
      if (mario.position[0] <  material_position[0] && (mario.position[0] % 16) < 7 && mario.speed < mario.walk_speed)
      {
        /* Correct Mario's position to the left */
        mario.position[0] -= (mario.position[0] % 16)
        if (mario.position[0] < scroll_pos) mario.position[0] = scroll_pos;
        $("mario").style.left = mario.position[0] + "px";
        return;
      }
      if ((mario.position[0] + 16) >  material_position[0] && (mario.position[0] % 16) > 9 && mario.speed < mario.walk_speed)
      {
        /* Correct Mario's position to the right */
        $("mario").style.left = (mario.position[0] += (16 - mario.position[0] % 16)) + "px";
        return;
      }
    }
    
    mario.jump_data = 0;
    mario.jumping = false;
    mario.bumps_up = false;
  }
  
  if (properties = has_property("questionmark", block))
  {
    var material_position = get_position(block);
    play_sound("hit_block");
    
    if (has_property("coinblock", block))
    {
      create_animation(_COIN_EXPL, [material_position[0] - 2, material_position[1] - 16]);
      play_sound("coin");
      add_points(200, {x: material_position[0] - 1, y: material_position[1] - 25}, 400);
      add_coin();
    }
    else
    {
      /* It's a special (mushroom/fireflower) block */
      var position = get_position(block);
      var obj = document.createElement('img');
      var new_id = "object" + get_uin();
      play_sound("mushroom");
      obj.setAttribute('id', new_id);
      obj.style.cssText = "position: absolute; z-index: 2; left: " + position[0] + "px; top: " + (position[1] - 16) + "px; width: 16px; height: 16px;";
      obj.setAttribute('src', "./images/" + (mario.size == _LARGE ? "fireflower" : "mushroom") + ".gif");
      document.body.appendChild(obj);
      popup_item_data.push({increment: 0, id: new_id, position: [position[0], position[1]], type: (mario.size == _LARGE ? _FIREFLOWER : _MUSHROOM), fall_data: 0});

    }
    $("block" + block).src = "./images/" + materials["h"].image[current_level.type];
    
    current_level_data = current_level_data.substring(0, block) + "h" + current_level_data.substring(block + 1);
    
    check_enemy_bump = true;
  }
  
  if (properties = has_property("starman", block))
  {
    var position = get_position(block);
    var obj = document.createElement('img');
    var new_id = "object" + get_uin();
    play_sound("hit_block");
    obj.setAttribute('id', new_id);
    obj.style.cssText = "position: absolute; z-index: 2; left: " + position[0] + "px; top: " + (position[1] - 16) + "px; width: 16px; height: 16px;";
    obj.setAttribute('src', "./images/starman.gif");
    document.body.appendChild(obj);
    
    $("block" + block).src = "./images/" + materials["h"].image[current_level.type];
    current_level_data = current_level_data.substring(0, block) + "h" + current_level_data.substring(block + 1);
    
    popup_item_data.push({increment: 0, id: new_id, position: [position[0], position[1]], type: _STARMAN, fall_data: 0});
    check_enemy_bump = true;
  }
  
  if (properties = has_property("breakable", block))
  {
    if (mario.size == _LARGE)
    {
      /* Break this brick */
      break_brick(block);
      play_sound("breakbrick");
      add_points(50);
    }
    else
    {
      /* Bump this brick */
      bump_brick(block);
      play_sound("hit_block");
    }
    check_enemy_bump = true;
  }
  
  if (check_enemy_bump)
  {
    /* Check if an enemy is standing on this brick. If so, kill it */
    for (var i in enemies_in_game)
    {
      var level_length = current_level_data.length;
      var pos_left = block % (level_length / 14);
      var pos_top = ((block - pos_left) / (level_length / 14));
      
      if (enemies_in_game[i].living_state != _ALIVE) { continue; }
      
      if (((pos_left * 16) + 16) > enemies_in_game[i].position[0] && (pos_left * 16) < (enemies_in_game[i].position[0] + 16)
        &&
           ((pos_top * 16) - 4) > (enemies_in_game[i].position[1] - enemies_in_game[i].size[1]) && ((pos_top * 16) - 16) < enemies_in_game[i].position[1])
      {
        enemies_in_game[i].bump_die(mario.direction);
        add_points(enemies_in_game[i].type == _GOOMBA ? 100 : 200, {x: enemies_in_game[i].position[0] + 1, y: enemies_in_game[i].position[1] - 35});
      }
    }
  }
  
  //mario.standing_solid = false;
  
  mario.jump_data += (mario.bumps_up ? 12 : 4);
  $("mario").style.top = (mario.position[1] += (Math.sin((mario.jump_data + 270) * Math.PI/180) * (4.7 + (((mario.speed < mario.walk_speed ? mario.walk_speed : mario.speed) - mario.walk_speed) * 1.5)))) - mario.height[mario.size] + "px";
  if (mario.jump_data > 90) { mario.jump_data = 0; mario.jumping = false; mario.bumps_up = false; }
}</script>-->
</div>