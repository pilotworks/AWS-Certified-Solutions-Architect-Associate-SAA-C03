# IAM - Mermaid Diagrams

## IAM Components Overview

### IAM Core Components Relationship

```mermaid
graph TB
    subgraph IAM_Components_Group["IAM Components"]
        Users["IAM Users<br/>People & Applications"]
        Groups["IAM Groups<br/>Collection of Users"]
        Roles["IAM Roles<br/>For Services & Temporary Access"]
        Policies["IAM Policies<br/>JSON Documents"]
    end
    
    subgraph AWS_Services_Group["AWS Services"]
        EC2[EC2]
        S3[S3]
        RDS[RDS]
        Lambda[Lambda]
    end
    
    Users -->|Member of| Groups
    Groups -->|Attached| Policies
    Users -->|Attached| Policies
    Roles -->|Attached| Policies
    
    Policies -->|Grants Permissions to| EC2
    Policies -->|Grants Permissions to| S3
    Policies -->|Grants Permissions to| RDS
    Policies -->|Grants Permissions to| Lambda
    
    EC2 -->|Assumes| Roles
    Lambda -->|Assumes| Roles
    
    classDef style1 fill:#FF9900
    class Users style1
    classDef style2 fill:#FF9900
    class Groups style2
    classDef style3 fill:#FF9900
    class Roles style3
    classDef style4 fill:#146EB4
    class Policies style4
```

### IAM Hierarchy and Structure

```mermaid
graph TB
    Root["AWS Account Root User<br/>⚠️ Complete Access"]
    
    Root --> AdminGroup[Administrators Group]
    Root --> DevGroup[Developers Group]
    Root --> OpsGroup[Operations Group]
    
    AdminGroup --> AdminPolicy["AdministratorAccess<br/>Policy"]
    DevGroup --> DevPolicy["Developer Policy<br/>Limited EC2, S3, RDS"]
    OpsGroup --> OpsPolicy["Operations Policy<br/>Read-Only + CloudWatch"]
    
    AdminGroup --> User1[Alice]
    AdminGroup --> User2[Bob]
    
    DevGroup --> User3[Charlie]
    DevGroup --> User4[Diana]
    
    OpsGroup --> User5[Eve]
    
    User1 -.Additional Policy.-> MFAPolicy[MFA Policy]
    
    classDef style1 fill:#C00
    class Root style1
    classDef style2 fill:#FF9900
    class AdminGroup style2
    classDef style3 fill:#FF9900
    class DevGroup style3
    classDef style4 fill:#FF9900
    class OpsGroup style4
    classDef style5 fill:#146EB4
    class AdminPolicy style5
```

## IAM Users and Authentication

### User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Console as AWS Console
    participant IAM
    participant MFA as MFA Device
    participant Service as AWS Service
    
    User->>Console: Enter Username & Password
    Console->>IAM: Validate Credentials
    IAM->>Console: Request MFA Token
    Console->>User: Prompt for MFA
    User->>MFA: Generate Token
    MFA->>User: 6-digit Code
    User->>Console: Enter MFA Token
    Console->>IAM: Validate MFA
    IAM->>Console: Session Token
    Console->>User: Access Granted
    User->>Service: Perform Action
    Service->>IAM: Verify Permissions
    IAM->>Service: Allow/Deny
    Service->>User: Result
    
```

### Access Keys for Programmatic Access

```mermaid
graph LR
    subgraph IAM_User_Group["IAM User"]
        User[User: Developer]
        AccessKey["Access Key ID:<br/>AKIAIOSFODNN7EXAMPLE"]
        SecretKey["Secret Access Key:<br/>wJalrXUtnFEMI/K7MDENG/..."]
    end
    
    subgraph Client_Tools_Group["Client Tools"]
        CLI[AWS CLI]
        SDK[AWS SDK]
        API[Direct API Calls]
    end
    
    subgraph AWS_Services_Group["AWS Services"]
        S3[S3]
        EC2[EC2]
        DynamoDB[DynamoDB]
    end
    
    User --> AccessKey
    User --> SecretKey
    
    AccessKey --> CLI
    SecretKey --> CLI
    
    AccessKey --> SDK
    SecretKey --> SDK
    
    AccessKey --> API
    SecretKey --> API
    
    CLI --> S3
    SDK --> EC2
    API --> DynamoDB
    
    classDef style1 fill:#FF9900
    class User style1
    classDef style2 fill:#569A31
    class AccessKey style2
    classDef style3 fill:#C00
    class SecretKey style3
