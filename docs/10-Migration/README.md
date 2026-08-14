# Module 10: Migration & Transfer Services

## Overview
AWS provides a comprehensive set of services to migrate applications, databases, and data to the cloud. This module covers migration strategies, tools, and best practices for moving workloads to AWS.

## Learning Objectives
- Understand the 6 R's of migration strategy
- Use AWS DataSync for data transfer
- Migrate databases with AWS Database Migration Service (DMS)
- Track migrations using AWS Migration Hub
- Plan and execute cloud migrations effectively

---

## 1. Migration Strategies (6 R's)

### The 6 R's of Migration

1. **Rehost (Lift and Shift)**
   - Move applications as-is to AWS
   - Fastest migration approach
   - Use AWS Application Migration Service (MGN)
   - Example: Move VM-based applications to EC2

2. **Replatform (Lift, Tinker, and Shift)**
   - Make a few cloud optimizations
   - No core architecture changes
   - Example: Migrate database to RDS instead of EC2

3. **Repurchase (Drop and Shop)**
   - Move to a different product (usually SaaS)
   - Example: Migrate CRM to Salesforce

4. **Refactor/Re-architect**
   - Reimagine how application is architected
   - Use cloud-native features
   - Example: Move monolith to microservices on ECS/Lambda

5. **Retire**
   - Identify IT assets that are no longer useful
   - Turn off unnecessary applications
   - Reduce cost and complexity

6. **Retain (Revisit)**
   - Keep applications in source environment
   - Applications not ready for migration
   - Plan to migrate later

---

## 2. AWS DataSync

### What is AWS DataSync?
- **Automated data transfer service**
- Move data between on-premises storage and AWS
- Transfer data between AWS storage services
- Secure, fast, and simple data migration

### Key Features
- **Fast**: Up to 10x faster than open-source tools
- **Automated**: Handles data transfer, encryption, validation
- **Secure**: Encryption in-transit with TLS
- **Cost-effective**: Pay only for data copied

### DataSync Architecture

```
┌─────────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  On-Premises        │         │   AWS DataSync   │         │  AWS Storage    │
│                     │         │                  │         │                 │
│  - NFS              │◄───────►│  - Agent         │◄───────►│  - S3           │
│  - SMB              │         │  - Task          │         │  - EFS          │
│  - HDFS             │         │  - Scheduling    │         │  - FSx          │
└─────────────────────┘         └──────────────────┘         └─────────────────┘
```

### Use Cases
1. **Data Migration**: Move on-premises data to AWS
2. **Data Replication**: Replicate data for backup/DR
3. **Data Processing Workflows**: Transfer data for processing
4. **Archive Cold Data**: Move infrequently accessed data to S3 Glacier

### Supported Storage Systems

**Source Locations:**
- NFS shares (Network File System)
- SMB shares (Server Message Block)
- HDFS (Hadoop Distributed File System)
- Self-managed object storage
- AWS Snowcone
- Amazon S3
- Amazon EFS
- Amazon FSx for Windows File Server
- Amazon FSx for Lustre
- Amazon FSx for OpenZFS
- Amazon FSx for NetApp ONTAP

**Destination Locations:**
- Amazon S3 (all storage classes)
- Amazon EFS
- Amazon FSx for Windows File Server
- Amazon FSx for Lustre
- Amazon FSx for OpenZFS
- Amazon FSx for NetApp ONTAP

### DataSync Agent
- **Virtual machine** deployed on-premises or in-cloud
- Connects to your storage system
- Communicates with AWS DataSync service
- Download from AWS Console as VMware, Hyper-V, or KVM image

### Creating a DataSync Task

**Step 1: Deploy the Agent**
```bash
# Agent installed on-premises as VM
# Agent activated through AWS Console
```

**Step 2: Configure Source and Destination**
- Source location: On-premises NFS/SMB server
- Destination location: S3, EFS, FSx

**Step 3: Configure Task Settings**
- Data verification options
- Bandwidth throttling
- Filtering (include/exclude patterns)
- Scheduling

**Step 4: Execute and Monitor**
- Run task manually or on schedule
- Monitor progress in CloudWatch

### DataSync Features

**Data Integrity Verification:**
- Checks data consistency at source and destination
- Verifies data after transfer

**Bandwidth Management:**
- Throttle bandwidth to limit network impact
- Configure limits per task

**Filtering:**
```bash
# Include only specific file patterns
Include: *.log, *.txt

# Exclude directories
Exclude: /temp/*, /cache/*
```

**Scheduling:**
- Hourly, daily, weekly, or custom schedules
- Automated recurring transfers

### Pricing
- **Per-GB transferred**: $0.0125 per GB
- No upfront fees or software licenses
- No charge for data transferred within same AWS Region

