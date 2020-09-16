import { promises as fs, writeFileSync } from 'fs';
import * as path from 'path';
// import * as core from '@actions/core';
// import * as github from '@actions/github';

async function readMarkdown(fileName: string) {
    try {
        const filePath = path.resolve(path.join('../', `/${fileName}`));
        return (await fs.readFile(filePath)).toString();
    } catch(e) {
        console.error(`Could not find filename: ${fileName}`);
        return '';
    }
}

const log = async () => {
    let read: Array<string> = (await readMarkdown('readme.md')).split('\n');
    const start = read.indexOf('<!-- Start -->');
    const values = [];
    
    for(let i = start + 1; i < read.length; ++i) {
        for(let j = 0; j < read[i].length; ++j) {
            let name = '';
            let url = '';
            const char = read[i][j];
            switch(char) {
                case '[':
                    while(read[i][++j] != ']' && j < read[i].length) {
                        name += read[i][j];
                        
                    }
                case '(':
                    ++j;
                    while(read[i][++j] != ')' && j < read[i].length) {
                        url += read[i][j];
                    }
            }
            if(name !== '' && url !== '') {
                values.push({ name, url });
            }
        }

    }
    const sortedValues = values.sort((a, b) => a.name.localeCompare(b.name));
    
    const ret = [sortedValues[0]];
    for (var i = 1; i < sortedValues.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
      if (sortedValues[i-1].url !== sortedValues[i].url) {
        ret.push(sortedValues[i]);
      }
    }

    const newRead = read.slice(0, start + 1);

    for (const element of ret) {
        newRead.push(`- [${element.name}](${element.url})`);
    }
    writeFileSync("../readme.md", newRead.join("\n"));
}

log();

/* Working on actions
(async () => {
    // const githubToken = core.getInput('github-token');
    const githubWorkspace: string | undefined = process.env.GITHUB_WORKSPACE;
    if(!githubWorkspace) {
        console.error('ERROR: Could not find github workspace');
        return;
    }
    const filePath = path.join(githubWorkspace, core.getInput('json-file-path'));
    const columns = core.getInput('columns');
    const data = fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);

    try {
        log();
    } catch (error) {
        core.setFailed(JSON.stringify(error));
    }
})();
*/