```

## IAM Groups

### Groups Management Pattern

```mermaid
graph TB
    subgraph Organization_Group["Organization"]
        Dev[Developers Group]
        QA[QA Group]
        Ops[Operations Group]
        Data[Data Scientists Group]
        Admin[Administrators Group]
    end
    
    subgraph Users_Group["Users"]
        U1[Alice] -.Member.-> Dev
        U2[Bob] -.Member.-> Dev
        U3[Charlie] -.Member.-> QA
        U4[Diana] -.Member.-> Ops
        U5[Eve] -.Member.-> Data
        U6[Frank] -.Member.-> Admin
        
        U2 -.Also Member.-> QA
        U5 -.Also Member.-> Dev
    end
    
    subgraph Policies_Group["Policies"]
        Dev --> P1["EC2 Full Access<br/>S3 Read/Write<br/>RDS Access"]
        QA --> P2["EC2 Read Only<br/>S3 Read Only"]
        Ops --> P3["CloudWatch Full<br/>EC2 Start/Stop<br/>Systems Manager"]
        Data --> P4["S3 Full Access<br/>Glue & Athena<br/>SageMaker"]
        Admin --> P5[AdministratorAccess]
    end
    
    classDef style1 fill:#FF9900
    class Dev style1
    classDef style2 fill:#FF9900
    class QA style2
    classDef style3 fill:#FF9900
    class Ops style3
    classDef style4 fill:#FF9900
    class Data style4
    classDef style5 fill:#C00
    class Admin style5
```

## IAM Roles

### IAM Role Assumption Flow

```mermaid
sequenceDiagram
    participant EC2 as EC2 Instance
    participant STS as AWS STS
    participant Role as IAM Role
    participant S3 as S3 Bucket
    
    Note over EC2: Instance has IAM Role attached
    EC2->>STS: AssumeRole Request
    STS->>Role: Validate Trust Policy
    Role->>STS: Trust Policy Valid
    STS->>EC2: Temporary Security Credentials<br/>(Access Key + Secret + Token)
    Note over EC2: Credentials valid for 1 hour
    EC2->>S3: Access S3 using temporary credentials
    S3->>Role: Check Permissions Policy
    Role->>S3: Allow/Deny
    S3->>EC2: Return Data
    
```

### Common Role Use Cases

```mermaid
graph TB
    subgraph AWS_Service_Roles_Group["AWS Service Roles"]
        EC2Role["EC2 Instance Role<br/>Access S3, DynamoDB, etc."]
        LambdaRole["Lambda Execution Role<br/>Access CloudWatch Logs"]
        ECSRole["ECS Task Role<br/>Access AWS Services"]
    end
    
    subgraph Cross_Account_Access_Group["Cross-Account Access"]
        AccountA["Account A<br/>Production"]
        AccountB["Account B<br/>Development"]
        CrossRole[Cross-Account Role]
        
        AccountB -.Assume.-> CrossRole
        CrossRole -.Access.-> AccountA
    end
    
    subgraph Federated_Access_Group["Federated Access"]
        SAML["SAML 2.0 Provider<br/>Active Directory"]
        WebIdentity["Web Identity Federation<br/>Google, Facebook, Amazon"]
        FedRole[Federated Role]
        
        SAML -.Authenticate.-> FedRole
        WebIdentity -.Authenticate.-> FedRole
    end
    
    EC2[EC2 Instance] --> EC2Role
    Lambda[Lambda Function] --> LambdaRole
    ECS[ECS Task] --> ECSRole
    
    classDef style1 fill:#FF9900
    class EC2Role style1
    classDef style2 fill:#FF9900
    class LambdaRole style2
    classDef style3 fill:#569A31
    class CrossRole style3
    classDef style4 fill:#146EB4
    class FedRole style4
```

### Role Trust Policy vs Permission Policy

```mermaid
graph LR
    subgraph IAM_Role_Components_Group["IAM Role Components"]
        TrustPolicy["Trust Policy<br/>WHO can assume this role?"]
        PermPolicy["Permission Policy<br/>WHAT can they do?"]
    end
    
    subgraph Trust_Policy_Example_Group["Trust Policy Example"]
        TP1["Trusted Entity:&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• EC2 Service&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Another AWS Account&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• SAML Provider&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Web Identity"]
    end
    
    subgraph Permission_Policy_Example_Group["Permission Policy Example"]
        PP1["Allowed Actions:&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• s3:GetObject&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• s3:PutObject&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• dynamodb:Query&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• logs:CreateLogGroup"]
    end
    
    TrustPolicy --> TP1
    PermPolicy --> PP1
    
    Entity["EC2/User/Service"] -->|1. Can I assume?| TrustPolicy
    TrustPolicy -->|2. Assume Role| STS[AWS STS]
    STS -->|3. Temporary Credentials| Entity
    Entity -->|4. What can I do?| PermPolicy
    PermPolicy -->|5. Allow/Deny| Action[AWS Service Action]
    
    classDef style1 fill:#FF9900
    class TrustPolicy style1
    classDef style2 fill:#146EB4
    class PermPolicy style2
    classDef style3 fill:#569A31
    class STS style3