### Exam Tips
✅ **DataSync vs Snow Family**
   - DataSync: For ongoing or regular transfers over network
   - Snow Family: For one-time large migrations or limited bandwidth

✅ **DataSync vs S3 Transfer Acceleration**
   - DataSync: For file systems (NFS, SMB) to AWS
   - S3 Transfer Acceleration: For direct uploads to S3

✅ **DataSync vs Storage Gateway**
   - DataSync: Data migration and transfer
   - Storage Gateway: Hybrid cloud storage with local caching

---

## 3. AWS Database Migration Service (DMS)

### What is AWS DMS?
- **Managed database migration service**
- Migrate databases to AWS quickly and securely
- Source database remains operational during migration
- Supports homogeneous and heterogeneous migrations

### Key Features
- **Minimal Downtime**: Source database stays operational
- **Continuous Data Replication**: Keep databases in sync
- **Broad Database Support**: 20+ database engines
- **Low Cost**: Pay only for compute resources and log storage

### DMS Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AWS DMS Process                         │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Source     │─────►│ Replication  │─────►│  Target  │ │
│  │   Database   │      │   Instance   │      │ Database │ │
│  │              │      │   (EC2)      │      │          │ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│                              │                             │
│                              ▼                             │
│                        ┌──────────┐                        │
│                        │ DMS Task │                        │
│                        └──────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Migration Types

**1. Homogeneous Migration**
- Same database engine (Oracle → Oracle)
- Source and target are same type
- Simple schema and data migration

**2. Heterogeneous Migration**
- Different database engines (Oracle → PostgreSQL)
- Requires AWS Schema Conversion Tool (SCT)
- More complex, needs schema conversion

### Supported Databases

**Source Databases:**
- Oracle
- Microsoft SQL Server
- MySQL
- MariaDB
- PostgreSQL
- MongoDB
- SAP ASE
- IBM Db2
- Azure SQL Database
- Amazon RDS
- Amazon Aurora
- Amazon S3
- Amazon DocumentDB

**Target Databases:**
- Oracle
- Microsoft SQL Server
- MySQL
- MariaDB
- PostgreSQL
- Amazon RDS
- Amazon Aurora
- Amazon Redshift
- Amazon DynamoDB
- Amazon S3
- Amazon OpenSearch
- Amazon Kinesis Data Streams
- Amazon DocumentDB
- Amazon Neptune
- Redis

### DMS Components

**1. Replication Instance**
- EC2 instance that runs DMS tasks
- Performs actual data migration
- Size based on workload and data volume

**2. Endpoints**
- Source endpoint: Connection to source database
- Target endpoint: Connection to target database
- Configure connection details and credentials

**3. Replication Tasks**
- Defines what tables to migrate
- Configures migration type
- Sets transformation rules

### Migration Task Types

**1. Full Load (Migrate Existing Data)**
- One-time migration of all data
- Snapshots source database and loads to target
- Good for static data or initial load

**2. CDC (Change Data Capture)**
- Replicate ongoing changes
- Captures changes after full load
- Keeps source and target in sync

**3. Full Load + CDC**
- Initial full load followed by ongoing replication
- Most common migration pattern
- Minimize downtime

### AWS Schema Conversion Tool (SCT)

**Purpose:**
- Convert database schema from one engine to another
- Handles heterogeneous migrations
- Converts stored procedures, functions, views

**Use Cases:**
- Oracle → PostgreSQL
- SQL Server → MySQL
- Oracle → Amazon Aurora

**Process:**
```
1. Connect to source database
2. Analyze and assess compatibility
3. Convert schema automatically
4. Manually fix incompatible code
5. Apply schema to target database
6. Use DMS for data migration
```

**Assessment Report:**
- Identifies what can be automatically converted
- Highlights manual changes needed
- Provides complexity estimates

### DMS Task Configuration

**Table Mappings:**
```json
{
  "rules": [
    {
      "rule-type": "selection",
      "rule-id": "1",
      "rule-name": "include-all-tables",
      "object-locator": {
        "schema-name": "myschema",
        "table-name": "%"
      },
      "rule-action": "include"
    }
  ]
}
```

**Transformation Rules:**
```json
{
  "rule-type": "transformation",
  "rule-id": "2",
  "rule-name": "rename-schema",
  "rule-action": "rename",
  "rule-target": "schema",
  "object-locator": {
    "schema-name": "myschema"
  },
  "value": "newschema"
}
```

### Multi-AZ Deployment
- High availability for replication instance
- Automatic failover
- Synchronous replication to standby
- Used for production migrations

### DMS Monitoring
- **CloudWatch Metrics**: CPU, memory, disk usage
- **Task Logs**: Detailed migration logs
- **Table Statistics**: Row counts, errors
- **Validation**: Compare source and target data

### Best Practices

1. **Right-Size Replication Instance**
   - T3 instances for testing
   - C5 instances for production migrations
   - R5 instances for large tables

