output "iot_endpoint" {
  description = "AWS IoT endpoint for device connections"
  value       = data.aws_iot_endpoint.data.endpoint_address
}

output "iot_policy_name" {
  description = "IoT policy name for machine certificates"
  value       = aws_iot_policy.machine_policy.name
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.machine_lifecycle.function_name
}

output "dlq_url" {
  description = "Dead Letter Queue URL"
  value       = aws_sqs_queue.lambda_dlq.url
}

data "aws_iot_endpoint" "data" {
  endpoint_type = "iot:Data-ATS"
}