```

## IAM Policies

### Policy Types Overview

```mermaid
graph TB
    subgraph Policy_Types_Group["Policy Types"]
        Identity["Identity-based Policies<br/>Attached to Users, Groups, Roles"]
        Resource["Resource-based Policies<br/>Attached to Resources like S3"]
        Permission["Permissions Boundary<br/>Maximum Permissions Limit"]
        SCP["Service Control Policies<br/>AWS Organizations"]
        Session["Session Policies<br/>Temporary Credentials"]
        ACL["Access Control Lists<br/>Legacy"]
    end
    
    Identity --> User[IAM User]
    Identity --> Group[IAM Group]
    Identity --> Role[IAM Role]
    
    Resource --> S3Bucket[S3 Bucket Policy]
    Resource --> SQS[SQS Queue Policy]
    Resource --> Lambda[Lambda Resource Policy]
    
    Permission -.Limits.-> Identity
    SCP -.Limits.-> Account[AWS Accounts]
    
    classDef style1 fill:#FF9900
    class Identity style1
    classDef style2 fill:#146EB4
    class Resource style2
    classDef style3 fill:#569A31
    class Permission style3
    classDef style4 fill:#8C4FFF
    class SCP style4
```

### Policy Evaluation Logic

```mermaid
flowchart TD
    Start([API Request]) --> Default{Default Deny}
    
    Default --> Explicit{"Explicit Deny<br/>Exists?"}
    Explicit -->|Yes| Deny(["❌ DENY"])
    Explicit -->|No| SCP{"SCP<br/>Allows?"}
    
    SCP -->|No| Deny
    SCP -->|Yes| Boundary{"Permission Boundary<br/>Allows?"}
    
    Boundary -->|No| Deny
    Boundary -->|Yes| Identity{"Identity Policy<br/>Allows?"}
    
    Identity -->|No| Resource{"Resource Policy<br/>Allows?"}
    Identity -->|Yes| Allow(["✅ ALLOW"])
    
    Resource -->|Yes| Allow
    Resource -->|No| Deny
    
    classDef style1 fill:#232F3E
    class Start style1
    classDef style2 fill:#569A31
    class Allow style2
    classDef style3 fill:#C00
    class Deny style3
    classDef style4 fill:#FF9900
    class Explicit style4
```

### Policy Structure Example

```mermaid
graph TB
    Policy[IAM Policy JSON]
    
    Policy --> Version[Version: 2012-10-17]
    Policy --> Statement[Statement Array]
    
    Statement --> Stmt1[Statement 1]
    Statement --> Stmt2[Statement 2]
    
    Stmt1 --> Effect1[Effect: Allow]
    Stmt1 --> Action1[Action: s3:GetObject]
    Stmt1 --> Resource1["Resource: arn:aws:s3:::bucket/*"]
    Stmt1 --> Condition1[Condition: IpAddress]
    
    Stmt2 --> Effect2[Effect: Deny]
    Stmt2 --> Action2[Action: s3:DeleteBucket]
    Stmt2 --> Resource2[Resource: arn:aws:s3:::bucket]
    
    classDef style1 fill:#FF9900
    class Policy style1
    classDef style2 fill:#569A31
    class Effect1 style2
    classDef style3 fill:#C00
    class Effect2 style3
```

## Multi-Factor Authentication (MFA)

### MFA Authentication Process

```mermaid
sequenceDiagram
    actor User
    participant Device as MFA Device
    participant AWS
    participant IAM
    
    User->>AWS: Login with Password
    AWS->>IAM: Validate Password
    IAM->>AWS: Password Valid
    AWS->>User: Request MFA Token
    User->>Device: Request Token
    Device->>Device: Generate Time-based Token
    Device->>User: Display 6-digit Code
    User->>AWS: Enter MFA Code
    AWS->>IAM: Validate MFA Token
    IAM->>AWS: MFA Valid
    AWS->>User: Access Granted ✅
    
