# Monitoring & Management - Mermaid Diagrams

## Amazon CloudWatch

### CloudWatch Architecture

```mermaid
graph TB
    subgraph AWS_Resources_Group["AWS Resources"]
        EC2[EC2 Instances]
        RDS[RDS Databases]
        Lambda[Lambda Functions]
        ELB[Load Balancers]
        Custom[Custom Applications]
    end
    
    subgraph CloudWatch_Group["CloudWatch"]
        Metrics["CloudWatch Metrics<br/>Time-series data"]
        Logs["CloudWatch Logs<br/>Log aggregation"]
        Alarms["CloudWatch Alarms<br/>Notifications & Actions"]
        Dashboards["CloudWatch Dashboards<br/>Visualization"]
        Events["EventBridge<br/>Event routing"]
        Insights["CloudWatch Insights<br/>Log analytics"]
    end
    
    subgraph Actions_Group["Actions"]
        SNS[SNS Notifications]
        ASG_Action[Auto Scaling Actions]
        Lambda_Action[Lambda Functions]
        SSM_Action[Systems Manager]
    end
    
    EC2 -->|CPU, Disk, Network| Metrics
    RDS -->|DB Metrics| Metrics
    Lambda -->|Duration, Errors| Metrics
    ELB -->|Request Count| Metrics
    Custom -->|Custom Metrics| Metrics
    
    EC2 -->|Application Logs| Logs
    Lambda -->|Function Logs| Logs
    Custom -->|App Logs| Logs
    
    Metrics --> Alarms
    Logs --> Insights
    Metrics --> Dashboards
    Logs --> Dashboards
    
    Alarms --> SNS
    Alarms --> ASG_Action
    Alarms --> Lambda_Action
    Alarms --> SSM_Action
    
    Events --> Lambda_Action
    
    classDef style1 fill:#FF9900
    class Metrics style1
    classDef style2 fill:#C00
    class Alarms style2
    classDef style3 fill:#569A31
    class Logs style3
```

### CloudWatch Metrics and Alarms

```mermaid
sequenceDiagram
    participant EC2
    participant CW as CloudWatch Metrics
    participant Alarm as CloudWatch Alarm
    participant SNS
    participant ASG as Auto Scaling
    
    Note over EC2,CW: Standard Metrics (5-min intervals, free(
    
    loop Every 5 minutes
        EC2->>CW: Send Metrics (CPU, Network, Disk(
    end
    
    Note over EC2,CW: Detailed Monitoring (1-min intervals, paid(
    
    loop Every 1 minute
        EC2->>CW: Send Detailed Metrics
    end
    
    Note over CW,Alarm: Alarm Configuration
    
    Alarm->>Alarm: Threshold: CPU > 80% for 2 periods
    
    CW->>Alarm: CPU = 85%
    Alarm->>Alarm: State: ALARM (was OK(
    
    Alarm->>SNS: Send Notification
    SNS->>SNS: Email/SMS to Operations Team
    
    Alarm->>ASG: Trigger Scale Out
    ASG->>ASG: Launch new EC2 instances
    
    Note over CW,Alarm: After scaling, CPU drops
    
    CW->>Alarm: CPU = 50%
    Alarm->>Alarm: State: OK (was ALARM(
    Alarm->>SNS: Send OK Notification
    
```

### CloudWatch Logs Architecture

