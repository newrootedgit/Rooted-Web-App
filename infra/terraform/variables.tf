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