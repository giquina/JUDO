# Official Judo Governance & Rules References

> For: University of London Judo Club Management App

---

## 1. International Judo Federation (IJF)

### Official Rules
- **IJF Sport and Organisation Rules (SOR):** https://rules.ijf.org/
- **Latest Version:** Effective January 2023 (with 2025 updates)
- **Rule Updates 2025:** https://www.ijf.org/news/show/judo-presents-the-new-rules

### What It Covers
- Official competition rules (scoring, techniques, penalties)
- Judogi specifications & requirements
- Referee rules & procedures
- Event organization standards
- Medical protocols

### Key 2025 Rule Changes
- Reintroduction of yuko score (1 point)
- Updated gripping rules
- Head use in throws allowed (except cadet events)

---

## 2. British Judo Association (BJA)

### Grading Hub
- **URL:** https://www.britishjudo.org.uk/get-started/grading/

### Kyu Grade Syllabus (Seniors)
- **PDF:** https://www.britishjudo.org.uk/wp-content/uploads/2024/11/Kyu-Grade-Syllabus-8th-November-2024.pdf
- **Last Updated:** November 2024

### Belt Progression (BJA Standard)

| Grade | Belt Color | Minimum Time to Next |
|-------|------------|---------------------|
| 6th Kyu | Red | 1 month |
| 5th Kyu | Yellow | 1 month |
| 4th Kyu | Orange | 56 days |
| 3rd Kyu | Green | 56 days |
| 2nd Kyu | Blue | 3 months |
| 1st Kyu | Brown | 3 months |
| 1st Dan | Black | Min age 15 |

### Dan Grade Requirements
- **URL:** https://www.britishjudo.org.uk/get-started/grading/dan-grades/
- Minimum age: 15 years old
- Tournament participation requirements apply

---

## 3. Scoring System

| Score | Points | Description |
|-------|--------|-------------|
| Ippon | 10 | Full point - ends match |
| Waza-ari | 7 | Near-ippon technique |
| Yuko | 1 | Minor score (reintroduced 2025) |
| Shido | Penalty | Warning/penalty |

---

## 4. Age Restrictions

| Technique Type | Minimum Age |
|---------------|-------------|
| Chokes (Shime-waza) | 13 years |
| Arm locks (Kansetsu-waza) | 16 years |
| Full competition rules | 15 years |

---

## 5. Judogi Specifications

### IJF Requirements
- **Regulations:** https://rules.ijf.org/ (Judogi section)
- Fabric weight: 650-750 g/m²
- Sleeve length: Must reach wrist when arms extended
- Belt colors must match rank

### For Club Training
- White or blue judogi required
- Belt must be correctly tied
- No jewelry or watches

---

## 6. Safety Standards

### Concussion Protocol
- **CDC Guidelines:** https://www.usjf.com/cdc-safesport/
- Immediate removal from training if suspected
- 24-hour minimum rest before return
- Graded return-to-play protocol

### British Judo Safety
- **URL:** https://www.britishjudo.org.uk/ (Safety section)
- Safeguarding procedures
- Injury prevention guidelines

---

## 7. Additional Resources

### Kodokan (Home of Judo)
- **URL:** https://www.kodokan.org/
- Official technique classifications
- History and philosophy of judo

### Wikipedia References
- **Judo Rules:** https://en.wikipedia.org/wiki/Judo_rules
- **Rank in Judo:** https://en.wikipedia.org/wiki/Rank_in_judo

---

## Implementation in App

### Belt Progression Tracking
Reference: `src/lib/judo-constants.ts`
- Uses BJA belt colors and progression
- Tracks time between grades
- Enforces minimum requirements

### Safety Features
- Concussion incident reporting
- Age-appropriate technique filtering
- Return-to-play tracking

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Sources:** IJF, BJA, CDC, Kodokan
