# AWS Visual Memory Guide - Diagrams & Charts

## 🎨 Visual Learning for AWS Concepts

---

## 1. AWS Global Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS GLOBAL INFRASTRUCTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  REGION (us-east-1)                                    │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │    │
│  │  │   AZ 1a      │  │   AZ 1b      │  │   AZ 1c      │ │    │
│  │  │              │  │              │  │              │ │    │
│  │  │  Data Center │  │  Data Center │  │  Data Center │ │    │
│  │  │  Data Center │  │  Data Center │  │  Data Center │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  EDGE LOCATIONS (400+) → CloudFront, Route 53, WAF, Shield     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

KEY CONCEPTS:
• Region = Geographic area (25+)
• AZ = Availability Zone = 1+ Data Centers (isolated)
• Edge Location = Cache content closer to users
```

---

## 2. VPC Architecture (Complete Picture)

```
┌───────────────────────────────────────────────────────────────────────┐
│                         AWS CLOUD (Region)                            │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  VPC (10.0.0.0/16)                                              │ │
│  │                                                                 │ │
│  │  ┌────────────────────────┐    ┌────────────────────────┐     │ │
│  │  │ PUBLIC SUBNET (AZ-A)   │    │ PUBLIC SUBNET (AZ-B)   │     │ │
│  │  │ 10.0.1.0/24            │    │ 10.0.2.0/24            │     │ │
│  │  │  ┌──────┐  ┌──────┐   │    │  ┌──────┐  ┌──────┐   │     │ │
│  │  │  │ EC2  │  │ EC2  │   │    │  │ EC2  │  │ EC2  │   │     │ │
│  │  │  │ Web  │  │ Web  │   │    │  │ Web  │  │ Web  │   │     │ │
│  │  │  └──────┘  └──────┘   │    │  └──────┘  └──────┘   │     │ │
│  │  │      ↓          ↓     │    │      ↓          ↓     │     │ │
│  │  └──────┼──────────┼─────┘    └──────┼──────────┼─────┘     │ │
│  │         │          │                  │          │           │ │
│  │    ┌────┴──────────┴──────────────────┴──────────┴────┐     │ │
│  │    │         Application Load Balancer (ALB)         │     │ │
│  │    └───────────────────────────────────────────────────┘     │ │
│  │         ↑                                         ↑           │ │
│  │  ┌──────┼─────────────────────────────────────────┼──────┐  │ │
│  │  │      │          INTERNET GATEWAY (IGW)         │      │  │ │
│  │  └──────┼─────────────────────────────────────────┼──────┘  │ │
│  │         │                                         │           │ │
│  │  ┌──────┴──────────────┐    ┌──────────────────┴─────┐     │ │
│  │  │ PRIVATE SUBNET (AZ-A)│    │ PRIVATE SUBNET (AZ-B) │     │ │
│  │  │ 10.0.11.0/24         │    │ 10.0.12.0/24          │     │ │
│  │  │  ┌──────┐  ┌──────┐ │    │  ┌──────┐  ┌──────┐   │     │ │
│  │  │  │ EC2  │  │ RDS  │ │    │  │ EC2  │  │ RDS  │   │     │ │
│  │  │  │ App  │  │ DB   │ │    │  │ App  │  │(Stdby)│  │     │ │
│  │  │  └──────┘  └──────┘ │    │  └──────┘  └──────┘   │     │ │
│  │  │      │               │    │                       │     │ │
│  │  └──────┼───────────────┘    └───────────────────────┘     │ │
│  │         │                                                   │ │
│  │         ↓                                                   │ │
│  │  ┌─────────────┐                                           │ │
│  │  │ NAT Gateway │ (for private subnet internet access)      │ │
│  │  └─────────────┘                                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
                           ↑
                    INTERNET (Users)

ROUTE TABLES:
Public Subnet:  0.0.0.0/0 → IGW (Internet Gateway)
Private Subnet: 0.0.0.0/0 → NAT Gateway

