import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ALIGN database...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.goalSheet.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.user.deleteMany();

  const pw = await hash("demo123", 12);

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "admin@align.io",
      password: pw,
      name: "Arjun Mehta",
      role: "ADMIN",
      department: "Human Resources",
      designation: "Chief People Officer",
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@align.io",
      password: pw,
      name: "Priya Sharma",
      role: "MANAGER",
      department: "Engineering",
      designation: "Engineering Director",
    },
  });

  const emp1 = await prisma.user.create({
    data: {
      email: "employee@align.io",
      password: pw,
      name: "Rahul Kapoor",
      role: "EMPLOYEE",
      department: "Engineering",
      designation: "Senior Software Engineer",
      managerId: manager.id,
    },
  });

  const emp2 = await prisma.user.create({
    data: {
      email: "neha@align.io",
      password: pw,
      name: "Neha Gupta",
      role: "EMPLOYEE",
      department: "Engineering",
      designation: "Product Designer",
      managerId: manager.id,
    },
  });

  const emp3 = await prisma.user.create({
    data: {
      email: "vikram@align.io",
      password: pw,
      name: "Vikram Singh",
      role: "EMPLOYEE",
      department: "Engineering",
      designation: "DevOps Engineer",
      managerId: manager.id,
    },
  });

  // Create cycle
  const cycle = await prisma.cycle.create({
    data: {
      name: "FY 2025-26",
      quarter: "Q1",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      status: "ACTIVE",
    },
  });

  const cycle2 = await prisma.cycle.create({
    data: {
      name: "FY 2025-26",
      quarter: "Q2",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-09-30"),
      status: "DRAFT",
    },
  });

  // Employee 1: Approved goal sheet with check-ins
  const gs1 = await prisma.goalSheet.create({
    data: {
      userId: emp1.id,
      cycleId: cycle.id,
      status: "APPROVED",
      submittedAt: new Date("2025-04-05"),
      approvedAt: new Date("2025-04-07"),
    },
  });

  const g1 = await prisma.goal.create({
    data: {
      goalSheetId: gs1.id,
      thrustArea: "Revenue Growth",
      title: "Increase API throughput by 40%",
      description: "Optimize backend microservices to handle 40% more concurrent requests, improving platform scalability for enterprise clients.",
      uom: "PERCENTAGE",
      target: 40,
      weightage: 30,
      achievement: 28,
      progressStatus: "ON_TRACK",
    },
  });

  const g2 = await prisma.goal.create({
    data: {
      goalSheetId: gs1.id,
      thrustArea: "Innovation",
      title: "Launch real-time collaboration engine",
      description: "Design and deploy a WebSocket-based real-time collaboration feature enabling multi-user document editing.",
      uom: "TIMELINE",
      target: 1,
      weightage: 25,
      achievement: 0.6,
      progressStatus: "ON_TRACK",
    },
  });

  const g3 = await prisma.goal.create({
    data: {
      goalSheetId: gs1.id,
      thrustArea: "Customer Success",
      title: "Reduce P1 bug resolution time",
      description: "Bring down average P1 resolution time from 48 hours to under 24 hours through automated triage and dedicated on-call process.",
      uom: "NUMERIC",
      target: 24,
      weightage: 20,
      achievement: 22,
      progressStatus: "COMPLETED",
    },
  });

  const sharedGoal = await prisma.goal.create({
    data: {
      goalSheetId: gs1.id,
      thrustArea: "Operational Excellence",
      title: "Achieve 99.9% platform uptime",
      description: "Implement monitoring, alerting, and redundancy measures to maintain 99.9% SLA across all production services.",
      uom: "PERCENTAGE",
      target: 99.9,
      weightage: 15,
      isShared: true,
      achievement: 99.7,
      progressStatus: "ON_TRACK",
    },
  });

  const g5 = await prisma.goal.create({
    data: {
      goalSheetId: gs1.id,
      thrustArea: "People & Culture",
      title: "Mentor 2 junior engineers",
      description: "Provide structured mentorship to 2 junior team members, including weekly 1:1s, code reviews, and career development planning.",
      uom: "NUMERIC",
      target: 2,
      weightage: 10,
      achievement: 2,
      progressStatus: "COMPLETED",
    },
  });

  // Check-ins for employee 1
  await prisma.checkin.createMany({
    data: [
      { goalId: g1.id, userId: emp1.id, quarter: "Q1-M1", planned: 10, achieved: 8, status: "ON_TRACK", comment: "Initial optimization phase completed. Identified 3 key bottlenecks in the API gateway." },
      { goalId: g1.id, userId: emp1.id, quarter: "Q1-M2", planned: 25, achieved: 20, status: "ON_TRACK", comment: "Database query optimization yielded 15% improvement. Working on caching layer next.", managerNote: "Good progress. Focus on Redis caching for the next phase." },
      { goalId: g1.id, userId: emp1.id, quarter: "Q1-M3", planned: 40, achieved: 28, status: "ON_TRACK", comment: "Caching layer deployed. Load testing shows 28% improvement so far." },
      { goalId: g2.id, userId: emp1.id, quarter: "Q1-M1", planned: 0.3, achieved: 0.2, status: "ON_TRACK", comment: "Architecture design completed. WebSocket protocol selected." },
      { goalId: g2.id, userId: emp1.id, quarter: "Q1-M2", planned: 0.6, achieved: 0.4, status: "AT_RISK", comment: "Core engine built. Facing challenges with conflict resolution.", managerNote: "Consider using CRDT approach. Schedule a design review session." },
      { goalId: g2.id, userId: emp1.id, quarter: "Q1-M3", planned: 0.8, achieved: 0.6, status: "ON_TRACK", comment: "CRDT implemented. Beta testing with internal team started." },
      { goalId: g3.id, userId: emp1.id, quarter: "Q1-M1", planned: 36, achieved: 32, status: "ON_TRACK", comment: "Automated triage system deployed for initial classification." },
      { goalId: g3.id, userId: emp1.id, quarter: "Q1-M3", planned: 24, achieved: 22, status: "COMPLETED", comment: "Target achieved! Average P1 resolution now at 22 hours." },
    ],
  });

  // Employee 2: Submitted goal sheet (pending approval)
  const gs2 = await prisma.goalSheet.create({
    data: {
      userId: emp2.id,
      cycleId: cycle.id,
      status: "SUBMITTED",
      submittedAt: new Date("2025-04-10"),
    },
  });

  await prisma.goal.createMany({
    data: [
      { goalSheetId: gs2.id, thrustArea: "Customer Success", title: "Redesign user onboarding flow", description: "Create an intuitive, step-by-step onboarding experience that reduces time-to-value for new users by 50%.", uom: "PERCENTAGE", target: 50, weightage: 30, progressStatus: "NOT_STARTED" },
      { goalSheetId: gs2.id, thrustArea: "Innovation", title: "Design system component library", description: "Build a comprehensive Figma + code component library with 40+ reusable components following our brand guidelines.", uom: "NUMERIC", target: 40, weightage: 25, progressStatus: "NOT_STARTED" },
      { goalSheetId: gs2.id, thrustArea: "Revenue Growth", title: "Enterprise dashboard redesign", description: "Redesign the analytics dashboard for enterprise clients with advanced data visualization and customization options.", uom: "TIMELINE", target: 1, weightage: 25, progressStatus: "NOT_STARTED" },
      { goalSheetId: gs2.id, thrustArea: "People & Culture", title: "Conduct UX research workshops", description: "Lead 4 cross-functional UX research workshops to build a user-centric culture across product and engineering teams.", uom: "NUMERIC", target: 4, weightage: 20, progressStatus: "NOT_STARTED" },
    ],
  });

  // Employee 3: Draft + shared goal copy
  const gs3 = await prisma.goalSheet.create({
    data: {
      userId: emp3.id,
      cycleId: cycle.id,
      status: "APPROVED",
      submittedAt: new Date("2025-04-06"),
      approvedAt: new Date("2025-04-08"),
    },
  });

  await prisma.goal.createMany({
    data: [
      { goalSheetId: gs3.id, thrustArea: "Operational Excellence", title: "Achieve 99.9% platform uptime", description: "Implement monitoring, alerting, and redundancy measures to maintain 99.9% SLA across all production services.", uom: "PERCENTAGE", target: 99.9, weightage: 30, isShared: true, sharedSourceId: sharedGoal.id, achievement: 99.7, progressStatus: "ON_TRACK" },
      { goalSheetId: gs3.id, thrustArea: "Innovation", title: "Implement GitOps CI/CD pipeline", description: "Migrate from manual deployments to a fully automated GitOps pipeline using ArgoCD, reducing deployment time by 70%.", uom: "PERCENTAGE", target: 70, weightage: 25, achievement: 55, progressStatus: "ON_TRACK" },
      { goalSheetId: gs3.id, thrustArea: "Operational Excellence", title: "Zero-downtime migration to K8s", description: "Migrate 12 production services from VMs to Kubernetes with zero downtime during the transition.", uom: "NUMERIC", target: 12, weightage: 25, achievement: 8, progressStatus: "ON_TRACK" },
      { goalSheetId: gs3.id, thrustArea: "People & Culture", title: "Create DevOps runbook library", description: "Document 20 operational runbooks covering incident response, scaling procedures, and disaster recovery.", uom: "NUMERIC", target: 20, weightage: 20, achievement: 14, progressStatus: "ON_TRACK" },
    ],
  });

  // Audit logs
  await prisma.auditLog.createMany({
    data: [
      { userId: emp1.id, action: "GOAL_SHEET_CREATED", entity: "GoalSheet", entityId: gs1.id, details: JSON.stringify({ status: "DRAFT" }) },
      { userId: emp1.id, action: "GOAL_SHEET_SUBMITTED", entity: "GoalSheet", entityId: gs1.id, details: JSON.stringify({ status: "SUBMITTED", goalsCount: 5 }) },
      { userId: manager.id, action: "GOAL_SHEET_APPROVED", entity: "GoalSheet", entityId: gs1.id, details: JSON.stringify({ status: "APPROVED", employeeName: "Rahul Kapoor" }) },
      { userId: emp2.id, action: "GOAL_SHEET_CREATED", entity: "GoalSheet", entityId: gs2.id, details: JSON.stringify({ status: "DRAFT" }) },
      { userId: emp2.id, action: "GOAL_SHEET_SUBMITTED", entity: "GoalSheet", entityId: gs2.id, details: JSON.stringify({ status: "SUBMITTED", goalsCount: 4 }) },
      { userId: emp3.id, action: "GOAL_SHEET_CREATED", entity: "GoalSheet", entityId: gs3.id, details: JSON.stringify({ status: "DRAFT" }) },
      { userId: emp3.id, action: "GOAL_SHEET_SUBMITTED", entity: "GoalSheet", entityId: gs3.id, details: JSON.stringify({ status: "SUBMITTED", goalsCount: 4 }) },
      { userId: manager.id, action: "GOAL_SHEET_APPROVED", entity: "GoalSheet", entityId: gs3.id, details: JSON.stringify({ status: "APPROVED", employeeName: "Vikram Singh" }) },
      { userId: emp1.id, action: "CHECKIN_SUBMITTED", entity: "Goal", entityId: g1.id, details: JSON.stringify({ quarter: "Q1-M1", achieved: 8 }) },
      { userId: emp1.id, action: "CHECKIN_SUBMITTED", entity: "Goal", entityId: g1.id, details: JSON.stringify({ quarter: "Q1-M2", achieved: 20 }) },
      { userId: admin.id, action: "CYCLE_CREATED", entity: "Cycle", entityId: cycle.id, details: JSON.stringify({ name: "FY 2025-26", quarter: "Q1" }) },
    ],
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { userId: manager.id, title: "Goal Sheet Pending", message: "Neha Gupta has submitted her goal sheet for Q1 review.", type: "approval", link: "/manager/review" },
      { userId: manager.id, title: "Check-in Due", message: "3 team members have pending quarterly check-ins.", type: "escalation", link: "/manager/checkins" },
      { userId: emp1.id, title: "Goal Approved", message: "Your Q1 goal sheet has been approved by Priya Sharma.", type: "approval", link: "/employee/goals", read: true },
      { userId: emp1.id, title: "Pulse Insight", message: "Your API throughput goal is trending 12% below target. Consider reallocating effort.", type: "pulse", link: "/pulse" },
      { userId: emp2.id, title: "Awaiting Approval", message: "Your goal sheet is pending manager review.", type: "approval", link: "/employee/goals" },
      { userId: admin.id, title: "Escalation Alert", message: "1 goal sheet has been pending approval for 7 days.", type: "escalation", link: "/admin" },
      { userId: admin.id, title: "Cycle Update", message: "Q1 cycle ends in 15 days. 1 of 3 goal sheets still pending.", type: "escalation", link: "/admin/cycles" },
      { userId: emp3.id, title: "Shared Goal Updated", message: "Platform uptime goal has been synced — 99.7% achieved.", type: "sync", link: "/employee/goals" },
    ],
  });

  console.log("✅ Seed complete!");
  console.log("   👤 Admin:    admin@align.io / demo123");
  console.log("   👤 Manager:  manager@align.io / demo123");
  console.log("   👤 Employee: employee@align.io / demo123");
  console.log("   👤 Employee: neha@align.io / demo123");
  console.log("   👤 Employee: vikram@align.io / demo123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
