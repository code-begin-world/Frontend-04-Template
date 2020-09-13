let dragable = document.querySelector('#dragable');

dragable.addEventListener('mousedown', function (e) {
    const offsetX = e.clientX;
    const offsetY = e.clientY;
    // 起始的  transform
    let startTransform = window.getComputedStyle(dragable).transform;
    if (/^matrix\(1, 0, 0, 1, \d+, \d+\)$/.test(startTransform)) {
        startTransform = startTransform
            .replace(/matrix\(1, 0, 0, 1, (.+)\)$/, '$1')
            .split(',')
            .map(item => {
                return parseInt(item, 10);
            });
    } else {
        startTransform = [0, 0];
    }
    const [baseX, baseY] = startTransform;
    let up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
    };
    let move = ev => {
        // dragable.style.transform = `translate(${baseX + ev.clientX - offsetX}px, ${baseY + ev.clientY - offsetY}px)`;
        let range = findNearlyRange(ev.clientX, ev.clientY);

        range.insertNode(dragable);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
});

let container = document.getElementById('container');
let ranges = [];
for (let i = 0; i < container.childNodes[0].textContent.length; i++) {
    let range = document.createRange();
    range.setStart(container.childNodes[0], i);
    range.setEnd(container.childNodes[0], i);
    // console.log(range.getBoundingClientRect());
    ranges.push(range);
}

function findNearlyRange(x, y) {
    let min = Infinity;
    let minRange = null;
    for (let range of ranges) {
        const rect = range.getBoundingClientRect();
        let d = (rect.x - x) ** 2 + (rect.y - y) ** 2;

        if (d < min) {
            min = d;
            minRange = range;
        }
    }
    return minRange;
}

document.addEventListener('selectstart', e => e.preventDefault());