```mermaid
graph TB
    subgraph Log_Sources_Group["Log Sources"]
        EC2["EC2 Instances<br/>CloudWatch Agent"]
        Lambda["Lambda Functions<br/>Automatic"]
        ECS["ECS Containers<br/>awslogs driver"]
        Beanstalk[Elastic Beanstalk]
        OnPrem["On-Premises<br/>CloudWatch Agent"]
    end
    
    subgraph CloudWatch_Logs_Group["CloudWatch Logs"]
        LogGroups["Log Groups<br/>/aws/lambda/function-name<br/>/var/log/application"]
        LogStreams["Log Streams<br/>Instance ID<br/>Container ID"]
        
        LogGroups --> LogStreams
        
        Retention["Retention Policies<br/>1 day to never expire<br/>Default: Never expire"]
        
        LogStreams --> Retention
    end
    
    subgraph Log_Processing_Group["Log Processing"]
        Filter["Metric Filters<br/>Extract metrics from logs<br/>COUNT, SUM, AVG"]
        
        Subscription["Subscription Filters<br/>Real-time processing"]
        
        Export["Export to S3<br/>Batch export<br/>Up to 12 hours delay"]
    end
    
    subgraph Destinations_Group["Destinations"]
        Kinesis["Kinesis Data Streams<br/>Real-time analytics"]
        Firehose["Kinesis Firehose<br/>S3, Redshift, OpenSearch"]
        Lambda2["Lambda Function<br/>Custom processing"]
        S3["S3 Bucket<br/>Archive"]
    end
    
    EC2 --> LogGroups
    Lambda --> LogGroups
    ECS --> LogGroups
    Beanstalk --> LogGroups
    OnPrem --> LogGroups
    
    LogStreams --> Filter
    LogStreams --> Subscription
    LogStreams --> Export
    
    Subscription --> Kinesis
    Subscription --> Firehose
    Subscription --> Lambda2
    
    Export --> S3
    
    classDef style1 fill:#FF9900
    class LogGroups style1
    classDef style2 fill:#569A31
    class Subscription style2
```

### CloudWatch Logs Insights

```mermaid
graph TB
    LogGroup["CloudWatch Log Group<br/>Application Logs"]
    
    Insights["CloudWatch Logs Insights<br/>Interactive Log Analytics"]
    
    subgraph Query_Examples_Group["Query Examples"]
        Q1["Find Errors:<br/>fields @timestamp, @message<br/>filter @message like /ERROR/<br/>sort @timestamp desc"]
        
        Q2["Top IP Addresses:<br/>stats count by client_ip<br/>sort count desc"]
        
        Q3["Response Time P99:<br/>stats avg, p99 @duration<br/>by bin 5m"]
        
        Q4["Exception Patterns:<br/>parse @message /Exception: (?&lt;exception&gt;.*?[/<br/>stats count by exception"]
    end
    
    subgraph Visualization_Group["Visualization"]
        LineChart["Line Chart<br/>Time series"]
        BarChart["Bar Chart<br/>Aggregations"]
        Table["Table View<br/>Raw results"]
    end
    
    LogGroup --> Insights
    
    Insights --> Q1
    Insights --> Q2
    Insights --> Q3
    Insights --> Q4
    
    Q1 --> Table
    Q2 --> BarChart
    Q3 --> LineChart
    Q4 --> BarChart
    
    Features["Features:<br/>✅ Purpose-built query language<br/>✅ Visualization<br/>✅ Query multiple log groups<br/>✅ Save queries<br/>💰 Pay per GB scanned"]
    
    classDef style1 fill:#FF9900
    class Insights style1
    classDef style2 fill:#569A31
    class LineChart style2
```

## AWS X-Ray

### X-Ray Distributed Tracing

```mermaid
graph LR
    User[User Request]
    
    subgraph API_Gateway_Group["API Gateway"]
        API["API Gateway<br/>X-Ray enabled"]
    end
    
    subgraph Lambda_Function_1_Group["Lambda Function 1"]
        Lambda1["Lambda Function<br/>Process Request<br/>X-Ray SDK"]
    end
    
    subgraph DynamoDB_Group["DynamoDB"]
        DDB["DynamoDB Table<br/>X-Ray integration"]
    end
    
    subgraph Lambda_Function_2_Group["Lambda Function 2"]
        Lambda2["Lambda Function<br/>External API Call<br/>X-Ray SDK"]
    end
    
    subgraph External_Service_Group["External Service"]
        External["External API<br/>HTTP call traced"]
    end
    
    subgraph X_Ray_Service_Group["X-Ray Service"]
        XRay["AWS X-Ray<br/>Trace Collection"]
        
        ServiceMap["Service Map<br/>Visual representation"]
        Traces["Traces<br/>End-to-end view"]
        Analytics["Analytics<br/>Performance insights"]
        
        XRay --> ServiceMap
        XRay --> Traces
        XRay --> Analytics
    end
    
    User --> API
    API -.Trace ID.-> Lambda1
    Lambda1 -.Segment.-> XRay
    
    Lambda1 --> DDB
    DDB -.Segment.-> XRay
    
    Lambda1 -.Trace ID.-> Lambda2
    Lambda2 -.Segment.-> XRay
    
    Lambda2 --> External
    External -.Subsegment.-> XRay
    
    classDef style1 fill:#FF9900
    class XRay style1
    classDef style2 fill:#569A31
    class ServiceMap style2
```