```

### MFA Device Types

```mermaid
graph TB
    MFA[MFA Options]
    
    MFA --> Virtual[Virtual MFA Device]
    MFA --> Hardware[Hardware MFA Device]
    MFA --> U2F[U2F Security Key]
    
    Virtual --> GoogleAuth[Google Authenticator]
    Virtual --> Authy[Authy]
    Virtual --> Microsoft[Microsoft Authenticator]
    
    Hardware --> Gemalto[Gemalto Token]
    Hardware --> SurePass[SurePassID]
    
    U2F --> Yubikey[YubiKey]
    
    classDef style1 fill:#FF9900
    class MFA style1
    classDef style2 fill:#146EB4
    class Virtual style2
    classDef style3 fill:#569A31
    class Hardware style3
    classDef style4 fill:#8C4FFF
    class U2F style4
```

## Cross-Account Access

### Cross-Account Role Assumption

```mermaid
sequenceDiagram
    participant UserA as User in Account A<br/>(Dev Account)
    participant STSA as STS Account A
    participant Role as Cross-Account Role<br/>in Account B
    participant STSb as STS Account B
    participant S3 as S3 in Account B<br/>(Prod Account)
    
    Note over UserA,S3: Setup: Account B creates role trusting Account A
    
    UserA->>STSA: Authenticate
    STSA->>UserA: Session Credentials
    UserA->>STSb: AssumeRole (Account B Role)
    STSb->>Role: Check Trust Policy
    Role->>STSb: Account A is Trusted
    STSb->>UserA: Temporary Credentials
    Note over UserA: Credentials valid 15min-12hrs
    UserA->>S3: Access S3 with temp credentials
    S3->>UserA: Return Data
    
```

### Cross-Account Architecture

```mermaid
graph TB
    subgraph Account_A_Development_111111111111_Group["Account A - Development (111111111111)"]
        DevUser[Developer User]
        DevGroup[Developers Group]
        AssumePolicy["Assume Role Policy<br/>sts:AssumeRole"]
        
        DevUser --> DevGroup
        DevGroup --> AssumePolicy
    end
    
    subgraph Account_B_Production_222222222222_Group["Account B - Production (222222222222)"]
        ProdRole[Production-ReadOnly-Role]
        TrustPolicy["Trust Policy:<br/>Trust Account 111111111111"]
        PermPolicy["Permission Policy:<br/>S3 Read, EC2 Describe"]
        ProdResources["Production Resources<br/>S3, EC2, RDS"]
        
        ProdRole --> TrustPolicy
        ProdRole --> PermPolicy
        PermPolicy --> ProdResources
    end
    
    AssumePolicy -.AssumeRole.-> ProdRole
    
    classDef style1 fill:#FF9900
    class DevUser style1
    classDef style2 fill:#569A31
    class ProdRole style2
    classDef style3 fill:#146EB4
    class TrustPolicy style3
```

## Identity Federation

### SAML 2.0 Federation Flow

```mermaid
sequenceDiagram
    actor User
    participant IdP as Identity Provider<br/>(Active Directory/ADFS)
    participant AWS
    participant STS as AWS STS
    participant Console as AWS Console
    
    User->>IdP: 1. Login with corporate credentials
    IdP->>User: 2. Authenticate
    IdP->>User: 3. Return SAML Assertion
    User->>STS: 4. AssumeRoleWithSAML + SAML Assertion
    STS->>STS: 5. Validate SAML Assertion
    STS->>User: 6. Temporary Security Credentials
    User->>Console: 7. Access AWS Console
    
```

### Web Identity Federation (Cognito)

```mermaid
graph TB
    User["Mobile/Web User"]
    
    User --> Social{Choose Provider}
    
    Social --> Google[Google]
    Social --> Facebook[Facebook]
    Social --> Amazon[Amazon]
    Social --> Apple[Apple]
    
    Google --> Cognito[Amazon Cognito]
    Facebook --> Cognito
    Amazon --> Cognito
    Apple --> Cognito
    
    Cognito --> STS[AWS STS]
    STS --> TempCreds[Temporary AWS Credentials]
    
    TempCreds --> S3[Access S3]
    TempCreds --> DynamoDB[Access DynamoDB]
    TempCreds --> Lambda[Invoke Lambda]
    
    classDef style1 fill:#232F3E
    class User style1
    classDef style2 fill:#FF9900
    class Cognito style2
    classDef style3 fill:#146EB4
    class STS style3
    classDef style4 fill:#569A31
    class TempCreds style4
