const {FilesFacade} = require("./dir");
const {TreeFacade} = require("./tree");
const depthPatternShort = /-d\s*[\d]+/;
const depthPatternLong = /--depth\s*[\d]+/;

const pathPatternShort = /-p\s[^\s]+/;
const pathPatternLong = /--path\s[^\s]+/;

class MainFacade {
    constructor(TreeFacade) {
        const [_, __, ...rest] = process.argv;
        this.paramsAsString = rest.join(' ');

        this.treeFacade = new TreeFacade(this.depth, this.path);
    }

    generateAndPrint() {
        return this.treeFacade.generate()
            .then((data) => this.format(data))
            .then(console.log);
    }

    get depth() {
        const [depthRaw] = this.paramsAsString.match(depthPatternShort) || this.paramsAsString.match(depthPatternLong);

        return Number(depthRaw.replace(/[^\d]/g, ''));
    }

    get path() {
        const [pathRaw] = this.paramsAsString.match(pathPatternShort) || this.paramsAsString.match(pathPatternLong);
        console.log(pathRaw)

        return pathRaw.replace(/(--path|-p)\s/, '');
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

try {
    new MainFacade(TreeFacade).generateAndPrint(); // пункт 1
    // new MainFacade(FilesFacade).generateAndPrint(); // пункт 2
} catch (err) {
    console.log(err);
}
