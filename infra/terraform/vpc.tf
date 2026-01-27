# Use default VPC for simplicity
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Create DB subnet group
resource "aws_db_subnet_group" "rooted" {
  name       = "${var.project_name}-${var.environment}-db-subnet"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-subnet"
    Environment = var.environment
    Project     = var.project_name
  }
}