### X-Ray Concepts

```mermaid
graph TB
    subgraph X_Ray_Trace_Group["X-Ray Trace"]
        Trace["Trace<br/>Trace ID: 1-5e7e0b0a-38ec39f3b8c1e12345678"]
        
        Segment1["Segment: API Gateway<br/>Start: 10:00:00.000<br/>Duration: 450ms"]
        Segment2["Segment: Lambda Function<br/>Start: 10:00:00.050<br/>Duration: 400ms"]
        Segment3["Segment: DynamoDB<br/>Start: 10:00:00.150<br/>Duration: 50ms"]
        
        Trace --> Segment1
        Trace --> Segment2
        Trace --> Segment3
        
        Subsegment1["Subsegment: DDB Query<br/>Duration: 30ms"]
        Subsegment2["Subsegment: DDB Deserialize<br/>Duration: 20ms"]
        
        Segment3 --> Subsegment1
        Segment3 --> Subsegment2
    end
    
    subgraph Annotations_Metadata_Group["Annotations & Metadata"]
        Annotations["Annotations<br/>Indexed for filtering<br/>Key-value pairs<br/>e.g., user_id: 12345"]
        
        Metadata["Metadata<br/>Not indexed<br/>Additional context<br/>e.g., request body"]
    end
    
    Segment2 -.Add.-> Annotations
    Segment2 -.Add.-> Metadata
    
    Sampling["Sampling Rules<br/>1st request/sec: 100%<br/>After: 5% of requests<br/>Reduce cost"]
    
    Trace -.Controlled by.-> Sampling
    
    classDef style1 fill:#FF9900
    class Trace style1
    classDef style2 fill:#569A31
    class Segment2 style2
```

## AWS CloudTrail

### CloudTrail Architecture

```mermaid
graph TB
    subgraph AWS_Account_Group["AWS Account"]
        Users["IAM Users/Roles"]
        Services[AWS Services]
        Console[Management Console]
        CLI["AWS CLI/SDK"]
    end
    
    subgraph CloudTrail_Group["CloudTrail"]
        Trail["CloudTrail Trail<br/>Event History"]
        
        Management["Management Events<br/>Control plane operations<br/>e.g., CreateBucket, RunInstances"]
        
        Data["Data Events<br/>Resource operations<br/>e.g., S3 GetObject, Lambda Invoke"]
        
        Insights["CloudTrail Insights<br/>Anomaly detection<br/>Unusual API activity"]
        
        Trail --> Management
        Trail --> Data
        Trail --> Insights
    end
    
    subgraph Storage_Processing_Group["Storage & Processing"]
        S3["S3 Bucket<br/>Log file delivery<br/>Every 5 minutes"]
        
        Athena["Amazon Athena<br/>Query logs with SQL"]
        
        CloudWatch["CloudWatch Logs<br/>Real-time analysis"]
        
        EventBridge["EventBridge<br/>Event-driven automation"]
    end
    
    Users --> Trail
    Services --> Trail
    Console --> Trail
    CLI --> Trail
    
    Management --> S3
    Data --> S3
    Insights --> S3
    
    Trail --> CloudWatch
    Trail --> EventBridge
    
    S3 --> Athena
    
    Encryption["SSE-S3 or SSE-KMS<br/>Log file encryption"] -.Encrypts.-> S3
    Validation["Log File Validation<br/>Detect tampering"] -.Validates.-> S3
    
    classDef style1 fill:#FF9900
    class Trail style1
    classDef style2 fill:#569A31
    class Management style2
    classDef style3 fill:#8C4FFF
    class Insights style3
```

