function findA(str) {
  let result = false;
  // str = str.toUpperCase();
  for (let s of str) {
    if (s === "A") return true;
  }

  return result;
}

console.log(findA("nnna"));
console.log(findA("abc"));
