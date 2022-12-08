// ===================== Fall 2022 EECS 493 Assignment 3 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==================================================
// ============ Page Scoped Globals Here ============
// ==================================================

// Div Handlers
let game_window;
let game_screen;
let onScreenAsteroid;

// Difficulty Helpers
let astProjectileSpeed = 0.5;          // easy: 1, norm: 3, hard: 5
let astSpawnRate = 800;

// Game Object Helpers
let currentAsteroid = 1;
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 10;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds

// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var shielded = false;
var touched = 0;
var vol = 50;
var SkipHTP = false;

var EASY = false;
var NORMAL = true;
var HARD = false;
var score_num = 0;
var level_num = 1;
var danger_num = 20;

// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
  // ====== Startup ====== 
  game_window = $('.game-window');
  game_screen = $("#actual_game");
  onScreenAsteroid = $('.curAstroid');

  // TODO: ADD MORE
  //spawn(); // Example: Spawn an asteroid that travels from one border to another

});

// TODO: ADD YOUR FUNCTIONS HERE
function Play_Collect() {
  document.getElementById('collect').volume = vol / 100;
  console.log(document.getElementById('collect').volume);
  document.getElementById('collect').play();
}

function Play_Die() {
  document.getElementById('die').volume = vol / 100;
  console.log(vol);
  console.log(document.getElementById('die').volume);
  document.getElementById('die').play();
}

function keyPressRouter(event) {
  switch (event.which) {
    case 37:
      LEFT = true;
      movePlayer(event.which);
      console.log("Left");
      break;
    case 38:
      UP = true;
      movePlayer(event.which);
      console.log("Up");
      break;
    case 39:
      RIGHT = true;
      movePlayer(event.which);
      console.log("Right");
      break;
    case 40:
      DOWN = true;
      movePlayer(event.which);
      console.log("Down");
      break;
  }
}

function movePlayer() {
  if (LEFT) {
    var new_pos = parseInt($('#player').css('left')) - PERSON_SPEED;
    if (new_pos < 0) {
      new_pos = 0;
    }
    $('#player').css('left', new_pos);
    if (shielded) {
      $('#player').attr("src", "src/player/player_shielded_left.gif");
    }
    else {
      $('#player').attr("src", "src/player/player_left.gif");
    }
  }
  if (UP) {
    var new_pos = parseInt($('#player').css('top')) - PERSON_SPEED;
    if (new_pos < 0) {
      new_pos = 0;
    }
    $('#player').css('top', new_pos);
    if (shielded) {
      $('#player').attr("src", "src/player/player_shielded_up.gif");
    }
    else {
      $('#player').attr("src", "src/player/player_up.gif");
    }
  }
  if (RIGHT) {
    var new_pos = parseInt($('#player').css('left')) + PERSON_SPEED;
    if (new_pos > maxPersonPosX) {
      new_pos = maxPersonPosX;
    }
    $('#player').css('left', new_pos);
    if (shielded) {
      $('#player').attr("src", "src/player/player_shielded_right.gif");
    }
    else {
      $('#player').attr("src", "src/player/player_right.gif");
    }
  }
  if (DOWN) {
    var new_pos = parseInt($('#player').css('top')) + PERSON_SPEED;
    if (new_pos > maxPersonPosY) {
      new_pos = maxPersonPosY;
    }
    $('#player').css('top', new_pos);
    if (shielded) {
      $('#player').attr("src", "src/player/player_shielded_down.gif");
    }
    else {
      $('#player').attr("src", "src/player/player_down.gif");
    }
  }
  var shieldexists = document.getElementById("shieldimg");
  var portalexists = document.getElementById("portalimg");
  if (shieldexists != null) {
    if (isColliding($('#player'), $('#shieldimg'))) {
      console.log('Shield');
      removeElement(document.getElementById("shieldimg"))
      shielded = true;
      Play_Collect();
    }
  }
  if (portalexists != null) {
    if (isColliding($('#player'), $('#portalimg'))) {
      console.log('Portal');
      removeElement(document.getElementById("portalimg"))
      level_num++;
      danger_num += 2;
      astProjectileSpeed *= 1.2;
      document.getElementById('danger_num2').innerHTML = danger_num;
      document.getElementById('level_num2').innerHTML = level_num;
      Play_Collect();
    }
  }

}

function Startgame() {
  if (EASY) {
    astProjectileSpeed *= 1;
    astSpawnRate = 1000;
    danger_num = 10;
  }
  if (NORMAL) {
    astProjectileSpeed *= 3;
    astSpawnRate = 800;
    danger_num = 20;
  }
  if (HARD) {
    astProjectileSpeed *= 5;
    astSpawnRate = 600;
    danger_num = 30;
  }
  document.getElementById('danger_num').innerHTML = danger_num;
  document.getElementById('level_num').innerHTML = level_num;
  document.getElementById('danger_num2').innerHTML = danger_num;
  document.getElementById('level_num2').innerHTML = level_num;
}

function removeElement(x) {
  x.parentNode.removeChild(x);
}

