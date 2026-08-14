# Module 01: AWS Fundamentals

## 📚 Overview

This module covers the foundational concepts of Amazon Web Services (AWS) that are essential for the AWS Certified Solutions Architect - Associate (SAA-C03) exam. Understanding these fundamentals is critical for designing and deploying applications on AWS.

**Exam Weight**: Foundation for all other domains (~10% direct questions, but essential for understanding everything else)

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:

- ✅ Explain AWS Global Infrastructure (Regions, Availability Zones, Edge Locations)
- ✅ Navigate the AWS Management Console and use AWS CLI
- ✅ Understand the AWS Well-Architected Framework's 6 pillars
- ✅ Identify AWS Shared Responsibility Model
- ✅ Describe AWS account management and billing basics
- ✅ Explain AWS service categories and when to use them

---

## 📖 Table of Contents

1. [AWS Global Infrastructure](#1-aws-global-infrastructure)
2. [AWS Management Tools](#2-aws-management-tools)
3. [AWS Well-Architected Framework](#3-aws-well-architected-framework)
4. [Shared Responsibility Model](#4-shared-responsibility-model)
5. [AWS Account Management](#5-aws-account-management)
6. [AWS Service Categories](#6-aws-service-categories)
7. [Exam Tips](#-exam-tips)
8. [Practice Questions](#-practice-questions)

---

## 1. AWS Global Infrastructure

### 1.1 Regions

**What is a Region?**
- A geographical area containing multiple Availability Zones
- Completely independent and isolated from other regions
- Currently 30+ regions globally

**Key Characteristics:**
- Each region has a unique code (e.g., `us-east-1`, `eu-west-1`)
- Data doesn't leave a region unless you explicitly configure it
- Pricing varies by region
- Not all services are available in all regions

**How to Choose a Region:**
```
Consider these factors:
1. Compliance - Data sovereignty requirements
2. Proximity - Latency to end users
3. Available Services - Not all services in all regions
4. Pricing - Costs vary by region
```

**Exam Tip**: 🎯 Choose the region closest to your users to minimize latency.

### 1.2 Availability Zones (AZs)

**What is an Availability Zone?**
- One or more discrete data centers within a region
- Each AZ has independent power, cooling, and networking
- Connected to other AZs via low-latency links
- Each region has minimum 3 AZs (most have 3-6)

**Key Characteristics:**
- AZs are named: `us-east-1a`, `us-east-1b`, `us-east-1c`, etc.
- Isolated from failures in other AZs
- Enables high availability and fault tolerance
- ~100 total AZs globally

**Multi-AZ Deployment Pattern:**
```
Region: us-east-1
├── AZ: us-east-1a
│   ├── Application Server 1
│   └── Database Primary
├── AZ: us-east-1b
│   ├── Application Server 2
│   └── Database Standby
└── AZ: us-east-1c
    └── Application Server 3
```

**Exam Tip**: 🎯 Always deploy across multiple AZs for high availability.

### 1.3 Edge Locations

**What is an Edge Location?**
- Endpoints for AWS services like CloudFront and Route 53
- Used to cache content closer to end users
- 400+ edge locations globally (more than Regions)
- Part of the AWS Global Network

**Use Cases:**
- Content Delivery Network (CloudFront)
- DNS service (Route 53)
- AWS WAF and Shield
- Lambda@Edge

**Exam Tip**: 🎯 Edge Locations ≠ Regions. They're for caching and low-latency access.

### 1.4 Local Zones

**What is a Local Zone?**
- Extension of an AWS region closer to large population centers
- Provides single-digit millisecond latency to end users
- Useful for latency-sensitive applications

**Example:** Los Angeles Local Zone extends `us-west-2` region

### 1.5 Wavelength Zones

**What is a Wavelength Zone?**
- AWS infrastructure embedded within telecom providers' 5G networks
- Enables ultra-low latency for mobile and edge devices
- Use cases: AR/VR, real-time gaming, autonomous vehicles

---

## 2. AWS Management Tools

### 2.1 AWS Management Console

**Web-Based Interface:**
- Visual, point-and-click interface
- Accessible at: https://console.aws.amazon.com
- Best for: Learning, exploration, one-time tasks

**Key Features:**
- Service search and favorites
- Recently visited services
- Resource groups
- Cost and usage dashboards

### 2.2 AWS Command Line Interface (CLI)

**Command-Line Tool:**
```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure

# Example: List S3 buckets
aws s3 ls

# Example: Launch EC2 instance
aws ec2 run-instances --image-id ami-12345678 --instance-type t2.micro
```

**Use Cases:**
- Automation and scripting
- Batch operations
- Integration with CI/CD pipelines

### 2.3 AWS SDKs (Software Development Kits)

**Programming Languages Supported:**
- Python (Boto3)
- JavaScript/Node.js
- Java
- .NET
- Ruby
- PHP
- Go

**Example (Python):**
```python
import boto3

# Create S3 client
s3 = boto3.client('s3')

# List buckets
response = s3.list_buckets()
```

### 2.4 AWS CloudFormation

**Infrastructure as Code (IaC):**
- Define infrastructure in JSON or YAML templates
- Version control your infrastructure
- Repeatable deployments
- Automatic rollback on errors

**Example Template:**
```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name
```

### 2.5 AWS CloudShell

**Browser-Based Shell:**
- Pre-configured with AWS CLI and tools
- No installation required
- 1 GB of storage per region
- Automatically authenticated with your console credentials

---

## 3. AWS Well-Architected Framework

### 3.1 Overview

The AWS Well-Architected Framework helps you understand best practices for designing and operating reliable, secure, efficient, and cost-effective systems in the cloud.

**6 Pillars: CROPSS (Mnemonic: "CROPS + Security")**

### 3.2 Operational Excellence

**Design Principles:**
- Perform operations as code
- Make frequent, small, reversible changes
- Refine operations procedures frequently
- Anticipate failure
- Learn from operational failures

**Key Services:**
- AWS CloudFormation
- AWS Config
- AWS CloudTrail
- Amazon CloudWatch

**Questions to Ask:**
- How do you determine your operational priorities?
- How do you design your workload for operational excellence?

### 3.3 Security

**Design Principles:**
- Implement strong identity foundation
- Enable traceability
- Apply security at all layers
- Automate security best practices
- Protect data in transit and at rest
- Keep people away from data
- Prepare for security events

**Key Services:**
- AWS IAM
- AWS KMS
- AWS WAF
- AWS Shield
- Amazon GuardDuty

**Questions to Ask:**
- How do you securely operate your workload?
- How do you manage identities and permissions?

### 3.4 Reliability

**Design Principles:**
- Automatically recover from failure
- Test recovery procedures
- Scale horizontally
- Stop guessing capacity
- Manage change through automation

**Key Services:**
- Amazon Route 53
- Elastic Load Balancing
- Auto Scaling
- Amazon RDS Multi-AZ

**Questions to Ask:**
- How do you design your workload to adapt to changes in demand?
- How do you implement your workload to withstand component failures?

### 3.5 Performance Efficiency

**Design Principles:**
- Democratize advanced technologies
- Go global in minutes
- Use serverless architectures
- Experiment more often
- Consider mechanical sympathy

**Key Services:**
- AWS Lambda
- Amazon CloudFront
- Amazon ElastiCache
- Amazon RDS Read Replicas

**Questions to Ask:**
- How do you select appropriate resource types and sizes?
- How do you monitor your resources to ensure performance?

### 3.6 Cost Optimization

**Design Principles:**
- Implement cloud financial management
- Adopt a consumption model
- Measure overall efficiency
- Stop spending on undifferentiated heavy lifting
- Analyze and attribute expenditure

**Key Services:**
- AWS Cost Explorer
- AWS Budgets
- Reserved Instances
- Savings Plans
- AWS Trusted Advisor

**Questions to Ask:**
- How do you govern usage?
- How do you monitor usage and cost?

### 3.7 Sustainability

**Design Principles:**
- Understand your impact
- Establish sustainability goals
- Maximize utilization
- Anticipate and adopt new, more efficient offerings
- Use managed services
- Reduce downstream impact

**Key Services:**
- EC2 Auto Scaling
- Serverless services
- AWS Graviton processors

**Exam Tip**: 🎯 Know the 6 pillars by heart. Use mnemonic: **"CROPSS"** or **"SCROPP"**

---

## 4. Shared Responsibility Model

### 4.1 Concept

**"Security OF the cloud vs. Security IN the cloud"**

```
┌─────────────────────────────────────────────┐
│          CUSTOMER RESPONSIBILITY            │
│         "Security IN the Cloud"             │
├─────────────────────────────────────────────┤
│ • Customer Data                             │
│ • Platform, Applications, IAM               │
│ • Operating System, Network, Firewall       │
│ • Client-Side Encryption & Authentication   │
│ • Server-Side Encryption (File System/Data)│
│ • Network Traffic Protection                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│            AWS RESPONSIBILITY               │
│         "Security OF the Cloud"             │
├─────────────────────────────────────────────┤
│ • Hardware / AWS Global Infrastructure      │
│ • Regions, AZs, Edge Locations             │
│ • Compute, Storage, Database, Networking    │
│ • Software (Hypervisor, Host OS)           │
│ • Physical Security of Data Centers         │
└─────────────────────────────────────────────┘
```

### 4.2 Examples by Service Type

**IaaS (EC2):**
- **AWS**: Physical hardware, hypervisor
- **Customer**: OS patches, security groups, data encryption

**PaaS (RDS):**
- **AWS**: OS patches, database patching, backups
- **Customer**: Database credentials, network access, data encryption

**SaaS (S3):**
- **AWS**: Infrastructure, software, physical security
- **Customer**: Data classification, bucket policies, encryption

**Exam Tip**: 🎯 If you can configure it, you're responsible for it!

---

## 5. AWS Account Management

### 5.1 AWS Account Basics

**Root User:**
- Created when AWS account is created
- Has complete access to all resources
- **NEVER use for everyday tasks**
- Enable MFA immediately

**Best Practices:**
- ✅ Create IAM users for daily tasks
- ✅ Enable MFA on root account
- ✅ Use strong password
- ✅ Don't share root credentials
- ✅ Delete root access keys

### 5.2 AWS Organizations

**What is AWS Organizations?**
- **Centrally manage multiple AWS accounts**
- Consolidated billing across all accounts
- Hierarchical account structure with Organizational Units (OUs)
- Automate account creation
- Apply policies across accounts

**Key Benefits:**
- ✅ **Consolidated Billing**: Single payment method, volume discounts
- ✅ **Centralized Management**: Control access and security policies
- ✅ **Service Control Policies (SCPs)**: Set permission guardrails
- ✅ **Account Automation**: Programmatic account creation
- ✅ **Cost Allocation**: Tag-based cost tracking across accounts

#### AWS Organizations Structure

```
Root (Organization)
│
├── Management Account (Master Account)
│   └── Pays all charges, full admin access
│
├── Production OU
│   ├── Prod-App Account
│   ├── Prod-DB Account
│   └── Prod-Network Account
│
├── Development OU
│   ├── Dev Account 1
│   ├── Dev Account 2
│   └── Test Account
│
├── Security OU
│   ├── Security Audit Account
│   └── Log Archive Account
│
└── Sandbox OU
    ├── Sandbox 1
    └── Sandbox 2
```

**Organizational Unit (OU) Best Practices:**
- Group accounts by function (Production, Development, Security)
- Nest OUs up to 5 levels deep
- Apply different policies to different OUs
- Use meaningful names for easy management

#### Service Control Policies (SCPs)

**What are SCPs?**
- JSON policies that define **maximum permissions** for accounts
- Act as **guardrails** (don't grant permissions, only limit them)
- Applied at: Organization Root, OU, or individual Account level
- Inherited down the OU hierarchy

**Important SCP Rules:**
- ❌ SCPs **DO NOT** affect the Management Account
- ❌ SCPs **DO NOT** grant permissions (only restrict)
- ✅ SCPs override IAM policies in member accounts
- ✅ Effective permissions = IAM permissions AND SCP permissions

**SCP Example 1: Deny All Access to Specific Region**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllOutsideUSEast1",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": "us-east-1"
        }
      }
    }
  ]
}
```

**SCP Example 2: Require Encryption for EBS Volumes**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnencryptedEBS",
      "Effect": "Deny",
      "Action": [
        "ec2:CreateVolume",
        "ec2:RunInstances"
      ],
      "Resource": "*",
      "Condition": {
        "Bool": {
          "ec2:Encrypted": "false"
        }
      }
    }
  ]
}
```

**SCP Example 3: Prevent Users from Leaving Organization**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "organizations:LeaveOrganization",
      "Resource": "*"
    }
  ]
}
```

**Common SCP Use Cases:**
- Restrict services to specific regions (data sovereignty)
- Enforce encryption requirements
- Prevent deletion of CloudTrail logs
- Restrict instance types to approved list
- Deny public S3 buckets
- Prevent leaving the organization

**SCP Evaluation Logic:**
```
User attempts action
    ↓
Is there an explicit Deny in SCP? → YES → ❌ DENY
    ↓ NO
Is there an explicit Allow in SCP? → YES → Check IAM Policy
    ↓ NO                                      ↓
❌ DENY (implicit)                    Is there Allow in IAM? → YES → ✅ ALLOW
                                            ↓ NO
                                        ❌ DENY
```

**Exam Tip**: 🎯 Remember: SCPs affect ALL users and roles in member accounts, but NOT the management account!

#### AWS Control Tower

**What is AWS Control Tower?**
- **Easy way to set up and govern multi-account AWS environments**
- Built on top of AWS Organizations
- Automated account provisioning
- Pre-configured guardrails (SCPs + Config rules)
- Dashboard for compliance monitoring

**Key Features:**
- **Landing Zone**: Well-architected multi-account baseline
- **Guardrails**: Preventive (SCPs) and detective (Config rules)
- **Account Factory**: Automated account provisioning
- **Dashboard**: Centralized visibility and compliance

**Control Tower Guardrails:**

**Mandatory Guardrails** (always enforced):
- Disallow changes to CloudTrail configuration
- Disallow deletion of log archive
- Enable CloudTrail in all regions
- Enable MFA for root user

**Strongly Recommended Guardrails**:
- Enable encryption for EBS volumes
- Disallow public read/write on S3 buckets
- Enable AWS Config in all regions

**Elective Guardrails** (optional):
- Restrict EC2 instance types
- Disallow internet connections from VPC
- Require tags on resources

**Control Tower vs Organizations:**
| Feature | Organizations | Control Tower |
|---------|---------------|---------------|
| Setup Complexity | Manual | Automated |
| Guardrails | Manual SCPs | Pre-built + custom |
| Account Provisioning | Manual | Account Factory |
| Compliance Dashboard | No | Yes |
| Use Case | Full control | Quick setup with best practices |

**When to Use:**
- **Control Tower**: Quick setup, governance out-of-the-box, less AWS experience
- **Organizations**: Maximum flexibility, custom policies, experienced teams

#### AWS Resource Access Manager (RAM)

**What is AWS RAM?**
- **Share AWS resources across accounts** without duplicating them
- Share within your Organization or with specific accounts
- No additional charge for using RAM
- Centralized resource management

**Shareable Resources:**
- **VPC Subnets**: Share subnets with other accounts (common use case)
- **Transit Gateway**: Share transit gateway attachments
- **Route 53 Resolver**: Share DNS query resolution rules
- **License Manager**: Share software licenses
- **Aurora DB Clusters**: Share Aurora DB clusters
- **Resource Groups**: Share resource groups
- **Capacity Reservations**: Share EC2 capacity reservations
- **Dedicated Hosts**: Share dedicated hosts
- **Prefix Lists**: Share managed prefix lists

**Common Use Case: VPC Subnet Sharing**
```
Account A (Networking Account)
└── VPC (10.0.0.0/16)
    ├── Private Subnet 1 (shared via RAM)
    └── Private Subnet 2 (shared via RAM)
        ↓
        RAM Resource Share
        ↓
Account B (Application Account)
└── EC2 instances launch in Account A's subnets
    (but owned by Account B)
```

**Benefits of Subnet Sharing:**
- ✅ Centralized network management
- ✅ Reduced number of VPCs
- ✅ Simplified network architecture
- ✅ Lower operational overhead
- ✅ Efficient use of IP addresses

**RAM Sharing Process:**
1. Resource owner creates a resource share
2. Specify which resources to share
3. Specify which accounts/OUs can access
4. Recipients accept the share (if outside Organization)
5. Recipients can use resources (but not modify/delete)

**Exam Tip**: 🎯 RAM is commonly tested with VPC subnet sharing scenarios for centralized networking!

#### Consolidated Billing

**How Consolidated Billing Works:**
- Single payment method for all accounts in Organization
- Management account pays all charges
- Member accounts cannot change billing settings
- Combined usage for volume discounts

**Volume Discount Benefits:**
```
Account 1: Uses 500 GB S3 storage
Account 2: Uses 800 GB S3 storage
Account 3: Uses 700 GB S3 storage
Total: 2,000 GB → Higher volume pricing tier applies
```

**Cost Allocation Tags:**
- Tag resources across accounts
- Track costs by project, department, environment
- Generate detailed cost reports
- Examples: `Project:WebApp`, `Environment:Production`, `CostCenter:Engineering`

### 5.3 Billing and Cost Management

**Key Services:**
- **AWS Budgets**: Set custom budgets and alerts
- **Cost Explorer**: Visualize and analyze costs
- **Cost and Usage Report**: Detailed cost data
- **AWS Cost Anomaly Detection**: ML-powered cost anomaly alerts

**Free Tier:**
- 12 months free for many services
- Always free services (Lambda, DynamoDB limits)
- Trials (short-term free trials)

---

## 6. AWS Service Categories

### 6.1 Compute

- **EC2**: Virtual servers
- **Lambda**: Serverless functions
- **ECS/EKS**: Containers
- **Elastic Beanstalk**: PaaS

### 6.2 Storage

- **S3**: Object storage
- **EBS**: Block storage for EC2
- **EFS**: File storage
- **Glacier**: Archive storage

### 6.3 Database

- **RDS**: Managed relational databases
- **DynamoDB**: NoSQL database
- **Aurora**: High-performance relational
- **Redshift**: Data warehouse

### 6.4 Networking

- **VPC**: Virtual network
- **Route 53**: DNS service
- **CloudFront**: CDN
- **Direct Connect**: Dedicated connection

### 6.5 Security & Identity

- **IAM**: Identity and access management
- **KMS**: Key management
- **WAF**: Web application firewall
- **GuardDuty**: Threat detection

### 6.6 Management & Monitoring

- **CloudWatch**: Monitoring and logging
- **CloudTrail**: API auditing
- **Config**: Resource inventory and compliance
- **Systems Manager**: Operations hub

---

## 🎯 Exam Tips

### Must Know for Exam

1. **Regions and AZs:**
   - Minimum 3 AZs per region
   - Deploy across multiple AZs for HA
   - Choose region based on: compliance, latency, cost, services

2. **Well-Architected Framework:**
   - Know all 6 pillars: CROPSS
   - Understand design principles
   - Know key services for each pillar

3. **Shared Responsibility:**
   - AWS = Security OF the cloud
   - Customer = Security IN the cloud
   - Varies by service type (IaaS vs PaaS vs SaaS)

4. **Management Tools:**
   - Console = GUI
   - CLI = Automation
   - SDK = Programming
   - CloudFormation = Infrastructure as Code

### Common Exam Scenarios

**Scenario 1**: *"A company needs to ensure their application remains available even if an entire data center fails."*
- **Answer**: Deploy across multiple Availability Zones

**Scenario 2**: *"Who is responsible for patching the operating system on an EC2 instance?"*
- **Answer**: Customer (it's IaaS - you manage the OS)

**Scenario 3**: *"A company wants to reduce latency for users in Europe accessing content from us-east-1."*
- **Answer**: Use CloudFront (Edge Locations)

### Exam Keywords Mapping

| Keyword | Think This |
|---------|------------|
| "High Availability" | Multi-AZ deployment |
| "Disaster Recovery" | Multi-Region |
| "Low Latency" | Edge Locations, CloudFront |
| "Compliance" | Choose specific Region |
| "Infrastructure as Code" | CloudFormation |
| "Security OF cloud" | AWS responsibility |
| "Security IN cloud" | Customer responsibility |

---

## 📝 Practice Questions

### Question 1
**Which of the following is an AWS responsibility under the Shared Responsibility Model?**

A) Patching the operating system on EC2 instances  
B) Encrypting data stored in S3 buckets  
C) Physical security of data centers  
D) Configuring security groups

<details>
<summary>Show Answer</summary>

**Answer: C**

**Explanation**: Physical security of data centers is AWS's responsibility ("Security OF the cloud"). Options A, B, and D are customer responsibilities ("Security IN the cloud").
</details>

### Question 2
**A company wants to deploy a web application that must remain available even if an entire AWS data center becomes unavailable. What should they do?**

A) Deploy the application in multiple Regions  
B) Deploy the application across multiple Availability Zones  
C) Deploy the application using multiple Edge Locations  
D) Use AWS CloudFormation for deployment

<details>
<summary>Show Answer</summary>

**Answer: B**

**Explanation**: Deploying across multiple Availability Zones within a region ensures the application remains available even if one AZ (data center) fails. Multi-Region (A) would be for disaster recovery across regions. Edge Locations (C) are for content delivery. CloudFormation (D) is for infrastructure as code.
</details>

### Question 3
**Which pillar of the AWS Well-Architected Framework focuses on the ability to recover from failures and dynamically acquire resources to meet demand?**

A) Operational Excellence  
B) Security  
C) Reliability  
D) Performance Efficiency

<details>
<summary>Show Answer</summary>

**Answer: C**

**Explanation**: Reliability pillar focuses on the ability to recover from failures and dynamically acquire computing resources to meet demand.
</details>

### Question 4
**What is the minimum number of Availability Zones in an AWS Region?**

A) 1  
B) 2  
C) 3  
D) 4

<details>
<summary>Show Answer</summary>

**Answer: C**

**Explanation**: Every AWS region has a minimum of 3 Availability Zones, though most have more.
</details>

### Question 5
**A solutions architect needs to ensure that users in Asia experience low latency when accessing static web content hosted in us-east-1. What should they use?**

A) Deploy the application in ap-southeast-1 region  
B) Use Amazon CloudFront  
C) Create a VPC in Asia  
D) Use Route 53 geoproximity routing

<details>
<summary>Show Answer</summary>

**Answer: B**

**Explanation**: CloudFront uses Edge Locations globally to cache content closer to users, reducing latency. This is more cost-effective than deploying in multiple regions (A) for static content.
</details>

---

## 🔗 Additional Resources

### AWS Official Documentation
- [AWS Global Infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [AWS Management Console](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/getting-started.html)

### Hands-On Labs
1. **Explore AWS Regions and AZs**: Navigate the console and identify available regions
2. **Set Up AWS CLI**: Configure CLI on your local machine
3. **Create CloudFormation Stack**: Deploy a simple S3 bucket using IaC
4. **Enable MFA**: Enable multi-factor authentication on your AWS account

### Next Steps
- ✅ Complete this module
- ➡️ **Next**: [Module 02: Identity and Access Management (IAM)](../02-IAM/README.md)
- 📚 **Related**: [Quick Reference](../reference/QUICK-REFERENCE.md) for service comparisons

---

**Module Progress**: 🎯 Foundation Complete  
**Estimated Study Time**: 4-6 hours  
**Difficulty**: ⭐ Beginner

---

[⬅️ Back to Main README](../README.md) | [Next Module: IAM ➡️](../02-IAM/README.md)
