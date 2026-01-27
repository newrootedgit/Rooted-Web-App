# Get latest Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 instance
resource "aws_instance" "rooted" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.small"
  
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = var.ec2_key_name

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = <<-EOF
              #!/bin/bash
              set -e
              
              # Update system
              apt-get update
              apt-get upgrade -y
              
              # Install Node.js 20
              curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
              apt-get install -y nodejs
              
              # Install pnpm
              npm install -g pnpm
              
              # Install Nginx
              apt-get install -y nginx
              
              # Install Docker
              curl -fsSL https://get.docker.com -o get-docker.sh
              sh get-docker.sh
              usermod -aG docker ubuntu
              
              # Install PM2
              npm install -g pm2
              
              # Create app directory
              mkdir -p /var/www/rooted
              chown ubuntu:ubuntu /var/www/rooted
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-web"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Elastic IP for stable public address
resource "aws_eip" "rooted" {
  instance = aws_instance.rooted.id
  domain   = "vpc"

  tags = {
    Name        = "${var.project_name}-${var.environment}-eip"
    Environment = var.environment
    Project     = var.project_name
  }
}
