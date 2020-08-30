let BOARD_SIZE = 15;
let CELL_SIZE = 60;
if (screen.width < BOARD_SIZE * CELL_SIZE) {
    CELL_SIZE = (screen.width / BOARD_SIZE) >> 0;
}

const canvas = document.createElement('canvas');
canvas.width = BOARD_SIZE * CELL_SIZE;
canvas.height = BOARD_SIZE * CELL_SIZE;

const ctx = canvas.getContext('2d');

document.getElementById('app').appendChild(canvas);

// 当前玩家
let gameEnd = false;
let player = 1;
// 当前棋盘
let chessBoard = [];
// 所有赢的可能结果
const winedResult = [];
let winedCount = 0;
let player1Win = [];
let player2Win = [];

function calcWinedResult() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        winedResult[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            winedResult[i][j] = [];
            // for (let k = 0; k < BOARD_SIZE; k++) {
            // }
        }
    }
    let count = 0;
    // 所有的横线 胜利的可能
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE - 4; j++) {
            for (let k = 0; k < 5; k++) {
                winedResult[i][j + k][count] = true;
            }
            count++;
        }
    }
    console.log(count);

    // 所有的竖线 胜利的可能
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE - 4; j++) {
            for (let k = 0; k < 5; k++) {
                winedResult[j + k][i][count] = true;
            }
            count++;
        }
    }

    // 斜线
    for (let i = 0; i < BOARD_SIZE - 4; i++) {
        for (let j = 0; j < BOARD_SIZE - 4; j++) {
            for (let k = 0; k < 5; k++) {
                winedResult[i + k][j + k][count] = true;
            }
            count++;
        }
    }
    for (let i = 0; i < BOARD_SIZE - 4; i++) {
        for (let j = BOARD_SIZE - 1; j > 3; j--) {
            for (let k = 0; k < 5; k++) {
                winedResult[i + k][j - k][count] = true;
            }
            count++;
        }
    }
    console.log(count);
    winedCount = count;

    player1Win = new Array(count).fill(0);
    player2Win = new Array(count).fill(0);
}
calcWinedResult();

function initChessBoard() {
    chessBoard = new Array(BOARD_SIZE).fill(0).map(_ => {
        return new Array(BOARD_SIZE).fill(0);
    });
    const mid = ((BOARD_SIZE / 2) >> 0) - 1;
    chessBoard[mid][mid] = 1;
    updateWin(mid, mid, 1);
    chessBoard[mid][mid + 1] = 2;
    updateWin(mid, mid + 1, 2);
    chessBoard[mid + 1][mid] = 2;
    updateWin(mid + 1, mid, 2);
    chessBoard[mid + 1][mid + 1] = 1;
    updateWin(mid + 1, mid + 1, 1);
}
initChessBoard();
function drawBoard() {
    ctx.strokeStyle = '#dddddd';
    for (let i = 0; i < BOARD_SIZE; i++) {
        ctx.moveTo(CELL_SIZE / 2 + CELL_SIZE * i, CELL_SIZE / 2);
        ctx.lineTo(CELL_SIZE / 2 + CELL_SIZE * i, CELL_SIZE * BOARD_SIZE - CELL_SIZE / 2);
        ctx.stroke();
        ctx.moveTo(CELL_SIZE / 2, CELL_SIZE / 2 + CELL_SIZE * i);
        ctx.lineTo(CELL_SIZE * BOARD_SIZE - CELL_SIZE / 2, CELL_SIZE / 2 + CELL_SIZE * i);
        ctx.stroke();

        if (/debug/.test(location.search)) {
            ctx.fillText(i, CELL_SIZE / 2 + CELL_SIZE * i - 2, CELL_SIZE / 2 - 4);
            i && ctx.fillText(i, CELL_SIZE / 2 - 14, CELL_SIZE / 2 + CELL_SIZE * i);
        }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (chessBoard[i][j] !== 0) {
                drawChess(i, j, chessBoard[i][j]);
            }
        }
    }
}
drawBoard();

function drawChess(i, j, player) {
    const x = CELL_SIZE / 2 + CELL_SIZE * i;
    const y = CELL_SIZE / 2 + CELL_SIZE * j;
    const r = CELL_SIZE * 0.45;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    // ctx.fill();

    const offset = r * 0.2;
    const gradient = ctx.createRadialGradient(x - offset, y - offset, r, x - offset, y - offset, 0.15 * r);
    if (player == 1) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#666666');
    } else {
        gradient.addColorStop(0, '#d1d1d1');
        gradient.addColorStop(1, '#f9f9f9');
    }
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

canvas.addEventListener('click', function (e) {
    if (gameEnd) return;
    const { offsetX, offsetY } = e;

    const x = (offsetX / CELL_SIZE) >> 0;
    const y = (offsetY / CELL_SIZE) >> 0;

    move(x, y);
});

function move(x, y) {
    if (chessBoard[x][y] !== 0) {
        console.error('已经落子');
        return;
    }
    if (player !== 1) {
        console.error('还没轮到你');
        return;
    }
    chessBoard[x][y] = player;
    drawChess(x, y, player);
    player = 3 - player;

    // 更新结果统计
    updateWin(x, y, 1);
    // for (let i = 0; i < winedCount; i++) {
    //     if (winedResult[x][y][i]) {
    //         player1Win[i]++;
    //         player2Win[i] = 6;
    //         console.log(player1Win[i]);
    //         if (player1Win[i] === 5) {
    //             alert('you win');
    //             gameEnd = true;
    //             break;
    //         }
    //     }
    // }

    if (!gameEnd) {
        AIMove();
    }
}