SECURITY:
• Security Groups = Instance-level firewall (stateful)
• NACLs = Subnet-level firewall (stateless)
```

---

## 3. High Availability Architecture

```
                         ┌──────────────────┐
                         │   Route 53 DNS   │
                         │  (Health Checks) │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │   CloudFront CDN  │
                         │  (Global Caching) │
                         └────────┬─────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
    ┌────▼─────┐            ┌────▼─────┐            ┌────▼─────┐
    │ Region 1 │            │ Region 2 │            │ Region 3 │
    │ (Primary)│            │ (Backup) │            │(DR Site) │
    └────┬─────┘            └────┬─────┘            └────┬─────┘
         │                        │                        │
    ┌────▼──────────────┐   ┌────▼──────────────┐   ┌────▼──────────────┐
    │  Load Balancer    │   │  Load Balancer    │   │  Load Balancer    │
    │   (Multi-AZ)      │   │   (Multi-AZ)      │   │   (Multi-AZ)      │
    └────┬──────────────┘   └────┬──────────────┘   └────┬──────────────┘
         │                        │                        │
    ┌────▼──────────────┐   ┌────▼──────────────┐   ┌────▼──────────────┐
    │  Auto Scaling     │   │  Auto Scaling     │   │  Auto Scaling     │
    │  EC2 Instances    │   │  EC2 Instances    │   │  EC2 Instances    │
    │  (AZ-1a, AZ-1b)   │   │  (AZ-2a, AZ-2b)   │   │  (AZ-3a, AZ-3b)   │
    └────┬──────────────┘   └────┬──────────────┘   └────┬──────────────┘
         │                        │                        │
    ┌────▼──────────────┐   ┌────▼──────────────┐   ┌────▼──────────────┐
    │  RDS Multi-AZ     │   │  Read Replica     │   │  Read Replica     │
    │  (Master+Standby) │   │  (Cross-Region)   │   │  (Cross-Region)   │
    └───────────────────┘   └───────────────────┘   └───────────────────┘
         │
    ┌────▼──────────────┐
    │  S3 Bucket        │
    │  + Replication    │───────────────────────────────────────────────►
    └───────────────────┘

FEATURES:
✓ Multi-Region failover
✓ Multi-AZ within region
✓ Auto Scaling for elasticity
✓ Load balancer health checks
✓ RDS automated failover
✓ S3 cross-region replication
✓ CloudFront edge caching
```

---

## 4. Serverless Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SERVERLESS ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  Users   │
    └────┬─────┘
         │
    ┌────▼─────────────────┐
    │  Route 53 (DNS)      │
    └────┬─────────────────┘
         │
    ┌────▼─────────────────┐
    │  CloudFront (CDN)    │───────────┐
    │  + S3 Static Website │           │
    └────┬─────────────────┘           │
         │                              │
    ┌────▼─────────────────┐           │
    │  API Gateway         │           │
    │  (REST/WebSocket)    │           │
    └────┬─────────────────┘           │
         │                              │
         ├─────────┬──────────┬────────┤
         │         │          │        │
    ┌────▼────┐ ┌─▼─────┐ ┌─▼─────┐ ┌▼──────┐
    │ Lambda  │ │Lambda │ │Lambda │ │Lambda │
    │Function1│ │Func 2 │ │Func 3 │ │Func 4 │
    └────┬────┘ └───┬───┘ └───┬───┘ └───┬───┘
         │          │         │         │
         ├──────────┴─────────┴─────────┤
         │                               │
    ┌────▼──────────┐            ┌──────▼────┐
    │  DynamoDB     │            │    S3     │
    │  (NoSQL DB)   │            │  (Files)  │
    └───────────────┘            └───────────┘

BENEFITS:
✓ No server management
✓ Auto-scaling
✓ Pay per use
✓ High availability built-in
✓ Focus on code, not infrastructure

COST MODEL:
• API Gateway: per million requests
• Lambda: per invocation + duration
• DynamoDB: per read/write or on-demand
• S3: per GB stored + requests
```

---