2. **Use Multi-AZ for Production**
   - High availability
   - Minimal downtime

3. **Enable Validation**
   - Verify data integrity
   - Detect discrepancies

4. **Optimize Performance**
   - Use parallel load for large tables
   - Batch apply for better throughput
   - LOB (Large Object) optimization

5. **Test Before Production**
   - Run test migrations
   - Validate data and performance
   - Plan cutover strategy

### Pricing
- **Replication Instance**: Hourly pricing based on instance type
- **Storage**: $0.115 per GB-month for change logs
- **Data Transfer**: Standard data transfer rates

### Exam Tips
✅ **DMS for ongoing replication**: Continuous data replication with CDC

✅ **SCT for heterogeneous migrations**: Different database engines require Schema Conversion Tool

✅ **Multi-AZ for production**: High availability for critical migrations

✅ **Snowball + DMS**: Use Snowball Edge for initial large data load, then DMS for CDC

---

## 4. AWS Migration Hub

### What is AWS Migration Hub?
- **Single location to track migrations**
- Centralized dashboard for migration progress
- Integrates with AWS and partner migration tools
- Free service (pay only for underlying tools)

### Key Features
- **Track Application Migrations**: Monitor servers and databases
- **Visualize Progress**: Unified view across tools
- **Integration**: Works with CloudEndure, DMS, Server Migration Service
- **Grouping**: Organize servers into applications

### Migration Hub Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              AWS Migration Hub Console                       │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │ Application│  │  Server    │  │   Migration Status  │   │
│  │  Grouping  │  │ Discovery  │  │    Dashboard        │   │
│  └────────────┘  └────────────┘  └─────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
           │                 │                    │
           ▼                 ▼                    ▼
    ┌────────────┐    ┌─────────────┐    ┌──────────────┐
    │    DMS     │    │   Server    │    │  CloudEndure │
    │            │    │  Migration  │    │   Migration  │
    └────────────┘    │   Service   │    └──────────────┘
                      └─────────────┘