```

## IAM Best Practices

### Security Best Practices Flow

```mermaid
flowchart TD
    Start([IAM Best Practices]) --> Root["🔐 Secure Root Account"]
    
    Root --> RootMFA[Enable MFA on Root]
    Root --> RootNoUse[Don't use Root for daily tasks]
    Root --> RootKeys[Delete Root Access Keys]
    
    RootNoUse --> Users[Create Individual IAM Users]
    Users --> Groups[Use Groups for Permissions]
    Groups --> LeastPriv[Apply Least Privilege]
    
    LeastPriv --> Policies[Use AWS Managed Policies]
    Policies --> Review[Regular Access Review]
    
    Review --> MFA[Enable MFA for All Users]
    MFA --> Rotate[Rotate Credentials Regularly]
    Rotate --> Conditions[Use Policy Conditions]
    
    Conditions --> Roles[Use Roles for Applications]
    Roles --> Monitor[Monitor with CloudTrail]
    Monitor --> End(["Secure IAM Setup ✅"])
    
    classDef style1 fill:#232F3E
    class Start style1
    classDef style2 fill:#C00
    class Root style2
    classDef style3 fill:#569A31
    class End style3
    classDef style4 fill:#FF9900
    class LeastPriv style4
```

### Permission Boundary Pattern

```mermaid
graph TB
    subgraph Permission_Evaluation_Group["Permission Evaluation"]
        MaxPerm["Maximum Permissions<br/>Permission Boundary"]
        IdentityPerm["Identity Policy<br/>What user can do"]
        Effective["Effective Permissions<br/>Intersection"]
        
        MaxPerm --> Effective
        IdentityPerm --> Effective
    end
    
    subgraph Example_Group["Example"]
        Boundary["Boundary Policy:&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Allow: EC2, S3, RDS&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Region: us-east-1"]
        
        UserPolicy["User Policy:&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Allow: EC2:*&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Allow: S3:*&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Allow: Lambda:*&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• All Regions"]
        
        Result["Effective Permission:&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Allow: EC2:* (us-east-1)&lt;&lt;&lt;BRTAG&gt;&gt;&gt;• Allow: S3:* (us-east-1)&lt;&lt;&lt;BRTAG&gt;&gt;&gt;❌ No RDS (not in user policy)&lt;&lt;&lt;BRTAG&gt;&gt;&gt;❌ No Lambda (not in boundary)"]
    end
    
    Boundary -.AND.-> Result
    UserPolicy -.AND.-> Result
    
    classDef style1 fill:#569A31
    class Effective style1
    classDef style2 fill:#FF9900
    class Result style2
```

## IAM Access Analyzer

### Access Analyzer Architecture

```mermaid
graph TB
    Analyzer[IAM Access Analyzer]
    
    Analyzer --> Scan{Scan Resources}
    
    Scan --> S3[S3 Buckets]
    Scan --> IAM[IAM Roles]
    Scan --> Lambda[Lambda Functions]
    Scan --> SQS[SQS Queues]
    Scan --> KMS[KMS Keys]
    Scan --> Secrets[Secrets Manager]
    
    S3 --> Findings[Access Findings]
    IAM --> Findings
    Lambda --> Findings
    SQS --> Findings
    KMS --> Findings
    Secrets --> Findings
    
    Findings --> Alert{"External Access<br/>Detected?"}
    
    Alert -->|Yes| Notify["SNS Notification<br/>Security Team"]
    Alert -->|Yes| Report[Generate Report]
    Alert -->|No| Safe[No Action Needed]
    
    classDef style1 fill:#FF9900
    class Analyzer style1
    classDef style2 fill:#146EB4
    class Findings style2
    classDef style3 fill:#C00
    class Notify style3
    classDef style4 fill:#569A31
    class Safe style4
```

## IAM Database Authentication

### RDS IAM Authentication Flow

```mermaid
sequenceDiagram
    participant App as Application
    participant IAM
    participant RDS as RDS MySQL/PostgreSQL
    
    Note over App: Has IAM Role with rds-db:connect permission
    
    App->>IAM: Request Authentication Token
    IAM->>IAM: Verify IAM Credentials
    IAM->>App: Return Auth Token (15 min validity)
    
    App->>RDS: Connect with username + auth token
    RDS->>IAM: Validate Token
    IAM->>RDS: Token Valid
    RDS->>App: Connection Established
    
    Note over App,RDS: Benefits: No password storage, IAM centralized auth, SSL enforced
    
```