## 5. Data Analytics Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    REAL-TIME ANALYTICS PIPELINE                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Data Sources │
│ • IoT        │
│ • Apps       │
│ • Logs       │
│ • Clickstream│
└──────┬───────┘
       │
       ├───────────────────────────────────────────┐
       │                                           │
       │ REAL-TIME PROCESSING                      │ BATCH PROCESSING
       │                                           │
   ┌───▼──────────────┐                     ┌─────▼─────────┐
   │ Kinesis Data     │                     │  S3 Bucket    │
   │ Streams          │                     │  (Raw Data)   │
   └───┬──────────────┘                     └─────┬─────────┘
       │                                           │
   ┌───▼──────────────┐                     ┌─────▼─────────┐
   │ Kinesis Data     │                     │  Glue Crawler │
   │ Analytics (SQL)  │                     │  (Discover)   │
   └───┬──────────────┘                     └─────┬─────────┘
       │                                           │
   ┌───▼──────────────┐                     ┌─────▼─────────┐
   │ Kinesis Data     │                     │  Glue ETL Job │
   │ Firehose         │                     │  (Transform)  │
   └───┬──────────────┘                     └─────┬─────────┘
       │                                           │
       └───────────────┬───────────────────────────┘
                       │
                ┌──────▼───────────┐
                │  S3 Data Lake    │
                │  (Parquet/ORC)   │
                └──────┬───────────┘
                       │
           ┌───────────┼───────────┐
           │           │           │
      ┌────▼────┐ ┌───▼─────┐ ┌──▼────────┐
      │ Athena  │ │ Redshift│ │    EMR    │
      │ (Query) │ │(Warehouse)│(Big Data) │
      └────┬────┘ └───┬─────┘ └──┬────────┘
           │          │          │
           └──────────┼──────────┘
                      │
               ┌──────▼──────┐
               │ QuickSight  │
               │(Dashboards) │
               └─────────────┘

FLOW:
1. Ingest: Kinesis or direct to S3
2. Process: Real-time (Kinesis) or Batch (Glue/EMR)
3. Store: S3 Data Lake
4. Query: Athena, Redshift, EMR
5. Visualize: QuickSight
```

---

## 6. Database Migration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE MIGRATION WITH DMS                   │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────┐
│   ON-PREMISES         │
│   Source Database     │
│   (Oracle, SQL Server)│
└──────────┬────────────┘
           │
           │ (1) Initial Assessment
           ▼
┌───────────────────────┐
│  AWS Schema           │
│  Conversion Tool (SCT)│ ◄─── Use when changing DB engines
│  (Converts Schema)    │      (Oracle → PostgreSQL)
└──────────┬────────────┘
           │
           │ (2) Schema Converted
           ▼
┌───────────────────────┐
│   AWS DMS             │
│   Replication Instance│
│                       │
│   Full Load + CDC     │
│   ┌─────────────┐    │
│   │  Tasks      │    │
│   │  • Migrate  │    │
│   │  • Replicate│    │
│   └─────────────┘    │
└──────────┬────────────┘
           │
           │ (3) Data Migrated & Synced
           ▼
┌───────────────────────┐
│   AWS RDS/Aurora      │
│   Target Database     │
│   (PostgreSQL, MySQL) │
└───────────────────────┘

MIGRATION TYPES:
1. Full Load: One-time copy
2. Full Load + CDC: Initial copy + ongoing changes
3. CDC Only: Replicate only changes

STEPS:
1. Use SCT to convert schema (if different engines)
2. Create DMS replication instance
3. Configure source & target endpoints
4. Create & run migration task
5. Monitor & validate
6. Cutover when ready
```

---

## 7. EC2 Instance Lifecycle

