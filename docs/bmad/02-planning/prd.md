# True Valence Mapper - Product Requirements Document
*BMAD Phase 2: Planning*
*Date: November 22, 2025*
*Product Manager: John*
*Client: ProActive ReSolutions Inc.*

## 1. Product Overview

### 1.1 Product Name
**True Valence Mapper** - A ProActive ReSolutions Digital Tool

### 1.2 Product Purpose
True Valence Mapper is a proprietary digital platform that enables ProActive Certified Coaches to visualize, assess, and improve their clients' workplace relationships using the ProActive Workplace Fundamentals methodology.

### 1.3 Problem Statement
ProActive Certified Coaches need a digital tool that:
- Embodies ProActive methodology in every interaction
- Provides consistent application of ProActive principles
- Enables measurable relationship improvements
- Strengthens the value of ProActive certification

### 1.4 Target Users

| User Type | Description | Volume |
|-----------|-------------|--------|
| **Primary** | ProActive Certified Coaches | ~200 active |
| **Secondary** | Coaching clients (Coachees) | ~3,000-4,000 |
| **Tertiary** | ProActive trainers & administrators | ~20 |

## 2. Core Requirements

### 2.1 Functional Requirements

#### FR1: Authentication & Access Control
**WHY:** Maintain exclusivity for ProActive Certified Coaches

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1.1 | System SHALL authenticate users against ProActive certification database | P0 |
| FR1.2 | System SHALL restrict access to active ProActive Certified Coaches only | P0 |
| FR1.3 | System SHALL support coach-client invitation system | P0 |
| FR1.4 | System SHALL enforce role-based permissions (Coach vs Coachee) | P0 |

#### FR2: Relationship Mapping
**WHY:** Visualize the invisible network of workplace relationships

| ID | Requirement | Priority |
|----|-------------|----------|
| FR2.1 | System SHALL allow creation of relationship nodes | P0 |
| FR2.2 | System SHALL categorize relationships per ProActive framework | P0 |
| FR2.3 | System SHALL display interactive network visualization | P0 |
| FR2.4 | System SHALL support 50+ relationships per map | P1 |
| FR2.5 | System SHALL enable relationship grouping/clustering | P2 |

**ProActive Relationship Categories:**
- Direct Report
- Manager/Supervisor
- Peer/Colleague
- Cross-functional Partner
- Internal Client
- External Stakeholder
- Mentor/Advisor

#### FR3: Valence Assessment
**WHY:** Measure relationship quality using ProActive metrics

| ID | Requirement | Priority |
|----|-------------|----------|
| FR3.1 | System SHALL capture multi-dimensional valence scores | P0 |
| FR3.2 | System SHALL use ProActive's 5-dimension model | P0 |
| FR3.3 | System SHALL calculate composite relationship health score | P0 |
| FR3.4 | System SHALL provide visual encoding (color/size) for valence | P0 |

**ProActive Valence Dimensions:**
1. **Trust Level** (-5 to +5)
2. **Communication Quality** (-5 to +5)
3. **Mutual Support** (-5 to +5)
4. **Professional Respect** (-5 to +5)
5. **Goal Alignment** (-5 to +5)

#### FR4: Progress Tracking
**WHY:** Demonstrate measurable improvement over time

| ID | Requirement | Priority |
|----|-------------|----------|
| FR4.1 | System SHALL capture relationship snapshots at each session | P0 |
| FR4.2 | System SHALL display change over time | P1 |
| FR4.3 | System SHALL highlight improvements and degradations | P1 |
| FR4.4 | System SHALL generate progress reports | P1 |

#### FR5: ProActive Methodology Integration
**WHY:** Ensure methodology fidelity and consistent application

| ID | Requirement | Priority |
|----|-------------|----------|
| FR5.1 | System SHALL embed ProActive reflection prompts | P0 |
| FR5.2 | System SHALL guide users through ProActive assessment process | P0 |
| FR5.3 | System SHALL provide ProActive action planning templates | P1 |
| FR5.4 | System SHALL include ProActive best practices tooltips | P1 |

