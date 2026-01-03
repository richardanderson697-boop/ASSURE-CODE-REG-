# Master Specification

# Master Prompt: Regulatory Compliance Web Scraping Platform

## Executive Summary
This document outlines the technical and functional specifications for a Regulatory Compliance Web Scraping Platform. The platform will leverage an agentic Retrieval-Augmented Generation (RAG) AI to autonomously scrape, analyze, and synthesize federal and state regulations from the United States, Europe, Canada, and the United Kingdom. The primary audience is high-risk regulated companies that require timely and accurate compliance intelligence. The system is designed from the ground up to be "compliance-ready," meaning all operations, from data scraping to user management, will adhere to stringent legal and security frameworks.

Key to this platform's design is a commitment to ethical data acquisition and robust security. The scraping engine will strictly adhere to `robots.txt` protocols, website terms of service, and implement respectful rate-limiting to avoid service disruption. All user data and system operations will be governed by the principles of GDPR, CCPA/CPRA, PIPEDA, and the UK Data Protection Act. The architecture will be built to support future SOC 2 auditing, ensuring the platform meets the high security, availability, and confidentiality standards demanded by its target clientele. The platform will provide its intelligence via a secure web dashboard, a RESTful API, and PDF exports.

## 1. Target Users and Needs
The platform is designed for professionals within high-risk, heavily regulated industries such as finance (FinTech, banking), healthcare (HealthTech, pharmaceuticals), energy, and telecommunications.

*   **User Personas:**
    *   **Compliance Officers:** Need to proactively track changes in legislation and regulatory guidance to update internal policies and avoid penalties. They require accurate, verifiable, and timely information with clear sourcing.
    *   **Legal Counsel (In-house and External):** Need to research specific regulations, understand their implications, and advise business units. They require deep search capabilities and the ability to export findings for reporting.
    *   **Risk Managers:** Need to assess the impact of regulatory changes on business operations and strategic initiatives. They require high-level summaries and trend analysis.

*   **User Needs & Security Expectations:**
    *   **Accuracy and Verifiability:** Users must be able to trust the data. Every piece of synthesized information must be traceable back to the original source document (e.g., a direct link to the government legislative portal).
    *   **Timeliness:** The platform must provide near real-time updates as new regulations are published or amended.
    *   **Confidentiality:** User account information, search queries, and saved data are considered sensitive business information. Users expect this data to be protected with strong encryption and access controls.
    *   **Data Privacy:** As users may be located in various jurisdictions, the platform must fully comply with GDPR, CCPA/CPRA, and PIPEDA for their personal data. This includes transparent privacy policies, clear consent mechanisms, and honoring data subject rights (e.g., data access, rectification, and erasure).
    *   **Auditability:** All user actions and data access must be logged to provide a clear audit trail, a critical requirement for regulated companies.

## 2. Core Features and Functionality

### 2.1 Agentic Scraping Engine
An automated system for identifying and extracting regulatory text from designated government and agency websites.

*   **Functionality:**
    *   Maintains a curated list of official sources for regulations in the US, EU, UK, and Canada.
    *   Intelligently navigates websites to find new and updated legal documents.
    *   Parses and extracts text content from HTML, PDF, and other document formats.
    *   **Ethical Scraping Module:**
        *   Automatically fetches and respects `robots.txt` for all target domains.
        *   Implements configurable rate-limiting and random delays to avoid overloading target servers.
        *   Uses a clearly identifiable User-Agent string (e.g., `RegulatoryComplianceBot/1.0; +http://[your-company-domain]/bot.html`).
*   **Security Implications:**
    *   The engine must operate within a sandboxed environment to prevent any potential exploits from affecting the core platform.
    *   All scraped data must be scanned for malware before being processed.
*   **Compliance Requirements:**
    *   **CFAA (US) & similar laws:** Operations must be designed to prevent any claim of "unauthorized access." The engine will only access publicly available information and will strictly adhere to website terms of service where applicable.
    *   **Copyright Law:** The platform will store raw text for analysis but will primarily present summaries, analyses, and direct links to the original sources to avoid copyright infringement.

### 2.2 RAG AI Analysis & Summarization
The core AI engine that processes raw regulatory text into structured, actionable intelligence.

*   **Functionality:**
    *   Uses a RAG model to provide contextually-aware summaries of complex regulations.
    *   Identifies key entities: effective dates, responsible agencies, affected industries, and required actions.
    *   Categorizes and tags regulations by jurisdiction, industry, and topic.
    *   Provides a natural language query interface (e.g., "Show me all new data privacy regulations in the EU affecting financial services since January").
*   **Security Implications:**
    *   The AI models and their training data (if any) are critical intellectual property and must be protected from unauthorized access.
    *   Input sanitization is required for the query interface to prevent injection attacks.
*   **Compliance Requirements:**
    *   **Data Integrity:** The system must ensure that the AI's analysis does not misrepresent the source material. All AI-generated content must be clearly labeled as such and linked to the original text.

### 2.3 Regulatory Intelligence Dashboard
A secure web interface for users to access and manage compliance data.

*   **Functionality:**
    *   Personalized dashboards showing relevant regulatory updates.
    *   Advanced search and filtering capabilities.
    *   User-managed watchlists and alerting for specific regulations or topics.
    *   Secure user and organization management portal.
*   **Security Implications:**
    *   **Authentication:** Mandatory Multi-Factor Authentication (MFA) for all users.
    *   **Authorization:** Role-Based Access Control (RBAC) to manage permissions within an organization (e.g., Admin, Read-Only User).
    *   All communication between the client and server must be encrypted via TLS 1.3.
*   **Compliance Requirements:**
    *   **GDPR/CCPA:** The dashboard must provide an accessible portal for users to manage their personal data, view the privacy policy, and submit data subject requests.

### 2.4 Secure API Access
A RESTful API for programmatic access to the regulatory data.

*   **Functionality:**
    *   Endpoints for searching regulations, retrieving specific document details, and accessing AI-generated summaries.
    *   Comprehensive API documentation.
*   **Security Implications:**
    *   **Authentication:** Access must be controlled via unique, revocable API keys.
    *   **Authorization:** API keys will be tied to user/organization accounts and will respect their permissions.
    *   **Throttling:** Implement strict rate-limiting to prevent abuse and ensure service availability.
*   **Compliance Requirements:**
    *   API usage must be logged to provide a full audit trail. Data transfers via the API must adhere to international data transfer regulations if applicable.

### 2.5 PDF Export & Reporting
Functionality to generate and download reports.

*   **Functionality:**
    *   Users can export search results, specific regulations, or summaries as professionally formatted PDF documents.
    *   PDFs will include generation timestamps, source links, and user attribution for auditability.
*   **Security Implications:**
    *   The PDF generation service must be sandboxed to prevent vulnerabilities (e.g., server-side request forgery).
    *   Generated PDFs containing sensitive query data must be stored securely and deleted after a short TTL.

