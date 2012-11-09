'use strict';

describe('mtTimer', function() {

  var timer = null,
    $timeout = null;

  beforeEach(function() {
    module('mtTimer');

    inject(function(_timer_, _$timeout_) {
      timer = _timer_;
      $timeout = _$timeout_;
    });
  });

  it('should decrease the left time', function() {
    var t = timer();
    expect(isNaN(t.left.ms)).toBe(true);
    expect(isNaN(t.left.percent)).toBe(true);
    expect(isNaN(t.initial)).toBe(true);

    var t = timer(3000);
    expect(t.left.ms).toBe(3000);
    expect(t.left.percent).toBe(100);
    expect(t.initial).toBe(3000);

    $timeout.flush();
    expect(t.left.ms).toBe(2000);
    expect(t.left.percent).toBe(67);
    expect(t.initial).toBe(3000);

    $timeout.flush();
    expect(t.left.ms).toBe(1000);
    expect(t.left.percent).toBe(33);
    expect(t.initial).toBe(3000);

    $timeout.flush();
    expect(t.left.ms).toBe(0);
    expect(t.left.percent).toBe(0);
    expect(t.initial).toBe(3000);
  });

  it('should accept a step parameter', function() {
    var t = timer(1000, 500);
    expect(t.left.ms).toBe(1000);
    expect(t.left.percent).toBe(100);
    expect(t.initial).toBe(1000);

    $timeout.flush();
    expect(t.left.ms).toBe(500);
    expect(t.left.percent).toBe(50);
    expect(t.initial).toBe(1000);

    $timeout.flush();
    expect(t.left.ms).toBe(0);
    expect(t.left.percent).toBe(0);
    expect(t.initial).toBe(1000);


    var t = timer(1000, 'this is not a number !');
    expect(t.left.ms).toBe(1000);
    expect(t.left.percent).toBe(100);
    expect(t.initial).toBe(1000);

    $timeout.flush();
    expect(t.left.ms).toBe(0);
    expect(t.left.percent).toBe(0);
    expect(t.initial).toBe(1000);
  });

  it('should invoke callback when timer is over', function() {
    var is_called = false;
    timer(1000, null, function() {
        is_called = true;
    });
    expect(is_called).toBe(false);

    $timeout.flush();
    expect(is_called).toBe(true);
  });

  it('should not be affected when properties are changed during processing', function() {
    var t = timer(1000);
    expect(t.left.ms).toBe(1000);
    expect(t.left.percent).toBe(100);
    expect(t.initial).toBe(1000);

    t.left.ms = 5000;
    t.left.percent = 10;
    t.initial = 10000;

    $timeout.flush();
    expect(t.left.ms).toBe(0);
    expect(t.left.percent).toBe(0);
    expect(t.initial).toBe(1000);
  });

  it('should be independent', function() {
    var t1 = timer(3000);
    expect(t1.left.ms).toBe(3000);
    expect(t1.left.percent).toBe(100);
    expect(t1.initial).toBe(3000);

    $timeout.flush();
    expect(t1.left.ms).toBe(2000);
    expect(t1.left.percent).toBe(67);
    expect(t1.initial).toBe(3000);

    var t2 = timer(5000);
    expect(t2.left.ms).toBe(5000);
    expect(t2.left.percent).toBe(100);
    expect(t2.initial).toBe(5000);

    $timeout.flush();
    // t1
    expect(t1.left.ms).toBe(1000);
    expect(t1.left.percent).toBe(33);
    expect(t1.initial).toBe(3000);
    // t2
    expect(t2.left.ms).toBe(4000);
    expect(t2.left.percent).toBe(80);
    expect(t2.initial).toBe(5000);
  });
});