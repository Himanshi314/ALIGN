<p align="center">
  <img src="https://img.shields.io/badge/ALIGN-Performance%20Command%20Center-1F1F1F?style=for-the-badge&labelColor=C6A969&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI2IiBmaWxsPSIjMUYxRjFGIi8+PHRleHQgeD0iNyIgeT0iMTgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiPkE8L3RleHQ+PC9zdmc+" alt="ALIGN" />
</p>

<h1 align="center">ALIGN</h1>
<p align="center">
  <strong>Where Goals Become Measurable Momentum</strong>
</p>

<p align="center">
  A premium <b>Performance Command Center</b> for strategic goal setting, quarterly tracking, and organizational alignment — built for the <b>AtomQuest Hackathon</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-6.2-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/NextAuth-5.0-000000?style=flat-square" alt="NextAuth" />
  <img src="https://img.shields.io/badge/Recharts-2.15-22B5BF?style=flat-square" alt="Recharts" />
  <img src="https://img.shields.io/badge/Framer%20Motion-11-FF0055?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

---

## ✨ What is ALIGN?

ALIGN is not another boring HR dashboard. It's a **strategic alignment platform** designed to feel like a funded startup product — with the polish of Linear, the clarity of Notion, and the spacing of Apple.

Built for high-performance organizations where goals aren't just set — they're **measured, tracked, predicted, and achieved**.

### 🎯 The Problem

Traditional goal-setting tools are cluttered, generic, and disconnected from real performance. Managers lose visibility, employees lose motivation, and leadership loses alignment.

### 💡 The Solution

ALIGN brings **AI-powered intelligence**, **real-time sync**, and **enterprise-grade analytics** into a single, beautiful interface that teams actually want to use.

---

## 🖼️ Preview

| Landing Page | Login |
|:---:|:---:|
| Hero with animated gold accents & floating AI insight card | Split layout with one-click role switching |

| Pulse AI Dashboard | Manager Review |
|:---:|:---:|
| Animated score ring with severity-graded insights | Expandable team cards with approve/return workflow |

| Analytics Hub | Admin Console |
|:---:|:---:|
| QoQ trends, radar charts, heatmaps | Cycle management, audit logs, org tree |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                 │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │
│  │ Employee │  │ Manager  │  │  Admin  │  │ Pulse AI │  │
│  │  Portal  │  │  Portal  │  │ Console │  │  Engine  │  │
│  └────┬─────┘  └────┬─────┘  └────┬────┘  └────┬─────┘  │
│       │              │             │             │        │
│  ┌────┴──────────────┴─────────────┴─────────────┴────┐  │
│  │              API Routes (8 endpoints)               │  │
│  └────────────────────────┬────────────────────────────┘  │
│                           │                               │
│  ┌────────────────────────┴────────────────────────────┐  │
│  │         SQLite + Prisma ORM (7 models)              │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Himanshi314/ALIGN.git
cd ALIGN

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Or create .env with:
#   DATABASE_URL="file:./dev.db"
#   AUTH_SECRET="any-secret-key"
#   NEXTAUTH_URL="http://localhost:3000"

# Create database & seed demo data
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Open **http://localhost:3000** and you're ready to go.

---

## 🔐 Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 👨‍💼 Employee | `employee@align.io` | `demo123` | Goal creation, check-ins, progress tracking |
| 👩‍💼 Manager | `manager@align.io` | `demo123` | Team review, approve/return, shared goals |
| 🛡️ Admin | `admin@align.io` | `demo123` | Cycles, audit logs, reports, org hierarchy |

> Additional employees: `neha@align.io`, `vikram@align.io` (same password)

---

## ⚡ Features

### 📋 Employee Portal
- **Goal Sheet Creation** — Structured form with thrust area selection, UoM picker, and real-time weightage bar
- **Validation Rules** — Total weightage must equal 100%, minimum 10% per goal, maximum 8 goals
- **Quarterly Check-ins** — Planned vs. achieved tracking with status selector and comments
- **Progress Visualization** — Color-coded progress bars and completion percentages

### 👥 Manager Portal
- **Team Review Dashboard** — Expandable cards showing each team member's goals
- **Inline Editing** — Modify targets and weightage before approving
- **Approve / Return** — One-click approval or return with mandatory comments
- **Check-in Oversight** — Planned vs. achievement comparison across the team
- **Shared Goals Push** — Create objectives that auto-sync across team members

### 🛡️ Admin Portal
- **Cycle Management** — Create, activate, lock, and complete performance cycles
- **Audit Logs** — Complete trail of every action with color-coded action badges
- **Reports & Export** — Department-wise completion rates with one-click CSV export
- **Organization Hierarchy** — Visual tree of manager-report relationships

### 🧠 Pulse AI — The WOW Factor
An intelligent insights engine that:
- 🔴 **Detects at-risk goals** trending below achievement targets
- ⚖️ **Suggests weightage optimization** for completed high-weight goals
- ⏰ **Flags delayed approvals** pending beyond SLA thresholds
- 📈 **Predicts quarterly performance** using trend analysis
- 📊 **Generates smart summaries** with natural-language insights

Visual features include an animated **Pulse Score** ring (0–100) and a color-coded **Escalation Timeline**.

### 📊 Analytics Hub
- **QoQ Achievement Trends** — Area chart tracking performance over quarters
- **Department Radar** — Spider chart showing performance across thrust areas
- **Team Completion Rates** — Bar chart comparing individual completion
- **Achievement Heatmap** — Color-intensity grid showing monthly progress
- **Manager Effectiveness** — Metrics on approval time, review rates, team completion

### 🔗 Shared Goal Sync Engine
When a primary goal owner updates their achievement, **all linked copies auto-sync** across employees. Visual indicators show sync status and last update timestamps.

