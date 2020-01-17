const core = require('@actions/core');
const aws = require('aws-sdk');
const fs = require('fs');
const tmp = require('tmp');

async function run() {
    try {
        const taskDefinitionFamily = core.getInput('task-definition-family');

        const ecs = new aws.ECS();
        const describeParameters = { taskDefinition: taskDefinitionFamily };
        const response = await ecs.describeTaskDefinition(describeParameters).promise();

        const json = JSON.stringify(response.taskDefinition);
        core.setOutput('json', json);

        const tmpFile = tmp.fileSync();
        fs.writeFileSync(tmpFile.name, json);
        core.setOutput('file', tmpFile.name);

    } catch (error) {
        core.debug(error.stack);
        core.setFailed(error.message);
    }
}

module.exports = run;
