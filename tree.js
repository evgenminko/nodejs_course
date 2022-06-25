module.exports.TreeFacade = class TreeFacade {
    constructor(paramsAsString) {
        const [depth] = paramsAsString.match(/(?<=(-d|--depth)\s*)[\d]+/);
        this.depth = Number(depth);

        const [membersQuantity = Math.random() > 0.5 ? 2 : 1] = paramsAsString.match(/(?<=(-m|--members)\s*)[\d]+/) || [];
        this.membersQuantity = Number(membersQuantity);

        console.log(`Генерация дерева с глубиной: "${depth}" и количеством узлов: "${this.membersQuantity}"\n`);
    }

    generate() {
        return Promise.resolve(this.generateTree());
    }

    generateTree(depth = this.depth) {
        return depth === 1
            ? this.generateList(() => {})
            : this.generateList(() => this.generateTree(depth - 1));
    }

    generateSymbols(quantity) {
        return Array.from({ length: quantity }, () => String.fromCharCode(Number((Math.random() * 10 + 1071).toFixed()))).join('');
    }

    generateList(getItems) {
        return Array.from({ length: this.membersQuantity }, () => ({ name: this.generateSymbols(4), items: getItems() }));
    }
}

