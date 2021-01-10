# week 19

## 阻止提交

 `process.exit(1);` 或 `process.exitCode = 1`

```js
const process = require('process');
process.exit(1);
```

## 检查提交的版本

只检查要提交的版本而不是当前工作区的内容，可通过 `git stash`来处理

先 `git stash push -k` 再进行校验，完成后再 `git stash pop`

```sh
await exec('git stash push -k');
const results = await eslint.lintFiles(['src/**/*.js']);
await exec('git stash pop');
```

pre-commit

```js
#!/usr/bin/env node

const process = require('process');
const child_process = require('child_process');

console.log('pre commit');
function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, resolve);
  });
}

// process.exit(1);

const { ESLint } = require('eslint');

(async function main() {
  // 1. Create an instance.
  const eslint = new ESLint();

  // 2. Lint files.
  await exec('git stash push -k');
  const results = await eslint.lintFiles(['src/**/*.js']);
  await exec('git stash pop');

  // 3. Format the results.
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  // 4. Output it.
  console.log(resultText);

  for (let result of results) {
    if (result.errorCount) {
      process.exitCode = 1;
      return;
    }
  }
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});

```


## 无头浏览器

chrome  [headless-chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)

[npm i puppeteer](https://www.npmjs.com/package/puppeteer)