## 3. Monetization Strategy
The platform will operate on a tiered B2B SaaS subscription model.

*   **Tiers:**
    *   **Professional:** For individual users or small teams, with limits on searches, alerts, and API calls.
    *   **Business:** For mid-sized companies, offering more users, higher API limits, and team management features.
    *   **Enterprise:** Custom-priced for large organizations, offering unlimited usage, dedicated support, and advanced security features (e.g., SSO integration).
*   **Payment Security & Compliance:**
    *   **PCI DSS:** The platform **will not** directly handle, process, or store credit card information. All payments will be processed through a PCI DSS Level 1 compliant third-party payment provider, such as **Stripe** or **Braintree**. Integration will be via their hosted payment pages or tokenization APIs to keep cardholder data out of our system's scope.

## 4. Data Architecture and Storage Requirements

*   **Data Models:**
    *   `Organization`: Stores company information.
    *   `User`: Stores user PII (name, email), hashed passwords, MFA configuration, and role.
    *   `RegulationSource`: Stores information about scraped websites (URL, last-scraped date).
    *   `RegulationDocument`: Stores raw and processed regulatory text, metadata (jurisdiction, date), and source URL.
    *   `AISummary`: Stores AI-generated analysis linked to a `RegulationDocument`.
    *   `ApiKey`: Stores hashed API keys linked to a `User` or `Organization`.
    *   `AuditLog`: Immutable log of user actions, API calls, and system events.

*   **Sensitive Data Handling:**
    *   **User PII (name, email):** Encrypted at rest using AES-256.
    *   **User Passwords:** Hashed using a strong, salted algorithm (e.g., Argon2, bcrypt).
    *   **API Keys:** Hashed in the database. The full key is shown to the user only once upon creation.
    *   **Encryption:** All data will be encrypted at rest (e.g., using AWS KMS or equivalent) and in transit (TLS 1.3).

*   **Data Retention and Deletion:**
    *   **User Data:** User accounts and associated PII will be permanently deleted upon user request, in compliance with GDPR's "right to be forgotten," after a brief grace period.
    *   **Regulatory Data:** Kept indefinitely as it forms the core product offering.
    *   **Audit Logs:** Retained for a minimum of one year for security analysis and compliance audits.

*   **Backup and Disaster Recovery:**
    *   Automated, daily backups of all databases and critical application data.
    *   Backups will be encrypted and stored in a separate geographic region.
    *   A disaster recovery plan will be documented and tested quarterly, with a Recovery Point Objective (RPO) of 24 hours and a Recovery Time Objective (RTO) of 4 hours. This is essential for SOC 2 compliance.

## 5. UI/UX Requirements

*   **User Interface:**
    *   A clean, professional, and data-centric design. The UI should prioritize clarity and ease of navigation for complex datasets.
    *   A responsive design that works effectively on standard desktop screen sizes.
*   **User Experience:**
    *   **Onboarding:** A guided onboarding process that highlights key features.
    *   **Authentication Flow:** A secure and user-friendly login and MFA setup process.
    *   **Consent Mechanisms:** A clear, un-bundled cookie consent banner on the first visit. The privacy policy and terms of service must be easily accessible. Checkboxes for consent must be unticked by default.
*   **Accessibility:**
    *   The application should be designed to meet **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards to ensure it is usable by people with disabilities, a common requirement for enterprise and government-facing software.

## 6. Technical Specifications

*   **Tech Stack (Recommended):**
    *   **Backend:** Python with Django/FastAPI (ideal for data processing and AI integration).
    *   **Frontend:** React or Vue.js (for a dynamic, responsive UI).
    *   **Database:** PostgreSQL (for robust, relational data storage).
    *   **AI/Scraping:** Python libraries such as Scrapy, BeautifulSoup, PyPDF2, and Hugging Face Transformers.
    *   **Infrastructure:** A major cloud provider (AWS, Azure, or GCP) for scalability, security, and compliance certifications.
*   **Authentication and Authorization:**
    *   Implement **OAuth 2.0** or **OpenID Connect** for user authentication.
    *   Use a managed identity provider (e.g., AWS Cognito, Auth0) to handle user pools, password policies, and MFA enforcement.
    *   Implement RBAC centrally in the backend, enforced at the API level.
*   **Encryption Standards:**
    *   **In Transit:** TLS 1.3 mandated for all client-server communication and internal service-to-service communication.
    *   **At Rest:** AES-256 encryption for all data stored in databases, object storage, and backups.
*   **API Security Measures:**
    *   Use an API Gateway (e.g., Amazon API Gateway) to manage authentication, throttling, and logging.
    *   All API endpoints must validate and sanitize user input to prevent common vulnerabilities (OWASP Top 10).
*   **Monitoring and Logging:**
    *   **Application Logs:** Structured logging for application events and errors.
    *   **Audit Logs:** A dedicated, immutable log stream for all security-sensitive events (logins, data exports, permission changes).
    *   Use a centralized logging solution (e.g., ELK Stack, Datadog) for monitoring, alerting, and analysis.

## 7. Security Integration
This specification is designed with security and compliance as a core principle, in line with **GDPR Article 25 (Data Protection by Design and by Default)**.

*   **Data Protection:** All technical decisions, from database schema design to API endpoint creation, must prioritize the protection of user data and the integrity of the regulatory intelligence.
*   **Compliance Checklist:** The development roadmap must include regular compliance checks against GDPR, CCPA, and other relevant regulations.
*   **Authentication and Authorization:** The selected authentication mechanism (e.g., Cognito) and the RBAC model are foundational security components and must be implemented before any application features that handle sensitive data.
*   **SOC 2 Readiness:** The architecture described (logging, encryption, access controls, DR) is designed to provide the technical evidence required for a future SOC 2 Type II audit, which will be critical for selling to enterprise customers.

## 8. Actionable Next Steps for Developer

