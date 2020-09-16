"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
async function readMarkdown(fileName) {
    try {
        const filePath = path.resolve(path.join('../', `/${fileName}`));
        console.log(filePath);
        return (await fs_1.promises.readFile(filePath)).toString();
    }
    catch (e) {
        return '';
    }
}
const log = async () => {
    let read = (await readMarkdown('readme.md')).split('\n');
    const start = read.indexOf('<!-- Start -->');
    const values = [];
    for (let i = start + 1; i < read.length; ++i) {
        for (let j = 0; j < read[i].length; ++j) {
            let name = '';
            let url = '';
            const char = read[i][j];
            switch (char) {
                case '[':
                    while (read[i][++j] != ']' && j < read[i].length) {
                        name += read[i][j];
                    }
                //console.log(name);
                case '(':
                    ++j;
                    while (read[i][++j] != ')' && j < read[i].length) {
                        url += read[i][j];
                    }
                //console.log(url);
            }
            if (name !== '' && url !== '') {
                values.push({ name, url });
            }
        }
    }
    //console.log(values);
    /*const compareStrings = (a: string, b: string) => {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }  */
    const sortedValues = values.sort((a, b) => a.name.localeCompare(b.name)); /*(a, b) => {
        return compareStrings(a.name, b.name);
    }) */
    const ret = [sortedValues[0]];
    for (var i = 1; i < sortedValues.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
        if (sortedValues[i - 1].url !== sortedValues[i].url) {
            ret.push(sortedValues[i]);
        }
    }
    const newRead = read.slice(0, start + 1);
    console.log(newRead);
    for (const element of ret) {
        //console.log(index, element);
        newRead.push(`- [${element.name}](${element.url})`);
    }
    console.log(newRead);
    //console.log(read);
    fs_1.writeFileSync("../readme.md", newRead.join("\n"));
};
log();
//# sourceMappingURL=index.js.map