# AWS Solution Architect - Quick Study Notes

## 🎯 Memory Aids & Mnemonics

### The 6 R's of Migration (RRRRR-R)
**"Real Robots Rarely Refactor, Retire, or Retain"**
1. **R**ehost - Lift and Shift
2. **R**eplatform - Lift, Tinker, and Shift
3. **R**epurchase - Drop and Shop
4. **R**efactor - Re-architect
5. **R**etire - Turn off
6. **R**etain - Keep for now

### Well-Architected Framework (CROPS)
**"CROPS grow well in the cloud"**
- **C**ost Optimization
- **R**eliability
- **O**perational Excellence
- **P**erformance Efficiency
- **S**ecurity

### S3 Storage Classes (SIGGIZ-OD)
**"SIG GIZ is ODD"**
- **S**tandard
- **I**ntelligent-Tiering
- **G**lacier Instant Retrieval
- **G**lacier Flexible Retrieval
- **I**nfrequent Access (Standard-IA)
- **Z**one-IA (One Zone-IA)
- **O**utposts
- **D**eep Archive

### EC2 Instance Types (CRAM-FACTS)
**"CRAM the FACTS for the exam"**
- **C**ompute Optimized (C5, C6) - CPU intensive
- **R**AM Optimized (R5, X, High Memory) - Memory intensive
- **A**ccelerated (P, G, F, Inf) - GPU/FPGA
- **M**edium/General Purpose (M5, T3, A1) - Balanced
- **F**PGA (F1) - Hardware acceleration
- **A**RM (A1, Graviton) - Cost-effective
- **C**ost Optimized (T3, T4g) - Burstable
- **T**hroughput Optimized (I3, D2, H1) - Storage optimized
- **S**torage (I, D, H) - High IOPS/throughput

### RDS Read Replica vs Multi-AZ
**"REPLICAS = Performance, MULTI = Protection"**
- **Read Replicas**: Scale READ performance, cross-region, async
- **Multi-AZ**: High availability, same region, sync, automatic failover

### Database Decision Tree
**"DynamoDB = Fast & Flexible, RDS = Relations Required, Redshift = Reporting"**
- **DynamoDB**: NoSQL, millisecond latency, serverless
- **RDS**: Relational, ACID, traditional SQL
- **Redshift**: Data warehouse, analytics, OLAP
- **Aurora**: MySQL/PostgreSQL on steroids (5x performance)
- **DocumentDB**: MongoDB compatibility
- **Neptune**: Graph database

### Security Groups vs NACLs
**"SG = Stateful Guardian, NACL = Network Access Control List"**

| Feature | Security Groups | NACLs |
|---------|----------------|-------|
| **Level** | Instance | Subnet |
| **State** | Stateful (return auto) | Stateless (explicit return) |
| **Rules** | Allow only | Allow AND Deny |
| **Order** | All evaluated | Numbered order |
| **Scope** | Specific instances | All instances in subnet |

**Memory Aid**: **"SG Says yes, NACL Numbers everything"**

---

## ⚡ Quick Reference Tables

### Storage Decision Matrix

| Need | Service | Why |
|------|---------|-----|
| Object storage | **S3** | Unlimited, 99.999999999% durability |
| File storage (shared) | **EFS** | NFSv4, multiple EC2 instances |
| File storage (Windows) | **FSx for Windows** | SMB, AD integration |
| Block storage | **EBS** | Persistent, single EC2 attachment |
| Archive | **S3 Glacier** | Lowest cost, retrieval time OK |
| Fast archive | **Glacier Instant** | Archive with ms retrieval |
| Temporary storage | **Instance Store** | Ephemeral, highest IOPS |
| Edge storage | **Snow Family** | Local processing + transfer |

### Compute Decision Matrix

