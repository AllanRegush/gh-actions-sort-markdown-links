"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const core = require("@actions/core");
const readme_box_1 = require("readme-box");
async function readMarkdown(filePath) {
    try {
        return (await fs_1.promises.readFile(filePath)).toString();
    }
    catch (e) {
        console.error(`Could not find filename: ${filePath}`);
        return '';
    }
}
const getLinks = (markdown) => {
    const start = markdown.indexOf('<!--START_SECTION:links-->');
    const values = [];
    for (let i = start + 1; i < markdown.length; ++i) {
        for (let j = 0; j < markdown[i].length; ++j) {
            let name = '';
            let url = '';
            const char = markdown[i][j];
            switch (char) {
                case '[':
                    while (markdown[i][++j] != ']' && j < markdown[i].length) {
                        name += markdown[i][j];
                    }
                case '(':
                    ++j;
                    while (markdown[i][++j] != ')' && j < markdown[i].length) {
                        url += markdown[i][j];
                    }
                case '<':
                    break;
            }
            if (name !== '' && url !== '') {
                values.push({ name, url });
            }
        }
    }
    return values;
};
const removeDuplicates = (values) => {
    const ret = [values[0]];
    for (var i = 1; i < values.length; i++) {
        if (values[i - 1].url !== values[i].url) {
            ret.push(values[i]);
        }
    }
    return ret;
};
const createListOfLinks = (list) => {
    const result = [];
    for (const element of list) {
        result.push(`- [${element.name}](${element.url})`);
    }
    return result;
};
const main = async (filePath) => {
    const read = (await readMarkdown(filePath)).split('\n');
    const values = getLinks(read);
    const sortedValues = values.sort((a, b) => a.name.localeCompare(b.name));
    const valuesWithNoDuplicates = removeDuplicates(sortedValues);
    const links = createListOfLinks(valuesWithNoDuplicates);
    return links.join('\n');
};
(async () => {
    const githubWorkspace = process.env.GITHUB_WORKSPACE;
    if (!githubWorkspace) {
        console.error('ERROR: Could not find github workspace');
        return;
    }
    const githubRepository = process.env.GITHUB_REPOSITORY;
    if (!githubRepository) {
        console.error('ERROR: Could not find github repository');
        return;
    }
    const githubRef = process.env.GITHUB_REF;
    if (!githubRef) {
        console.error();
        return;
    }
    const githubToken = core.getInput('github-token');
    const markdownPath = path.join(githubWorkspace, core.getInput('markdown-path'));
    try {
        const result = await main(markdownPath);
        await readme_box_1.ReadmeBox.updateSection(result, {
            owner: githubRepository.split('/')[0],
            repo: githubRepository.split('/')[1],
            branch: githubRef.split('/')[2],
            token: githubToken,
            section: 'links',
        });
    }
    catch (error) {
        core.setFailed(JSON.stringify(error));
    }
})();
//# sourceMappingURL=index.js.map