# 01: AWS Fundamentals - Ultra Fast Learning 🚀

## AWS Global Infrastructure
- **Regions**: Geographic areas, 30+ worldwide, data stays unless you move it
- **AZs**: 2-6 per region, physically separated, connected by low-latency links
- **Edge Locations**: 400+ for CloudFront/Route 53, content caching
- **Choose Region by**: Compliance, latency, pricing, service availability

## Management Tools
- **Console**: Web-based GUI
- **CLI**: Command-line access, uses access keys
- **CloudShell**: Browser-based shell, free
- **SDK**: Programmatic access (Python/Java/Node.js)
- **CloudFormation**: Infrastructure as Code (IaC)

## Well-Architected Framework (6 Pillars)
1. **Operational Excellence**: Run, monitor, improve systems
2. **Security**: Protect data, encryption, least privilege
3. **Reliability**: Recover from failures, auto-scaling
4. **Performance Efficiency**: Right resources for workload
5. **Cost Optimization**: Avoid unnecessary costs
6. **Sustainability**: Minimize environmental impact

## Shared Responsibility Model
- **AWS Responsible FOR the Cloud**: Physical security, hardware, network
- **YOU Responsible IN the Cloud**: Data, IAM, encryption, OS patches, firewall

## AWS Account Management
- **Root User**: Email + password, enable MFA, don't use daily
- **Organizations**: Centralized billing, consolidated billing, SCPs
- **Control Tower**: Multi-account governance, guardrails
- **Service Control Policies (SCPs)**: Restrict what accounts can do
- **RAM (Resource Access Manager)**: Share resources across accounts

### AWS Organizations - Key Points
- **Management Account**: Pays bills, not affected by SCPs, full control
- **Member Accounts**: Subject to SCPs, inherit from OU/Org
- **OUs**: Organizational Units, up to 5 levels deep
- **Consolidated Billing**: Volume discounts, single payment, RI sharing

### SCPs (Service Control Policies) - EXAM CRITICAL
- ❌ **DON'T** grant permissions (only restrict)
- ❌ **DON'T** affect management account
- ✅ **DO** set maximum permissions
- ✅ **DO** override IAM in member accounts
- ✅ **Formula**: Effective = IAM AND SCP

**Common Uses:**
- Restrict regions: Deny actions outside allowed regions
- Require encryption: Deny unencrypted EBS/S3
- Protect logs: Deny CloudTrail deletion
- Prevent org exit: Deny LeaveOrganization

### Control Tower
- **What**: Automated multi-account setup on top of Organizations
- **Landing Zone**: Well-architected baseline
- **Account Factory**: Auto-create accounts
- **Guardrails**: Mandatory (always on) + Optional (your choice)
- **Dashboard**: Compliance visibility
- **Use When**: Quick setup, less experience, want best practices

### AWS RAM (Resource Access Manager)
- **Share**: VPC subnets, Transit Gateway, Route 53 rules, Aurora
- **Most Common**: Share VPC subnets across accounts
- **Benefit**: Centralized networking, no VPC duplication
- **Free**: No charge for using RAM

## Service Categories (Must Know)
- **Compute**: EC2, Lambda, ECS, EKS, Fargate, Beanstalk
- **Storage**: S3, EBS, EFS, Storage Gateway
- **Database**: RDS, DynamoDB, Aurora, ElastiCache, Redshift
- **Networking**: VPC, Route 53, CloudFront, Direct Connect
- **Security**: IAM, KMS, WAF, Shield, GuardDuty
- **Integration**: SQS, SNS, EventBridge, Step Functions
- **Analytics**: Athena, Kinesis, EMR, Glue, QuickSight

## Quick Exam Tips
- **Region** = multiple AZs (min 2)
- **AZ** = one or more data centers
- **Edge Location** = CloudFront caching
- **Free Tier**: 12 months for most services
- **Support Plans**: Basic (free), Developer ($29), Business ($100), Enterprise ($15K)
- **Billing**: Use Cost Explorer, Budgets, Cost Allocation Tags