| Workload | Best Choice | Why |
|----------|-------------|-----|
| Traditional apps | **EC2** | Full control, flexibility |
| Serverless functions | **Lambda** | Event-driven, no servers |
| Containers (managed) | **ECS/EKS** | Docker orchestration |
| Containers (serverless) | **Fargate** | No EC2 management |
| Platform as a Service | **Elastic Beanstalk** | Deploy code, auto-scaling |
| Batch jobs | **Batch** | Managed batch computing |
| High-performance computing | **EC2 + Cluster Placement** | Low latency, high throughput |

### Database Decision Matrix

| Use Case | Database | Key Feature |
|----------|----------|-------------|
| Relational (MySQL/PostgreSQL) | **RDS** | Managed, backups, Multi-AZ |
| Relational (high performance) | **Aurora** | 5x MySQL, 3x PostgreSQL |
| NoSQL (key-value) | **DynamoDB** | Single-digit ms, serverless |
| NoSQL (document) | **DocumentDB** | MongoDB compatible |
| In-memory cache | **ElastiCache** | Redis or Memcached |
| Data warehouse | **Redshift** | Columnar, petabyte-scale |
| Graph database | **Neptune** | Relationships, social networks |
| Time-series | **Timestream** | IoT, metrics, events |
| Ledger | **QLDB** | Immutable, cryptographic |

### Network Services Quick Guide

| Service | Purpose | Key Point |
|---------|---------|-----------|
| **VPC** | Private network | Your own data center in AWS |
| **Subnet** | IP range in VPC | Public = IGW, Private = NAT |
| **Internet Gateway** | Internet access | Attached to VPC |
| **NAT Gateway** | Private → Internet | For private subnets (outbound) |
| **VPC Peering** | Connect VPCs | Non-transitive |
| **Transit Gateway** | Hub for VPCs | Transitive, simplifies architecture |
| **Direct Connect** | Dedicated connection | On-prem to AWS, low latency |
| **VPN** | Encrypted connection | Over internet to VPC |
| **Route 53** | DNS service | 7 routing policies |
| **CloudFront** | CDN | Global edge locations |
| **Global Accelerator** | Network performance | Static IPs, AWS backbone |

### Route 53 Routing Policies (SIM-WGLF)

**"SIM with Weighted Geolocation Latency Failover"**
1. **S**imple - Single resource
2. **I**P-based - Route based on client IP
3. **M**ulti-value - Multiple IPs (with health checks)
4. **W**eighted - Distribute traffic by weight (%)
5. **G**eolocation - Route by user location
6. **L**atency - Lowest latency region
7. **F**ailover - Active-passive DR

---

## 🔥 High-Frequency Exam Topics

### EC2 Pricing (Remember: ORSS-DC)
- **O**n-Demand: No commitment, highest cost
- **R**eserved: 1-3 years, up to 72% off
- **S**avings Plans: Flexible, $/hour commitment
- **S**pot: Up to 90% off, can be interrupted
- **D**edicated Hosts: BYOL, compliance
- **D**edicated Instances: Hardware isolation

### S3 Encryption (4 Types)

**"SSE = Server-Side, CSE = Client-Side"**

1. **SSE-S3**: AWS manages keys (AES-256)
2. **SSE-KMS**: You control keys via KMS
3. **SSE-C**: You provide keys
4. **Client-Side**: Encrypt before upload

### EBS Volume Types (GP-IP-ST)

**"General Purpose, Provisioned IOPS, Throughput"**

| Type | Name | IOPS | Throughput | Use Case |
|------|------|------|------------|----------|
| **gp3** | General Purpose SSD | 16,000 | 1,000 MB/s | Boot volumes, dev/test |
| **gp2** | General Purpose SSD | 16,000 | 250 MB/s | Legacy |
| **io2** | Provisioned IOPS SSD | 64,000 | 1,000 MB/s | Databases, critical apps |
| **io1** | Provisioned IOPS SSD | 64,000 | 1,000 MB/s | Legacy |
| **st1** | Throughput Optimized HDD | 500 | 500 MB/s | Big data, data warehouse |
| **sc1** | Cold HDD | 250 | 250 MB/s | Infrequent access |

