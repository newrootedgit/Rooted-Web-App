# Lambda Function
resource "aws_lambda_function" "machine_lifecycle" {
  filename         = "${path.module}/../lambda/machine-lifecycle.zip"
  function_name    = "${var.project_name}-machine-lifecycle-${var.environment}"
  role            = aws_iam_role.lambda_exec.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/../lambda/machine-lifecycle.zip")
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256

  environment {
    variables = {
      API_ENDPOINT    = var.api_endpoint
      SECRET_TOKEN    = var.lambda_secret_token
      ENVIRONMENT     = var.environment
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.lambda_logs
  ]
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${var.project_name}-machine-lifecycle-${var.environment}"
  retention_in_days = 14
}

# Lambda Permission for IoT Rule
resource "aws_lambda_permission" "allow_iot" {
  statement_id  = "AllowExecutionFromIoT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.machine_lifecycle.function_name
  principal     = "iot.amazonaws.com"
  source_arn    = aws_iot_topic_rule.machine_lifecycle.arn
}

# Dead Letter Queue (SQS)
resource "aws_sqs_queue" "lambda_dlq" {
  name                      = "${var.project_name}-machine-lifecycle-dlq-${var.environment}"
  message_retention_seconds = 1209600  # 14 days
  
  tags = {
    Name        = "${var.project_name}-lambda-dlq"
    Environment = var.environment
  }
}

resource "aws_lambda_function_event_invoke_config" "machine_lifecycle" {
  function_name = aws_lambda_function.machine_lifecycle.function_name

  destination_config {
    on_failure {
      destination = aws_sqs_queue.lambda_dlq.arn
    }
  }

  maximum_retry_attempts = 2
}
