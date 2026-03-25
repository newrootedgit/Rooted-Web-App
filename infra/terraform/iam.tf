# Lambda Execution Role
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-exec-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Lambda Basic Execution Policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda SQS Policy (for DLQ)
resource "aws_iam_role_policy" "lambda_sqs" {
  name = "${var.project_name}-lambda-sqs-${var.environment}"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = aws_sqs_queue.lambda_dlq.arn
      }
    ]
  })
}

# IoT Rule Role
resource "aws_iam_role" "iot_rule" {
  name = "${var.project_name}-iot-rule-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "iot.amazonaws.com"
        }
      }
    ]
  })
}

# IAM User for Support S3 Uploads
resource "aws_iam_user" "support_s3" {
  name = "${var.project_name}-support-s3-${var.environment}"

  tags = {
    Name        = "${var.project_name}-support-s3"
    Environment = var.environment
  }
}

resource "aws_iam_user_policy" "support_s3" {
  name = "${var.project_name}-support-s3-${var.environment}"
  user = aws_iam_user.support_s3.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.support_uploads.arn}/support/*"
      }
    ]
  })
}

resource "aws_iam_access_key" "support_s3" {
  user = aws_iam_user.support_s3.name
}

# IoT Rule CloudWatch Logs Policy
resource "aws_iam_role_policy" "iot_cloudwatch" {
  name = "${var.project_name}-iot-cloudwatch-${var.environment}"
  role = aws_iam_role.iot_rule.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.iot_rule_errors.arn}:*"
      }
    ]
  })
}