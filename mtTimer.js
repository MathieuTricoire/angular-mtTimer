'use strict';

/**
 * @ngdoc function
 * @name mtTimer.timer
 * @requires $timeout
 *
 * @description
 * Creates a timer.
 *
 * @param {int} ms The initial value to start in ms.
 * @param {int=} [step_ms=1000] Step to decrease the timer in ms.
 * @param {function()=} callback A function will be fired when timer was over.
 * @returns {Object} An object with properties who represent state of timer.
 *   {
 *     initial: 1000,
 *     left: {
 *       ms: 1000,
 *       percent: 100
 *     }
 *   }
 *
 * @example Go: http://jsfiddle.net/tricky21/4FZXh/
 */
angular.module('mtTimer', []).
  value('version', '0.1').
  factory('timer', ['$timeout', function($timeout) {
    return function (ms, step_ms, callback) {
      step_ms = angular.isNumber(step_ms) ? parseInt(step_ms, 10) : 1000;

      var initial = parseInt(ms, 10),
        left_ms = initial + step_ms;

      var timer = {
        initial: initial,
          left: {
            ms: left_ms,
            percent: 100
        }
      };

      (function tick() {
        left_ms = left_ms - step_ms;

        if (left_ms > 0) {
          $timeout(tick, step_ms);
        } else if (typeof callback === 'function') {
          $timeout(callback);
        }

        timer.initial = initial;
        timer.left.ms = left_ms;
        timer.left.percent = Math.round(left_ms / initial * 100);
      })();

      return timer;
    };
  }]);