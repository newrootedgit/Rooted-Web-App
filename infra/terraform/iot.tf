# IoT Policy for Machines
resource "aws_iot_policy" "machine_policy" {
  name = "${var.project_name}-machine-policy-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "iot:Connect"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:client/$${iot:Connection.Thing.ThingName}"
      },
      {
        Effect = "Allow"
        Action = "iot:Subscribe"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:topicfilter/rooted/machines/$${iot:Connection.Thing.ThingName}/ping"
      },
      {
        Effect = "Allow"
        Action = "iot:Receive"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:topic/rooted/machines/$${iot:Connection.Thing.ThingName}/ping"
      },
      {
        Effect = "Allow"
        Action = "iot:Publish"
        Resource = "arn:aws:iot:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:topic/rooted/machines/$${iot:Connection.Thing.ThingName}/pong"
      }
    ]
  })
}

# IoT Rule for Lifecycle Events
resource "aws_iot_topic_rule" "machine_lifecycle" {
  name        = "${var.project_name}_machine_lifecycle_${var.environment}"
  description = "Route machine connection/disconnection events to Lambda"
  enabled     = true
  sql         = "SELECT clientId as deviceId, timestamp, eventType, sessionIdentifier FROM '$aws/events/presence/+/+'"
  sql_version = "2016-03-23"

  lambda {
    function_arn = aws_lambda_function.machine_lifecycle.arn
  }

  error_action {
    cloudwatch_logs {
      log_group_name = aws_cloudwatch_log_group.iot_rule_errors.name
      role_arn       = aws_iam_role.iot_rule.arn
    }
  }
}

# CloudWatch Log Group for IoT Rule Errors
resource "aws_cloudwatch_log_group" "iot_rule_errors" {
  name              = "/aws/iot/rules/${var.project_name}-lifecycle-errors-${var.environment}"
  retention_in_days = 7
}