```

### Core Components

**1. Application Discovery**
- Discover on-premises servers
- Understand dependencies
- Group servers into applications

**2. Migration Tools Integration**
- AWS Application Migration Service (MGN)
- AWS Database Migration Service (DMS)
- AWS Server Migration Service (SMS)
- Partner tools (CloudEndure, ATADATA, etc.)

**3. Migration Tracking**
- Server-level migration status
- Application-level migration status
- Timeline and progress tracking

### AWS Application Discovery Service

**Purpose:**
- Plan migrations by gathering data about on-premises infrastructure
- Discover servers, VMs, and applications

**Discovery Types:**

**Agentless Discovery (VMware vCenter)**
- VM information (CPU, memory, disk)
- No software installation required
- Limited to VMware environments

**Agent-based Discovery**
- Detailed information (processes, network connections)
- Install AWS Discovery Agent on servers
- Works on physical and virtual servers

**Discovery Data Collected:**
- Server specifications (CPU, memory, disk)
- Network dependencies and connections
- Running processes and performance data
- Resource utilization over time

### Migration Hub Strategy Recommendations

**Purpose:**
- Automated migration strategy recommendations
- Analyze application portfolio
- Recommend optimal 6 R strategy

**Features:**
- Assess applications for migration readiness
- Recommend migration patterns (rehost, replatform, etc.)
- Estimate migration effort and cost
- Prioritize applications for migration

### Setting Up Migration Hub

**Step 1: Choose Home Region**
- Select single home region for Migration Hub
- All migration data stored in this region

**Step 2: Connect Migration Tools**
- Authorize tools to send data to Migration Hub
- Configure DMS, MGN, or SMS

**Step 3: Group Applications**
- Create application groups
- Add servers and databases to groups

**Step 4: Track Progress**
- Monitor migration status
- View updates from integrated tools

### Application Grouping

**Why Group Applications?**
- Track related resources together
- Understand application dependencies
- Coordinate migration of entire apps

**Example Application Group:**
```
Application: E-Commerce Website
├── Web Server (3 instances)
├── Application Server (2 instances)
├── Database Server (MySQL)
└── Cache Server (Redis)
```

### Migration Status Tracking

**Server Status:**
- Not Started
- In Progress
- Completed
- Failed

**Migration Phases:**
1. **Discovery**: Identify and assess servers
2. **Planning**: Group and plan migrations
3. **Migration**: Execute using tools
4. **Validation**: Verify successful migration

### AWS Server Migration Service (SMS) - Legacy

**Note:** Being replaced by AWS Application Migration Service (MGN)

**Features:**
- Automate VM migration to AWS
- Incremental replication
- Schedule migration windows
- Minimal downtime

### AWS Application Migration Service (MGN)

**Purpose:**
- Lift-and-shift migration (Rehost)
- Replaces CloudEndure and SMS
- Automated infrastructure conversion

**How It Works:**
```
1. Install AWS Replication Agent on source servers
2. Continuous block-level replication to AWS
3. Launch test instances for validation
4. Cutover to production instances
5. Decommission source servers
```

**Key Features:**
- Continuous data replication
- Non-disruptive testing
- Point-in-time recovery
- Automated orchestration

**Use Cases:**
- Large-scale lift-and-shift migrations
- Disaster recovery
- Cloud-based testing and development

### Integration with Other AWS Services

**AWS CloudFormation:**
- Infrastructure as code for migrated resources
- Template-based deployment

**AWS Systems Manager:**
- Manage migrated instances
- Patch management and automation

**Amazon CloudWatch:**
- Monitor migration performance
- Set up alarms for migration tasks

### Best Practices

1. **Start with Discovery**
   - Use Application Discovery Service
   - Understand dependencies before migration

2. **Group Related Resources**
   - Create application groups
   - Migrate entire applications together

3. **Choose Right Migration Tool**
   - DMS for databases
   - MGN for servers (lift-and-shift)
   - DataSync for file systems

4. **Test Before Cutover**
   - Validate in test environment
   - Performance testing
   - Application functionality testing

5. **Monitor Progress**
   - Use Migration Hub dashboard
   - Track completion percentage
   - Address issues promptly

### Migration Hub Pricing
- **Free service**
- Pay only for underlying migration tools
- No additional charge for tracking and monitoring

### Exam Tips
✅ **Centralized tracking**: Migration Hub provides single dashboard for all migrations

✅ **Application Discovery Service**: Discover servers and dependencies before migration

✅ **Integration**: Works with DMS, MGN, and partner tools

✅ **Application grouping**: Group servers and databases by application

✅ **Strategy Recommendations**: Automated recommendations for 6 R's migration strategy

---

## 5. Other Migration Services

### AWS Transfer Family
- **Managed file transfer service**
- Supports SFTP, FTPS, FTP, AS2 protocols
- Transfer files directly into S3 or EFS
- No infrastructure management

**Use Cases:**
- Replace legacy file transfer systems
- Share files with partners
- Data lake ingestion

### AWS Snow Family

**AWS Snowcone**
- Small, portable edge computing and data transfer device
- 8 TB usable storage
- Use for edge computing and data transfer
- Can run EC2 instances and Lambda functions

**AWS Snowball Edge**
- 80 TB or 210 TB of usable storage
- Compute capabilities (EC2, Lambda)
- Storage Optimized or Compute Optimized options
- For large data migrations and edge computing

**AWS Snowmobile**
- Exabyte-scale data transfer
- 100 PB per Snowmobile
- Physical truck for massive migrations
- For datacenter migrations

**When to Use:**
- Limited bandwidth
- Large data volumes (> 10 TB)
- One-time migrations
- Secure data transfer

### AWS Application Discovery Service
- Already covered in Migration Hub section
- Discovers on-premises infrastructure
- Agentless or agent-based discovery

### AWS Migration Evaluator
- **Assess on-premises infrastructure**
- Build business case for cloud migration
- Analyze cost and performance
- Formerly TSO Logic

**Features:**
- Quick insights into current state
- Cost projections for AWS
- Right-sizing recommendations
- ROI analysis

### AWS Mainframe Modernization
- Migrate and modernize mainframe applications
- Automated refactoring or replatforming
- Managed runtime environment
- Supports COBOL, PL/I, JCL

---

## 6. Migration Best Practices

### Migration Phases

**1. Assess**
- Discover current infrastructure
- Identify dependencies
- Create business case
- Estimate costs

**2. Mobilize**
- Create migration plan
- Set up landing zone
- Build migration team
- Security and compliance planning

**3. Migrate & Modernize**
- Execute migration using appropriate tools
- Validate and test
- Optimize and modernize
- Decommission on-premises resources

### AWS Cloud Adoption Framework (CAF)

**6 Perspectives:**

**Business:**
- Align IT with business goals
- Create business case
- ROI justification

**People:**
- Training and organizational change
- Skill development
- Change management

**Governance:**
- Cloud governance model
- Cost management
- Risk management

**Platform:**
- Architecture design
- Landing zone setup
- Cloud-native capabilities

**Security:**
- Identity and access management
- Data protection
- Compliance

**Operations:**
- Monitoring and logging
- Incident management
- Business continuity

### Security During Migration

1. **Encryption in Transit**: TLS/SSL for data transfer
2. **Encryption at Rest**: Encrypt data in AWS storage
3. **IAM Policies**: Least privilege access
4. **VPN/Direct Connect**: Secure network connectivity
5. **Compliance**: Maintain compliance during migration

### Performance Optimization

1. **Network Optimization**
   - Use AWS Direct Connect for large transfers
   - Enable Multi-Part Upload for S3
   - Use DataSync for optimal performance

2. **Parallel Processing**
   - Migrate multiple servers simultaneously
   - Parallel table loads in DMS

3. **Compression**
   - Compress data before transfer
   - Reduce transfer time and cost

---

## 7. Exam Tips Summary

### Key Concepts to Remember

✅ **6 R's of Migration**
   - Rehost, Replatform, Repurchase, Refactor, Retire, Retain
   - Choose based on business needs and complexity

✅ **DataSync**
   - Automated data transfer (NFS/SMB to AWS)
   - 10x faster than open-source tools
   - Use agent for on-premises sources

✅ **DMS (Database Migration Service)**
   - Minimal downtime database migration
   - Supports homogeneous and heterogeneous migrations
   - Use SCT for schema conversion (different engines)
   - CDC for continuous replication

✅ **Migration Hub**
   - Centralized tracking dashboard
   - Integrates with DMS, MGN, and partner tools
   - Application grouping and progress tracking
   - Free service

✅ **Snow Family**
   - Snowcone: 8 TB, edge computing
   - Snowball: 80-210 TB, large migrations
   - Snowmobile: 100 PB, datacenter migrations
   - Use when bandwidth is limited

✅ **Application Migration Service (MGN)**
   - Lift-and-shift (rehost) migrations
   - Continuous replication
   - Automated cutover
   - Replaces CloudEndure and SMS

✅ **AWS Backup**
   - Centralized backup management
   - Cross-region and cross-account backup
   - Backup policies and compliance
   - Essential for DR and data protection

---

## 7. AWS Backup

### What is AWS Backup?

**AWS Backup** is a fully managed, policy-based backup service that centralizes and automates data protection across AWS services.

**Key Benefits:**
- ✅ **Centralized Management**: Single console for all backups
- ✅ **Policy-Based**: Automated backup scheduling and retention
- ✅ **Cross-Region/Cross-Account**: Copy backups for disaster recovery
- ✅ **Compliance**: Lifecycle policies and backup auditing
- ✅ **Cost-Effective**: Pay only for backup storage used

### Supported AWS Services

**Compute:**
- Amazon EC2 (instances and EBS volumes)
- VMware on AWS

**Storage:**
- Amazon EBS volumes
- Amazon EFS file systems
- Amazon FSx (Windows File Server, Lustre, OpenZFS, NetApp ONTAP)
- AWS Storage Gateway volumes

**Databases:**
- Amazon RDS (all engines)
- Amazon Aurora
- Amazon DynamoDB
- Amazon DocumentDB
- Amazon Neptune

**Other:**
- Amazon S3
- AWS CloudFormation stacks

### AWS Backup Components

#### 1. Backup Plans

**What is a Backup Plan?**
- Defines **WHEN** and **HOW OFTEN** to back up resources
- Specifies backup **retention period**
- Defines backup **lifecycle** (move to cold storage)
- Can copy backups to other regions

**Backup Plan Example:**
```json
{
  "BackupPlanName": "DailyBackupPlan",
  "Rules": [
    {
      "RuleName": "DailyBackup",
      "ScheduleExpression": "cron(0 2 * * ? *)",
      "StartWindowMinutes": 60,
      "CompletionWindowMinutes": 120,
      "Lifecycle": {
        "MoveToColdStorageAfterDays": 30,
        "DeleteAfterDays": 365
      },
      "CopyActions": [
        {
          "DestinationBackupVaultArn": "arn:aws:backup:us-west-2:123456789012:backup-vault:DRVault",
          "Lifecycle": {
            "DeleteAfterDays": 90
          }
        }
      ]
    }
  ]
}
```

**Backup Frequency Options:**
- Continuous (point-in-time recovery)
- Hourly
- Every 12 hours
- Daily
- Weekly
- Monthly
- Custom cron expressions

#### 2. Backup Vaults

**What is a Backup Vault?**
- Container for storing and organizing backups
- Can enable vault lock for **compliance** (WORM - Write Once Read Many)
- Apply resource-based access policies
- Enable encryption with KMS

**Vault Lock:**
- Enforce retention policies
- Prevent backup deletion (even by root user)
- Meet regulatory compliance (SEC, HIPAA, etc.)
- Set minimum and maximum retention periods

#### 3. Resource Assignment

**How to Assign Resources:**
- **By tags**: Backup all resources with `Backup:Daily` tag
- **By resource ID**: Specific resources (ARN)
- **By resource type**: All RDS instances, all EBS volumes

**Example Tag-Based Assignment:**
```json
{
  "ResourceType": "*",
  "Tags": {
    "Environment": "Production",
    "Backup": "Required"
  }
}
```

### AWS Backup Features

#### Cross-Region Backup

**Purpose:**
- Disaster recovery
- Compliance requirements
- Geographic redundancy

**How it Works:**
1. Primary backup in source region
2. Automatically copy to destination region(s)
3. Managed by backup plan
4. Different retention in each region

**Example:**
```
Production (us-east-1)
  └── Backup Vault: PrimaryVault
      └── Daily backups (retain 30 days)
          ↓ Copy to DR region