### 🔔 Notification Center
Microsoft Teams-style slide-in panel with:
- Grouped notifications (Approvals, Pulse, Escalations, Sync)
- Unread count badges
- Mark all as read
- Click-to-navigate

---

## 🎨 Design System

ALIGN uses a meticulously crafted design system inspired by Linear, Notion, and Vercel:

| Token | Hex | Usage |
|-------|-----|-------|
| Ivory | `#F8F7F4` | Background |
| Ivory Warm | `#F3F1EC` | Card surfaces |
| Graphite | `#1F1F1F` | Primary text |
| Gold | `#C6A969` | Accents, CTAs |
| Sage | `#7A8F6A` | Success, completion |
| Rose | `#C27070` | Danger, at-risk |

**Typography**: Outfit (headings) · Inter (body) · JetBrains Mono (metrics)

**Principles**: Whitespace-heavy · 16px border radius · Subtle shadows · Glassmorphism · Smooth 300ms transitions

---

## 🗂️ Project Structure

```
ALIGN/
├── prisma/
│   ├── schema.prisma          # 7 models — User, Cycle, GoalSheet, Goal, Checkin, AuditLog, Notification
│   └── seed.ts                # 5 users, cycles, goals, check-ins, audit logs, notifications
├── src/
│   ├── app/
│   │   ├── page.tsx           # ✨ Animated landing page
│   │   ├── layout.tsx         # Root layout with Google Fonts
│   │   ├── globals.css        # Design system tokens & components
│   │   ├── login/             # Auth page with quick-access buttons
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx     # Sidebar + topbar + notification center
│   │   │   ├── employee/      # Dashboard, goals (CRUD), check-ins
│   │   │   ├── manager/       # Dashboard, review, check-ins, shared goals
│   │   │   ├── admin/         # Dashboard, cycles, audit, reports, org
│   │   │   ├── analytics/     # Recharts hub (5 chart types)
│   │   │   └── pulse/         # AI intelligence dashboard
│   │   └── api/
│   │       ├── goals/         # CRUD + validation + approval workflow
│   │       ├── checkins/      # Check-in submission + shared goal sync
│   │       ├── pulse/         # AI insight generation engine
│   │       ├── cycles/        # Cycle CRUD (admin)
│   │       ├── audit/         # Paginated audit logs
│   │       ├── dashboard/     # Role-based dashboard data
│   │       └── notifications/ # Fetch + mark-as-read
│   ├── lib/
│   │   ├── auth.ts            # NextAuth v5 config (Credentials + JWT)
│   │   ├── prisma.ts          # Client singleton
│   │   └── utils.ts           # Helpers, constants, color maps
│   ├── components/
│   │   └── providers.tsx      # Session provider wrapper
│   └── middleware.ts          # Route protection + role-based redirects
├── .env                       # Environment variables (not committed)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | Server components, API routes, file-based routing |
| **Language** | TypeScript (strict) | Type safety across the full stack |
| **Styling** | Tailwind CSS v4 | Utility-first with custom design tokens |
| **Animations** | Framer Motion | Smooth page transitions & micro-interactions |
| **Database** | SQLite via Prisma | Zero-config, portable, instant setup |
| **Auth** | NextAuth.js v5 | JWT sessions, role-based access, middleware |
| **Charts** | Recharts | Area, bar, radar charts with custom tooltips |
| **Icons** | Lucide React | Consistent, lightweight icon set |
| **Typography** | Google Fonts | Outfit + Inter + JetBrains Mono |

---

## 📦 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/goals` | Get user's goal sheets |
| `POST` | `/api/goals` | Create goal sheet with validation |
| `GET` | `/api/goals/[id]` | Get goal sheet detail |
| `PATCH` | `/api/goals/[id]` | Approve / return / submit / edit goals |
| `POST` | `/api/checkins` | Submit check-in + auto-sync shared goals |
| `GET` | `/api/pulse` | Generate AI insights + pulse score |
| `GET/POST/PATCH` | `/api/cycles` | Cycle CRUD (admin only) |
| `GET` | `/api/audit` | Paginated audit logs |
| `GET` | `/api/dashboard` | Role-based dashboard data |
| `GET/PATCH` | `/api/notifications` | Fetch / mark-all-read |

---

## 📐 Database Schema

```
User ──────────┐
  │             │ (managerId → self-referencing)
  │             │
  ├── GoalSheet ┤
  │     │       │
  │     ├── Goal ┤
  │     │    │   │ (sharedSourceId → self-referencing)
  │     │    │   │
  │     │    └── Checkin
  │     │
  │     └── Cycle
  │
  ├── AuditLog
  └── Notification
```

**7 models** with full relational integrity, cascading deletes, and self-referencing relations for org hierarchy and shared goals.

---

## 🧪 Validation Rules

| Rule | Enforcement |
|------|-------------|
| Total weightage = 100% | Server-side + client-side real-time bar |
| Minimum per goal = 10% | Server-side validation |
| Maximum goals = 8 | Client-side limit + server check |
| UoM required | Numeric / Percentage / Timeline / Zero-Based |
| Approval flow | DRAFT → SUBMITTED → APPROVED / RETURNED |

---

## 📄 Available Scripts

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
npm run db:push    # Push Prisma schema to database
npm run db:seed    # Seed demo data
npm run db:reset   # Reset database + re-seed
```

---

## 🏆 Built For

**AtomQuest Hackathon 2025** — In-House Goal Setting & Tracking Portal

This is not a college project. This is a **production-grade SaaS product** designed to win.

---

<p align="center">
  <sub>Built with precision by <b>Himanshi</b> · AtomQuest 2025</sub>
</p>