### CloudTrail Event Structure

```mermaid
graph TB
    Event[CloudTrail Event]
    
    Event --> EventTime["eventTime:<br/>2024-01-15T10:00:00Z"]
    Event --> EventName["eventName:<br/>RunInstances"]
    Event --> UserIdentity["userIdentity:<br/>type: IAMUser<br/>userName: alice"]
    Event --> SourceIP["sourceIPAddress:<br/>203.0.113.1"]
    Event --> UserAgent["userAgent:<br/>aws-cli/2.0.0"]
    Event --> RequestParams["requestParameters:<br/>instanceType: t3.micro<br/>imageId: ami-12345678"]
    Event --> ResponseElements["responseElements:<br/>instanceId: i-1234567890abcdef"]
    Event --> ErrorCode["errorCode:<br/>null or error details"]
    
    Use["Use Cases:<br/>• Security auditing<br/>• Compliance<br/>• Operational troubleshooting<br/>• Risk auditing"]
    
    classDef style1 fill:#FF9900
    class Event style1
```

## AWS Config

### AWS Config Architecture

```mermaid
graph TB
    subgraph AWS_Resources_Group["AWS Resources"]
        EC2[EC2 Instances]
        S3[S3 Buckets]
        RDS[RDS Databases]
        IAM[IAM Roles]
        SG[Security Groups]
    end
    
    subgraph AWS_Config_Group["AWS Config"]
        Config["AWS Config<br/>Resource Inventory<br/>Configuration History"]
        
        Rules["Config Rules<br/>Compliance Checks"]
        
        Managed["AWS Managed Rules<br/>190+ pre-built rules"]
        Custom["Custom Rules<br/>Lambda functions"]
        
        Rules --> Managed
        Rules --> Custom
    end
    
    subgraph Compliance_Group["Compliance"]
        Compliant["✅ Compliant Resources"]
        NonCompliant["❌ Non-Compliant Resources"]
    end
    
    subgraph Actions_Group["Actions"]
        SNS["SNS Notifications<br/>Config changes"]
        Remediation["Auto Remediation<br/>SSM Automation"]
        Timeline["Configuration Timeline<br/>Historical changes"]
    end
    
    subgraph Storage_Group["Storage"]
        S3Bucket["S3 Bucket<br/>Config snapshots<br/>History files"]
    end
    
    EC2 --> Config
    S3 --> Config
    RDS --> Config
    IAM --> Config
    SG --> Config
    
    Config --> Rules
    
    Rules --> Compliant
    Rules --> NonCompliant
    
    NonCompliant --> SNS
    NonCompliant --> Remediation
    
    Config --> Timeline
    Config --> S3Bucket
    
    Examples["Rule Examples:<br/>• ec2-encrypted-volumes<br/>• s3-bucket-public-read-prohibited<br/>• iam-password-policy<br/>• rds-multi-az-support"]
    
    classDef style1 fill:#FF9900
    class Config style1
    classDef style2 fill:#C00
    class NonCompliant style2
    classDef style3 fill:#569A31
    class Compliant style3
```

### Config Rules and Remediation

```mermaid
sequenceDiagram
    participant Admin as Administrator
    participant Resource as S3 Bucket
    participant Config as AWS Config
    participant Rule as Config Rule
    participant SSM as Systems Manager
    
    Admin->>Resource: Create S3 bucket with public access
    Resource->>Config: Configuration change detected
    Config->>Rule: Evaluate s3-bucket-public-read-prohibited
    
    Rule->>Rule: Check compliance
    Rule->>Config: NON_COMPLIANT
    
    Config->>SNS: Send notification
    SNS->>Admin: Alert: Non-compliant resource
    
    Note over Config,SSM: Auto-Remediation Enabled
    
    Config->>SSM: Trigger remediation action
    SSM->>Resource: Run Automation Document<br/>Remove public access
    Resource->>Resource: Block public access enabled
    
    Resource->>Config: Configuration change detected
    Config->>Rule: Re-evaluate compliance
    Rule->>Config: COMPLIANT
    Config->>SNS: Resource now compliant
    
```