function spawnShields() {
  var shieldx = Math.floor(getRandomNumber(0, maxPersonPosX)) + 'px';
  var shieldy = Math.floor(getRandomNumber(0, maxPersonPosY)) + 'px';
  var shield = document.createElement('img');
  shield.id = "shieldimg";
  shield.src = "src/shield.gif";
  shield.style.height = "62px";
  shield.style.width = "62px";
  shield.style.position = "absolute";
  shield.style.left = shieldx;
  shield.style.top = shieldy;


  document.getElementById('actual_game').appendChild(shield);

  setTimeout('removeElement(document.getElementById("shieldimg"))', 5000);
}

function spawnPortals() {
  var portx = Math.floor(getRandomNumber(0, maxPersonPosX)) + 'px';
  var porty = Math.floor(getRandomNumber(0, maxPersonPosY)) + 'px';
  var portal = document.createElement('img');
  portal.id = "portalimg";
  portal.src = "src/port.gif";
  portal.style.height = "62px";
  portal.style.width = "62px";
  portal.style.position = "absolute";
  portal.style.left = portx;
  portal.style.top = porty;


  document.getElementById('actual_game').appendChild(portal);

  setTimeout('removeElement(document.getElementById("portalimg"))', 5000);

}

function score_update() {
  score_num += 40;
  document.getElementById('score_num2').innerHTML = score_num;

}

function game_t2() {
  $(window).keydown(keyPressRouter);
  document.getElementById('actual_game').style.zIndex = 5;
  document.getElementById('Ready').style.zIndex = -1;
  var t = setInterval(spawn, astSpawnRate);
  var s = setInterval(spawnShields, 15000);
  var p = setInterval(spawnPortals, 20000);
  var score = setInterval(score_update, 500);

  function collide_check() {
    const actasteroids = document.querySelectorAll("div[id^='a-']");
    if (!shielded) {
      for (i = 0; i < actasteroids.length; ++i) {
        if (isColliding($('#player'), $(actasteroids[i]))) {
          touched = 1;
          if (touched == 1) {
            astProjectileSpeed = 00000000000;
            $('#player').attr('src', 'src/player/player_touched.gif');
            Play_Die();
            Play_Die();
            Play_Die();
            $(window).off();
            clearInterval(t);
            clearInterval(s);
            clearInterval(p);
            clearInterval(score);
            touched++;
            setTimeout(function () {
              Game_Over();
            }, 2000);
          }
          if (touched == 2) {
            clearInterval(a);
          }
        }
      }
    }
    else {
      for (i = 0; i < actasteroids.length; ++i) {
        if (isColliding($('#player'), $(actasteroids[i]))) {
          shielded = false;
          var temp = actasteroids[i].id;
          removeElement(document.getElementById(temp))
        }
      }
    }
  }
  var a = setInterval(collide_check, 10)
}

$("#Reset").click(function () {
  document.getElementById('btns').style.zIndex = 5;
  document.getElementById('menu').style.zIndex = 5;
  document.getElementById('GOscreen').style.zIndex = -1;
  astProjectileSpeed = 0.5;
  score_num = 0;
  level_num = 0;
  $('#player').attr('src', 'src/player/player.gif');
  SkipHTP = true;

});


function Game_Over() {
  document.getElementById('game_right_section2').style.zIndex = -1;
  document.getElementById('actual_game').style.zIndex = -1;
  document.getElementById('btns').style.zIndex = -1;
  document.getElementById('menu').style.zIndex = 5;
  document.getElementById('GOscreen').style.zIndex = 7;
  document.getElementById('scoredisp').innerHTML = score_num;
  document.getElementById('player').style.left = '600px';
  document.getElementById('player').style.top = '300px';
  const actasteroids2 = document.querySelectorAll("div[id^='a-']");
  for (i = 0; i < actasteroids2.length; ++i) {
    var temp = actasteroids2[i].id;
    removeElement(document.getElementById(temp));
  }
}

$("#HTPStart").click(GetReady);
function GetReady() {
  document.getElementById('game_right_section2').style.zIndex = 5;
  document.getElementById('Ready').style.zIndex = 5;
  document.getElementById('HTP').style.zIndex = -1;
  Startgame();
  setTimeout(function () {
    game_t2();
  }, 3000);
}

$("#Play").click(HowToPlay);
function HowToPlay() {
  document.getElementById('menu').style.zIndex = -1;
  if (SkipHTP) {
    document.getElementById('game_right_section2').style.zIndex = 5;
    document.getElementById('Ready').style.zIndex = 5;
    Startgame();
    setTimeout(function () {
      game_t2();
    }, 3000);

  }
  else {
    document.getElementById('HTP').style.zIndex = 3;
  }


}

$("#sett").click(OpenSettings);
function OpenSettings() {
  document.getElementById('settings').style.zIndex = 3;

  var slider = document.getElementById("myRange");
  var output = document.getElementById("VolNum");
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
    vol = this.value;
  }
}

