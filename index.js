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

        const taskDefinition = stripProblematicProperties(response.taskDefinition);
        const json = JSON.stringify(taskDefinition, null, 2);

        core.setOutput('json', json);
        console.info(`json output: ${json}`);

        const tmpFile = tmp.fileSync({
            dir: process.env.RUNNER_TEMP,
            prefix: 'task-definition-',
            postfix: '.json',
            keep: true,
            discardDescriptor: true
        });
        fs.writeFileSync(tmpFile.name, json);

        core.setOutput('file', tmpFile.name);
        console.info(`file output: ${tmpFile.name}`);

    } catch (error) {
        core.debug(error.stack);
        core.setFailed(error.message);
    }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
    run();
}

function stripProblematicProperties(taskDefinition) {
    if (taskDefinition.taskDefinitionArn) delete taskDefinition.taskDefinitionArn;
    if (taskDefinition.revision) delete taskDefinition.revision;
    if (taskDefinition.status) delete taskDefinition.status;
    if (taskDefinition.requiresAttributes) delete taskDefinition.requiresAttributes;
    if (taskDefinition.compatibilities) delete taskDefinition.compatibilities;
    return taskDefinition;
}
