# S3 Bucket for Support Ticket Attachments
resource "aws_s3_bucket" "support_uploads" {
  bucket = "${var.project_name}-support-uploads"

  tags = {
    Name        = "${var.project_name}-support-uploads"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_public_access_block" "support_uploads" {
  bucket = aws_s3_bucket.support_uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "support_uploads" {
  bucket = aws_s3_bucket.support_uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CORS: Allow browser-based presigned PUT uploads from the app domain
resource "aws_s3_bucket_cors_configuration" "support_uploads" {
  bucket = aws_s3_bucket.support_uploads.id

  cors_rule {
    allowed_origins = ["https://app.rootedrobotics.com"]
    allowed_methods = ["PUT"]
    allowed_headers = ["Content-Type"]
    max_age_seconds = 3600
  }
}
