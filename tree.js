class TreeFacade {
    constructor(depth, membersQuantity = Math.random() > 0.5 ? 2 : 1) {
        console.log(`Генерация дерева с глубиной: ${depth} и количеством узлов: ${membersQuantity}`);

        this.depth = depth;
        this.membersQuantity = membersQuantity;
    }

    generateAndPrint() {
        console.log(this.format(this.generateTree()));
    }

    generateTree(depth = this.depth) {
        return depth === 1
            ? this.generateList(() => {})
            : this.generateList(() => this.generateTree(depth - 1));
    }

    format(tree, depth = 1) {
        if (!tree || tree.length === 0) return '';

        const lvlSeparator = depth === 1 ? '--' : '|__';
        const levelIndent = Array(depth).join('    ');

        return tree
            .map(elem => {
                const nameFormatted = `(lvl: ${depth}) "${elem.name}"`;
                const nodesFormatted = tree.length > 0 ? this.format(elem.items, depth + 1) : '';

                return `${levelIndent}${lvlSeparator}${nameFormatted}\n`.concat(nodesFormatted);
            })
            .join('');
    }

    generateSymbol() {
        return String.fromCharCode(Number((Math.random() * 10000).toFixed()));
    }

    generateList(getItems) {
        return Array.from({ length: this.membersQuantity }, () => ({ name: this.generateSymbol(), items: getItems() }));
    }
}

const depthPatternShort = /-d\s*[\d]+/;
const depthPatternLong = /--depth\s*[\d]+/;

class MainFacade {
    constructor(TreeFacade) {
        this.treeFacade = new TreeFacade(this.depth);
    }

    get depth() {
        const [_, __, ...rest] = process.argv;
        this.paramsAsString = rest.join(' ');

        const [depthRaw] = this.paramsAsString.match(depthPatternShort) || this.paramsAsString.match(depthPatternLong) || [];

        return Number(depthRaw.replace(/[^\d]/g, ''));
    }

    generateAndPrint() {
        return this.treeFacade.generateAndPrint();
    }
}



try {
    new MainFacade(TreeFacade).generateAndPrint();
} catch (err) {
    console.log('Проверьте корректность ввода: "-d" или "--depth" для глубины вложенности');
}

