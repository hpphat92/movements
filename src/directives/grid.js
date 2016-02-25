'use strict';
angular.module('moveApp')
  .directive('grid', ['$timeout', function ($timeout) {
    return {
      scope: {
        width: '@',
        height: '@',
        matrixData: '=gridData'
      },
      replace: true,
      template: '<div class="grid">' +
      '<div ng-repeat="h in matrixData track by $index" class="grid-row">' +
      '<div ng-repeat="w in h track by $index" ng-class="getClassNameForCell(w)" ng-click="changeState(w)" class="grid-cell">' +
      '<span class="white-ball" ng-show="w.status==3||w.status==4"></span>' +
      '</div>' +
      '</div>' +
      '</div>',
      link: function (scope, elem, attr) {
        scope.width = parseInt(scope.width, 10);
        scope.height = parseInt(scope.height, 10);
        scope.matrixData = _.range(scope.width).map(function (idxX) {
          return _.range(scope.height).map(function (idxY) {
            return {
              x: idxX,
              y: idxY
            };
          })
        });
        scope.getClassNameForCell = function (cell) {
          switch (cell.status) {
            case 0:
            case undefined:
              return 'blocker';
            case 1:
              return 'can-move';
            case 2:
              return 'blue-color';
            case 3:
              return 'ball';
            case 4:
              return 'ball-color';
          }
        };
        scope.changeState = function (cellInfo) {
          var cell = cellInfo.status;
          switch (cell) {
            //blocked
            case 0:
            case undefined:
              cell = 1;
              break;
            //can move
            case 1:
              cell = 2;
              break;
            // colored
            case 2:
              cell = 3;
              break;
            case 3:
              cell = 4;
              break;
            case 4:
              cell = 0;
          }
          cellInfo.status = cell;
        };
        scope.range = _.range;

        var isBlocked = function (map, x, y, dx, dy) {
          if (x + dx < 0 || x + dx > scope.width - 1) {
            return true;
          }
          if (y + dy < 0 || y + dy > scope.height - 1) {
            return true;
          }
          var map = scope.matrixData;
          if (!map[x] || !map[x][y] || !map[x + dx][y + dy].status) {
            return true;
          }

          var stepDx = dx, stepDy = dy;
          if (map[x + dx][y + dy].status === 3 || map[x + dx][y + dy].status === 4) {
            var newDx = dx + stepDx, newDy = dy + stepDy;
            if (x + newDx < 0 || x + newDx > scope.width - 1) {
              return true;
            }
            if (y + newDy < 0 || y + newDy > scope.height - 1) {
              return true;
            }
            while (map[x + newDx][y + newDy].status !== 1 && map[x + newDx][y + newDy].status !== 2) {
              if (x + newDx < 0 || x + newDx > scope.width - 1) {
                return true;
              }
              if (y + newDy < 0 || y + newDy > scope.height - 1) {
                return true;
              }
              if(!map[x+newDx][y+newDy].status){
                return true;
              }
              newDx+=stepDx;
              newDy+=stepDy;
            }
            return false;
          }
        };
        var doMove = function (x, y, dx, dy) {
          if (x + dx < 0 || x + dx > scope.width - 1) {
            return;
          }
          if (y + dy < 0 || y + dy > scope.height - 1) {
            return;
          }
          $timeout(function () {
            if(!scope.matrixData[x][y].overlapBall){
              scope.matrixData[x][y].status = (scope.matrixData[x][y].status === 4 ? 2 : 1);
            }else{
              scope.matrixData[x][y].overlapBall = false;
            }
            if(scope.matrixData[x + dx][y + dy].status==3 || scope.matrixData[x + dx][y + dy].status==4){
              scope.matrixData[x + dx][y + dy].overlapBall = true;
            }else{
              scope.matrixData[x + dx][y + dy].status = (scope.matrixData[x + dx][y + dy].status === 2 ? 4 : 3);
            }
          });
        };
        var move = function (y, x) {
          var ballCells = _.filter([].concat.apply([], scope.matrixData), function (d) {
            return d.status === 3 || d.status === 4;
          });
          _.each(ballCells, function (cell) {
            if (!isBlocked(scope.matrixData, cell.x, cell.y, x, y)) {
              doMove(cell.x, cell.y, x, y);
            }
          });
        };


        var keyDownEvnt = function ($event) {
          if ($event.keyCode == 38)
            move(0, -1);
          else if ($event.keyCode == 39)
            move(1, 0);
          else if ($event.keyCode == 40)
            move(0, 1);
          else if ($event.keyCode == 37)
            move(-1, 0); // left
        };

        scope.$on('Start', function () {
          document.addEventListener("keydown", keyDownEvnt, false);
        });

        scope.$on('Stop', function () {
          document.removeEventListener("keydown", keyDownEvnt, false);
        });


        scope.$on('top',function(){
          move(0,-1);
        });
        scope.$on('bottom',function(){
          move(0,1);
        });
        scope.$on('left',function(){
          move(-1,0);
        });
        scope.$on('right',function(){
          move(1,0);
        });
      }
    }
  }]);