function AIMove() {
    if (player !== 2) return;

    // 最大得分
    // let maxScore = 0;
    // // 落子位置
    // let x = 0;
    // let y = 0;

    function bestChoice(board, cp, deep, topN = 3) {
        // let maxScore = 0;
        // 前N个最大得分 以及对应的落子位置
        const topNChoice = new Array(topN).fill(0).map(_ => {
            return { score: 0, x: 0, y: 0 };
        });
        function getTopNMin() {
            let min = topNChoice[0];
            for (let i = 1; i < topNChoice.length; i++) {
                if (topNChoice[i].score < min.score) {
                    min = topNChoice[i];
                }
            }
            return min;
        }
        function getTopNMax() {
            let max = topNChoice[0];
            for (let i = 1; i < topNChoice.length; i++) {
                if (topNChoice[i].score >= max.score) {
                    max = topNChoice[i];
                }
            }
            return max;
        }

        const playerScore = [];
        const AIScore = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            playerScore[i] = [];
            AIScore[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                playerScore[i][j] = 0;
                AIScore[i][j] = 0;
            }
        }

        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === 0) {
                    for (let k = 0; k < winedCount; k++) {
                        if (winedResult[i][j][k]) {
                            // if (i == 8 && (j==8||j==5)) debugger
                            // AI 考虑 拦截我方
                            switch (player1Win[k]) {
                                case 1:
                                    playerScore[i][j] += 140;
                                    break;
                                case 2:
                                    playerScore[i][j] += 260;
                                    break;
                                case 3:
                                    playerScore[i][j] += 1000;
                                    break;
                                case 4:
                                    playerScore[i][j] += 10000;
                                    break;
                                default:
                                    break;
                            }
                            // AI 考虑自己走棋
                            switch (player2Win[k]) {
                                case 1:
                                    AIScore[i][j] += 300;
                                    break;
                                case 2:
                                    AIScore[i][j] += 500;
                                    break;
                                case 3:
                                    AIScore[i][j] += 2400;
                                    break;
                                case 4:
                                    AIScore[i][j] += 20000;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    const currentMin = getTopNMin();

                    // 顺便找最大分数
                    // 从玩家角度考虑
                    if (playerScore[i][j] > currentMin.score) {
                        // 玩家得分最高的点 就是AI要占领的点
                        currentMin.score = playerScore[i][j];
                        currentMin.x = i;
                        currentMin.y = j;
                    } else if (playerScore[i][j] == currentMin.score) {
                        // 若玩家得分相同 AI 会找对自己更有利的点
                        if (AIScore[i][j] >= AIScore[currentMin.x][currentMin.y]) {
                            currentMin.x = i;
                            currentMin.y = j;
                        }
                    }

                    // AI 自己的考虑
                    if (AIScore[i][j] > currentMin.score) {
                        // 自己最有优势的点
                        currentMin.score = AIScore[i][j];
                        currentMin.x = i;
                        currentMin.y = j;
                    } else if (AIScore[i][j] == currentMin.score) {
                        // 自己优势相同则选玩家更好的点， 破坏对手赢的可能性
                        if (playerScore[i][j] >= playerScore[currentMin.x][currentMin.y]) {
                            currentMin.x = i;
                            currentMin.y = j;
                        }
                    }
                }
            }
        }

        if (deep == 1) {
            // return getTopNMax(topNChoice);
            return topNChoice;
        }

        console.log(topNChoice);
        // 针对已经找到的 topN 的结果 尝试走一步 再比较
        topNChoice.map(choice => {
            // 尝试走一步
            const nextBoard = copyBoard(board);
            const { score, x, y } = choice;
            nextBoard[x][y] = cp;

            // 这一步之后对方的结果
            const rivalTopNChoice = bestChoice(nextBoard, 3 - cp, deep - 1);
            console.log(choice, rivalTopNChoice);
            //  把下一步的加进来
        });
        return topNChoice;
        // return {
        //     maxScore,
        //     x,
        //     y
        // };
    }

    let { maxScore, x, y } = bestChoice(chessBoard, player, 3);

    // 落子
    chessBoard[x][y] = player;
    drawChess(x, y, player);
    player = 3 - player;

    // 更新结果统计
    updateWin(x, y, 2);
    // for (let i = 0; i < winedCount; i++) {
    //     if (winedResult[x][y][i]) {
    //         player2Win[i]++;
    //         player1Win[i] = 6;
    //         if (player2Win[i] === 5) {
    //             alert('AI win');
    //             gameEnd = true;
    //             break;
    //         }
    //     }
    // }
}

function updateWin(x, y, player) {
    // 更新结果统计
    for (let i = 0; i < winedCount; i++) {
        if (winedResult[x][y][i]) {
            if (player == 2) {
                player2Win[i]++;
                player1Win[i] = 6;
                if (player2Win[i] === 5) {
                    setTimeout(() => {
                        alert('AI win');
                    });
                    gameEnd = true;
                    break;
                }
            } else if (player == 1) {
                player1Win[i]++;
                player2Win[i] = 6;
                if (player1Win[i] === 5) {
                    setTimeout(() => {
                        alert('you win');
                    });
                    gameEnd = true;
                    break;
                }
            }
        }
    }
}

function copyBoard(board) {
    return board.map(function (row) {
        return Object.create(row);
    });
}
