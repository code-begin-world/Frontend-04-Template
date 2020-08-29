class Game {
    constructor() {
        document.querySelector('#app').innerHTML = '';
        this.end = false;
        this.chessboard = new Array(9).fill(0);
        this.cp = 1;
        this.cellTextArr = ['', '🔴', '❌'];

        this.init();
    }

    init() {
        const chessboard = this.chessboard;
        const cellTextArr = this.cellTextArr;
        const d = document.createDocumentFragment();
        const h3 = document.createElement('h3');
        h3.textContent = '当前玩家：' + cellTextArr[this.cp];

        const that = this;

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            const x = i % 3;
            const y = (i / 3) >> 0;

            cell.setAttribute('class', `cell cell-${x}-${y}`);
            cell.dataset['x'] = x;
            cell.dataset['y'] = y;
            cell.dataset['i'] = i;
            cell.appendChild(
                document.createTextNode(
                    // arr[i][j] === 1 ? '🔴' : (arr[i][j] === 2 ? '❌' : "")
                    cellTextArr[chessboard[i]]
                )
            );
            cell.addEventListener(
                'click',
                function () {
                    if (that.end || this.classList.contains('active')) return;
                    // this.classList.add('active');
                    // chessboard[this.dataset.y][this.dataset.x] = cp;
                    // this.textContent = cellTextArr[cp];
                    // cp = 3 - cp;
                    that.move(this.dataset.x, this.dataset.y, this);
                    h3.textContent = '当前玩家：' + cellTextArr[that.cp];
                },
                true
            );
            d.appendChild(cell);

            d.appendChild(h3);
        }

        this.$tip = document.createElement('div');
        this.$suggest = document.createElement('div');

        d.appendChild(this.$tip);
        d.appendChild(this.$suggest);

        document.querySelector('#app').appendChild(d);
    }
    /**
     * 落子的逻辑
     * @param {number} i x 位置
     * @param {number} j y 位置
     * @param {HTMLElement} cell 点击的dom
     */
    move(i, j, cell) {
        i = parseInt(i, 10);
        j = parseInt(j, 10);
        const index = j * 3 + i;

        this.chessboard[index] = this.cp;
        if (cell) {
            // const cell = document.querySelector(`.cell.cell-${i}-${j}`);
            cell.textContent = this.cellTextArr[this.cp];
            cell.classList.add('active');
        }
        // 检查当前局面是否赢
        const res = this.checkWin(this.chessboard, this.cp);
        if (res.win) {
            this.end = true;
            setTimeout(() => {
                alert(`游戏结束，${this.cellTextArr[res.player]} 获得胜利`);
            }, 0);
            return;
        }
        this.cp = 3 - this.cp;

        // 推测下一步谁会赢
        const willWin = this.willWin(this.chessboard, this.cp);
        console.log(willWin);
        if (willWin != null) {
            this.$tip.textContent = `AI 预测: 落子到 (${willWin})，${this.cellTextArr[this.cp]} 将赢得比赛`;
        } else {
            this.$tip.textContent = '';
        }

        this.aiMove();
        // const suggest = this.bestChoice(this.chessboard, this.cp);
        // if (suggest.point != null) {
        //     this.$suggest.textContent = `AI 建议： 落子到 (${suggest.point}) ， 结果是 ${suggest.result > 0 ? '胜' : '平局'}`;
        // } else {
        //     this.$suggest.textContent = '';
        // }
    }

    aiMove() {
        const suggest = this.bestChoice(this.chessboard, this.cp);
        // if (suggest.point != null) {
        //     this.$suggest.textContent = `AI 建议： 落子到 (${suggest.point}) ， 结果是 ${suggest.result > 0 ? '胜' : '平局'}`;
        // } else {
        //     this.$suggest.textContent = '';
        // }

        if (suggest.point != null) {
            this.chessboard[suggest.point] = this.cp;
            const x = suggest.point % 3;
            const y = (suggest.point / 3) >> 0;
            const cell = document.querySelector(`.cell.cell-${x}-${y}`);
            cell.textContent = this.cellTextArr[this.cp];
            cell.classList.add('active');
            // 检查当前局面是否赢
            const res = this.checkWin(this.chessboard, this.cp);
            if (res.win) {
                this.end = true;
                setTimeout(() => {
                    alert(`游戏结束，${this.cellTextArr[res.player]} 获得胜利`);
                }, 0);
                return;
            }
            this.cp = 3 - this.cp;
        }
    }

    /**
     * 检查当前局面某人是否赢
     * @param {number []} chessboard  棋盘数组
     * @param {number} player 玩家
     */
    checkWin(chessboard, player) {
        let winedPlayer = 0;
        const arr = chessboard;
        const win = this.winedLins.some(line => {
            const [i, j, k] = line;
            // console.log(line);
            if (arr[i] === player && arr[i] === arr[j] && arr[j] === arr[k]) {
                winedPlayer = arr[i];
                return true;
            }
            return false;
        });

        // console.log(win, winedPlayer);

        // return win;
        return {
            win,
            player: winedPlayer
        };
    }

    willWin(arr, player) {
        for (let i = 0; i < 9; i++) {
            if (arr[i]) continue;

            const nextArr = Object.create(arr);
            nextArr[i] = player;
            const res = this.checkWin(nextArr, player);
            if (res.win) {
                // console.log('xxx');
                return i;
            }
        }

        return null;
    }

    bestChoice(chessboard, player) {
        let point = null;
        // 直接要赢的情况
        if ((point = this.willWin(chessboard, player))) {
            return {
                point,
                result: 1
            };
        }

        let result = -2;
        for (var i = 0; i < 9; i++) {
            if (chessboard[i]) continue;

            // 尝试走一步
            const nextState = Object.create(chessboard);
            nextState[i] = player;
            // 之后检查对方的结果
            const rival = this.bestChoice(nextState, 3 - player).result;

            // 若对方结果取反即代表对我方最有利的 若这个结果好，则记录下来
            if (-rival > result) {
                result = -rival;
                point = i;
            }
            // 找到一个可以赢的点就可以退出了
            if (result == 1) {
                break;
            }
        }
        return {
            point,
            result: point != null ? result : 0
        };
    }

    /** 所有会赢的情况 */
    winedLins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
}

new Game();