DR Region (us-west-2)
  └── Backup Vault: DRVault
      └── Backup copies (retain 90 days)
```

#### Cross-Account Backup

**Use Case:**
- Centralized backup management
- Security isolation
- Compliance requirements

**Architecture:**
```
Production Account (111111111111)
  └── Resources (RDS, EC2, EFS)
      └── Backup to local vault
          ↓ Copy to backup account
Backup Account (222222222222)
  └── Centralized Backup Vault
      └── All organization backups
```

**Setup Steps:**
1. Enable AWS Organizations
2. Enable cross-account backup in Backup settings
3. Share backup vault using AWS RAM
4. Configure backup plan with copy action

#### Backup Policies (AWS Organizations)

**What are Backup Policies?**
- Organization-wide backup policies
- Enforce backup requirements across all accounts
- Applied at OU or account level
- Inherited down the hierarchy

**Example Backup Policy:**
```json
{
  "plans": {
    "ProdBackupPlan": {
      "regions": ["us-east-1", "us-west-2"],
      "rules": {
        "DailyBackupRule": {
          "schedule_expression": "cron(0 2 * * ? *)",
          "start_backup_window_minutes": 60,
          "complete_backup_window_minutes": 120,
          "lifecycle": {
            "move_to_cold_storage_after_days": 30,
            "delete_after_days": 365
          }
        }
      },
      "selections": {
        "tags": {
          "ProdBackupTag": {
            "iam_role_arn": "arn:aws:iam::$account:role/BackupRole",
            "tag_key": "Backup",
            "tag_value": ["Required", "Daily"]
          }
        }
      }
    }
  }
}
```

### Backup Lifecycle Management

**Storage Tiers:**
1. **Warm Storage**: Fast access, higher cost
2. **Cold Storage**: Glacier, lower cost, slower access

**Lifecycle Transition:**
```
Day 0-30: Warm Storage (frequent access)
    ↓