**Memory Tip**: "**G**ood for **P**roduction, **I**ntense **O**perations, **S**low but **T**hrifty"

### Load Balancer Types (ACN-G)

**"Application, Classic, Network, Gateway"**

| Type | Layer | Protocol | Use Case |
|------|-------|----------|----------|
| **ALB** | 7 (Application) | HTTP/HTTPS | Microservices, containers, path-based |
| **NLB** | 4 (Transport) | TCP/UDP | Extreme performance, static IP |
| **CLB** | 4 & 7 | HTTP/HTTPS/TCP | Legacy (avoid) |
| **GWLB** | 3 (Network) | IP | Firewalls, IDS/IPS |

**Remember**: "**A**pps use ALB, **N**etwork uses NLB, **C**lassic is old, **G**ateway for security"

---

## 💡 Common Scenarios & Solutions

### Scenario 1: High Availability
**Problem**: Need fault-tolerant architecture
**Solution**: 
- Multi-AZ deployment (minimum 2 AZs)
- Auto Scaling Group
- Application Load Balancer
- RDS Multi-AZ or Aurora
- S3 for static content (11 9's durability)

### Scenario 2: Disaster Recovery
**Strategies (by RTO/RPO)**: **"Backup, Pilot, Warm, Hot"**
1. **Backup & Restore**: Cheapest, slowest (hours)
2. **Pilot Light**: Core services running (minutes)
3. **Warm Standby**: Scaled-down copy running
4. **Hot Site/Multi-Site**: Full duplicate, instant failover

### Scenario 3: Cost Optimization
**Checklist**:
- ✅ Use Reserved Instances/Savings Plans (70% of usage)
- ✅ Spot Instances for fault-tolerant workloads
- ✅ Right-size instances (CloudWatch metrics)
- ✅ Auto Scaling (scale down when idle)
- ✅ S3 Lifecycle policies (move to cheaper tiers)
- ✅ Delete unused resources (snapshots, volumes, IPs)
- ✅ Use CloudFront (reduce data transfer costs)

### Scenario 4: Serverless Architecture
**Stack**: "**ALARMS**"
- **A**PI Gateway - REST/WebSocket APIs
- **L**ambda - Compute
- **A**urora Serverless - Database
- **R**oute 53 - DNS
- **M**S (DynamoDB) - NoSQL
- **S**3 - Object storage

### Scenario 5: Hybrid Cloud
**Solution**:
- **Storage Gateway**: Hybrid storage (File/Volume/Tape)
- **Direct Connect**: Dedicated network connection
- **VPN**: Encrypted over internet
- **Outposts**: AWS infrastructure on-premises
- **DataSync**: Automated data transfer

### Scenario 6: Database Migration
**Tool Selection**:
- **Same engine** (Oracle → Oracle): DMS only
- **Different engine** (Oracle → PostgreSQL): SCT + DMS
- **Large data + limited bandwidth**: Snowball + DMS (CDC)
- **Ongoing replication**: DMS with CDC enabled

### Scenario 7: Real-Time Analytics
**Pipeline**: "**KALE**"
- **K**inesis Data Streams - Ingest real-time data
- **A**nalytics - Process with SQL/Flink
- **L**ambda - Transform/enrich (optional)
- **E**lasticsearch/S3 - Store results

**Alternative**: Kinesis Firehose → S3 → Athena → QuickSight

---

## 🎓 Study Tips by Service Category

### Identity & Access (IAM)
**Golden Rules**:
1. **Least Privilege**: Give minimum permissions needed
2. **Never use root**: Create admin user immediately
3. **MFA**: Enable for all privileged users
4. **Roles not keys**: Use IAM roles for EC2, Lambda
5. **Policy structure**: Effect, Action, Resource, Condition

**Remember**: "**PARC** = Principal, Action, Resource, Condition"

### Monitoring & Logging
**The Monitoring Trinity**: "**CloudWatch, CloudTrail, Config**"
- **CloudWatch**: Metrics & Logs (performance monitoring)
- **CloudTrail**: API calls (who did what, when)
- **Config**: Resource inventory & compliance (configuration history)

**X-Ray**: Distributed tracing (debug microservices)

### Security Services
**"Guard your WAF with Shield and Inspector"**
- **GuardDuty**: Threat detection (ML-powered)
- **WAF**: Web Application Firewall (Layer 7)
- **Shield**: DDoS protection (Standard free, Advanced paid)
- **Inspector**: Vulnerability scanning (EC2, containers)
- **Macie**: Data privacy (finds PII in S3)
- **Security Hub**: Central security view

### Migration Services
**"DataSync for files, DMS for databases, MGN for servers"**
- **DataSync**: NFS/SMB → S3/EFS (fast, automated)
- **DMS**: Database migration (same or different engines)
- **MGN**: Application Migration Service (lift-and-shift)
- **Migration Hub**: Track all migrations
- **Snow Family**: Physical data transfer (TB to EB)

### Analytics Services
**"AGAKE"** (A-Gake)
- **A**thena: Query S3 with SQL (serverless)
- **G**lue: ETL and Data Catalog
- **A**nalytics: Kinesis Data Analytics (real-time)
- **K**inesis: Streaming data (Streams, Firehose)
- **E**MR: Big data frameworks (Hadoop, Spark)

**Visualization**: QuickSight

---

## 🧠 Memory Techniques

### The Number Game

**S3 Durability & Availability**:
- **11 nines** (99.999999999%) = Durability (data won't be lost)
- **4 nines** (99.99%) = Availability (data accessible)
- **Remember**: "11 for Don't lose, 4 for Available"

**RDS Backups**:
- **Automated**: 1-35 days (default 7)
- **Snapshots**: Manual, unlimited retention
- **Remember**: "Auto = 35 max, Snap = forever"

**Lambda Limits**:
- **Timeout**: 15 minutes max
- **Memory**: 128 MB - 10 GB
- **Deployment**: 50 MB (zipped), 250 MB (unzipped)
- **Remember**: "15-min max, 10GB RAM, 50/250 package"

**EBS Multi-Attach**:
- Only **io1/io2** volumes
- Max **16 instances** (same AZ)
- **Remember**: "IO = 16 instances only"

### Port Numbers (Common)

**"SSH FTP Webby SQL RDP MySQL PostgreSQL Redis Tomcat"**
- **SSH**: 22
- **FTP**: 21
- **HTTP**: 80
- **HTTPS**: 443
- **SQL Server**: 1433
- **RDP**: 3389
- **MySQL/Aurora**: 3306
- **PostgreSQL**: 5432
- **Redis**: 6379
- **Tomcat**: 8080

### Encryption at Rest vs In Transit

**"Rest = At home in bed, Transit = On the road"**
- **At Rest**: Stored on disk (S3, EBS, RDS) - Use KMS
- **In Transit**: Moving over network - Use TLS/SSL

---

## 📝 Cheat Sheet for Exam Day

### Data Transfer Costs
**"IN is free, OUT costs money, SAME REGION is free"**
- Data IN: Free
- Data OUT to Internet: Charged (tiered pricing)
- Same region (same AZ): Free
- Cross-AZ: Small charge
- Cross-region: Charged

### Global vs Regional vs AZ Services

**Global** (One per account):
- IAM, Route 53, CloudFront, WAF

**Regional** (Per region):
- S3 (global namespace, regional storage), VPC, Lambda, DynamoDB

**AZ-specific**:
- EC2, EBS, RDS (Multi-AZ spans AZs), Subnet

### Shared Responsibility Model

**"AWS = OF the cloud, YOU = IN the cloud"**

**AWS Responsible For**:
- Physical security
- Hardware
- Network infrastructure
- Hypervisor
- Managed service operations

**You Responsible For**:
- Data encryption
- IAM users/roles
- Security groups/NACLs
- Application security
- OS patches (EC2)
- Client-side encryption

**Remember**: "AWS handles the building, you lock your doors"

### When to Use What

**Caching**:
- **CloudFront**: Cache at edge (global)
- **ElastiCache**: Cache database queries (Redis/Memcached)
- **DAX**: DynamoDB Accelerator (microsecond latency)

**Message Queues**:
- **SQS**: Decouple applications, standard or FIFO
- **SNS**: Pub/Sub, fan-out to multiple subscribers
- **EventBridge**: Event bus, scheduled events
- **Remember**: "SQS = Queue it up, SNS = Shout it out, EventBridge = Event routing"

**Container Services**:
- **ECS**: AWS-native container orchestration
- **EKS**: Managed Kubernetes
- **Fargate**: Serverless containers (no EC2)
- **ECR**: Container image registry (like Docker Hub)

---

## ✅ Pre-Exam Checklist

### Must Know Cold:
- ✅ S3 storage classes and when to use each
- ✅ EC2 instance types and families
- ✅ RDS vs DynamoDB vs Redshift
- ✅ Security Groups vs NACLs
- ✅ IAM policies, roles, and users
- ✅ VPC components (subnets, IGW, NAT, route tables)
- ✅ Load balancer types (ALB, NLB, CLB)
- ✅ Auto Scaling policies
- ✅ Well-Architected Framework pillars
- ✅ CloudWatch vs CloudTrail vs Config
- ✅ Lambda limitations and use cases
- ✅ Route 53 routing policies

### Common Trick Questions:
1. **"Cheapest option"** → Usually serverless (Lambda, S3, DynamoDB On-Demand)
2. **"Lowest latency"** → ElastiCache, DynamoDB DAX, CloudFront
3. **"Most scalable"** → Serverless services
4. **"High availability"** → Multi-AZ, Auto Scaling, Load Balancer
5. **"Disaster recovery"** → Multi-region, backups, Route 53 failover
6. **"Best practice"** → Managed services, least privilege, encryption

### Red Flags (Wrong Answers):
- ❌ Using EC2 when serverless exists
- ❌ Single AZ for production
- ❌ Hardcoded credentials
- ❌ Opening security group to 0.0.0.0/0 (except HTTP/HTTPS)
- ❌ Not using encryption
- ❌ Root user for daily tasks

---

## 🎯 Final Power Tips

### The 3-2-1 Rule for Exam
- **3 minutes** per question average (65 questions / 130 minutes)
- **2 passes**: First = answer known questions, Second = tackle hard ones
- **1 rule**: Eliminate obviously wrong answers first

### Keywords to Watch For
- **"Cost-effective"** → Spot, S3 Glacier, serverless
- **"Fault-tolerant"** → Multi-AZ, Auto Scaling
- **"Scalable"** → Auto Scaling, DynamoDB, Lambda
- **"Secure"** → Encryption, IAM roles, VPC
- **"High performance"** → Provisioned IOPS, ElastiCache, placement groups
- **"Serverless"** → Lambda, DynamoDB, Aurora Serverless, Fargate
- **"Real-time"** → Kinesis, DynamoDB Streams, Lambda
- **"Legacy migration"** → Rehost (lift-and-shift), MGN, DMS

### Remember the AWS Naming
- **Services ending in "S"**: Usually plural → Multiple items
  - EC2 = Elastic Compute Cloud (multiple instances)
  - S3 = Simple Storage Service (multiple objects)
  - RDS = Relational Database Service (multiple databases)

---

**Last Tip**: If stuck between two answers, choose the **AWS-managed service** over self-managed. AWS loves recommending their managed services!

Good luck! 🚀

