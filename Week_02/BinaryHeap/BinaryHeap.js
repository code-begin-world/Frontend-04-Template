class BinaryHeap {
    constructor(data = [], compare = (a, b) => a - b) {
        this.data = data;
        this.compare = compare;
    }
    take() {
        if (!this.data.length) return;

        // 最小堆 第一个元素必定是最小元素 直接给即可
        let min = this.data[0];

        this._doRemoveTop();

        return min;
    }
    give(item) {
        // 直接放到最后再最堆进行调整
        this.data.push(item);

        // 需要上比较的 index
        let index = this.data.length - 1;
        let parentIndex = ((index - 1) / 2) >> 0;

        while (index > 0 && this.compare(item, this.data[parentIndex]) < 0) {
            // 移动
            this.data[index] = this.data[parentIndex];
            this.data[parentIndex] = item;
            index = parentIndex;
            parentIndex = ((index - 1) / 2) >> 0;
        }
    }
    get length() {
        return this.data.length;
    }

    _doRemoveTop() {
        // 最后的直接移动到堆顶
        this.data[0] = this.data[this.length - 1];
        this.data.pop();

        const findMin = parentIndex => {
            let parent = this.data[parentIndex];

            let leftIndex = parentIndex * 2 + 1;
            let rightIndex = leftIndex + 1;

            // 没有左子节点
            if (leftIndex >= this.length) {
                return parentIndex;
            }
            // 仅有左节点 直接左节点和父节点即可
            if (rightIndex >= this.length) {
                if (this.compare(this.data[leftIndex], parent) < 0) {
                    return leftIndex;
                }
                return parentIndex;
            }

            // 三个节点都在的情况 取最小值
            const rightCompareLeft = this.compare(this.data[rightIndex], this.data[leftIndex]);
            // 左右节点相同 则取任意和父节点相比
            if (rightCompareLeft === 0) {
                if (this.compare(this.data[leftIndex], parent) < 0) {
                    return leftIndex;
                } else {
                    return parentIndex;
                }
            }

            if (rightCompareLeft < 0) {
                return rightIndex;
            } else {
                return leftIndex;
            }

            return parentIndex;
        };

        // 最小移走后 调整堆 使得其仍为最小堆
        let parentIndex = 0;
        let minIndex = findMin(0);

        while (minIndex != parentIndex) {
            // 交换位置
            const temp = this.data[parentIndex];
            this.data[parentIndex] = this.data[minIndex];
            this.data[minIndex] = temp;
            // 继续检查
            parentIndex = minIndex;
            minIndex = findMin(parentIndex);
        }
    }
}

var b = new BinaryHeap([1, 6, 2, 7, 9, 6, 4]);
b.take();

const app = document.getElementById('app');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
app.appendChild(canvas);

canvas.width = window.innerWidth - 6 * 2;
canvas.height = window.innerHeight - 6 * 2;

draw(b.data);
function draw(data) {
    var len = data.length;

    // var deep = (Math.log(len) + 1) >> 0;
    var deep = 1;

    while (Math.pow(2, deep) - 1 <= len) {
        deep++;
    }
    console.log(deep);

    var offset = [0, 0];
    var size = [400, 400];
    ctx.translate(size[0] / 2 + offset[0], size[1] + offset[1]);

    drawNode(0, -380, data[0]);
}

function drawNode(x, y, node) {
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '20px / 20 "Cascadia Code"';
    ctx.fillText(node, x - 10, y + 5, 20);
}