1.  **Setup Secure Cloud Environment:** Provision a new, isolated cloud environment (e.g., AWS VPC). Configure strict network security groups, disable all unnecessary ports, and set up separate subnets for public-facing, application, and data layers.
2.  **Implement IAM and MFA:** Configure Identity and Access Management (IAM) roles with the principle of least privilege. Enforce MFA for all developer and administrative accounts with access to the cloud environment.
3.  **Establish CI/CD Pipeline:** Set up an automated CI/CD pipeline that includes static code analysis (SAST) and software composition analysis (SCA) to check for security vulnerabilities in code and dependencies.
4.  **Develop Core Data Models:** Implement the database schema using an ORM (e.g., Django ORM). Configure database-level encryption and ensure all fields designated as sensitive are encrypted at the application layer as well.
5.  **Set Up Authentication Service:** Integrate a managed identity provider (e.g., AWS Cognito). Configure the user pool with a strong password policy and mandatory MFA. Implement the basic user registration and login flows.
6.  **Prototype the Ethical Scraping Engine:** Develop the first version of the scraping module for a limited set of sources. Ensure it correctly parses `robots.txt` and implements rate-limiting *before* it is ever pointed at a live public website.
7.  **Build the Ingestion and Processing Logic:** Create the pipeline to take raw scraped data, clean it, and store it in the `RegulationDocument` model. This is a non-user-facing backend component.
8.  **Develop Secure API Foundation:** Create the first secure API endpoint (e.g., a simple health check). Implement API key authentication and ensure logging is correctly configured via an API Gateway.
9.  **Implement Centralized Logging:** Configure application and audit logging to stream to a secure, centralized service (e.g., AWS CloudWatch Logs). Set up basic alerts for critical security events (e.g., failed login attempts).
10. **Draft Initial Privacy Policy:** Work with a legal expert to draft a comprehensive privacy policy that accurately reflects the data handling practices defined in this specification and complies with GDPR, CCPA, and other relevant laws. This should be done *before* any public launch.

---


# Technology Stack

Of course. As ASSURE-CODE, I will generate a compliance-ready technical specification for the Web Scraping Platform. The following technology stack justification is designed to meet the stringent security, privacy, and operational requirements for serving high-risk regulated companies, with specific adherence to GDPR, CCPA/CPRA, PIPEDA, and best practices to mitigate risks under regulations like the CFAA.

# Technology Stack Recommendation

## Security-First Stack Selection
This technology stack is selected with a security-first and compliance-centric mindset. The choices are directly influenced by the need to create a platform that is trusted by high-risk regulated companies. The architecture must support the principles of least privilege, defense-in-depth, and data minimization. All components are chosen for their ability to support the stringent requirements of a comprehensive Security Blueprint, which includes:

*   **Required Encryption Standards:** All data must be encrypted in transit using TLS 1.3 and at rest using AES-256. Key management will be handled by a dedicated, audited service.
*   **Authentication and Authorization:** Multi-factor authentication (MFA) is mandatory for all user accounts. A robust Role-Based Access Control (RBAC) system will be implemented to enforce the principle of least privilege.
*   **Compliance Framework Needs:** The stack must be hosted on infrastructure that provides attestations for SOC 2 Type II, ISO 27001, and provides tooling to support GDPR, CCPA/CPRA, and PIPEDA compliance (e.g., data residency options, tools for data subject access requests).
*   **Security Monitoring and Logging:** The system must generate immutable, comprehensive audit trails of all user and system actions. Real-time security monitoring and alerting for suspicious activities are required.
*   **Ethical Scraping:** The architecture must programmatically enforce ethical scraping practices, including strict adherence to `robots.txt`, configurable rate limiting, and clear source attribution to mitigate legal risks under CFAA and copyright laws.

## Recommended Primary Stack
The single best technology stack for this project is a containerized Python backend with a React/Next.js frontend, hosted on Amazon Web Services (AWS). This stack provides the ideal balance of specialized tooling for the core AI and scraping tasks, enterprise-grade security, and proven scalability.

## Detailed Stack Components

### Frontend
*   **Framework:** **Next.js (React Framework)**
    *   **Rationale:** Next.js provides a robust, production-ready framework with built-in security features. Its server-side rendering (SSR) and static site generation (SSG) capabilities reduce the client-side attack surface and improve performance. It includes sensible security headers by default and a mature ecosystem for adding further security controls.
*   **State Management:** **Redux Toolkit**
    *   **Rationale:** For an application with complex data states (e.g., managing scraped data, search filters, user settings), Redux Toolkit provides a predictable and maintainable state management pattern. Its immutability helps prevent unintended side effects.
*   **UI Component Library:** **MUI (Material-UI)**
    *   **Rationale:** MUI offers a comprehensive suite of accessible, production-ready components that accelerate development while maintaining a professional look and feel suitable for enterprise users.
*   **Security Libraries:**
    *   **Authentication:** **Auth.js (formerly NextAuth.js)** to handle secure, server-side authentication flows, integrating seamlessly with third-party providers like Auth0 or AWS Cognito. It helps mitigate common auth vulnerabilities like token leakage.
    *   **Input Validation:** **Zod** for schema declaration and validation on both client and server, preventing malformed data from being processed and mitigating risks of injection attacks.
    *   **XSS Prevention:** Rely on React's native JSX escaping. For rendering user-generated or scraped content, use **DOMPurify** to sanitize any HTML before it is rendered, preventing Cross-Site Scripting (XSS) attacks.

### Backend
*   **Server Framework:** **Python with FastAPI**
    *   **Rationale:** Python is the undisputed leader for AI/ML (Hugging Face, LangChain) and web scraping (`Scrapy`, `Playwright`). FastAPI is a modern, high-performance framework that uses Pydantic for automatic data validation, which is a critical security feature for preventing insecure deserialization and data-based injection attacks. Its asynchronous nature is perfect for I/O-bound tasks like making requests to external websites.
*   **API Architecture:** **REST API with OpenAPI Specification**
    *   **Rationale:** A well-documented REST API is the industry standard and ensures broad compatibility for the required API export feature. FastAPI automatically generates OpenAPI documentation, which aids in security reviews and client integration.
*   **Authentication Approach:** **JWT (JSON Web Tokens)**
    *   **Rationale:** JWTs are stateless and work well with distributed, containerized services. We will implement a short-lived access token (e.g., 15 minutes) and a long-lived, securely stored refresh token rotation strategy to minimize the impact of a compromised token.
*   **Security Middleware:**
    *   **Rate Limiting:** Implement middleware to prevent brute-force attacks on login endpoints and protect the API from denial-of-service (DoS) attacks.
    *   **CORS:** Use FastAPI's CORS middleware with a strict allowlist of origins.
    *   **Headers:** Use a middleware library to set security headers like `Content-Security-Policy`, `X-Content-Type-Options`, and `Strict-Transport-Security`.

### Database
*   **Primary Database:** **PostgreSQL (via Amazon RDS)**
    *   **Rationale:** PostgreSQL is a highly reliable, ACID-compliant relational database. Amazon RDS for PostgreSQL provides managed security features, including mandatory **encryption at rest** via AWS KMS, automated backups, and simplified point-in-time recovery. It also supports the `pgvector` extension, which can serve as an efficient and secure vector store for the RAG AI's embeddings.
*   **Caching Strategy:** **Redis (via Amazon ElastiCache)**
    *   **Rationale:** Redis will be used for caching frequently accessed data, managing session information, and as a message broker for the scraping task queue. ElastiCache supports encryption in transit and at rest.
*   **Search Functionality:** **Amazon OpenSearch Service**
    *   **Rationale:** For powerful, fast, and secure full-text search across millions of regulatory documents, a dedicated search engine is necessary. OpenSearch provides advanced querying capabilities and can be secured within the VPC.
