# Quick Reference - New Topics Added (March 2026)

This document provides a quick reference for the critical topics that were added to complete SAA-C03 exam coverage.

---

## 🔥 AWS Organizations & SCPs (CRITICAL)

### Key Facts
- **Management Account**: Cannot be restricted by SCPs, pays all bills
- **Member Accounts**: Subject to SCPs, can be restricted
- **SCPs**: Maximum permissions (guardrails), DON'T grant access
- **Effective Permissions**: IAM Policy AND SCP (both must allow)

### Common Exam Scenarios

| Scenario | Solution |
|----------|----------|
| Restrict all accounts to specific regions | SCP with Deny on aws:RequestedRegion |
| Prevent accounts from leaving org | SCP denying organizations:LeaveOrganization |
| Require encryption on all EBS volumes | SCP denying ec2:CreateVolume if not encrypted |
| Enforce compliance across 50+ accounts | AWS Organizations + SCPs |
| Get volume discounts across accounts | Consolidated Billing |

### SCP Template - Region Restriction
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["us-east-1", "eu-west-1"]
      }
    }
  }]
}
```

### Exam Keywords
- "Enforce policy across all accounts" → **SCP**
- "Cannot be overridden by account admins" → **SCP**
- "Centralized billing" → **AWS Organizations**
- "Volume discounts" → **Consolidated Billing**
- "Maximum permissions" → **SCP**

---

## 🏗️ AWS Control Tower

### When to Use
| Control Tower | Manual Organizations |
|---------------|---------------------|
| Quick setup (hours) | Custom setup (days) |
| Pre-built guardrails | Custom policies |
| Less AWS expertise | More control |
| Best practices out-of-box | Maximum flexibility |

### Key Components
- **Landing Zone**: Well-architected multi-account baseline
- **Account Factory**: Automated account provisioning
- **Guardrails**: Mandatory (always) + Optional (your choice)
- **Dashboard**: Compliance monitoring

### Exam Scenario
**Question**: "Company needs multi-account setup with governance, FAST"
**Answer**: AWS Control Tower (not manual Organizations)

---

## 🔗 AWS Resource Access Manager (RAM)

### Most Common Use Case: VPC Subnet Sharing
```
Networking Account (Owner)
└── VPC with Subnets
    ↓ Share via RAM
Application Accounts (Consumers)
└── Launch EC2 in shared subnets
```

### Benefits
- ✅ Centralized networking
- ✅ No VPC duplication
- ✅ Efficient IP usage
- ✅ Simplified architecture

### Shareable Resources (Know for Exam)
- **VPC Subnets** ← Most tested
- Transit Gateway
- Route 53 Resolver rules
- Aurora DB clusters
- License Manager configs

### Exam Keywords
- "Share VPC subnets across accounts" → **RAM**
- "Centralized networking" → **RAM with VPC sharing**
- "Avoid VPC duplication" → **RAM**

---

## 💾 AWS Backup

### Key Features
- **Centralized**: Single dashboard for all backups
- **Policy-Based**: Automated scheduling and retention
- **Cross-Region**: Copy backups for DR
- **Cross-Account**: Centralized backup account
- **Compliance**: Vault Lock (WORM)

### Supported Services (15+)
- EC2, EBS
- RDS, Aurora, DynamoDB
- EFS, FSx (all types)
- Storage Gateway
- S3, DocumentDB, Neptune

### Backup Plan Components
1. **Schedule**: When to backup (cron)
2. **Retention**: How long to keep
3. **Lifecycle**: When to move to cold storage
4. **Copy**: Cross-region/account

### Exam Scenarios

| Requirement | Solution |
|-------------|----------|
| Centralized backup across all services | AWS Backup |
| Cross-region DR backup | AWS Backup with copy actions |
| Enforce backup policies org-wide | AWS Backup Policies + Organizations |
| Prevent backup deletion (compliance) | Backup Vault Lock |
| Cost-effective long-term retention | Lifecycle to cold storage |

### AWS Backup vs Service-Native
- **Use AWS Backup**: Multiple services, centralized, compliance
- **Use Service-Native**: Simple single-service backups

---

## 🔄 Disaster Recovery Strategies

### RTO vs RPO
- **RTO** (Recovery Time Objective): How quickly to recover
- **RPO** (Recovery Point Objective): How much data loss acceptable

```
Last Backup → Disaster → Recovery Complete
    |<-RPO->|<----RTO---->|