Day 30-90: Cold Storage (compliance)
    ↓
Day 90+: Delete (retention expired)
```

**Cost Optimization:**
- Move to cold storage after 30-90 days
- Set appropriate deletion policies
- Use continuous backup only when necessary

### AWS Backup vs Service-Native Backups

| Feature | AWS Backup | Service-Native (e.g., RDS snapshots) |
|---------|------------|--------------------------------------|
| Centralized management | ✅ Yes | ❌ Per-service |
| Policy-based automation | ✅ Yes | ⚠️ Limited |
| Cross-region copy | ✅ Automated | ⚠️ Manual |
| Cross-account backup | ✅ Yes | ❌ Complex |
| Compliance reporting | ✅ Built-in | ❌ Manual |
| Lifecycle management | ✅ Automated | ⚠️ Manual |
| Multiple services | ✅ 15+ services | ❌ Single service |
| Cost | 💰 Backup storage cost | 💰 Snapshot storage cost |

**When to Use AWS Backup:**
- ✅ Multiple AWS services to back up
- ✅ Need centralized management
- ✅ Cross-region or cross-account requirements
- ✅ Compliance and audit requirements
- ✅ Policy-based automation

**When to Use Service-Native:**
- ✅ Simple, single-service backups
- ✅ Tight integration with service features
- ✅ Custom scripting requirements

### AWS Backup Monitoring

**CloudWatch Metrics:**
- Number of backup jobs succeeded/failed
- Backup job duration
- Recovery point counts

**EventBridge Integration:**
- Trigger on backup job completion
- Alert on backup failures
- Automate restore testing

**AWS Backup Audit Manager:**
- Compliance reporting
- Policy violations detection
- Automated findings

### AWS Backup Pricing

**Cost Components:**
1. **Backup Storage**: Price per GB-month
   - Warm storage: ~$0.05/GB-month
   - Cold storage: ~$0.01/GB-month
2. **Restore Requests**: Price per GB restored
3. **Data Transfer**: Cross-region copy charges

**Cost Optimization Tips:**
- Use lifecycle policies to move to cold storage
- Set appropriate retention periods
- Delete unnecessary backups
- Use incremental backups (automatic)

### Exam Tips for AWS Backup

✅ **Key Exam Points:**
- AWS Backup provides **centralized**, **policy-based** backup
- Supports **15+ AWS services**
- **Cross-region** and **cross-account** backup for DR
- **Vault Lock** for compliance (WORM)
- Integration with **AWS Organizations** for policy enforcement
- **Lifecycle management** (warm → cold storage → delete)

✅ **Common Exam Scenarios:**
- "Centralized backup across multiple services" → **AWS Backup**
- "Cross-region disaster recovery backup" → **AWS Backup with copy actions**
- "Enforce backup policies across all accounts" → **AWS Backup Policies with Organizations**
- "Prevent backup deletion for compliance" → **Backup Vault Lock**
- "Cost-effective long-term backup retention" → **Lifecycle to cold storage**

---

## 8. Disaster Recovery Strategies

### RTO and RPO

**Recovery Time Objective (RTO):**
- How quickly you need to recover after a disaster
- Time from disaster event to full recovery
- Example: RTO = 4 hours means system must be back in 4 hours

**Recovery Point Objective (RPO):**
- How much data loss is acceptable
- Time between last backup and disaster event
- Example: RPO = 1 hour means max 1 hour of data loss acceptable

**RTO vs RPO:**
```
Last Backup        Disaster Event        System Recovered
     |                    |                      |
     |<---- RPO (data) -->|<---- RTO (time) ---->|
     |                    |                      |
   Backup            Disaster              Recovery
  (8:00 AM)          (9:00 AM)           (11:00 AM)

