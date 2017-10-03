'use strict';
angular.module('moveApp')
  .controller('moveController', ['$scope','$timeout', function ($scope,$timeout) {
    $scope.width = 5;
    $scope.height = 7;
    $scope.start = function () {
      $scope.started = true;
      $scope.$broadcast('Start');
    };
    $scope.stop = function () {
      $scope.started = false;
      $scope.$broadcast('Stop');
    };

    function getAllBall(mapBall) {
      return _.filter(mapBall, function (a) {
        return a.status === 3 || a.status === 4;
      });
    }

    function findCell(mapBall, x, y) {
      return _.find(mapBall, {x: x, y: y});
    }

    function countOutsideBall(mapBall) {
      if (!mapBall) {
        return false;
      }
      return _.filter(mapBall, function (a) {
        return a.status === 3;
      }).length;
    }

    var isBlocked = function (map, x, y, dx, dy) {
      if (x + dx < 0 || x + dx > $scope.width - 1) {
        return true;
      }
      if (y + dy < 0 || y + dy > $scope.height - 1) {
        return true;
      }
      var newCell = findCell(map, x + dx, y + dy);
      if (!newCell || !newCell.status) {
        return true;
      }
      var stepDx = dx, stepDy = dy;
      if (newCell.status === 3 || newCell.status === 4) {
        var newDx = dx + stepDx, newDy = dy + stepDy;
        if (x + newDx < 0 || x + newDx > $scope.width - 1) {
          return true;
        }
        if (y + newDy < 0 || y + newDy > $scope.height - 1) {
          return true;
        }
        var newerCell = findCell(map, x + newDx, y + newDy);
        while (newerCell.status !== 1 && newerCell.status !== 2) {
          if (x + newDx < 0 || x + newDx > $scope.width - 1) {
            return true;
          }
          if (y + newDy < 0 || y + newDy > $scope.height - 1) {
            return true;
          }
          if (!newerCell.status) {
            return true;
          }
          newDx += stepDx;
          newDy += stepDy;
          newerCell = findCell(map, x + newDx, y + newDy);
        }
        return false;
      }
    };

    function getNewStage(mapBall, dx, dy) {
      var newMap = angular.copy(mapBall);
      var moveSteps = 0;
      _.each(getAllBall(newMap), function (ball) {
        var x = ball.x,
          y = ball.y;
        if (x + dx < 0 || x + dx > $scope.width - 1) {
          return;
        }
        if (y + dy < 0 || y + dy > $scope.height - 1) {
          return;
        }
        var newCell = findCell(newMap, x + dx, y + dy);
        if (newCell && newCell.status) {
          if (!isBlocked(newMap, x, y, dx, dy)) {
            if (!ball.overlapBall) {
              ball.status = (ball.status === 4 ? 2 : 1);
            } else {
              ball.overlapBall = false;
            }
            if (newCell.status == 3 || newCell.status == 4) {
              newCell.overlapBall = true;
            } else {
              newCell.status = (newCell.status === 2 ? 4 : 3);
            }
            if (newCell.status == 3 || newCell.status == 4 || newCell.status == 2) {
              moveSteps++;
            }
          }
        }
      });
      return {
        moveSteps: moveSteps,
        newMap: newMap
      }
    }

    $scope.doPlay = function (direction) {
      _.each(direction, function (d) {
        $timeout(function(){
          $scope.$broadcast(d.direction);
        },5000);
      });
    };
    $scope.clear = function () {
      scope.gridData = _.range($scope.width).map(function (idxX) {
        return _.range($scope.height).map(function (idxY) {
          return {
            x: idxX,
            y: idxY
          };
        })
      });
    };
    $scope.optimize = function (map) {
      var mapBall = [].concat.apply([], map);
      $scope.queue = [mapBall];
      var count = 0;
      $scope.info = [];
      $scope.direction = [];
      var pos = [
        {dx: 0, dy: -1, direction: 'left'}, // left
        {dx: 0, dy: 1, direction: 'right'}, // right
        {dx: -1, dy: 0, direction: 'top'}, // top
        {dx: 1, dy: 0, direction: 'bottom'}]; // bottom
      var i = 0;
      while (countOutsideBall($scope.queue[i]) && count < 5000) {
        _.each(pos, function (p) {
          var newStage = getNewStage($scope.queue[i], p.dx, p.dy);
          if (newStage.moveSteps) {
            $scope.queue.push.apply($scope.queue, [newStage.newMap]);
            $scope.info.push({direction: p.direction, idx: i});
          }
        });
        i++;
        count++;
      }
      console.log('stop after', i);
      if (i === 5000) {
        alert('there is no solution to this case');
        return;
      }
      while (i > 0) {
        var dt = $scope.info[i - 1];
        $scope.direction.push({
          message: 'Move ' + dt.direction,
          direction: dt.direction,
        });
        i = dt.idx;
      }
      $scope.direction = _.reverse($scope.direction);
    }
  }
  ])
;