```
                    ┌─────────────────┐
                    │   PENDING       │
                    │  (launching)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
           ┌────────┤    RUNNING      │◄────────┐
           │        │  (charged $$$)  │         │
           │        └────────┬────────┘         │
           │                 │                  │
           │        ┌────────▼────────┐         │
           │        │   STOPPING      │         │
           │        │                 │         │
           │        └────────┬────────┘         │
           │                 │                  │
           │        ┌────────▼────────┐         │
           └───────►│    STOPPED      │─────────┘ (RESTART)
                    │ (EBS $ only)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  TERMINATING    │
                    │                 │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   TERMINATED    │
                    │  (gone forever) │
                    └─────────────────┘

KEY POINTS:
• STOP = Keep instance, only pay for EBS storage
• TERMINATE = Delete instance (can prevent with protection)
• Instance Store = Lost on STOP/TERMINATE
• EBS = Persists (if not set to delete on terminate)
```

---

## 8. Auto Scaling Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTO SCALING IN ACTION                        │
└─────────────────────────────────────────────────────────────────┘

TRAFFIC PATTERN:
      High │     ╱╲        ╱╲
           │    ╱  ╲      ╱  ╲
           │   ╱    ╲    ╱    ╲
      Low  │__╱      ╲__╱      ╲___
           └────────────────────────────► Time
             8am  12pm  6pm  12am  6am

INSTANCE COUNT:
    10│         ┌──┐    ┌──┐
      │         │  │    │  │
     5│    ┌───┐│  │┌───┐  │
      │    │   ││  ││   │  │
     2│────┤   ├┘  └┤   ├──┘  ← Minimum = 2
      └────────────────────────────► Time

┌─────────────────────────────────────────┐
│  AUTO SCALING GROUP CONFIG              │
├─────────────────────────────────────────┤
│  Min Size:     2 instances              │
│  Desired:      2 instances              │
│  Max Size:     10 instances             │
│                                         │
│  SCALING POLICIES:                      │
│  • Target Tracking                      │
│    - CPU > 70% → Scale OUT (+2)        │
│    - CPU < 30% → Scale IN (-1)         │
│                                         │
│  • Scheduled Scaling                    │
│    - 8am weekdays → 5 instances         │
│    - 10pm → 2 instances                │
│                                         │
│  • Step Scaling                         │
│    - CPU 50-70% → +1 instance          │
│    - CPU 70-90% → +2 instances         │
│    - CPU > 90%  → +3 instances         │
└─────────────────────────────────────────┘
```

---

## 9. S3 Storage Class Decision Flow

```
        START: Need to store data in S3
                     │
                     ▼
        ┌────────────────────────────┐
        │ Access frequency known?    │
        └──────┬─────────────┬───────┘
               │ YES         │ NO
               ▼             ▼
    ┌──────────────┐   ┌────────────────────┐
    │How often     │   │ S3 Intelligent-    │
    │accessed?     │   │ Tiering            │
    └──┬───────────┘   │ (auto-optimize)    │
       │               └────────────────────┘
       ├─────────┬─────────┬─────────┐
       │         │         │         │
     Daily    Monthly   Rarely   Never
       │         │         │         │
       ▼         ▼         ▼         ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
   │S3      │ │S3      │ │Glacier │ │ Glacier  │
   │Standard│ │Std-IA  │ │Flexible│ │Deep Arc  │
   │        │ │        │ │        │ │          │
   │$0.023/ │ │$0.0125/│ │$0.0036/│ │$0.00099/ │
   │GB-mo   │ │GB-mo   │ │GB-mo   │ │GB-mo     │
   └────────┘ └────────┘ └────────┘ └──────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Critical data?       │
        │ NO → One Zone-IA     │
        │ YES → Standard-IA    │
        └──────────────────────┘