RPO = 1 hour (data from 8 AM to 9 AM lost)
RTO = 2 hours (9 AM to 11 AM to recover)
```

### Four DR Strategies

#### 1. Backup and Restore (Lowest cost, Highest RTO/RPO)

**Architecture:**
- Regular backups to S3/Glacier
- Restore when disaster occurs
- No resources running in DR region

**Characteristics:**
- 💰 **Cost**: Lowest (only backup storage)
- ⏱️ **RTO**: Hours to days
- 💾 **RPO**: Hours (depends on backup frequency)

**Use Case:** Non-critical applications, long RTO acceptable

**Implementation:**
```
Production Region (us-east-1)
  └── Application + Database
      └── AWS Backup (daily)
          ↓
DR Region (us-west-2)
  └── S3 Backup Vault (backups only)
  
Disaster:
  1. Deploy infrastructure (CloudFormation)
  2. Restore from backup
  3. Update DNS
```

#### 2. Pilot Light (Low cost, Medium RTO/RPO)

**Architecture:**
- Core components always running in DR region
- Minimal resources (just enough to restore quickly)
- Scale up resources during disaster

**Characteristics:**
- 💰 **Cost**: Low (minimal running resources)
- ⏱️ **RTO**: Minutes to hours
- 💾 **RPO**: Minutes (continuous replication)

**Use Case:** Critical applications, moderate RTO requirements

**Implementation:**
```
Production Region (us-east-1)
  ├── Full application stack
  └── RDS Primary
      ↓ Continuous replication
DR Region (us-west-2)
  ├── AMIs ready
  ├── RDS Read Replica (or Aurora replica)
  └── Small or no compute instances
  
Disaster:
  1. Promote RDS read replica to primary
  2. Scale up compute resources (Auto Scaling)
  3. Update Route 53 DNS
```

#### 3. Warm Standby (Medium cost, Low RTO/RPO)

**Architecture:**
- Scaled-down version of full environment running
- All components active but minimal capacity
- Scale up during disaster

**Characteristics:**
- 💰 **Cost**: Medium (scaled-down resources running)
- ⏱️ **RTO**: Minutes
- 💾 **RPO**: Seconds to minutes

**Use Case:** Business-critical applications

**Implementation:**
```
Production Region (us-east-1)
  ├── Full-scale application (100% capacity)
  └── RDS Multi-AZ Primary
      ↓ Synchronous replication
DR Region (us-west-2)
  ├── Smaller application stack (30% capacity)
  ├── RDS Read Replica or Aurora Global Database
  └── Auto Scaling ready to scale up
  
Disaster:
  1. Promote database
  2. Scale up to 100% capacity
  3. Route 53 health check automatic failover
```

#### 4. Multi-Site Active/Active (Highest cost, Lowest RTO/RPO)

**Architecture:**
- Full production environment in multiple regions
- Both sites actively serving traffic
- Immediate failover

**Characteristics:**
- 💰 **Cost**: Highest (full duplication)
- ⏱️ **RTO**: Real-time (automatic)
- 💾 **RPO**: Near-zero (continuous sync)

**Use Case:** Mission-critical applications, zero downtime requirements

**Implementation:**
```
Production Region 1 (us-east-1)
  ├── Full application stack (50% traffic)
  ├── Aurora Global Database (Primary)
  └── DynamoDB Global Tables
      ↕ Bidirectional replication
Production Region 2 (us-west-2)
  ├── Full application stack (50% traffic)
  ├── Aurora Global Database (Secondary)
  └── DynamoDB Global Tables
  
