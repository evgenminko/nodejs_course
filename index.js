const {FilesFacade} = require("./dir");
const {TreeFacade} = require("./tree");

class MainFacade {
    constructor(treeFacade) {
        this.treeFacade = treeFacade;
    }

    generateAndPrint() {
        return this.treeFacade.generate()
            .then((data) => this.format(data))
            .then((data) => console.log(data));
    }

    format(tree, depth = 1) {
        if (!tree || tree.length === 0) return '';

        const lvlSeparator = depth === 1 ? '-' : '|--';
        const levelIndent = Array(depth).join('    ');

        return tree
            .map(elem => {
                const nameFormatted = `(lvl: ${depth}) "${elem.name}"`;

                if (!elem.items) return `${levelIndent}|__${nameFormatted}\n`;

                const nodesFormatted = this.format(elem.items, depth + 1);

                return `${levelIndent}${lvlSeparator}${nameFormatted}\n`.concat(nodesFormatted);
            })
            .join('');
    }
}

(async () => {
    try {
        const [_, __, ...rest] = process.argv;
        const paramsAsString = rest.join(' ');

        // await new MainFacade(new TreeFacade(paramsAsString)).generateAndPrint(); // пункт 1
        // await new MainFacade(new FilesFacade(paramsAsString)).generateAndPrint(); // пункт 1
    } catch (err) {
        console.log(err);
    }
})()
