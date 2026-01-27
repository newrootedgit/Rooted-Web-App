variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-west-2"
}

variable "project_name" { 
    description = "The name of the project."
    type        = string
    default     = "rooted"
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
  default     = "prod"
}

variable "api_endpoint" {
  description = "The API endpoint URL."
  type        = string
}

variable "lambda_secret_token" { 
    description = "The secret token for securing Lambda functions."
    type        = string
    sensitive   = true
}

variable "db_password" {
  description = "The master password for the RDS database."
  type        = string
  sensitive   = true
}

variable "ec2_key_name" {
  description = "Name of the EC2 key pair for SSH access."
  type        = string
}
