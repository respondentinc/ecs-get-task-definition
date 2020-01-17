# ECS Get Task Definition

Queries AWS for the latest task definition for a particular family.

## Inputs

### `task-definition-family`

**Required** The family name of the task definition to query.

## Outputs

### `json`

JSON representation of the task definition.

### `file`

Name of a temporary file that holds the JSON representation of the task definition

## Example usage

    uses: respondentinc/ecs-get-task-definition@v1
    with:
      task-definition-family: 'hello_world'

## IAM permissions required

- `ecs:DescribeTaskDefinition`
