// 配置相关
const SIZE = 100;
const GAP = 10;
const CELL_SIZE = 8;

// 填充颜色 0 空   1 墙   2 可到达  3 路径  4 目标
const FILL_COLORS = ['#DDD', '#000', 'darkseagreen', 'darkgreen', '#f00'];

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

function fillAim(point) {
    fillPoint(point, 4);
    ctx.strokeStyle = '#f00';
    const [x, y] = point;
    const i = GAP + x * CELL_SIZE;
    const j = GAP + y * CELL_SIZE;
    ctx.strokeRect(i, j, CELL_SIZE, CELL_SIZE);
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

    window.loadMap = function () {
        map.fill(0);

        // prettier-ignore
        [360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,453,454,455,456,457,458,459,460,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,549,550,551,552,553,595,596,597,598,599,648,649,748,749,849,850,851,951,952,1052,1053,1054,1154,1155,1255,1256,1257,1357,1358,1458,1459,1460,1560,1561,1634,1635,1636,1637,1638,1639,1640,1641,1642,1643,1644,1645,1646,1647,1648,1649,1650,1651,1652,1661,1662,1733,1734,1743,1744,1752,1753,1754,1755,1756,1762,1763,1832,1833,1844,1845,1856,1863,1864,1931,1932,1945,1956,1957,1964,1965,2030,2031,2045,2057,2065,2066,2130,2145,2146,2157,2166,2229,2230,2246,2257,2267,2329,2346,2347,2357,2358,2367,2368,2428,2429,2447,2458,2468,2469,2528,2547,2558,2569,2627,2628,2647,2648,2658,2669,2670,2727,2748,2758,2770,2827,2848,2870,2871,2926,2927,2948,2971,3026,3048,3071,3126,3148,3149,3171,3172,3226,3249,3272,3326,3349,3372,3426,3449,3472,3525,3526,3549,3557,3558,3559,3560,3572,3625,3649,3655,3656,3657,3660,3672,3725,3749,3750,3753,3754,3755,3760,3761,3772,3825,3850,3851,3852,3853,3861,3872,3925,3950,3951,3961,3972,4025,4061,4072,4125,4161,4172,4225,4226,4272,4326,4372,4426,4472,4526,4571,4572,4626,4627,4671,4727,4771,4827,4870,4871,4927,4928,4970,5028,5029,5069,5070,5129,5168,5169,5229,5230,5267,5268,5330,5331,5366,5367,5431,5432,5465,5466,5532,5533,5564,5565,5633,5634,5662,5663,5664,5734,5735,5736,5760,5761,5762,5836,5837,5857,5858,5859,5860,5937,5938,5939,5955,5956,5957,6039,6040,6041,6042,6043,6044,6051,6052,6053,6054,6055,6144,6145,6146,6147,6148,6149,6150,6151].forEach(i=>map[i] = 1);

        drawMap();
    };

    app.insertAdjacentHTML('afterbegin', `<button onclick="saveMap()">保存</button><button onclick="clearMap()">清空</button><button onclick="loadMap()">加载预设</button>`);
}
initEvent();

function sleep(t) {
    return new Promise(res => {
        setTimeout(res, t);
    });
}

async function findPath(start, end) {
    fillAim(end);
    const mapCopy = Object.create(map);
    // 记录所有可走到的点
    const queue = [start];

    function insert(x, y, pre) {
        if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;

        const index = y * SIZE + x;

        if (mapCopy[index]) return;

        fillPoint([x, y], 2);

        mapCopy[index] = pre;

        queue.push([x, y]);
    }

    while (queue.length) {
        const point = queue.shift();
        const [x, y] = point;

        if (x === end[0] && y === end[1]) {
            // alert('可到达');
            let path = getPath(point);
            fillPoint(point, 3);
            let i = path.length - 1;
            while (i >= 0) {
                fillPoint(path[i--], 3);
            }
            await sleep(20);
            alert('路径已找到');
            return true;
        }
        await sleep(0);

        insert(x, y - 1, point);
        insert(x + 1, y, point);
        insert(x, y + 1, point);
        insert(x - 1, y, point);

        insert(x - 1, y - 1, point);
        insert(x + 1, y - 1, point);
        insert(x + 1, y + 1, point);
        insert(x - 1, y + 1, point);
    }

    function getPath(point) {
        let path = [];

        let [x, y] = point;
        while (x != start[0] || y != start[1]) {
            const index = y * SIZE + x;
            path.push(mapCopy[index]);
            [x, y] = mapCopy[index];
        }
        // path.reverse();

        return path;
    }
    return false;
}

document.getElementById('go').onclick = function () {
    let s = document.getElementById('start').value;
    let e = document.getElementById('end').value;

    s = s
        .trim()
        .split(',')
        .map(_ => parseInt(_, 10));
    e = e
        .trim()
        .split(',')
        .map(_ => parseInt(_, 10));
    const [x1, y1] = s;
    const [x2, y2] = e;

    let start, end;
    if (x1 >= 0 && x1 < SIZE && y1 >= 0 && y1 < SIZE) {
        if (map[y1 * SIZE + x1] == 1) {
            return alert('起点在墙上');
        }
        start = [x1, y1];
    } else {
        return alert('起点不合法');
    }
    if (x2 >= 0 && x2 < SIZE && y2 >= 0 && y2 < SIZE) {
        if (map[y2 * SIZE + x2] == 1) {
            return alert('终点在墙上');
        }
        end = [x2, y2];
    } else {
        return alert('终点不合法');
    }
    if (start && end) {
        findPath([x1, y1], [x2, y2]);
    }
};