### 2.2 Non-Functional Requirements

#### NFR1: Performance
| ID | Requirement | Target |
|----|-------------|--------|
| NFR1.1 | Page load time | < 2 seconds |
| NFR1.2 | Visualization render time | < 1 second |
| NFR1.3 | Concurrent users supported | 500 |

#### NFR2: Security & Privacy
| ID | Requirement | Standard |
|----|-------------|----------|
| NFR2.1 | Data encryption at rest | AES-256 |
| NFR2.2 | Data encryption in transit | TLS 1.3 |
| NFR2.3 | GDPR compliance | Full |
| NFR2.4 | Coach-client data isolation | Complete |

#### NFR3: Usability
| ID | Requirement | Metric |
|----|-------------|--------|
| NFR3.1 | Time to complete first map | < 10 minutes |
| NFR3.2 | User satisfaction score | > 4.5/5 |
| NFR3.3 | Mobile responsive | Yes |
| NFR3.4 | Accessibility | WCAG 2.1 AA |

## 3. User Stories

### 3.1 Epic: Coach Onboarding
**As a** ProActive Certified Coach
**I want to** quickly set up my coaching practice on the platform
**So that** I can start using ProActive tools with my clients immediately

#### Stories:
```
US1.1: As a coach, I want to verify my ProActive certification
US1.2: As a coach, I want to create my coach profile
US1.3: As a coach, I want to invite my first client
US1.4: As a coach, I want to access ProActive training materials
```

### 3.2 Epic: Relationship Mapping Session
**As a** ProActive Certified Coach
**I want to** guide my client through relationship mapping
**So that** we can identify relationship patterns and opportunities

#### Stories:
```
US2.1: As a coach, I want to create a new mapping session
US2.2: As a coach, I want to add relationships using ProActive categories
US2.3: As a coach, I want to assess each relationship's valence
US2.4: As a coach, I want to identify key relationship insights
US2.5: As a coach, I want to save session snapshot for tracking
```

### 3.3 Epic: Coachee Self-Reflection
**As a** coaching client
**I want to** reflect on my relationships between sessions
**So that** I can apply ProActive principles independently

#### Stories:
```
US3.1: As a coachee, I want to access my relationship map
US3.2: As a coachee, I want to update relationship status
US3.3: As a coachee, I want to add reflection notes
US3.4: As a coachee, I want to track my action items
```

### 3.4 Epic: Progress Measurement
**As a** ProActive Certified Coach
**I want to** demonstrate relationship improvements
**So that** I can show ROI of ProActive coaching

#### Stories:
```
US4.1: As a coach, I want to compare snapshots over time
US4.2: As a coach, I want to generate progress reports
US4.3: As a coach, I want to export visualizations
US4.4: As a coach, I want to celebrate client wins
```

## 4. Acceptance Criteria

### 4.1 Definition of Done
A feature is complete when:
- [ ] All acceptance criteria are met
- [ ] ProActive methodology alignment verified
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass
- [ ] Security review completed
- [ ] Accessibility audit passed
- [ ] Documentation updated
- [ ] ProActive trainer approval received

### 4.2 Feature-Level Acceptance Criteria

#### AC: Relationship Creation
```gherkin
GIVEN I am a ProActive Certified Coach
WHEN I create a new relationship
THEN I must select from ProActive relationship categories
AND I must complete all 5 valence dimensions
AND the relationship appears on the visual map
AND the composite health score is calculated
```

#### AC: Valence Assessment
```gherkin
GIVEN I am assessing a relationship
WHEN I score each ProActive dimension
THEN scores range from -5 to +5
AND visual indicators update in real-time
AND composite score uses ProActive weighting algorithm
AND guidance text reflects ProActive principles
```

#### AC: Progress Tracking
```gherkin
GIVEN I have multiple session snapshots
WHEN I view progress over time
THEN I see trend lines for each relationship
AND improvements are highlighted in green
AND degradations are highlighted in amber
AND ProActive success metrics are calculated
```

## 5. MVP Scope

### 5.1 Release 1.0 (Months 1-3)
**Theme:** Core ProActive Coaching Workflow