*   **Backup and Recovery:** Utilize AWS RDS automated daily snapshots and transaction log backups to enable point-in-time recovery for the last 35 days, a critical feature for business continuity and SOC 2 compliance.

### AI & Scraping Infrastructure
*   **Scraping Orchestration:** **Scrapy** framework for building efficient, asynchronous web crawlers. For JavaScript-heavy sites, use **Playwright**.
*   **Task Queue:** **Celery** with Redis as a broker to manage and scale long-running scraping jobs independently of the main API.
*   **RAG Framework:** **LangChain** or **LlamaIndex** to orchestrate the process of document chunking, embedding, retrieval, and synthesis with an LLM.
*   **LLM Provider:** **Azure OpenAI Service** or **Amazon Bedrock**.
    *   **Rationale:** These providers offer enterprise-grade privacy and security. They process data in-region and guarantee that API inputs/outputs are not used to train their models, which is a critical compliance requirement.
*   **Data Storage:** **Amazon S3** for storing raw scraped HTML/PDFs and exported PDF documents. S3 buckets will be configured with default encryption, versioning, and strict, non-public access policies.

### Infrastructure
*   **Hosting Platform:** **Amazon Web Services (AWS)**
    *   **Rationale:** AWS holds the most extensive set of compliance certifications (SOC 2, ISO 27001, FedRAMP) and provides the necessary tools to build a secure and compliant application. The application will be deployed within a Virtual Private Cloud (VPC) with strict network segmentation.
*   **CI/CD Approach:** **GitHub Actions**
    *   **Rationale:** A CI/CD pipeline will be built using GitHub Actions to automate testing and deployment. The pipeline will include mandatory security checks: **Snyk** or **Dependabot** for dependency scanning, and **CodeQL** for Static Application Security Testing (SAST) on every pull request.
*   **Monitoring and Analytics:** **Amazon CloudWatch** and **AWS X-Ray**
    *   **Rationale:** CloudWatch will be used for infrastructure monitoring, performance logging, and security alerting (e.g., alerts on failed logins). X-Ray will provide distributed tracing to diagnose issues in the microservices architecture.
*   **Logging and Audit Trail:** **AWS CloudTrail** and **CloudWatch Logs**
    *   **Rationale:** CloudTrail will log all API calls made to the AWS account, providing a critical audit trail. Application logs from CloudWatch will be streamed to a secure, long-term storage solution like Amazon OpenSearch or Datadog, with alerts configured for security events. This is non-negotiable for SOC 2.
*   **Security Infrastructure:**
    *   **Authentication Service:** **AWS Cognito** or **Auth0**. These services offload the most critical security components (user management, MFA, password policies) to a dedicated, audited provider, significantly reducing security risk.
    *   **Encryption Key Management:** **AWS KMS** to manage the lifecycle of encryption keys used for RDS, S3, and other services, ensuring customer-managed or AWS-managed keys protect data at rest.
    *   **API Gateway:** **Amazon API Gateway** to act as a secure front door for the backend. It will handle API key management, request validation, rate limiting, and integration with AWS WAF.
    *   **WAF:** **AWS WAF** to protect against common web exploits like SQL injection and XSS, as defined by the OWASP Top 10.

## Alternative Stack Comparison

### Stack Option A (Recommended)
*   **Technologies:** Next.js, Python/FastAPI, PostgreSQL, Redis, OpenSearch, AWS (ECS, RDS, S3, API Gateway, Cognito).
*   **Pros:**
    *   **Best-in-Class Tooling:** Utilizes Python, the industry standard for AI/ML and web scraping, ensuring access to the best libraries and talent.
    *   **Superior Security Posture:** Leverages the comprehensive AWS security ecosystem (KMS, WAF, GuardDuty, Cognito) for a defense-in-depth architecture.
    *   **Highly Scalable & Decoupled:** Containerized microservices architecture (e.g., on ECS or EKS) allows for independent scaling of the API, scraping workers, and AI processing.
    *   **Compliance-Ready:** AWS provides extensive compliance documentation and tools to accelerate SOC 2 and GDPR certification efforts.
    *   **No Vendor Lock-in:** Core technologies (Python, PostgreSQL, React) are open-source, allowing for future portability.
*   **Cons:**
    *   **Higher Operational Complexity:** Managing a containerized microservices architecture requires more DevOps expertise than a serverless or monolithic approach.
    *   **Potentially Higher Cost at Low Scale:** The cost of running persistent services like RDS and OpenSearch clusters can be higher than pay-per-use serverless models initially.
*   **Best for:** Building a robust, secure, and scalable enterprise-grade platform for high-risk regulated clients where performance, security, and compliance are paramount.
*   **Security Rating:** **High**. This stack enables a multi-layered security approach, from the network level (VPC) to the application level (WAF, data validation), with strong identity and key management.

### Stack Option B (Serverless/Jamstack)
*   **Technologies:** Next.js on Vercel, Backend via AWS Lambda (Python), Database: Amazon DynamoDB, Vector DB: Pinecone, Auth: Auth.js.
*   **Pros:**
    *   **Reduced Operational Overhead:** Vercel and AWS Lambda handle server management, patching, and scaling automatically.
    *   **Cost-Efficient at Scale:** Pay-per-use model can be very cost-effective for spiky or unpredictable workloads.
    *   **Rapid Development:** The developer experience on platforms like Vercel is excellent, enabling faster iteration.
*   **Cons:**
    *   **Not Ideal for Long-Running Tasks:** Standard AWS Lambda functions have a 15-minute execution limit, which is unsuitable for extensive web scraping jobs. This requires more complex architectures (e.g., AWS Step Functions, Fargate).
    *   **Debugging Complexity:** Debugging issues across a distributed serverless architecture can be more challenging than in a containerized environment.
    *   **Potential for Misconfiguration:** Security relies heavily on correctly configured IAM roles and permissions, which can be complex to manage at scale.
*   **Best for:** Projects where speed of development is the top priority and workloads are short-lived and event-driven.
*   **Security Rating:** **Medium**. While secure if configured correctly, the distributed nature and reliance on IAM policies increase the risk of misconfiguration. It places a higher burden on developers to manage security at a granular level.