RETRIEVAL TIMES:
• Standard / Std-IA / One Zone-IA: Milliseconds
• Intelligent-Tiering: Milliseconds
• Glacier Instant: Milliseconds
• Glacier Flexible: Minutes to hours
• Glacier Deep Archive: 12-48 hours
```

---

## 10. Security Layers (Defense in Depth)

```
┌─────────────────────────────────────────────────────────────────┐
│                 AWS SECURITY - LAYERS OF DEFENSE                 │
└─────────────────────────────────────────────────────────────────┘

              ╔════════════════════════════════╗
              ║   1. EDGE PROTECTION           ║
              ║   • Route 53 (DNS)             ║
              ║   • CloudFront (CDN)           ║
              ║   • Shield (DDoS)              ║
              ║   • WAF (Web attacks)          ║
              ╚════════════╤═══════════════════╝
                           │
              ╔════════════▼═══════════════════╗
              ║   2. NETWORK LEVEL             ║
              ║   • VPC (isolation)            ║
              ║   • NACLs (subnet firewall)    ║
              ║   • Security Groups (instance) ║
              ╚════════════╤═══════════════════╝
                           │
              ╔════════════▼═══════════════════╗
              ║   3. IDENTITY & ACCESS         ║
              ║   • IAM (users, roles)         ║
              ║   • MFA (multi-factor auth)    ║
              ║   • Cognito (app users)        ║
              ╚════════════╤═══════════════════╝
                           │
              ╔════════════▼═══════════════════╗
              ║   4. APPLICATION               ║
              ║   • API Gateway (throttling)   ║
              ║   • Secrets Manager (creds)    ║
              ║   • Parameter Store            ║
              ╚════════════╤═══════════════════╝
                           │
              ╔════════════▼═══════════════════╗
              ║   5. DATA LAYER                ║
              ║   • KMS (encryption keys)      ║
              ║   • S3 encryption              ║
              ║   • RDS encryption             ║
              ║   • EBS encryption             ║
              ╚════════════╤═══════════════════╝
                           │
              ╔════════════▼═══════════════════╗
              ║   6. DETECTION & RESPONSE      ║
              ║   • GuardDuty (threats)        ║
              ║   • CloudTrail (audit logs)    ║
              ║   • Config (compliance)        ║
              ║   • Security Hub (centralized) ║
              ║   • Macie (data discovery)     ║
              ╚════════════════════════════════╝
```

---

## 11. Cost Optimization Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│               EC2 COST OPTIMIZATION STRATEGY                     │
└─────────────────────────────────────────────────────────────────┘

MONTH 1-2: Initial Launch
├─ 100% On-Demand instances
└─ Cost: $$$$$

         ↓ (Analyze CloudWatch metrics)

MONTH 3-6: Optimization Phase 1
├─ 60% Reserved Instances (1-year)
├─ 30% On-Demand (variable load)
└─ 10% Spot (batch processing)
└─ Cost: $$$ (40% savings)

         ↓ (Continue monitoring)

MONTH 7-12: Optimization Phase 2
├─ Right-size instances (downgrade oversized)
├─ Implement Auto Scaling
├─ Use Savings Plans instead of some RIs
└─ Cost: $$ (60% savings)

         ↓ (Ongoing)

YEAR 2+: Mature Optimization
├─ 70% Reserved/Savings Plans (3-year)
├─ 15% Spot instances
├─ 15% On-Demand
├─ Auto Scaling optimized
├─ Scheduled scaling for predictable patterns
└─ Cost: $ (75% savings)

┌─────────────────────────────────────┐
│  COST MONITORING TOOLS              │
├─────────────────────────────────────┤
│  Weekly:  Budgets alerts            │
│  Monthly: Cost Explorer             │
│  Quarter: Right-sizing review       │
│  Yearly:  RI/Savings Plan renewal   │
└─────────────────────────────────────┘
```

---

## 12. Disaster Recovery Strategies