**Included:**
- ProActive coach authentication
- Basic relationship mapping (up to 30 relationships)
- 5-dimension valence assessment
- Session snapshot capability
- Coach-client sharing
- Basic visualization (force-directed graph)
- ProActive reflection prompts

**Explicitly Excluded:**
- Progress tracking over time
- Report generation
- Mobile app
- API access
- Bulk operations
- AI recommendations

### 5.2 Release 1.1 (Months 4-6)
**Theme:** Progress & Insights

**Planned Additions:**
- Temporal tracking
- Progress visualization
- Basic reporting
- Export capabilities
- ProActive action templates

### 5.3 Release 2.0 (Months 7-12)
**Theme:** Scale & Enterprise

**Future Considerations:**
- Enterprise features
- Aggregate analytics
- Mobile apps
- API platform
- ProActive AI coach assistant

## 6. Success Metrics

### 6.1 Business Metrics
| Metric | Target (6 months) | Measurement |
|--------|------------------|-------------|
| Coach adoption | 80% of active coaches | Unique coach logins |
| Client engagement | 70% weekly active | Coachee login frequency |
| Session completion | 90% completion rate | Maps with full assessment |
| Certification value | 20% increase in renewal | Coach survey |

### 6.2 Product Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first map | < 10 minutes | Session analytics |
| Relationships per map | Average 15-20 | Database query |
| Return usage | 85% return within 7 days | Cohort analysis |
| NPS Score | > 50 | Quarterly survey |

### 6.3 ProActive Methodology Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Methodology adherence | 95% use ProActive categories | Feature usage |
| Complete assessments | 90% fill all 5 dimensions | Completion rate |
| Action plan creation | 60% create action plans | Template usage |
| Principle application | 80% use reflection prompts | Engagement tracking |

## 7. Technical Architecture (High-Level)

### 7.1 Technology Stack Recommendation
- **Frontend:** React with TypeScript
- **Visualization:** D3.js for network graphs
- **Backend:** Node.js with Express
- **Database:** PostgreSQL for relational data
- **Authentication:** Integration with ProActive SSO
- **Hosting:** AWS with auto-scaling
- **Security:** End-to-end encryption

### 7.2 Integration Points
- ProActive certification database (verify coach status)
- ProActive learning management system (training materials)
- ProActive CRM (client management)
- Email service (notifications)
- Calendar systems (session scheduling)

## 8. Risks & Dependencies

### 8.1 Dependencies
| Dependency | Owner | Status |
|------------|-------|--------|
| ProActive certification API | ProActive IT | Required |
| ProActive methodology documentation | ProActive Training | Required |
| Coach training materials | ProActive Training | Required |
| Brand guidelines | ProActive Marketing | Required |

### 8.2 Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Low coach adoption | High | Medium | Pilot program with champions |
| Technical complexity | Medium | Low | Phased rollout |
| Methodology drift | High | Low | ProActive trainer review |
| Data privacy concerns | High | Medium | Zero-knowledge architecture option |

## 9. Open Questions

1. **Pricing Model:** Include in certification or separate subscription?
2. **Data Retention:** How long to keep historical snapshots?
3. **Offline Access:** Support offline mode for coaches?
4. **Customization:** Allow enterprise clients to add custom dimensions?
5. **Language Support:** Internationalization requirements?

## 10. Appendices

### Appendix A: ProActive Workplace Fundamentals Principles
1. Awareness before Action
2. Intentional Relationship Building
3. Reflective Practice
4. Measurable Progress
5. Sustainable Change

### Appendix B: Competitive Differentiation
True Valence Mapper is the ONLY tool that:
- Requires ProActive certification for access
- Embeds ProActive methodology in every feature
- Uses ProActive's 5-dimension valence model
- Integrates with ProActive training ecosystem
- Provides ProActive-specific success metrics

---

*"The WHY is clear: ProActive coaches need a tool that embodies their methodology. Every feature serves that purpose."*
*- John, BMAD Product Manager*
*For: ProActive ReSolutions Inc.*