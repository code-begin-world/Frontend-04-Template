function findABCDEF(str) {
  let findA = false;
  let findB = false;
  let findC = false;
  let findD = false;
  let findE = false;
  let findF = false;

  for (let c of str) {
    if (c == 'a') {
      findA = true;
    } else if (findA && c == 'b') {
      findB = true;
    } else if (findB && c == 'c') {
      findC = true;
    } else if (findC && c == 'd') {
      findD = true;
    } else if (findD && c == 'e') {
      findE = true;
    } else if (findE && c == 'f') {
      findF = true;
      break;
    } else {
      findA = false;
      findB = false;
      findC = false;
      findD = false;
      findE = false;
      findF = false;
    }
  }
  return findF;
}

// test
console.log(findABCDEF('xab'));
console.log(findABCDEF('abc'));
console.log(findABCDEF('abcdef'));
console.log(findABCDEF('abcdefx'));
console.log(findABCDEF('xxabcdefx'));
console.log(findABCDEF('xx_abcdef'));
