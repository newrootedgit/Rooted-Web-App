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

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.rooted.endpoint
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.rooted.db_name
}

output "ec2_security_group_id" {
  description = "EC2 security group ID"
  value       = aws_security_group.ec2.id
}

output "ec2_public_ip" {
  description = "EC2 Elastic IP address"
  value       = aws_eip.rooted.public_ip
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.rooted.id
}

data "aws_iot_endpoint" "data" {
  endpoint_type = "iot:Data-ATS"
}