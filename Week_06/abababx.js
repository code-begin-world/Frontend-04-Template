function find_abababx(str) {
  let state = start;

  for (let c of str) {
    state = state(c);
    // console.log(c, state.name);
    if (state === end) return true;
  }

  return state == end;
}

function start(c) {
  if (c == 'a') {
    return foundA;
  }
  return start;
}
function end(c) {
  return end;
}

function foundA(c) {
  if (c == 'b') {
    return foundB;
  }
  return start(c);
}

function foundB(c) {
  if (c == 'a') {
    return foundA2;
  }
  return start(c);
}

function foundA2(c) {
  if (c == 'b') {
    return foundB2;
  }
  return start(c);
}

function foundB2(c) {
  if (c == 'a') {
    return foundA3;
  }
  return start(c);
}
function foundA3(c) {
  if (c == 'b') {
    return foundB3;
  }
  return start(c);
}
function foundB3(c) {
  if (c == 'x') {
    return end;
  }
  // 第三个 b 不匹配 可回到第二个 b 继续
  return foundB2(c);
}

// abababx
console.log(find_abababx('abababy')); 
console.log(find_abababx('abababx'));
console.log(find_abababx('ababababx'));
console.log(find_abababx('ababababababx'));
console.log(find_abababx('abababxabababx'));
