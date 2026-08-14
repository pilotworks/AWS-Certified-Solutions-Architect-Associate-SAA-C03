# AWS SAA-C03 Flashcards

> Quick reference flashcards for key concepts and services

## 🎯 How to Use
- Review regularly for spaced repetition
- Focus on weak areas identified in practice tests
- Use for last-minute review before exam

---

## Auto Scaling & Load Balancing

**Q: What is the purpose of a cooldown period in Auto Scaling?**
A: Prevents rapid scaling events by suppressing additional scale-out actions until the cooldown period ends, allowing metrics to stabilize.

**Q: Which load balancers support dynamic port mapping for ECS?**
A: Application Load Balancer (ALB) and Network Load Balancer (NLB).

**Q: How do you prevent instance replacement during maintenance in an ASG?**
A: Put the instance in Standby state, perform maintenance, then return to InService.

---

## Storage Services

**Q: What is Amazon S3's consistency model?**
A: Strong read-after-write consistency for all operations (PUTs, DELETEs, LIST).

**Q: How do you enable WORM (Write Once Read Many) in S3?**
A: Enable S3 Object Lock at bucket creation (requires versioning).

**Q: What's the difference between S3 signed URLs and signed cookies?**
A: Signed URLs grant access to individual objects; Signed cookies grant access to multiple objects without changing URLs.

**Q: Can you attach an EBS volume across Availability Zones?**
A: No. Create a snapshot, then restore in the target AZ.

---

## Networking

**Q: What are the two types of VPC endpoints?**
A: Gateway endpoints (S3, DynamoDB - free) and Interface endpoints (PrivateLink - charged).

**Q: What's the difference between Security Groups and NACLs?**
A: SGs are stateful, allow-only rules at instance level. NACLs are stateless, allow/deny rules at subnet level.

**Q: What placement group type minimizes latency for HPC?**
A: Cluster placement group (single AZ, packed instances).

---

## Databases

**Q: What's the difference between Multi-AZ and Read Replicas?**
A: Multi-AZ provides high availability with automatic failover (standby not readable). Read Replicas scale read traffic.

**Q: How does Aurora Serverless scale?**
A: Automatically adjusts capacity using ACUs (Aurora Capacity Units) based on demand.

**Q: Which RDS feature requires versioning?**
A: Cross-Region Read Replicas promotion preserves version info.

---

## Compute & Containers

**Q: What IAM permissions does Lambda need for CloudWatch Logs?**
A: logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents.

**Q: What ECS networking mode provides task-level security groups?**
A: awsvpc networking mode.

**Q: Where does ECS on AWS Outposts provide lowest latency?**
A: On-premises, using ECS EC2 launch type.

---

## Analytics & Machine Learning

**Q: Which service analyzes S3 data without a data warehouse?**
A: Amazon Athena (serverless SQL queries on S3).

**Q: What service creates searchable text from scanned documents?**
A: Amazon Textract (OCR for forms, tables, handwriting).

**Q: Which service converts text to speech?**
A: Amazon Polly (Neural TTS, multiple voices/languages).

---

## Monitoring & Security

**Q: What service provides distributed tracing for serverless apps?**
A: AWS X-Ray (with Insights for anomaly detection).

**Q: How do you rotate API keys automatically?**
A: AWS Secrets Manager with custom Lambda rotation function.

**Q: What detects underutilized EC2 instances?**
A: AWS Trusted Advisor and CloudWatch metrics.

---

## Migration & Transfer

**Q: Which Storage Gateway type stores data as S3 objects?**
A: S3 File Gateway (SMB/NFS interface, S3 backend).

**Q: How do you transfer Lustre data to S3?**
A: AWS DataSync or FSx for Lustre data repository tasks.

---

## Best Practices

**Q: How do you ensure immediate S3 object availability globally?**
A: S3 provides strong consistency; objects are immediately available after successful PUT.

**Q: What's the most cost-effective caching solution?**
A: Amazon ElastiCache (Redis/Memcached for database query caching).

**Q: How do you distribute traffic across AZs evenly?**
A: Enable AZ rebalancing with target tracking scaling policy.

---

*Review these flashcards daily for optimal retention!*

