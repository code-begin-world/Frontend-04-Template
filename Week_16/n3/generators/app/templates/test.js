var assert = require('assert');

function add(a, b) {
  return a + b;
}

describe('测试', function () {
  it('1 + 1 = 2', function () {
    assert.equal(add(1, 1), 2);
  });
});
