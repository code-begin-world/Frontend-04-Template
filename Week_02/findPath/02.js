// 配置相关
const SIZE = 100;
const GAP = 10;
const CELL_SIZE = 8;

// 填充颜色 0 空   1 墙   2 目标
const FILL_COLORS = ['#DDD', '#000', '#F00'];

const map = (() => {
    const s = localStorage.getItem('savedMap');
    if (s) {
        return JSON.parse(s);
    }
    return new Array(SIZE ** 2).fill(0);
})();

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function drawMap() {
    const w = CELL_SIZE * SIZE + GAP * 2;
    const h = w;
    canvas.width = w;
    canvas.height = h;

    // 清空
    ctx.clearRect(0, 0, w, h);
    app.appendChild(canvas);

    // 填充
    ctx.fillStyle = '#ddd';
    ctx.fillRect(GAP, GAP, w - GAP * 2, h - GAP * 2);

    // 划线 分隔为格子
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    for (let i = 0; i < SIZE + 1; i++) {
        // 竖线
        let x = CELL_SIZE * i + GAP;
        ctx.moveTo(x, GAP);
        ctx.lineTo(x, h - GAP);
        ctx.stroke();
        // ctx.fillText(i, x, GAP, 10);
        // 横线
        let y = CELL_SIZE * i + GAP;
        ctx.moveTo(GAP, y);
        ctx.lineTo(w - GAP, y);
        ctx.stroke();
        // ctx.fillText(GAP, y, i);
    }

    // 检查 map 还原点
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            const index = y * SIZE + x;
            if (map[index]) {
                fillPoint([x, y], map[index]);
            }
        }
    }

    // 标记 中心点
    ctx.strokeStyle = '#f00';
    const mid = GAP + (SIZE / 2 - 1) * CELL_SIZE;
    ctx.strokeRect(mid, mid, CELL_SIZE, CELL_SIZE);
}

drawMap();

function fillPoint(point, type) {
    const [x, y] = point;
    const i = GAP + x * CELL_SIZE + 1;
    const j = GAP + y * CELL_SIZE + 1;

    ctx.fillStyle = FILL_COLORS[type];
    ctx.fillRect(i, j, CELL_SIZE - 2, CELL_SIZE - 2);
}

// fillPoint([0, 0], 1)
// fillPoint([0, 1], 1)
// fillPoint([0, 2], 1)

function initEvent() {
    let mousedown = false;
    let isInCreating = false;
    document.addEventListener('mousedown', function (e) {
        if (e.which == 2) {
            mousedown = false;
            return;
        }
        isInCreating = e.which !== 3;
        mousedown = true;
    });
    document.addEventListener('mouseup', function (e) {
        mousedown = false;
    });
    document.addEventListener('contextmenu', function (e) {
        // e.stopPropagation();
        e.preventDefault();
    });

    function calcPointFromEvent(e) {
        const { offsetX, offsetY } = e;
        const x = ((offsetX - GAP) / CELL_SIZE) >> 0;
        const y = ((offsetY - GAP) / CELL_SIZE) >> 0;

        if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return null;

        console.log(x, y);

        return [x, y];
    }

    canvas.addEventListener('mousemove', function (e) {
        if (!mousedown) return;

        const point = calcPointFromEvent(e);
        if (!point) return;
        const pointType = isInCreating ? 1 : 0;
        fillPoint(point, pointType);
        map[point[1] * SIZE + point[0]] = pointType;
    });

    // 点击也可以画
    canvas.addEventListener('click', function (e) {
        const point = calcPointFromEvent(e);
        if (!point) return;
        const pointType = 1;
        fillPoint(point, pointType);
        map[point[1] * SIZE + point[0]] = pointType;
    });
    canvas.addEventListener('contextmenu', function (e) {
        const point = calcPointFromEvent(e);
        if (!point) return;
        const pointType = 0;
        fillPoint(point, pointType);
        map[point[1] * SIZE + point[0]] = pointType;
    });

    window.saveMap = () => {
        localStorage.setItem('savedMap', JSON.stringify(map));
    };
    window.clearMap = () => {
        map.fill(0);
        saveMap();
        drawMap();
    };

    app.insertAdjacentHTML('afterbegin', `<button onclick="saveMap()">保存</button><button onclick="clearMap()">清空</button>`);
}
initEvent();

function findPath(start, end) {
    const mapCopy = Object.create(map);
    // 记录所有可走到的点
    const queue = [start];

    function insert(x, y) {
        if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;

        const index = y * SIZE + x;

        if (mapCopy[index]) return;

        mapCopy[index] = 2;

        queue.push([x, y]);
    }

    while (queue.length) {
        const [x, y] = queue.shift();

        if (x === end[0] && y === end[1]) {
            return true;
        }
        insert(x, y - 1);
        insert(x + 1, y);
        insert(x, y + 1);
        insert(x - 1, y);
    }
    return false;
}