```
┌─────────────────────────────────────────────────────────────────┐
│              DISASTER RECOVERY STRATEGIES (4 Types)              │
└─────────────────────────────────────────────────────────────────┘

1. BACKUP & RESTORE (Cheapest, Slowest)
   ┌──────────────┐              ┌──────────────┐
   │  Production  │──Backup──►   │  S3/Glacier  │
   │  Data Center │              │  (AWS)       │
   └──────────────┘              └──────────────┘
   RPO: Hours    RTO: Hours      Cost: $

2. PILOT LIGHT (Core services always on)
   ┌──────────────┐              ┌──────────────┐
   │  Production  │──Replicate─► │  AWS         │
   │  (Full)      │              │  (DB only)   │◄─Scale up on DR
   └──────────────┘              └──────────────┘
   RPO: Minutes  RTO: 10s mins   Cost: $$

3. WARM STANDBY (Scaled-down version running)
   ┌──────────────┐              ┌──────────────┐
   │  Production  │──Replicate─► │  AWS         │
   │  (100%)      │              │  (30%)       │◄─Scale to 100%
   └──────────────┘              └──────────────┘
   RPO: Seconds  RTO: Minutes    Cost: $$$

4. MULTI-SITE / HOT SITE (Full duplicate)
   ┌──────────────┐              ┌──────────────┐
   │  Production  │◄──Sync──────►│  AWS         │
   │  (100%)      │              │  (100%)      │
   └──────────────┘              └──────────────┘
   RPO: None     RTO: Instant    Cost: $$$$

┌────────────────────────────────────────────┐
│  RTO = Recovery Time Objective             │
│      (How long until service restored?)    │
│                                            │
│  RPO = Recovery Point Objective            │
│      (How much data can you lose?)         │
└────────────────────────────────────────────┘
```

---

## 13. Monitoring Strategy (CloudWatch + CloudTrail + Config)

```
┌─────────────────────────────────────────────────────────────────┐
│                  THE MONITORING TRINITY                          │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  CLOUDWATCH - Performance Monitoring               │
│  "What is happening right now?"                    │
├────────────────────────────────────────────────────┤
│  • Metrics: CPU, Memory, Disk, Network            │
│  • Logs: Application logs, System logs            │
│  • Alarms: Alert when threshold exceeded          │
│  • Dashboards: Visualize metrics                  │
│  • Events: Scheduled or event-based actions       │
└────────────────────────────────────────────────────┘
              │
              │  "EC2 CPU > 80% at 2:30 PM"
              │  "Lambda errors increased"
              ▼

┌────────────────────────────────────────────────────┐
│  CLOUDTRAIL - API Audit Logging                    │
│  "Who did what, when?"                             │
├────────────────────────────────────────────────────┤
│  • Records ALL API calls                          │
│  • User identity, time, IP address                │
│  • For compliance and security                    │
│  • Stores logs in S3                              │
│  • Integration with CloudWatch Logs               │
└────────────────────────────────────────────────────┘
              │
              │  "User john@company.com deleted S3
              │   bucket at 3:15 PM from IP 1.2.3.4"
              ▼

┌────────────────────────────────────────────────────┐
│  AWS CONFIG - Configuration Compliance             │
│  "Is it configured correctly?"                     │
├────────────────────────────────────────────────────┤
│  • Tracks resource configuration over time        │
│  • Compliance rules checking                      │
│  • Configuration history                          │
│  • Relationship tracking                          │
│  • Remediation (auto-fix issues)                  │
└────────────────────────────────────────────────────┘
              │
              │  "Security Group allows SSH from
              │   0.0.0.0/0 - NON-COMPLIANT"
              ▼

        ┌─────────────────────┐
        │  SECURITY HUB       │
        │  (Aggregated View)  │
        └─────────────────────┘

USE CASES:
• CloudWatch: "My app is slow" → Check CPU/Memory
• CloudTrail: "Who deleted my S3 bucket?" → Check logs
• Config: "Are all EBS volumes encrypted?" → Compliance check
```

---

## 14. Load Balancer Comparison (Visual)

