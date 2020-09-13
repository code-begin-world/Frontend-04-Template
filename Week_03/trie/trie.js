let $ = Symbol('$');
class Trie {
    constructor() {
        this.root = Object.create(null);
    }
    insert(word) {
        let node = this.root;

        for (let c of word) {
            if (!node[c]) {
                node[c] = Object.create(null);
            }
            node = node[c];
        }
        if (!($ in node)) {
            node[$] = 0;
        }

        node[$]++;
    }
    most() {
        let max = 0;
        let maxWord = '';
        const visit = (node, word) => {
            // 到达单词结尾
            if (node[$] && node[$] > max) {
                max = node[$];
                maxWord = word;
            }
            for (let letter in node) {
                visit(node[letter], word + letter);
            }
        };
        visit(this.root, '');
        console.log('maxWord', maxWord);
        console.log('max', max);
        return [maxWord, max];
    }
}
