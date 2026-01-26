# Upgrade Phases Documentation

This directory contains implementation guides for major system upgrades and new features.

## Available Guides

### Infrastructure & Deployment
- **[INFRASTRUCTURE_SETUP.md](./INFRASTRUCTURE_SETUP.md)** - VM setup, Terraform, AWS services, scaling
- **[AWS_IOT_CONNECTIVITY.md](./AWS_IOT_CONNECTIVITY.md)** - AWS IoT Core integration for machines
- **[IOT_CONNECTIVITY.md](./IOT_CONNECTIVITY.md)** - IoT connectivity patterns and implementation

### Admin Portal (NEW)
- **[ADMIN_PORTAL.md](./ADMIN_PORTAL.md)** - Complete admin portal implementation guide
  - Architecture and design decisions
  - Detailed implementation steps
  - Security considerations
  - Deployment options
  - Testing and troubleshooting
  
- **[ADMIN_PORTAL_QUICKSTART.md](./ADMIN_PORTAL_QUICKSTART.md)** - Quick start guide
  - Condensed implementation steps
  - Copy-paste code snippets
  - Fast track to working admin portal

## Admin Portal Overview

The admin portal provides cross-tenant machine monitoring capabilities for support staff.

**Key Features:**
- View all tenants and their machines
- Monitor machine status (online/offline)
- Farm-level machine grouping
- Secure admin-only access via Clerk

**Access:**
- Admin user: `support@rootedrobotics.com`
- Authentication: Clerk with `isAdmin` metadata flag
- Deployment: Separate subdomain or path

**Quick Links:**
- [Full Documentation](./ADMIN_PORTAL.md)
- [Quick Start Guide](./ADMIN_PORTAL_QUICKSTART.md)

## Implementation Order

For new deployments, follow this order:

1. **Infrastructure Setup** - Set up VM, database, services
2. **IoT Connectivity** - Connect machines to backend
3. **Admin Portal** - Deploy monitoring dashboard

## Contributing

When adding new upgrade guides:
1. Follow the existing documentation structure
2. Include architecture diagrams
3. Provide actionable steps with code examples
4. Add troubleshooting section
5. Update this README with links