```

### Four DR Strategies

| Strategy | RTO | RPO | Cost | When to Use |
|----------|-----|-----|------|-------------|
| **Backup & Restore** | Hours-Days | Hours | 💰 | Non-critical, cost-sensitive |
| **Pilot Light** | 10min-Hours | Minutes | 💰💰 | Important, some downtime OK |
| **Warm Standby** | Minutes | Seconds | 💰💰💰 | Business-critical |
| **Multi-Site** | Real-time | Near-zero | 💰💰💰💰 | Mission-critical, zero downtime |

### Quick Decision Matrix

**"RTO must be under 10 minutes"** → Warm Standby or Multi-Site

**"RPO can be 4 hours"** → Backup & Restore or Pilot Light

**"Cost is primary concern"** → Backup & Restore

**"Zero downtime required"** → Multi-Site Active/Active

**"Business-critical app"** → Warm Standby

### Implementation Guide

#### Backup & Restore
- Daily backups to S3
- No running DR resources
- Deploy from scratch during disaster

#### Pilot Light
- Database replica running
- AMIs ready
- Scale up during disaster

#### Warm Standby
- Scaled-down full stack running (30% capacity)
- Scale to 100% during disaster
- Auto Scaling ready

#### Multi-Site Active/Active
- Full capacity in multiple regions
- Both serving traffic
- Automatic failover

### Exam Keywords
- "Lowest cost DR" → **Backup & Restore**
- "Core components always running" → **Pilot Light**
- "Scaled-down version running" → **Warm Standby**
- "Both sites active" → **Multi-Site Active/Active**
- "RTO 5 minutes" → **Warm Standby** or **Multi-Site**
- "Acceptable data loss 1 hour" → **RPO = 1 hour** → Backup/Restore or Pilot Light

---

## 📝 Exam Cheat Sheet

### High-Frequency Topics (Must Know)

#### AWS Organizations
- ❌ SCPs don't grant permissions
- ❌ SCPs don't affect management account
- ✅ Consolidated billing = volume discounts
- ✅ Effective permissions = IAM AND SCP

#### AWS Backup
- ✅ Centralized backup for 15+ services
- ✅ Cross-region copy for DR
- ✅ Vault Lock for compliance (WORM)
- ✅ Lifecycle: warm → cold → delete

#### Disaster Recovery
- ✅ RTO = Time to recover
- ✅ RPO = Data loss acceptable
- ✅ 4 strategies: Backup < Pilot < Warm < Multi-Site
- ✅ Cost increases with lower RTO/RPO

#### AWS RAM
- ✅ Share VPC subnets (most common)
- ✅ Share Transit Gateway
- ✅ Centralized networking

#### Control Tower
- ✅ Quick multi-account setup
- ✅ Landing Zone + Account Factory
- ✅ Pre-built guardrails
- ✅ Use when: fast setup, less experience

---

## 🎯 Practice Questions - Quick Fire

### Q1: How to prevent all member accounts from using services in unauthorized regions?
**A**: Service Control Policy (SCP) with region restriction

### Q2: What's the fastest way to set up a multi-account environment with governance?
**A**: AWS Control Tower

### Q3: How to share VPC subnets across multiple accounts?
**A**: AWS Resource Access Manager (RAM)

### Q4: Which service provides centralized backup for EC2, RDS, DynamoDB, and EFS?
**A**: AWS Backup

### Q5: If RTO must be under 10 minutes, which DR strategy?
**A**: Warm Standby or Multi-Site Active/Active

### Q6: What's the cheapest DR strategy?
**A**: Backup and Restore

### Q7: Do SCPs affect the management account?
**A**: NO (critical exam point)

### Q8: How to enforce backup policies across all accounts in an organization?
**A**: AWS Backup Policies with AWS Organizations

### Q9: What prevents backup deletion for compliance?
**A**: AWS Backup Vault Lock (WORM)

### Q10: RTO = time to _____, RPO = acceptable _____
**A**: RTO = time to **recover**, RPO = acceptable **data loss**

---

## 📚 Where to Study

### Module 01: AWS Fundamentals
- Section 5.2: AWS Organizations
- Section 5.2.1: Service Control Policies
- Section 5.2.2: AWS Control Tower
- Section 5.2.3: AWS RAM
- Practice Questions 21-27

### Module 10: Migration
- Section 7: AWS Backup
- Section 8: Disaster Recovery Strategies
- All exam scenarios

### Fast Learning
- `01-AWS-Fundamentals/FAST-LEARN.md` - Organizations section
- `01-AWS-Fundamentals/ULTRA-FAST-LEARN.md` - Quick bullets
- `10-Migration/ULTRA-FAST-LEARN.md` - AWS Backup bullets

---

## ⏱️ Time Allocation for Study

- **AWS Organizations + SCPs**: 45 minutes
- **Control Tower + RAM**: 30 minutes
- **AWS Backup**: 45 minutes
- **DR Strategies**: 45 minutes
- **Practice Questions**: 30 minutes

**Total**: ~3 hours for complete mastery

---

**Last Updated**: March 2, 2026
**Exam Impact**: HIGH - These topics appear in 15-20% of questions
**Study Priority**: CRITICAL - Focus here first!

