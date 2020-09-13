function test(size, range, length) {
    function randWord(len) {
        let s = '';
        for (let i = 0; i < len; i++) {
            s += String.fromCharCode(((Math.random() * range) >> 0) + 97);
        }
        return s;
    }

    let trie = new Trie();

    console.log(trie);
    for (let i = 0; i < size; i++) {
        trie.insert(randWord(length ? length : (Math.random() * 4 + 2) >> 0));
    }
    var most = trie.most();
    console.log('most', most);
    document.body.insertAdjacentHTML('afterbegin', `<h3 style="padding-left:8px">most: ${most[0]}, times: ${most[1]}</h3>`);

    function trie2node(trieNode) {
        const arr = [];
        for (var letter in trieNode) {
            var item = {
                name: letter,
                collapsed: true
            };
            if (trieNode[letter][$]) {
                item.value = trieNode[letter][$];
                item.name = letter + ` [$](${item.value})`;

                // 标记最多次数的
                if (item.value == most[1]) {
                    item.label = {
                        borderColor: '#ff0000',
                        borderWidth: 1,
                        padding: 4,
                        backgroundColor: '#ff0000',
                        color: '#ffffff'
                    };
                }
            }
            item.children = trie2node(trieNode[letter]);

            arr.push(item);
        }
        return arr;
    }
    const treeData = {
        name: 'trie',
        children: trie2node(trie.root, false)
    };
    // expand most path
    let level = 0;
    function expandMost(list) {
        for (let item of list) {
            const letter = item.name;
            if (letter == most[0][level]) {
                item.collapsed = false;
                level++;

                item.label = Object.assign(item.label || {}, {
                    borderColor: '#ff0000',
                    borderWidth: 1,
                    padding: 4,
                    backgroundColor: '#ff0000',
                    color: '#ffffff'
                });

                expandMost(item.children);
                break;
            }
        }
    }
    expandMost(treeData.children);

    console.log(treeData);

    var myChart = echarts.init(document.querySelector('#show'));
    myChart.setOption({
        // initialTreeDepth: length + 1,
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                // initialTreeDepth: length - 1,
                type: 'tree',

                data: [treeData],

                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',

                symbolSize: 7,

                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 12
                },

                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                },

                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    });
}
// test(100000, 26, 4);
test(1000, 4, 4);
