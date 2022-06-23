const fs = require('fs');
const path = require('path');
const util = require('util')

const readdirAsync = util.promisify(fs.readdir);

module.exports.FilesFacade = class FilesFacade {
    constructor(depth, wayToDir) {
        console.log(`Генерация списка директорий и файлов с глубиной: "${depth}", путь к корневой директории: "${wayToDir}"`);

        this.depth = depth;
        this.wayToDir = path.resolve(wayToDir);
    }

    async generate() {
        const files = await this.readDirectoriesAndFiles();

        return  await this.generateList(files);
    }

    readDirectoriesAndFiles = (wayToDir = this.wayToDir) => {
        return readdirAsync(wayToDir, { withFileTypes: true });
    }

    generateList = async (files, depth = this.depth, wayParentDir = this.wayToDir) => {
        if (depth === 1) {
            return files;
        }

        const mapFunction = this.getFilesMapper(depth, wayParentDir);

        return await Promise.all(files.map(mapFunction));
    }

    getFilesMapper = (depth, wayParentDir) => async (file) => {
        if (!file.isDirectory()) {
            return file;
        }

        const wayToInsideDir = path.join(wayParentDir, file.name);
        const files = await this.readDirectoriesAndFiles(wayToInsideDir);

        return { name: file.name, items: await this.generateList(files, depth - 1, wayToInsideDir) }
    }
}
