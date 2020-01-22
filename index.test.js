jest.mock('@actions/core');

const mockECSDescribeTaskDefinition = jest.fn();

jest.mock('aws-sdk', () => ({
    ECS: jest.fn(() => ({
        describeTaskDefinition: mockECSDescribeTaskDefinition
    }))
}));

const core = require('@actions/core');
const fixture = require('./sample-task-definition');
const action = require('./index');

beforeEach(() => {
    jest.clearAllMocks();

    mockECSDescribeTaskDefinition.mockImplementation(() => {
        return {
            promise() {
                return Promise.resolve(fixture);
            }
        };
    });
});

test('outputs json as a string', async () => {
    const taskDefinitionFamily = 'hello_world';
    core.getInput = jest.fn().mockReturnValue(taskDefinitionFamily);

    await action();

    expect(core.setFailed).not.toBeCalled();
    expect(mockECSDescribeTaskDefinition).toBeCalledWith({ taskDefinition: taskDefinitionFamily });
    expect(core.setOutput).toHaveBeenCalledWith('json', expect.any(String));
});

test('outputs the path to a file with the json', async () => {
    const taskDefinitionFamily = 'hello_world';
    core.getInput = jest.fn().mockReturnValue(taskDefinitionFamily);

    await action();

    expect(core.setFailed).not.toBeCalled();
    expect(mockECSDescribeTaskDefinition).toBeCalledWith({ taskDefinition: taskDefinitionFamily });
    expect(core.setOutput).toHaveBeenCalledWith('file', expect.any(String));
});