## AWS Systems Manager

### Systems Manager Capabilities

```mermaid
mindmap
    root((AWS Systems<br/>Manager))
        Operations Management
            Automation
                Runbooks
                Automated tasks
                Remediation
            OpsCenter
                Operational issues
                Centralized dashboard
            Incident Manager
                Incident response
        Application Management
            Parameter Store
                Configuration data
                Secrets
                Free tier
            AppConfig
                Feature flags
                Configuration deployment
        Change Management
            Change Manager
                ITSM integration
                Change approval
            Maintenance Windows
                Scheduled tasks
                Patching windows
        Node Management
            Fleet Manager
                Remote management
                GUI for instances
            Session Manager
                Secure shell access
                No SSH keys needed
            Patch Manager
                Automated patching
                Compliance reporting
            Run Command
                Execute commands
                No SSH required
            State Manager
                Desired state
                Configuration compliance
        Shared Resources
            Documents
                SSM Documents
                Automation runbooks
                Command documents
```

### Systems Manager Session Manager

```mermaid
graph TB
    Admin["Administrator<br/>No SSH key needed"]
    
    subgraph AWS_Systems_Manager_Group["AWS Systems Manager"]
        SSM["Session Manager<br/>Secure shell access"]
        
        IAM["IAM Permissions<br/>Control access"]
        
        SSM --> IAM
    end
    
    subgraph VPC_Private_Subnet_Group["VPC - Private Subnet"]
        EC2["EC2 Instance<br/>No public IP<br/>No SSH port 22<br/>SSM Agent installed"]
        
        SSMAgent["SSM Agent<br/>Connects to SSM"]
        
        EC2 --> SSMAgent
    end
    
    subgraph Logging_Auditing_Group["Logging & Auditing"]
        CloudTrail["CloudTrail<br/>API calls logged"]
        S3["S3 Bucket<br/>Session logs"]
        CloudWatch["CloudWatch Logs<br/>Session output"]
    end
    
    Admin --> SSM
    SSM --> IAM
    IAM --> EC2
    
    SSMAgent -.Poll for commands.-> SSM
    
    SSM --> CloudTrail
    SSM --> S3
    SSM --> CloudWatch
    
    Benefits["Benefits:<br/>✅ No bastion hosts<br/>✅ No SSH keys to manage<br/>✅ IAM-based access control<br/>✅ Full audit trail<br/>✅ Session recording<br/>✅ Works in private subnets"]
    
    classDef style1 fill:#FF9900
    class SSM style1
    classDef style2 fill:#569A31
    class EC2 style2
```

### Systems Manager Parameter Store

```mermaid
graph TB
    subgraph Parameter_Store_Group["Parameter Store"]
        PS["Parameter Store<br/>Centralized Configuration"]
        
        Standard["Standard Parameters<br/>✅ Free<br/>📏 4 KB<br/>📊 10,000 params"]
        
        Advanced["Advanced Parameters<br/>💰 $0.05/param/month<br/>📏 8 KB<br/>📊 100,000 params<br/>📋 Policies"]
        
        PS --> Standard
        PS --> Advanced
    end
    
    subgraph Parameter_Types_Group["Parameter Types"]
        String["String<br/>Plain text"]
        StringList["StringList<br/>Comma-separated"]
        SecureString["SecureString<br/>🔐 KMS encrypted"]
    end
    
    subgraph Hierarchical_Organization_Group["Hierarchical Organization"]
        Hierarchy["/myapp/dev/db-url<br/>/myapp/dev/db-password<br/>/myapp/prod/db-url<br/>/myapp/prod/db-password"]
    end
    
    subgraph Applications_Group["Applications"]
        Lambda[Lambda Functions]
        EC2[EC2 Instances]
        CodeBuild[CodeBuild]
        ECS[ECS Tasks]
    end
    
    Standard --> String
    Standard --> StringList
    Advanced --> SecureString
    
    PS --> Hierarchy
    
    Lambda --> PS
    EC2 --> PS
    CodeBuild --> PS
    ECS --> PS
    
    Versioning["Parameter Versioning<br/>Track changes<br/>Rollback capability"] -.Feature.-> PS
    
    Policies["Parameter Policies<br/>Expiration<br/>Notification<br/>Advanced only"] -.Feature.-> Advanced
    
    classDef style1 fill:#FF9900
    class PS style1
    classDef style2 fill:#569A31
    class SecureString style2
```

