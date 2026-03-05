import { PrismaClient, Gender, RelationType, TicketType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Tamim Diwan database...');

  // ── Admin User ─────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tamim.sa';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: 'مشرف النظام' },
  });
  console.log('✅ Admin user created');

  // ── Branches ───────────────────────────────────────────────────
  const rootBranch = await prisma.branch.upsert({
    where: { id: 'b1000000-0000-0000-0000-000000000001' },
    update: {},
    create: { id: 'b1000000-0000-0000-0000-000000000001', nameAr: 'قبيلة تميم' },
  });

  const branch1 = await prisma.branch.upsert({
    where: { id: 'b2000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'b2000000-0000-0000-0000-000000000001',
      nameAr: 'بنو سعد',
      parentBranchId: rootBranch.id,
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { id: 'b2000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'b2000000-0000-0000-0000-000000000002',
      nameAr: 'بنو العنبر',
      parentBranchId: rootBranch.id,
    },
  });

  const branch3 = await prisma.branch.upsert({
    where: { id: 'b3000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'b3000000-0000-0000-0000-000000000001',
      nameAr: 'آل زيد',
      parentBranchId: branch1.id,
    },
  });

  console.log('✅ Branches created');

  // ── Persons ────────────────────────────────────────────────────
  const grandfather = await prisma.person.upsert({
    where: { id: 'p1000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'p1000000-0000-0000-0000-000000000001',
      fullNameAr: 'تميم بن مرة',
      gender: Gender.M,
      birthDate: new Date('1920-01-01'),
      deathDate: new Date('1998-06-15'),
      branchId: rootBranch.id,
      city: 'الرياض',
      bio: 'جد القبيلة وأصلها، عاش حياةً حافلةً بالعطاء.',
    },
  });

  const father1 = await prisma.person.upsert({
    where: { id: 'p2000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'p2000000-0000-0000-0000-000000000001',
      fullNameAr: 'عبدالله بن تميم',
      gender: Gender.M,
      birthDate: new Date('1950-03-10'),
      branchId: branch1.id,
      city: 'الرياض',
      bio: 'أحد أبناء الجد تميم، رجل أعمال ومحب للخير.',
    },
  });

  const father2 = await prisma.person.upsert({
    where: { id: 'p2000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'p2000000-0000-0000-0000-000000000002',
      fullNameAr: 'محمد بن تميم',
      gender: Gender.M,
      birthDate: new Date('1955-07-22'),
      branchId: branch2.id,
      city: 'الدمام',
    },
  });

  const son1 = await prisma.person.upsert({
    where: { id: 'p3000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'p3000000-0000-0000-0000-000000000001',
      fullNameAr: 'سعد بن عبدالله التميمي',
      gender: Gender.M,
      birthDate: new Date('1978-11-05'),
      branchId: branch1.id,
      city: 'الرياض',
    },
  });

  const son2 = await prisma.person.upsert({
    where: { id: 'p3000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'p3000000-0000-0000-0000-000000000002',
      fullNameAr: 'فهد بن عبدالله التميمي',
      gender: Gender.M,
      birthDate: new Date('1980-04-18'),
      branchId: branch1.id,
      city: 'جدة',
    },
  });

  const son3 = await prisma.person.upsert({
    where: { id: 'p3000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: 'p3000000-0000-0000-0000-000000000003',
      fullNameAr: 'نورة بنت عبدالله التميمية',
      gender: Gender.F,
      birthDate: new Date('1983-09-01'),
      branchId: branch1.id,
      city: 'الرياض',
    },
  });

  const grandson1 = await prisma.person.upsert({
    where: { id: 'p4000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'p4000000-0000-0000-0000-000000000001',
      fullNameAr: 'عمر بن سعد التميمي',
      gender: Gender.M,
      birthDate: new Date('2005-02-14'),
      branchId: branch1.id,
      city: 'الرياض',
    },
  });

  console.log('✅ Persons created');

  // ── Relationships ──────────────────────────────────────────────
  const rels = [
    { personId: father1.id, relatedPersonId: grandfather.id, relationType: RelationType.FATHER },
    { personId: father2.id, relatedPersonId: grandfather.id, relationType: RelationType.FATHER },
    { personId: son1.id,   relatedPersonId: father1.id,     relationType: RelationType.FATHER },
    { personId: son2.id,   relatedPersonId: father1.id,     relationType: RelationType.FATHER },
    { personId: son3.id,   relatedPersonId: father1.id,     relationType: RelationType.FATHER },
    { personId: grandson1.id, relatedPersonId: son1.id,     relationType: RelationType.FATHER },
  ];

  for (const rel of rels) {
    await prisma.relationship.upsert({
      where: {
        personId_relatedPersonId_relationType: {
          personId: rel.personId,
          relatedPersonId: rel.relatedPersonId,
          relationType: rel.relationType,
        },
      },
      update: {},
      create: rel,
    });
  }
  console.log('✅ Relationships created');

  // ── Closure Table ──────────────────────────────────────────────
  // Build paths from the relationships
  // Seed self-referencing paths first (depth 0)
  const allPersons = [grandfather, father1, father2, son1, son2, son3, grandson1];
  for (const p of allPersons) {
    await prisma.personTreePath.upsert({
      where: { ancestorId_descendantId: { ancestorId: p.id, descendantId: p.id } },
      update: {},
      create: { ancestorId: p.id, descendantId: p.id, depth: 0 },
    });
  }

  // Direct parent-child (depth 1)
  const parentChild = [
    { ancestor: grandfather.id, descendant: father1.id },
    { ancestor: grandfather.id, descendant: father2.id },
    { ancestor: father1.id,     descendant: son1.id },
    { ancestor: father1.id,     descendant: son2.id },
    { ancestor: father1.id,     descendant: son3.id },
    { ancestor: son1.id,        descendant: grandson1.id },
  ];

  for (const pc of parentChild) {
    await prisma.personTreePath.upsert({
      where: { ancestorId_descendantId: { ancestorId: pc.ancestor, descendantId: pc.descendant } },
      update: {},
      create: { ancestorId: pc.ancestor, descendantId: pc.descendant, depth: 1 },
    });
  }

  // depth 2
  const depth2 = [
    { ancestor: grandfather.id, descendant: son1.id },
    { ancestor: grandfather.id, descendant: son2.id },
    { ancestor: grandfather.id, descendant: son3.id },
    { ancestor: father1.id,     descendant: grandson1.id },
  ];
  for (const d of depth2) {
    await prisma.personTreePath.upsert({
      where: { ancestorId_descendantId: { ancestorId: d.ancestor, descendantId: d.descendant } },
      update: {},
      create: { ancestorId: d.ancestor, descendantId: d.descendant, depth: 2 },
    });
  }

  // depth 3
  await prisma.personTreePath.upsert({
    where: { ancestorId_descendantId: { ancestorId: grandfather.id, descendantId: grandson1.id } },
    update: {},
    create: { ancestorId: grandfather.id, descendantId: grandson1.id, depth: 3 },
  });

  console.log('✅ Tree paths created');

  // ── News ───────────────────────────────────────────────────────
  const newsItems = [
    {
      titleAr: 'انعقاد الاجتماع السنوي لأبناء قبيلة تميم',
      contentAr: 'عُقد مؤخراً الاجتماع السنوي الذي يجمع أبناء قبيلة تميم من مختلف أرجاء المملكة، وقد تناول الاجتماع عدداً من المحاور الهامة المتعلقة بتطوير خدمات الأسرة الكبيرة وتعزيز التواصل بين أبنائها في الداخل والخارج.',
      category: 'أخبار',
      publishedAt: new Date('2024-12-01'),
    },
    {
      titleAr: 'إطلاق مبادرة "تميم يبني" للشباب',
      contentAr: 'أعلنت لجنة شباب قبيلة تميم عن إطلاق مبادرة "تميم يبني" الرامية إلى دعم المشاريع الريادية لأبناء القبيلة، وستشمل المبادرة تقديم الدعم التقني والمالي للمشاريع الواعدة.',
      category: 'مبادرات',
      publishedAt: new Date('2024-11-15'),
    },
    {
      titleAr: 'تكريم أبناء القبيلة المتفوقين دراسياً',
      contentAr: 'احتفت قبيلة تميم بأبنائها المتفوقين في مرحلة الثانوية والجامعة، إذ حضر الحفل كبار أعيان القبيلة وعدد من المسؤولين.',
      category: 'تعليم',
      publishedAt: new Date('2024-10-20'),
    },
    {
      titleAr: 'حفل زفاف جماعي لأبناء قبيلة تميم',
      contentAr: 'نظّمت لجنة القبيلة الاجتماعية حفل زفاف جماعياً شارك فيه عشرون عريساً من أبناء تميم، في خطوة تعكس قيم التكافل والتراحم.',
      category: 'اجتماعي',
      publishedAt: new Date('2024-09-05'),
    },
  ];

  for (const item of newsItems) {
    await prisma.news.create({ data: item });
  }
  console.log('✅ News created');

  // ── Events ─────────────────────────────────────────────────────
  const events = [
    {
      titleAr: 'ملتقى تميم السنوي 2025',
      descriptionAr: 'الملتقى السنوي الذي يجمع أبناء قبيلة تميم من مختلف مناطق المملكة في أجواء من الألفة والمحبة، يتضمن الملتقى فعاليات ثقافية ورياضية واجتماعية.',
      startAt: new Date('2025-02-20T09:00:00Z'),
      endAt: new Date('2025-02-22T21:00:00Z'),
      city: 'الرياض',
      locationText: 'قاعة الملك عبدالعزيز للمؤتمرات — الرياض',
      mapUrl: 'https://maps.google.com/?q=24.6877,46.7219',
      contactName: 'عبدالرحمن التميمي',
      contactPhone: '+966501234567',
    },
    {
      titleAr: 'مسابقة الشعر النبطي لأبناء تميم',
      descriptionAr: 'مسابقة سنوية في الشعر النبطي مفتوحة لجميع أبناء القبيلة، تُعقد في إطار الحفاظ على الموروث الشعري والثقافي.',
      startAt: new Date('2025-03-10T18:00:00Z'),
      endAt: new Date('2025-03-10T22:00:00Z'),
      city: 'الأحساء',
      locationText: 'النادي الأدبي بالأحساء',
      contactName: 'سلطان التميمي',
      contactPhone: '+966507654321',
    },
    {
      titleAr: 'بطولة كرة القدم الخماسية',
      descriptionAr: 'بطولة رياضية سنوية تجمع فرق الأحياء والمناطق من أبناء قبيلة تميم، ترسيخاً لروح التنافس الشريف.',
      startAt: new Date('2025-04-01T15:00:00Z'),
      endAt: new Date('2025-04-05T20:00:00Z'),
      city: 'الدمام',
      locationText: 'ملعب الشباب — الدمام',
      contactName: 'فيصل التميمي',
      contactPhone: '+966509876543',
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log('✅ Events created');

  // ── Tickets ────────────────────────────────────────────────────
  await prisma.ticket.create({
    data: {
      type: TicketType.SUGGESTION,
      title: 'إضافة قسم لمعلومات الطب والصحة',
      message: 'أقترح إضافة قسم متخصص يوفر معلومات طبية مفيدة لأبناء القبيلة ويعرّف بالأطباء المنتسبين إلى تميم.',
      contactPhone: '+966500000001',
      contactEmail: 'example@email.com',
    },
  });

  await prisma.ticket.create({
    data: {
      type: TicketType.COMPLAINT,
      title: 'معلومات شجرة العائلة غير محدّثة',
      message: 'لاحظت أن بعض البيانات في شجرة العائلة قديمة وتحتاج إلى مراجعة وتحديث.',
      contactPhone: '+966500000002',
    },
  });
  console.log('✅ Tickets created');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📧 Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
