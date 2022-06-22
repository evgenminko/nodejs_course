class TreeFacade {
    constructor() {
        this.membersQuantity = 0;
    }

    generate(depth, membersQuantity) {
        this.membersQuantity = membersQuantity;
        console.log(this.format(this.generateTree(depth)));
    }

    generateTree(depth) {
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

const [_, __, ...rest] = process.argv;
const paramsAsString = rest.join(' ');

const depthPatternShort = /-d\s*[\d]+/;
const depthPatternLong = /--depth\s*[\d]+/;

try {
    const [depthRaw] = paramsAsString.match(depthPatternShort) || paramsAsString.match(depthPatternLong) || [];
    const depth = Number(depthRaw.replace(/[^\d]/g, ''));

    const membersQuantity = Math.random() > 0.5 ? 2 : 1;

    console.log(`Генерация дерева с глубиной: ${depth} и количеством узлов: ${membersQuantity}`);

    new TreeFacade().generate(depth, membersQuantity);
} catch (err) {
    console.log('Проверьте корректность ввода: "-d" или "--depth" для глубины вложенности');
}

