import { PrismaClient, AnnouncementType, SessionType, ResourceType, InterviewFormat, InterviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with comprehensive test data...');

  // 1. Admin Account
  const adminEmail = "admin@gurukul-test.com"; // TODO: Replace with real admin emails
  await prisma.adminEmail.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true, status: 'ACTIVE' },
    create: { email: adminEmail, name: "Admin User", userType: 'STAFF', isAdmin: true, status: 'ACTIVE' },
  });

  // 2. Students
  const students = [
    // IPMX
    { email: "priya.ipmx@gurukul-test.com", name: "Priya Sharma", programme: "IPMX", currentRole: "VP Strategy", company: "McKinsey", industry: "Consulting", active: true },
    { email: "rohit.ipmx@gurukul-test.com", name: "Rohit Agarwal", programme: "IPMX", currentRole: "Director Ops", company: "Infosys", industry: "Technology", active: true },
    { email: "deepa.ipmx@gurukul-test.com", name: "Deepa Krishnan", programme: "IPMX", currentRole: "CFO", company: "HDFC Bank", industry: "Finance", active: true },
    { email: "manish.ipmx@gurukul-test.com", name: "Manish Gupta", programme: "IPMX", currentRole: null, company: null, industry: null, active: false },
    // PGPSM
    { email: "ananya.pgpsm@gurukul-test.com", name: "Ananya Iyer", programme: "PGPSM", currentRole: "Sustainability Lead", company: "Tata Steel", industry: "Manufacturing", active: true },
    { email: "karan.pgpsm@gurukul-test.com", name: "Karan Mehta", programme: "PGPSM", currentRole: "ESG Analyst", company: "EY", industry: "Consulting", active: true },
    { email: "pooja.pgpsm@gurukul-test.com", name: "Pooja Nair", programme: "PGPSM", currentRole: "Programme Manager", company: "UNDP", industry: "Government", active: true },
    { email: "siddharth.pgpsm@gurukul-test.com", name: "Siddharth Roy", programme: "PGPSM", currentRole: null, company: null, industry: null, active: false },
    // PGPWE
    { email: "vikram.pgpwe@gurukul-test.com", name: "Vikram Malhotra", programme: "PGPWE", currentRole: "Senior Manager", company: "Deloitte", industry: "Consulting", active: true },
    { email: "neha.pgpwe@gurukul-test.com", name: "Neha Joshi", programme: "PGPWE", currentRole: "Product Manager", company: "Flipkart", industry: "Technology", active: true },
    { email: "amit.pgpwe@gurukul-test.com", name: "Amit Saxena", programme: "PGPWE", currentRole: "Regional Head", company: "Asian Paints", industry: "FMCG", active: true },
    { email: "ritu.pgpwe@gurukul-test.com", name: "Ritu Verma", programme: "PGPWE", currentRole: null, company: null, industry: null, active: false },
    // DGMP
    { email: "suresh.dgmp@gurukul-test.com", name: "Suresh Pillai", programme: "DGMP", currentRole: "Operations Head", company: "Mahindra", industry: "Manufacturing", active: true },
    { email: "divya.dgmp@gurukul-test.com", name: "Divya Menon", programme: "DGMP", currentRole: "Marketing Lead", company: "HUL", industry: "FMCG", active: true },
    { email: "rahul.dgmp@gurukul-test.com", name: "Rahul Bose", programme: "DGMP", currentRole: "Finance Manager", company: "ICICI Bank", industry: "Finance", active: true },
    { email: "kavya.dgmp@gurukul-test.com", name: "Kavya Reddy", programme: "DGMP", currentRole: null, company: null, industry: null, active: false },
  ];

  for (const [index, student] of students.entries()) {
    // Distribute ages realistically
    const age = 28 + (index % 15);
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - age);

    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: { status: student.active ? 'ACTIVE' : 'DORMANT' },
      create: {
        email: student.email,
        name: student.name,
        userType: 'STUDENT',
        isAdmin: false,
        status: student.active ? 'ACTIVE' : 'DORMANT',
      },
    });

    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        programme: student.programme,
        batch: "2025",
        dob,
        currentRole: student.currentRole,
        company: student.company,
        industry: student.industry,
        workExperience: student.active ? `Experienced professional in ${student.industry} currently working as ${student.currentRole} at ${student.company}.` : null,
        profileComplete: student.active,
      },
      create: {
        userId: user.id,
        programme: student.programme,
        batch: "2025",
        dob,
        currentRole: student.currentRole,
        company: student.company,
        industry: student.industry,
        workExperience: student.active ? `Experienced professional in ${student.industry} currently working as ${student.currentRole} at ${student.company}.` : null,
        profileComplete: student.active,
      },
    });
  }

  // Deactivated Student
  await prisma.user.upsert({
    where: { email: "deactivated@gurukul-test.com" },
    update: { status: 'DEACTIVATED' },
    create: { email: "deactivated@gurukul-test.com", name: "Test Deactivated", userType: 'STUDENT', isAdmin: false, status: 'DEACTIVATED' },
  });

  // 3. Announcements (8 total)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const announcementsData = [
    { title: "Welcome to Gurukul — Your IIML Portal is Live", type: AnnouncementType.GENERAL, targetProgrammes: [], isPinned: true, body: "Welcoming all students to the platform." },
    { title: "IPMX Residency Block 3 — Schedule Released", type: AnnouncementType.EVENT, targetProgrammes: ["IPMX"], isPinned: false, body: "Announcing the Block 3 residential schedule." },
    { title: "Mandatory: Complete Your Profile by This Weekend", type: AnnouncementType.URGENT, targetProgrammes: [], isPinned: true, body: "Reminder to complete profile for mock interview access." },
    { title: "PGPWE Weekend Session — Room Change", type: AnnouncementType.URGENT, targetProgrammes: ["PGPWE"], isPinned: false, body: "Venue change for this Saturday's session." },
    { title: "New Resources Added: ESG Frameworks", type: AnnouncementType.GENERAL, targetProgrammes: ["PGPSM"], isPinned: false, body: "New study materials uploaded to the resources section." },
    { title: "Mock Interview Platform — How to Get Started", type: AnnouncementType.GENERAL, targetProgrammes: [], isPinned: false, body: "Guide on how to book your first mock interview session." },
    { title: "DGMP Guest Lecture — Industry Leader Series", type: AnnouncementType.EVENT, targetProgrammes: ["DGMP"], isPinned: false, body: "Details of upcoming guest lecture." },
    { title: "Holiday Notice — No Sessions on [Date]", type: AnnouncementType.GENERAL, targetProgrammes: [], isPinned: false, expiryDate: futureDate, body: "No academic sessions on the upcoming holiday." },
  ];

  for (const ann of announcementsData) {
    await prisma.announcement.create({
      data: {
        title: ann.title,
        type: ann.type,
        targetProgrammes: ann.targetProgrammes,
        isPinned: ann.isPinned,
        body: ann.body,
        expiryDate: ann.expiryDate,
        createdBy: adminUser.id,
      }
    });
  }

  // 4. Timetable Sessions (10 total)
  const ttData = [
    { programme: "IPMX", subject: "Strategic Management", faculty: "Dr. Amit Verma", venue: "LH-1", type: SessionType.LECTURE, offset: 1, start: "09:00", end: "10:30" },
    { programme: "IPMX", subject: "Corporate Finance", faculty: "Dr. Priya Rao", venue: "LH-1", type: SessionType.EXAM, offset: 3, start: "11:00", end: "12:30" },
    { programme: "PGPSM", subject: "Sustainable Business Models", faculty: "Dr. K. Nair", venue: "LH-3", type: SessionType.LECTURE, offset: 2, start: "14:00", end: "15:30" },
    { programme: "PGPSM", subject: "ESG Reporting Frameworks", faculty: "Dr. S. Mehta", venue: "LH-3", type: SessionType.WORKSHOP, offset: 5, start: "16:00", end: "18:00" },
    { programme: "PGPWE", subject: "Operations Management", faculty: "Dr. R. Sharma", venue: "Online/Zoom", type: SessionType.LECTURE, offset: 6, start: "09:00", end: "11:00" },
    { programme: "PGPWE", subject: "Marketing Strategy", faculty: "Dr. D. Gupta", venue: "Online/Zoom", type: SessionType.LECTURE, offset: 7, start: "11:30", end: "13:30" },
    { programme: "DGMP", subject: "Business Communication", faculty: "Dr. A. Singh", venue: "LH-5", type: SessionType.LECTURE, offset: 10, start: "14:00", end: "15:30" },
    { programme: "DGMP", subject: "Financial Accounting", faculty: "Dr. P. Iyer", venue: "LH-5", type: SessionType.LECTURE, offset: 12, start: "16:00", end: "17:30" },
    { programme: "IPMX", subject: "Leadership Talk", faculty: "Guest Speaker", venue: "Auditorium", type: SessionType.GUEST_TALK, offset: 15, start: "18:00", end: "19:30" },
    { programme: "PGPSM", subject: "Capstone Prep", faculty: "Dr. K. Nair", venue: "LH-3", type: SessionType.WORKSHOP, offset: 20, start: "10:00", end: "13:00" },
  ];

  for (const session of ttData) {
    const d = new Date();
    d.setDate(d.getDate() + session.offset);
    await prisma.timetableSession.create({
      data: {
        programme: session.programme,
        batch: "2025",
        subject: session.subject,
        faculty: session.faculty,
        venue: session.venue,
        sessionType: session.type,
        date: d,
        startTime: session.start,
        endTime: session.end,
        createdBy: adminUser.id,
      }
    });
  }

  // 5. Resources (Categories & Items)
  const categoriesData = [
    { name: "Course Readings", programme: "ALL" },
    { name: "Past Exam Papers", programme: "ALL" },
    { name: "Case Study Library", programme: "IPMX" },
    { name: "ESG Frameworks & Reports", programme: "PGPSM" },
  ];

  for (const cat of categoriesData) {
    const createdCat = await prisma.resourceCategory.create({
      data: { name: cat.name, programme: cat.programme }
    });
    // Create 2 resources per category
    await prisma.resource.createMany({
      data: [
        { categoryId: createdCat.id, title: `${cat.name} Material 1`, driveUrl: "https://drive.google.com/placeholder", typeTag: ResourceType.PDF, createdBy: adminUser.id, targetProgrammes: cat.programme === "ALL" ? [] : [cat.programme] },
        { categoryId: createdCat.id, title: `${cat.name} Material 2`, driveUrl: "https://drive.google.com/placeholder", typeTag: ResourceType.LINK, createdBy: adminUser.id, targetProgrammes: cat.programme === "ALL" ? [] : [cat.programme] }
      ]
    });
  }

  // 5a. Programme Resources (Top-level Drive Folders)
  const programmeResources = [
    { programme: 'PGPSM', driveUrl: 'https://drive.google.com/drive/folders/1Dt-8vKu_h0lNMtJ_0EyPqQz0RY_QRrej?usp=drive_link' },
    { programme: 'IPMX',  driveUrl: 'https://drive.google.com/drive/folders/1DVohI0zBwnICqXGNHbiRr6NxSodrZAP_?usp=drive_link' },
    { programme: 'PGPWE', driveUrl: 'https://drive.google.com/drive/folders/1rXamNgW6cJgMS_mg_9LRu5OVHpMihV-I?usp=drive_link' },
    { programme: 'DGMP',  driveUrl: 'https://drive.google.com/drive/folders/1It1ilj1FsxQAXdjgvZqqkH9_haNgd7XR?usp=drive_link' },
  ];

  for (const resource of programmeResources) {
    await prisma.programmeResource.upsert({
      where:  { programme: resource.programme },
      update: { 
        driveUrl: resource.driveUrl, 
        updatedBy: 'system@gurukul-seed' 
      },
      create: { 
        programme: resource.programme, 
        driveUrl:  resource.driveUrl, 
        updatedBy: 'system@gurukul-seed' 
      },
    });
  }

  // 6. Mock Interviews
  const priya = await prisma.user.findUnique({ where: { email: "priya.ipmx@gurukul-test.com" } });
  const rohit = await prisma.user.findUnique({ where: { email: "rohit.ipmx@gurukul-test.com" } });
  const vikram = await prisma.user.findUnique({ where: { email: "vikram.pgpwe@gurukul-test.com" } });
  const neha = await prisma.user.findUnique({ where: { email: "neha.pgpwe@gurukul-test.com" } });
  const ananya = await prisma.user.findUnique({ where: { email: "ananya.pgpsm@gurukul-test.com" } });
  const karan = await prisma.user.findUnique({ where: { email: "karan.pgpsm@gurukul-test.com" } });
  const suresh = await prisma.user.findUnique({ where: { email: "suresh.dgmp@gurukul-test.com" } });
  const divya = await prisma.user.findUnique({ where: { email: "divya.dgmp@gurukul-test.com" } });

  // Session 1: CONFIRMED
  const s1Date = new Date(); s1Date.setDate(s1Date.getDate() + 3);
  await prisma.mockInterviewSession.create({
    data: {
      requesterId: priya!.id,
      partnerId: rohit!.id,
      sessionFormat: InterviewFormat.FULL_MOCK,
      status: InterviewStatus.CONFIRMED,
      proposedSlots: [s1Date.toISOString()],
      confirmedSlot: s1Date,
    }
  });

  // Session 2: AWAITING_FEEDBACK
  const s2Date = new Date(); s2Date.setDate(s2Date.getDate() - 2);
  await prisma.mockInterviewSession.create({
    data: {
      requesterId: vikram!.id,
      partnerId: neha!.id,
      sessionFormat: InterviewFormat.QUICK_PREP,
      status: InterviewStatus.AWAITING_FEEDBACK,
      proposedSlots: [s2Date.toISOString()],
      confirmedSlot: s2Date,
    }
  });

  // Session 3: REQUESTED
  const s3Date = new Date(); s3Date.setDate(s3Date.getDate() + 7);
  await prisma.mockInterviewSession.create({
    data: {
      requesterId: ananya!.id,
      partnerId: karan!.id,
      sessionFormat: InterviewFormat.FULL_MOCK,
      status: InterviewStatus.REQUESTED,
      proposedSlots: [s3Date.toISOString(), new Date(s3Date.getTime() + 86400000).toISOString(), new Date(s3Date.getTime() + 172800000).toISOString()],
    }
  });

  // Session 4: COMPLETED with Feedback
  const s4Date = new Date(); s4Date.setDate(s4Date.getDate() - 5);
  const session4 = await prisma.mockInterviewSession.create({
    data: {
      requesterId: suresh!.id,
      partnerId: divya!.id,
      sessionFormat: InterviewFormat.FULL_MOCK,
      status: InterviewStatus.COMPLETED,
      proposedSlots: [s4Date.toISOString()],
      confirmedSlot: s4Date,
    }
  });

  await prisma.mockInterviewFeedback.createMany({
    data: [
      { sessionId: session4.id, reviewerId: divya!.id, revieweeId: suresh!.id, rating: 4, whatWentWell: "Good structured answers.", improvements: "Be more concise.", wouldRepeat: true },
      { sessionId: session4.id, reviewerId: suresh!.id, revieweeId: divya!.id, rating: 5, whatWentWell: "Excellent pacing and confidence.", improvements: "None really.", wouldRepeat: true }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
