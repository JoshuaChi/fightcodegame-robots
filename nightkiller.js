
var Robot = function(robot) {
  robot.turn(45);
  robot.rotateCannon(45);
  robot.ahead(10);
  this.lastEnemyBearing = null;
  this.clone = null;
};


Robot.prototype.isLeft = function(me) {
  if(me.arenaWidth / 2 > me.position.x) {
    return false;
  }
  return true;
}

Robot.prototype.isUp = function(me) {
  if(me.arenaHeight / 2 > me.position.y){
    return true;
  }
  return false;
}

Robot.prototype.turn1 = function(robot, bearing) {
  robot.turn(bearing);
}

Robot.prototype.onIdle = function(ev) {
  var robot;
  robot = ev.robot;
  if (this.lastEnemyBearing != null ) {
    robot.rotateCannon(this.lastEnemyBearing);
  }
  robot.ahead(0.5);
};

// this method gets called whenever we hit another robot...
Robot.prototype.onRobotCollision = function(ev) {
  var robot = ev.robot;
  var collidedRobot = ev.collidedRobot;
  this.turn1(robot, collidedRobot.bearing);
};

// this method gets called whenever we hit a wall...
Robot.prototype.onWallCollision = function(ev) {
  var robot = ev.robot;
  robot.turn(10);
  //robot.rotateCannon(30);
  robot.ahead(10);
};

// yay we see another robot! time to wreak some havoc...
Robot.prototype.onScannedRobot = function(ev) {
  var robot;
  var scannedRobot = ev.scannedRobot;
  robot = ev.robot;
  if (robot.id == scannedRobot.parentId || robot.parentId == scannedRobot.id) {
    return;
  }
  this.lastEnemyBearing = scannedRobot.bearing;
  this.clone = robot.clone();

  if ((scannedRobot.parentId == null && robot.parentId == null) || (scannedRobot.parentId == null && robot.parentId && robot.parentId != scannedRobot.id)) {
    for(var i = 0; i < 300; i++) {
      robot.fire();
    }
  }
  //robot.turn(scannedRobot.bearing);
  robot.ahead(30);
};

// ohhh... we were hit by another robot...
Robot.prototype.onHitByBullet = function(ev) {
  this.clone = ev.robot.clone();
  var robot;
  robot = ev.robot;
  this.lastEnemyBearing = ev.bearing;
  robot.ahead(20);
  robot.disappear();
};