$("#Close").click(closeSettings);
function closeSettings() {
  document.getElementById('settings').style.zIndex = -1;
}

$("#easy").click(SelectEasy);
function SelectEasy() {
  document.getElementById('easy').style.border = "3px solid yellow";
  document.getElementById('norm').style.border = "3px solid black";
  document.getElementById('hard').style.border = "3px solid black";
  EASY = true;
  NORMAL = false;
  HARD = false;
}

$("#norm").click(SelectNorm);
function SelectNorm() {
  document.getElementById('easy').style.border = "3px solid black";
  document.getElementById('norm').style.border = "3px solid yellow";
  document.getElementById('hard').style.border = "3px solid black";
  EASY = false;
  NORMAL = true;
  HARD = false;
}

$("#hard").click(SelectHard);
function SelectHard() {
  document.getElementById('easy').style.border = "3px solid black";
  document.getElementById('norm').style.border = "3px solid black";
  document.getElementById('hard').style.border = "3px solid yellow";

  EASY = false;
  NORMAL = false;
  HARD = true;
}

$('#easy').mouseover(ehiglight);
$('#norm').mouseover(nhiglight);
$('#hard').mouseover(hhiglight);

$('#easy').mouseout(e2higlight);
$('#norm').mouseout(n2higlight);
$('#hard').mouseout(h2higlight);

function ehiglight() {
  if (document.getElementById('easy').style.border == "3px solid black") {
    document.getElementById('easy').style.border = "3px solid green";
  }
}
function nhiglight() {
  if (document.getElementById('norm').style.border == "3px solid black") {
    document.getElementById('norm').style.border = "3px solid green";
  }
}
function hhiglight() {
  if (document.getElementById('hard').style.border == "3px solid black") {
    document.getElementById('hard').style.border = "3px solid green";
  }
}
function e2higlight() {
  if (document.getElementById('easy').style.border == "3px solid green") {
    document.getElementById('easy').style.border = "3px solid black";
  }
  if (document.getElementById('easy').style.border == "3px solid yellow") {
    document.getElementById('easy').style.border = "3px solid yellow";
  }
}
function n2higlight() {
  if (document.getElementById('norm').style.border == "3px solid green") {
    document.getElementById('norm').style.border = "3px solid black";
  }
  if (document.getElementById('norm').style.border == "3px solid yellow") {
    document.getElementById('norm').style.border = "3px solid yellow";
  }
}
function h2higlight() {
  if (document.getElementById('hard').style.border == "3px solid green") {
    document.getElementById('hard').style.border = "3px solid black";
  }
  if (document.getElementById('hard').style.border == "3px solid yellow") {
    document.getElementById('hard').style.border = "3px solid yellow";
  }
}

// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}

// Starter Code for randomly generating and moving an asteroid on screen
// Feel free to use and add additional methods to this class
class Asteroid {
  // constructs an Asteroid object
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Asteroid div and append it to DOM so it can be modified later
    let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAstroid' > <img src = 'src/asteroid.png'/></div>";
    onScreenAsteroid.append(objectString);
    // select id of this Asteroid
    this.id = $('#a-' + currentAsteroid);
    currentAsteroid++; // ensure each Asteroid has its own id
    // current x, y position of this Asteroid
    this.cur_x = 0; // number of pixels from right
    this.cur_y = 0; // number of pixels from top

    /*------------------------Private Member Variables------------------------*/
    // member variables for how to move the Asteroid
    this.x_dest = 0;
    this.y_dest = 0;
    // member variables indicating when the Asteroid has reached the boarder
    this.hide_axis = 'x';
    this.hide_after = 0;
    this.sign_of_switch = 'neg';
    // spawn an Asteroid at a random location on a random side of the board
    this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
    if (this.hide_axis == 'x') {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_x > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_x < this.hide_after) {
          return true;
        }
      }
    }
    else {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_y > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_y < this.hide_after) {
          return true;
        }
      }
    }
    return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
    // ensures all asteroids travel at current level's speed
    this.cur_y += this.y_dest * astProjectileSpeed;
    this.cur_x += this.x_dest * astProjectileSpeed;
    // update asteroid's css position
    this.id.css('top', this.cur_y);
    this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
    // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
    let x = getRandomNumber(0, 1280);
    let y = getRandomNumber(0, 720);
    let floor = 784;
    let ceiling = -64;
    let left = 1344;
    let right = -64;
    let major_axis = Math.floor(getRandomNumber(0, 2));
    let minor_aix = Math.floor(getRandomNumber(0, 2));
    let num_ticks;

    if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
    }
    if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

      this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

      this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
    }
    // show this Asteroid's initial position on screen
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
    // normalize the speed s.t. all Asteroids travel at the same speed
    let speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
    this.x_dest = this.x_dest / speed;
    this.y_dest = this.y_dest / speed;
  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    // update asteroid position on screen
    asteroid.updatePosition();

    // determine whether asteroid has reached its end position, i.e., outside the game border
    if (asteroid.hasReachedEnd()) {
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
