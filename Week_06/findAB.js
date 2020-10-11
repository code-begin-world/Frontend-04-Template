function findAB(str) {
  let findA = false;
  let findB = false;

  for (let c of str) {
    if (c == 'a') {
      findA = true;
    } else if (findA && c == 'b') {
      findB = true;
      break;
    } else {
      findA = false;
    }
  }

  return findB;
}


console.log(findAB('acbc'));
console.log(findAB('bcabc'));
console.log(findAB('xaxab'));