### Stack Option C (Microsoft Azure Ecosystem)
*   **Technologies:** Blazor/React Frontend, ASP.NET Core (C#) Backend, Azure SQL Database, Azure App Service/AKS, Azure AD B2C, Azure OpenAI Service.
*   **Pros:**
    *   **Tightly Integrated Ecosystem:** Excellent for organizations already invested in Azure and the Microsoft stack.
    *   **Enterprise-Grade Security:** Azure provides a suite of security tools (Azure Sentinel, Defender for Cloud, Azure AD) that are highly regarded in the enterprise space.
    *   **Strongly-Typed Language:** C#/.NET offers performance and type safety, which can help prevent certain classes of bugs.
*   **Cons:**
    *   **Weaker Scraping/AI Ecosystem:** The open-source ecosystem for web scraping and AI orchestration is significantly more mature and extensive in Python than in C#. This could lead to slower development or the need to build custom tooling for core features.
    *   **Potential for Higher Costs:** Azure services can sometimes be more expensive than their AWS counterparts for similar workloads.
    *   **Less Community Support for Niche Tasks:** Finding community support and pre-built libraries for specific scraping or RAG tasks may be more difficult.
*   **Best for:** Enterprises with existing .NET expertise and a strategic commitment to the Microsoft Azure cloud.
*   **Security Rating:** **High**. Azure's security offerings are on par with AWS. Azure AD B2C is a powerful and secure identity management solution. The primary drawback is functional, not security-related.

## Final Recommendation
The definitive recommendation is **Stack Option A (Python/React on AWS)**.

This stack is unequivocally the best choice because its core technologies align perfectly with the application's primary functions: advanced web scraping and AI-powered analysis. The Python ecosystem provides an unparalleled advantage in these domains, which directly translates to faster development and more powerful features.

Furthermore, the AWS infrastructure provides the most robust and comprehensive suite of managed services for building a secure, auditable, and compliant platform. The ability to use AWS WAF, KMS, Cognito, and CloudTrail out of the box directly addresses the security and compliance requirements mandated by the target audience of high-risk regulated companies. This stack is not just a collection of technologies; it's an architecture designed from the ground up to earn and maintain the trust of users for whom security and compliance are not optional.

---


# Security Analysis

Here is the COMPLIANCE-READY Security Blueprint for the Regulatory Compliance Web Scraping Platform.

# Security Blueprint

This document outlines the security and compliance requirements for the "Regulatory Compliance Web Scraping Platform." Given the target audience of high-risk regulated companies and the handling of data across multiple international jurisdictions, a robust security posture is paramount.

---

### **ACTIVE REGULATORY REQUIREMENTS**

This blueprint incorporates requirements from the following regulations based on the project's scope (US, Europe, Canada, UK) and functionality:

*   **GDPR (General Data Protection Regulation - EU):** Applies to the personal data of users within the European Union.
*   **UK GDPR:** Applies to the personal data of users within the United Kingdom.
*   **PIPEDA (Personal Information Protection and Electronic Documents Act - Canada):** Applies to the personal data of users in Canada.
*   **US State Privacy Laws (e.g., CCPA/CPRA):** Applies to the personal data of users in specific US states like California.
*   **CFAA (Computer Fraud and Abuse Act - US):** While scraping public data is generally permissible, aggressive or unauthorized scraping can fall under the scope of this act. Adherence to `robots.txt` and terms of service is a critical mitigation.
*   **EU Database Directive:** Provides sui generis protection for databases. Scraping must not constitute an unauthorized extraction or re-utilization of the whole or a substantial part of the contents of a database.

---

## Data Protection Requirements

### 1. Sensitive Data Types
The platform will handle several categories of data, each requiring specific protection measures.

*   **User Personal Data (PII):**
    *   **Description:** Information used to identify and manage user accounts.
    *   **Examples:** Full name, business email address, phone number, company name, job title, IP addresses.
    *   **Classification:** **Confidential.** Subject to GDPR, UK GDPR, PIPEDA, and CCPA/CPRA.
*   **User Authentication Credentials:**
    *   **Description:** Data used to authenticate users and systems.
    *   **Examples:** Hashed passwords, API keys, session tokens, MFA secrets.
    *   **Classification:** **Highly Confidential.**
*   **Scraped Regulatory Data:**
    *   **Description:** The core data product—laws, regulations, and compliance documents scraped from public government and agency websites.
    *   **Examples:** Text of regulations, legal notices, publication dates.
    *   **Classification:** **Internal.** While the source is public, the aggregated, structured, and analyzed dataset is a valuable and proprietary asset. Its integrity is critical for customers.
*   **Operational & Audit Logs:**
    *   **Description:** System-generated logs for monitoring, security analysis, and auditing.
    *   **Examples:** User login attempts, API requests, system errors, data access patterns.
    *   **Classification:** **Confidential.** May contain user IP addresses and other sensitive operational data.

### 2. Encryption Requirements

*   **Encryption in Transit:**
    *   All external network communication must be encrypted using **TLS 1.2 or higher**. This applies to the web application, APIs, and any data transfer between services.
    *   Internal service-to-service communication within the cloud environment should also be encrypted using mTLS (mutual TLS).
    *   Configure ciphers to disallow weak or compromised algorithms (e.g., RC4, SHA-1).
*   **Encryption at Rest:**
    *   All data stored in databases, object storage (e.g., S3, Azure Blob Storage), and backups must be encrypted using **AES-256** or a stronger algorithm.
    *   Utilize a managed key management service (KMS) like AWS KMS or Azure Key Vault for managing encryption keys. Access to the KMS must be tightly controlled and audited.
    *   Databases must be configured to encrypt data on disk and all automated backups.

### 3. Data Retention Policies

*   **User Personal Data:**
    *   Data shall be retained for the duration of an active user account.
    *   Upon account deletion request (exercising GDPR "Right to Erasure"), user PII must be permanently deleted from production systems within 30 days. Anonymized usage data may be retained.
    *   Data in backups will be deleted in accordance with the backup lifecycle, not to exceed 90 days.
*   **Scraped Regulatory Data:**
    *   Retain versioned history of all scraped regulations to allow users to track changes over time.
    *   Establish a formal policy for archiving or purging data that is no longer relevant or has been superseded for an extended period (e.g., > 10 years).
*   **Operational & Audit Logs:**
    *   Security and audit logs must be retained for a minimum of **365 days** to facilitate security incident investigations.
    *   Logs must be stored in a tamper-evident format. After the retention period, logs can be archived to cold storage or securely deleted.

## Compliance Checklist

### GDPR / UK GDPR
This is mandatory due to operations in Europe and the UK.

| Requirement | Actionable Measure |
| :--- | :--- |
| **Lawful Basis for Processing** | User consent (for marketing) and contract fulfillment (for service delivery) must be the basis for processing user PII. This must be clearly stated in the Privacy Policy. |
| **Data Subject Rights** | Implement automated or well-defined manual processes for users to exercise their rights: access, rectification, erasure, portability, and restriction of processing. |
| **Data Minimization** | Collect only the absolute minimum PII required to create and manage an account. |
| **Privacy by Design** | Conduct a Data Protection Impact Assessment (DPIA) before launch and for any major new feature. |
| **Data Processing Agreements (DPAs)** | Sign DPAs with all third-party sub-processors (e.g., cloud provider, email service). |
| **Data Transfer** | If transferring EU/UK user data outside the EEA/UK, ensure adequacy mechanisms like Standard Contractual Clauses (SCCs) are in place. |

### PCI DSS (Payment Card Industry Data Security Standard)
*   **Not Applicable** in the current scope.
*   **Action:** If payment processing is added, it **MUST** be outsourced to a certified Level 1 PCI DSS compliant payment processor (e.g., Stripe, Braintree). The implementation must use a method (e.g., Stripe Elements, Braintree Drop-in UI) that ensures no cardholder data ever touches the platform's servers, thereby minimizing PCI scope to a simple SAQ-A.

### HIPAA (Health Insurance Portability and Accountability Act)
*   **Not Applicable.** The platform does not process, store, or transmit Protected Health Information (PHI).

### SOC 2 (Service Organization Control 2)
*   **Highly Recommended.** The target audience ("High risk regulated companies") will likely require a SOC 2 Type II report as part of their vendor due diligence. The platform should be designed and built with SOC 2 controls in mind from day one.
*   **Considerations:**
    *   **Security (Common Criteria):** Implement all controls outlined in this blueprint (access control, encryption, monitoring).
    *   **Availability:** Design for high availability with redundancy, automated backups, and a tested disaster recovery plan.
    *   **Confidentiality:** Enforce strict access controls and encryption for all sensitive data.
    *   **Privacy:** Adhere to all GDPR/CCPA principles and maintain a comprehensive privacy policy.
    *   **Process:** Formalize policies for change management, incident response, and vendor risk management.

## Authentication & Authorization

### 1. Recommended Authentication Methods
*   **Primary:** User email and a strong password.
    *   **Password Policy:** Minimum 12 characters, complexity requirements (uppercase, lowercase, number, symbol), and checked against known breached password lists.
    *   **Password Storage:** Passwords must be hashed using a strong, salted, one-way algorithm like **Argon2** or **bcrypt**.
*   **Multi-Factor Authentication (MFA):**
    *   **Mandatory** for all user accounts. Users must be required to enable it upon first login or within a short grace period.
    *   Support TOTP (e.g., Google Authenticator, Authy) and FIDO2/WebAuthn for phishing-resistant authentication.
*   **Enterprise Integration:**
    *   Provide support for SAML 2.0 or OpenID Connect (OIDC) for Single Sign-On (SSO) with enterprise identity providers (e.g., Azure AD, Okta).
*   **API Authentication:**
    *   All API access must be authenticated using bearer tokens or cryptographically signed requests. API keys must be long, high-entropy, and revocable.

### 2. Role-Based Access Control (RBAC) Structure
Implement a strict RBAC model based on the Principle of Least Privilege.

*   **`Organization Admin`:** Manages users, billing, and global settings for their organization. Can invite/remove users and assign roles.
*   **`User`:** Standard role. Can configure and run scraping jobs, view/export data, and manage their own API keys. Cannot manage other users.
*   **`Auditor` (Read-Only):** Can view all data, reports, and logs within their organization but cannot make any changes, run jobs, or access sensitive settings.

### 3. Session Management
*   Use a framework-native, secure session management system.
*   Session tokens must be stored in secure, `HttpOnly`, `SameSite=Strict` cookies to prevent XSS-based theft.
*   Implement a server-side session timeout for idle sessions (e.g., 30 minutes).
*   The "logout" function must invalidate the session token on the server-side, not just clear it from the client.

## Security Best Practices

### 1. API Security Measures
*   All API endpoints must enforce authentication and RBAC authorization.
*   Use unique, high-entropy API keys for programmatic access. Never expose keys in client-side code.
*   Implement versioning for the API (e.g., `/api/v1/...`).
*   Follow RESTful best practices and use standard HTTP verbs and status codes.
*   Log all API requests and responses (excluding sensitive data) for auditing and threat detection.

### 2. Input Validation
*   **Server-Side Validation is Mandatory:** Never trust client-side input.
*   Validate all incoming data for type, format, length, and range.
*   Use parameterized queries or prepared statements for all database interactions to prevent SQL injection.
*   Sanitize all data before rendering it in HTML to prevent Cross-Site Scripting (XSS). Use a modern front-end framework (e.g., React, Vue) with built-in output encoding.

### 3. Rate Limiting Strategies
*   **Login Endpoints:** Limit login attempts per account and per IP address to prevent brute-force attacks (e.g., 5 failed attempts in 5 minutes results in a temporary lockout).
*   **API Endpoints:** Implement rate limiting based on the user's subscription tier (e.g., 100 requests/minute). Return `429 Too Many Requests` HTTP status code when the limit is exceeded.
*   **Scraping Agent:** The agent itself must have built-in rate limiting and politeness delays to avoid being blocked by target sites and to comply with the "respectful scraping" requirement. This should be configurable per domain.

### 4. Monitoring and Logging Recommendations
*   **Centralized Logging:** Aggregate logs from all services into a centralized SIEM (Security Information and Event Management) or logging platform (e.g., ELK Stack, Splunk, Datadog).
*   **Audit Trail:** Log all security-sensitive events with user ID, source IP, timestamp, and event details.
    *   Examples: Login success/failure, password change, MFA enrollment, API key creation/revocation, user role change.
*   **Alerting:** Configure real-time alerts for high-priority security events:
    *   Multiple failed logins from a single IP.
    *   Anomalous API usage patterns.
    *   Attempts to access unauthorized resources (403 errors).
*   **Scraping Agent Compliance Logging:**
    *   The scraping agent must log every decision related to `robots.txt` (e.g., "Skipped URL /private/ because of Disallow rule").
    *   Maintain a permanent, auditable log of the source URL and retrieval timestamp for every piece of data stored. This is critical for data provenance and integrity.

---


# Cost Breakdown

# Cost Analysis & Infrastructure Projection

**Project:** Web Scraping Platform Using Agentic RAG AI
**ASSURE-CODE Compliance Analysis:** This document incorporates cost considerations for handling sensitive regulatory data across multiple international jurisdictions. The projections are designed to meet the high security and availability expectations of regulated enterprise clients and include non-negotiable costs for compliance with GDPR, UK DPA, CCPA/CPRA, and PIPEDA.

---

## Application Complexity Assessment

Based on the core requirements of a multi-jurisdictional, agentic AI-powered web scraping platform targeting high-risk regulated companies, the application complexity is rated as:

-   **Enterprise**

**Justification:**
1.  **Agentic RAG AI Core:** This is a highly complex system requiring a sophisticated data pipeline (scrape, chunk, embed, index), a vector database, and integration with Large Language Models (LLMs). This goes far beyond a simple web application.
2.  **Multi-Jurisdictional Compliance:** The need to scrape and process data from the US, EU, UK, and Canada, while strictly adhering to privacy laws (GDPR, CCPA, etc.), `robots.txt`, and website Terms of Service, introduces significant architectural and legal overhead.
3.  **Enterprise Target Audience:** Serving "high-risk regulated companies" mandates enterprise-grade security, reliability (high uptime SLAs), and auditability from day one. This requires robust infrastructure, comprehensive security measures, and certifications like SOC 2.
4.  **Data Scale:** The volume of regulatory text from multiple countries is vast and constantly changing, requiring a scalable and efficient infrastructure for storage, processing, and retrieval.

---

## Infrastructure Requirements

The infrastructure must be designed for security, scalability, and high availability. All data storage must be encrypted at rest (AES-256) and in transit (TLS 1.2+).

| Component | Requirement | Recommended Service(s) (AWS Example) | Rationale |
| :--- | :--- | :--- | :--- |
| **Database (Relational)** | SQL database for user data, metadata, API keys, audit logs. | AWS RDS for PostgreSQL (Multi-AZ) | Managed service for high availability, automated backups, and simplified management. Multi-AZ is critical for enterprise SLAs. |
| **Database (Vector)** | High-performance vector database for RAG AI semantic search. | Pinecone, Weaviate, or AWS RDS with `pgvector` | Essential for the core AI functionality. Managed vector DBs are recommended for performance and scalability. |
| **Storage (Object)** | Scalable storage for raw scraped documents, processed text, and PDF exports. | AWS S3 with Server-Side Encryption (SSE-KMS) | Durable, cost-effective, and secure. Using customer-managed keys (KMS) provides a stronger audit trail for compliance. |
| **Compute (Application)** | Hosting for the main API, web front-end, and background processing. | AWS EKS (Kubernetes) or AWS Fargate | Containerization provides scalability and portability. EKS offers full control, while Fargate simplifies operations. |
| **Compute (AI/Scraping)** | Scalable workers for scraping, data processing, and AI model inference. | AWS Fargate (for scraping) and EC2 GPU Instances (for embedding/inference) | Fargate allows for massively parallel, short-lived scraping tasks. Dedicated GPU instances are necessary for efficient AI data processing. |
| **CDN & Bandwidth** | Global content delivery for the web app and API, data egress. | AWS CloudFront | Improves performance, reduces latency, and provides a first layer of DDoS protection. |
| **Security Infrastructure** | WAF, DDoS protection, threat detection, centralized logging. | AWS WAF, AWS Shield Advanced, AWS GuardDuty, AWS CloudWatch | A multi-layered security approach is non-negotiable for protecting sensitive data and meeting compliance requirements. |

---

## Security and Compliance Cost Considerations

These costs are integral to the platform's viability and are not optional. They are amortized monthly in the cost breakdown below.

| Area | Requirement & Annual Cost Estimate | Rationale |
| :--- | :--- | :--- |
| **Compliance Certifications** | **SOC 2 Type II:** Readiness assessment and audit. **($25,000 - $60,000+)** | Essential for building trust and selling to enterprise customers. The cost covers auditors and readiness platforms (e.g., Vanta, Drata). |
| **Security Audits** | **Annual Penetration Test:** Required for SOC 2 and customer due diligence. **($10,000 - $25,000+)** | Proactively identifies and mitigates vulnerabilities in the application and infrastructure. |
| **Security Tooling** | **SIEM & Threat Detection:** Centralized logging and analysis. **($12,000 - $50,000+)** | Services like Datadog, Splunk, or AWS Security Hub are critical for continuous monitoring, incident response, and compliance evidence. |
| **Encryption Key Management**| **Managed KMS:** For cryptographic key control. **(Usage-based, typically <$500/mo)** | AWS KMS or Google Cloud KMS is required by GDPR/CCPA for demonstrating control over data encryption and fulfilling data subject rights. |
| **Data Backup & DR** | **Cross-Region Replication & Testing:** For business continuity. **(Adds ~20-40% to storage/DB costs)** | Ensures data is recoverable in the event of a regional outage, a key requirement for enterprise SLAs and compliance frameworks. |

---

## Monthly Cost Breakdown (3 Scenarios)

Estimates are based on a leading cloud provider like AWS. Costs for third-party APIs (LLMs, residential proxies for scraping) are highly variable and represent a significant operational expense.

### 1. MVP/Launch Phase (1-1,000 users / 1-10 clients)

| Category | Service/Tool Example | Estimated Monthly Cost |
| :--- | :--- | :--- |
| Database Costs | AWS RDS (db.t4g.medium) + Pinecone (Starter) | $250 |
| Storage Costs | AWS S3 (1TB, encrypted) | $50 |
| Compute/Hosting Costs | AWS Fargate, App Runner | $1,200 |
| Security & Monitoring | AWS WAF, GuardDuty, Vanta/Drata | $700 |
| Compliance & Audit | Amortized (SOC 2, Pen Test) | $3,000 |
| Third-party API Costs | LLM API (OpenAI/Anthropic), Proxy Service | $1,500 |
| CDN/Bandwidth Costs | AWS CloudFront (1TB) | $100 |
| **TOTAL Monthly Estimate** | | **$6,800** |

### 2. Growth Phase (1,000-10,000 users / 10-50 clients)

| Category | Service/Tool Example | Estimated Monthly Cost |
| :--- | :--- | :--- |
| Database Costs | AWS RDS (db.r6g.large, Multi-AZ) + Pinecone (Standard) | $800 |
| Storage Costs | AWS S3 (10TB, encrypted) | $350 |
| Compute/Hosting Costs | AWS EKS Cluster + Reserved Instances | $4,500 |
| Security & Monitoring | AWS Shield Advanced, Datadog, Snyk | $2,000 |
| Compliance & Audit | Amortized (SOC 2, ISO 27001) | $5,000 |
| Third-party API Costs | High-volume LLM API & Proxies | $8,000 |
| CDN/Bandwidth Costs | AWS CloudFront (10TB) | $850 |
| **TOTAL Monthly Estimate** | | **$21,500** |

### 3. Scale Phase (10,000+ users / 50+ clients)

| Category | Service/Tool Example | Estimated Monthly Cost |
| :--- | :--- | :--- |
| Database Costs | AWS Aurora Serverless v2 + Pinecone (Enterprise) | $5,000 |
| Storage Costs | AWS S3 (100TB+, with tiering) | $2,000 |
| Compute/Hosting Costs | Large EKS Cluster (multi-region), GPU Fleet | $25,000 |
| Security & Monitoring | Enterprise SIEM, dedicated SecOps tooling | $15,000 |
| Compliance & Audit | Continuous multi-framework audits | $8,000 |
| Third-party API Costs | Enterprise LLM contracts or self-hosted models | $30,000+ |
| CDN/Bandwidth Costs | AWS CloudFront (negotiated rates) | $6,000 |
| **TOTAL Monthly Estimate** | | **$91,000+** |

---

## Cost Optimization Strategies

Balancing cost with performance and security is critical.

1.  **Leverage ARM-based Compute:** Use AWS Graviton processors for compute workloads (EC2, RDS, Fargate) to achieve up to 40% better price-performance over comparable x86 instances.
2.  **Optimize AI Pipeline:**
    *   **Model Tiering:** Use smaller, faster, and cheaper LLMs (e.g., Claude Haiku, GPT-3.5-Turbo) for simple queries, reserving more powerful models (e.g., GPT-4, Claude Opus) for complex synthesis tasks.
    *   **Intelligent Caching:** Implement a caching layer (like Redis or Dragonfly) for RAG results and frequently accessed documents to reduce redundant LLM calls and database lookups.
3.  **Utilize Spot Instances:** Run stateless and fault-tolerant workloads, such as data embedding and batch scraping jobs, on EC2 Spot Instances to reduce compute costs by up to 90%.
4.  **Implement Data Lifecycle Policies:** Automatically transition older, infrequently accessed scraped data from standard object storage (S3 Standard) to cheaper tiers (S3 Infrequent Access or Glacier) to significantly reduce long-term storage costs.
5.  **Commit to Savings Plans:** For predictable, baseline compute and database usage, commit to 1-year or 3-year AWS Savings Plans or Reserved Instances to achieve discounts of 40-72% over on-demand pricing.
6.  **Automate Compliance:** Utilize compliance automation platforms (Vanta, Drata) to continuously monitor controls and collect evidence, drastically reducing the manual effort and consulting costs associated with SOC 2 and ISO 27001 audits.

---


# Code Scaffold

```json
{
  "projectName": "web-scraping-platform-using",
  "securityArchitecture": {
    "authentication": {
      "provider": "Auth0",
      "methods": [
        "email/password",
        "OAuth (Google, Microsoft)",
        "MFA (TOTP)"
      ],
      "sessionManagement": "JWT with refresh tokens"
    },
    "authorization": {
      "model": "RBAC",
      "roles": [
        "SuperAdmin",
        "Admin",
        "User",
        "BillingManager"
      ]
    },
    "encryption": {
      "atRest": "AES-256",
      "inTransit": "TLS 1.3+",
      "keyManagement": "AWS KMS"
    },
    "compliance": {
      "frameworks": [
        "GDPR",
        "CCPA/CPRA",
        "PIPEDA",
        "UK GDPR",
        "SOC 2 Type II"
      ],
      "dataRetention": "User activity logs retained for 1 year. Scraped regulatory data retained for active customer subscriptions and purged 90 days after termination. Financial records retained for 7 years.",
      "auditLogging": true
    }
  },
  "structure": {
    "frontend": {
      "framework": "Next.js",
      "folders": [
        "app/",
        "components/",
        "hooks/",
        "lib/",
        "contexts/",
        "middleware/"
      ],
      "keyFiles": [
        {
          "path": "src/app/layout.tsx",
          "purpose": "Root layout, wraps application with Auth0 UserProvider and other global contexts.",
          "securityFeatures": [
            "Strict Content Security Policy (CSP) headers",
            "Global error boundaries"
          ]
        },
        {
          "path": "src/middleware.ts",
          "purpose": "Edge middleware to protect routes based on authentication status and user role.",
          "securityFeatures": [
            "Route protection",
            "Redirects for unauthenticated users"
          ]
        },
        {
          "path": "src/app/api/auth/[...auth0]/route.ts",
          "purpose": "Auth0 Next.js SDK route handlers for login, logout, and session management.",
          "securityFeatures": [
            "CSRF protection (handled by SDK)",
            "Secure, HttpOnly cookies"
          ]
        }
      ]
    },
    "backend": {
      "framework": "Fastify (Node.js)",
      "folders": [
        "routes/",
        "plugins/",
        "services/",
        "workers/",
        "models/",
        "lib/"
      ],
      "keyFiles": [
        {
          "path": "src/server.ts",
          "purpose": "Main server entry point. Registers all plugins, routes, and starts the server.",
          "securityFeatures": [
            "Helmet for security headers",
            "CORS with strict origin allowlist",
            "Rate limiting per IP/user",
            "JWT validation plugin"
          ]
        },
        {
          "path": "src/workers/scrapingAgent.ts",
          "purpose": "Manages the agentic scraping process. Interacts with the job queue and headless browsers.",
          "securityFeatures": [
            "Strict adherence to robots.txt using 'robots-parser'",
            "User-Agent rotation and respectful request throttling",
            "Sandboxed browser environments for execution"
          ]
        },
        {
          "path": "src/plugins/auth.ts",
          "purpose": "Fastify plugin to handle JWT verification and attach user context to requests.",
          "securityFeatures": [
            "Validates JWT signature and expiry",
            "Fetches user permissions for authorization checks"
          ]
        }
      ]
    },
    "database": {
      "type": "PostgreSQL",
      "encryptionEnabled": true,
      "schema": [
        {
          "table": "users",
          "columns": [
            {"name": "id", "type": "uuid", "primary": true},
            {"name": "organization_id", "type": "uuid", "foreign_key": "organizations.id"},
            {"name": "auth0_user_id", "type": "string", "unique": true, "indexed": true},
            {"name": "email", "type": "string", "unique": true},
            {"name": "role", "type": "string"},
            {"name": "created_at", "type": "timestamp"},
            {"name": "updated_at", "type": "timestamp"}
          ]
        },
        {
          "table": "organizations",
          "columns": [
            {"name": "id", "type": "uuid", "primary": true},
            {"name": "name", "type": "string"},
            {"name": "subscription_status", "type": "string"}
          ]
        },
        {
          "table": "scrape_jobs",
          "columns": [
            {"name": "id", "type": "uuid", "primary": true},
            {"name": "user_id", "type": "uuid", "foreign_key": "users.id"},
            {"name": "status", "type": "string"},
            {"name": "query", "type": "jsonb"},
            {"name": "created_at", "type": "timestamp"}
          ]
        },
        {
          "table": "audit_logs",
          "columns": [
            {"name": "id", "type": "uuid", "primary": true},
            {"name": "user_id", "type": "uuid", "foreign_key": "users.id", "indexed": true},
            {"name": "action", "type": "string"},
            {"name": "details", "type": "jsonb"},
            {"name": "ip_address", "type": "inet"},
            {"name": "timestamp", "type": "timestamp"}
          ]
        }
      ]
    }
  },
  "deployment": {
    "platform": "AWS (ECS Fargate, RDS for PostgreSQL, S3, ElastiCache for Redis)",
    "cicd": "GitHub Actions",
    "monitoring": "Datadog"
  },
  "dependencies": {
    "frontend": [
      "next",
      "react",
      "react-dom",
      "@auth0/nextjs-auth0",
      "axios",
      "@tanstack/react-query",
      "zod",
      "jspdf"
    ],
    "backend": [
      "fastify",
      "@fastify/helmet",
      "@fastify/cors",
      "@fastify/jwt",
      "@fastify/rate-limit",
      "playwright",
      "bullmq",
      "pg",
      "langchain",
      "pdf-lib",
      "robots-parser"
    ]
  }
}
```

---