Route 53: Geoproximity routing or weighted routing
Disaster: Automatic failover, no intervention needed
```

### DR Strategy Comparison

| Strategy | RTO | RPO | Cost | Use Case |
|----------|-----|-----|------|----------|
| **Backup & Restore** | Hours-Days | Hours | 💰 Lowest | Non-critical, cost-sensitive |
| **Pilot Light** | 10min-Hours | Minutes | 💰💰 Low | Important apps, acceptable downtime |
| **Warm Standby** | Minutes | Seconds | 💰💰💰 Medium | Business-critical apps |
| **Multi-Site** | Real-time | Near-zero | 💰💰💰💰 Highest | Mission-critical, zero downtime |

### DR Best Practices

✅ **Define Requirements:**
- Document acceptable RTO and RPO
- Understand business impact of downtime
- Balance cost vs availability

✅ **Automate Everything:**
- Use CloudFormation for infrastructure
- Automate failover with Route 53 health checks
- Test automation regularly

✅ **Test Regularly:**
- Schedule DR drills
- Document procedures
- Update runbooks

✅ **Monitor and Alert:**
- CloudWatch alarms for replication lag
- Route 53 health checks
- AWS Health Dashboard

✅ **Data Replication:**
- **RDS**: Read replicas, Multi-AZ, Aurora Global Database
- **DynamoDB**: Global Tables
- **S3**: Cross-Region Replication (CRR)
- **EBS**: Snapshots copied to DR region
- **EFS**: Backup to S3, replicate with DataSync

### Exam Tips for Disaster Recovery

✅ **Exam Keywords Mapping:**
- "Lowest cost DR" → **Backup and Restore**
- "Core components always running" → **Pilot Light**
- "Scaled-down version running" → **Warm Standby**
- "Zero downtime, both sites active" → **Multi-Site Active/Active**
- "RTO in minutes, RPO in seconds" → **Warm Standby or Multi-Site**
- "Acceptable data loss of 1 hour" → **RPO = 1 hour** → Backup & Restore or Pilot Light
- "Recover within 10 minutes" → **RTO = 10 minutes** → Warm Standby or Multi-Site

---

## 9. Exam Summary



**Scenario 1: Large Database Migration**
- Solution: DMS with Multi-AZ, Full Load + CDC
- For heterogeneous: Use SCT first

**Scenario 2: Ongoing File Sync**
- Solution: DataSync with scheduled tasks
- Alternative: Storage Gateway for hybrid access

**Scenario 3: Migrate 500 Servers**
- Solution: Application Migration Service (MGN)
- Track with Migration Hub

**Scenario 4: Limited Bandwidth, 50 TB Data**
- Solution: AWS Snowball Edge
- Follow up with DataSync for incremental changes

**Scenario 5: Track Multiple Migration Tools**
- Solution: AWS Migration Hub
- Centralized dashboard for all tools

---

## 8. Hands-On Practice

### Lab 1: DMS Database Migration
1. Create source and target databases (RDS)
2. Create DMS replication instance
3. Configure source and target endpoints
4. Create migration task (Full Load + CDC)
5. Monitor migration progress
6. Validate data

### Lab 2: DataSync File Transfer
1. Set up source NFS share (or use S3)
2. Deploy DataSync agent (if on-premises)
3. Create DataSync task
4. Configure destination (S3, EFS)
5. Execute task and monitor

### Lab 3: Migration Hub Setup
1. Choose home region
2. Connect migration tools
3. Discover servers (Application Discovery Service)
4. Create application groups
5. Track migration progress

---

## 9. Additional Resources

### AWS Documentation
- [AWS Migration Hub](https://docs.aws.amazon.com/migrationhub/)
- [AWS Database Migration Service](https://docs.aws.amazon.com/dms/)
- [AWS DataSync](https://docs.aws.amazon.com/datasync/)
- [AWS Application Migration Service](https://docs.aws.amazon.com/mgn/)

### AWS Whitepapers
- AWS Cloud Adoption Framework
- AWS Migration Best Practices
- Database Migration Guide

### AWS Training
- AWS Migration Learning Plan
- Deep Dive on AWS Migration Services
- Hands-on DMS Workshop

---

## Quick Reference

| Service | Purpose | Key Feature |
|---------|---------|-------------|
| **DataSync** | Automated data transfer | 10x faster, agent-based |
| **DMS** | Database migration | Minimal downtime, CDC |
| **Migration Hub** | Track migrations | Centralized dashboard |
| **SCT** | Schema conversion | Heterogeneous DB migrations |
| **MGN** | Server migration | Lift-and-shift, continuous replication |
| **Snow Family** | Physical data transfer | Limited bandwidth scenarios |
| **Transfer Family** | Managed file transfer | SFTP/FTPS to S3/EFS |

---

**Next Module:** [11-Analytics →](../11-Analytics/README.md)

**Previous Module:** [← 09-Monitoring](../09-Monitoring/README.md)