## AWS Personal Health Dashboard

### Health Dashboard Architecture

```mermaid
graph TB
    subgraph AWS_Health_Events_Group["AWS Health Events"]
        Service["Service Health Events<br/>Regional or global issues"]
        Account["Account-specific Events<br/>Scheduled maintenance<br/>Resource changes"]
    end
    
    subgraph Personal_Health_Dashboard_Group["Personal Health Dashboard"]
        PHD["AWS Personal Health Dashboard<br/>Personalized service health"]
        
        Current["Current Issues<br/>Affecting your resources"]
        Scheduled["Scheduled Changes<br/>Upcoming maintenance"]
        History["Event History<br/>Past 90 days"]
        
        PHD --> Current
        PHD --> Scheduled
        PHD --> History
    end
    
    subgraph Notifications_Group["Notifications"]
        EventBridge["EventBridge<br/>Event-driven automation"]
        SNS["SNS<br/>Email/SMS alerts"]
        Lambda["Lambda<br/>Auto-remediation"]
        Slack["Slack/Teams<br/>Chat notifications"]
    end
    
    Service --> PHD
    Account --> PHD
    
    Current --> EventBridge
    Scheduled --> EventBridge
    
    EventBridge --> SNS
    EventBridge --> Lambda
    EventBridge --> Slack
    
    Examples["Event Examples:<br/>• EC2 instance retirement<br/>• EBS volume migration<br/>• RDS maintenance<br/>• Service degradation in region"]
    
    classDef style1 fill:#FF9900
    class PHD style1
    classDef style2 fill:#569A31
    class EventBridge style2
```

## Monitoring Best Practices

### Comprehensive Monitoring Strategy

```mermaid
graph TB
    subgraph Infrastructure_Monitoring_Group["Infrastructure Monitoring"]
        CW_Metrics["CloudWatch Metrics<br/>CPU, Memory, Disk, Network"]
        CW_Alarms["CloudWatch Alarms<br/>Threshold alerts"]
        
        CW_Metrics --> CW_Alarms
    end
    
    subgraph Application_Monitoring_Group["Application Monitoring"]
        CW_Logs["CloudWatch Logs<br/>Application logs"]
        Insights["Logs Insights<br/>Query & analyze"]
        
        CW_Logs --> Insights
    end
    
    subgraph Distributed_Tracing_Group["Distributed Tracing"]
        XRay["X-Ray<br/>End-to-end traces<br/>Service map"]
    end
    
    subgraph Compliance_Audit_Group["Compliance & Audit"]
        Config["AWS Config<br/>Resource compliance"]
        CloudTrail["CloudTrail<br/>API audit logs"]
    end
    
    subgraph Security_Monitoring_Group["Security Monitoring"]
        GuardDuty["GuardDuty<br/>Threat detection"]
        SecurityHub["Security Hub<br/>Central security view"]
        
        GuardDuty --> SecurityHub
    end
    
    subgraph Centralized_Dashboard_Group["Centralized Dashboard"]
        Dashboard["CloudWatch Dashboard<br/>Unified view<br/>All metrics & logs"]
    end
    
    CW_Alarms --> Dashboard
    Insights --> Dashboard
    XRay --> Dashboard
    Config --> Dashboard
    
    Actions["Automated Actions:<br/>• Auto Scaling<br/>• Lambda remediation<br/>• SNS notifications<br/>• Incident tickets"]
    
    CW_Alarms --> Actions
    Config --> Actions
    GuardDuty --> Actions
    
    classDef style1 fill:#FF9900
    class Dashboard style1
    classDef style2 fill:#569A31
    class Actions style2
```