```
┌─────────────────────────────────────────────────────────────────┐
│                   LOAD BALANCER COMPARISON                       │
└─────────────────────────────────────────────────────────────────┘

APPLICATION LOAD BALANCER (ALB) - Layer 7
┌─────────────────────────────────────────┐
│          HTTP/HTTPS Traffic             │
│                                         │
│  /api/*  → Backend 1                    │
│  /web/*  → Backend 2                    │
│  *.example.com → Backend 3              │
│                                         │
│  Features:                              │
│  ✓ Path-based routing                   │
│  ✓ Host-based routing                   │
│  ✓ WebSockets support                   │
│  ✓ HTTP/2 support                       │
│  ✓ Integrates with WAF                  │
│  ✓ Authenticates users (Cognito, OIDC) │
└─────────────────────────────────────────┘

NETWORK LOAD BALANCER (NLB) - Layer 4
┌─────────────────────────────────────────┐
│          TCP/UDP Traffic                │
│                                         │
│  Extreme performance                    │
│  Millions of requests per second        │
│  Static IP addresses                    │
│  Ultra-low latency                      │
│                                         │
│  Features:                              │
│  ✓ TCP/UDP/TLS                          │
│  ✓ Static IP or Elastic IP              │
│  ✓ Preserves source IP                  │
│  ✓ Sub-millisecond latency              │
│  ✓ TLS termination                      │
└─────────────────────────────────────────┘

CLASSIC LOAD BALANCER (CLB) - Layer 4 & 7
┌─────────────────────────────────────────┐
│          Legacy (Avoid)                 │
│                                         │
│  Use ALB or NLB for new apps            │
│                                         │
│  Features:                              │
│  ✓ HTTP, HTTPS, TCP, SSL               │
│  ⚠ Less features than ALB/NLB          │
│  ⚠ Being phased out                    │
└─────────────────────────────────────────┘

GATEWAY LOAD BALANCER (GWLB) - Layer 3
┌─────────────────────────────────────────┐
│   Third-party appliances                │
│                                         │
│  Firewalls, IDS/IPS                     │
│  Deep packet inspection                 │
│                                         │
│  Features:                              │
│  ✓ Layer 3 (IP packets)                 │
│  ✓ GENEVE protocol                      │
│  ✓ Scale security appliances            │
└─────────────────────────────────────────┘

DECISION TREE:
Need Layer 7 features (HTTP/path routing)? → ALB
Need extreme performance/static IP? → NLB
Need to route to security appliances? → GWLB
```

---

## 15. Database Selection Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHOOSE YOUR DATABASE                          │
└─────────────────────────────────────────────────────────────────┘

                   START: Need a database
                             │
                ┌────────────┴────────────┐
                │                         │
            Relational?               NoSQL?
                │                         │
       ┌────────┴────────┐       ┌────────┴────────┐
       │                 │       │                 │
   OLTP (apps)      OLAP (analytics)  Document    Key-Value
       │                 │           │               │
       ▼                 ▼           ▼               ▼
   ┌────────┐      ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  RDS   │      │ Redshift │  │Document  │  │ DynamoDB │
   │ Aurora │      │          │  │   DB     │  │          │
   └────────┘      └──────────┘  └──────────┘  └──────────┘
       │
       ├─ Need MySQL/PostgreSQL compatibility? → RDS or Aurora
       ├─ Need 5x performance? → Aurora
       ├─ Need Oracle/SQL Server? → RDS
       └─ Variable traffic? → Aurora Serverless

OTHER USE CASES:
┌──────────────────┬─────────────────────────────┐
│  Use Case        │  Database                   │
├──────────────────┼─────────────────────────────┤
│  E-commerce      │  DynamoDB (cart, sessions)  │
│  Social network  │  Neptune (graph)            │
│  Caching         │  ElastiCache (Redis)        │
│  Time-series     │  Timestream                 │
│  Ledger          │  QLDB (immutable)           │
│  Search          │  OpenSearch                 │
│  Migration from  │  DocumentDB                 │
│  MongoDB         │                             │
└──────────────────┴─────────────────────────────┘

PERFORMANCE REQUIREMENTS:
• Millisecond latency → DynamoDB, ElastiCache
• Microsecond latency → DynamoDB DAX
• Petabyte scale → Redshift
• In-memory → ElastiCache
```

---

**Remember**: A picture is worth a thousand words. Use these visual aids to understand relationships between services and architectural patterns! 🎨

**Study Tip**: Draw these diagrams from memory. If you can draw it, you understand it! ✏️
