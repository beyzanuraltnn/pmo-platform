using Microsoft.EntityFrameworkCore;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Persistence;

internal static class SeedDataIds
{
    public static readonly Guid RolePmoAdmin = Guid.Parse("3D16D95F-87AF-42E5-9D44-39A2CE200001");
    public static readonly Guid RoleProjectManager = Guid.Parse("3D16D95F-87AF-42E5-9D44-39A2CE200002");
    public static readonly Guid RoleProductManager = Guid.Parse("3D16D95F-87AF-42E5-9D44-39A2CE200003");
    public static readonly Guid RoleTechLead = Guid.Parse("3D16D95F-87AF-42E5-9D44-39A2CE200004");
    public static readonly Guid RoleQa = Guid.Parse("3D16D95F-87AF-42E5-9D44-39A2CE200005");
    public static readonly Guid RoleCto = Guid.Parse("3D16D95F-87AF-42E5-9D44-39A2CE200006");
    public static readonly Guid RoleViewer = Guid.Parse("3D16D95F-87AF-42E5-9D44-39A2CE200007");

    public static readonly Guid UserAdmin = Guid.Parse("6A95D67E-50BB-47B2-8C12-0ACCCE100001");
    public static readonly Guid UserPm = Guid.Parse("6A95D67E-50BB-47B2-8C12-0ACCCE100002");
    public static readonly Guid UserProduct = Guid.Parse("6A95D67E-50BB-47B2-8C12-0ACCCE100003");
    public static readonly Guid UserTechLead = Guid.Parse("6A95D67E-50BB-47B2-8C12-0ACCCE100004");
    public static readonly Guid UserQa = Guid.Parse("6A95D67E-50BB-47B2-8C12-0ACCCE100005");
    public static readonly Guid UserCto = Guid.Parse("6A95D67E-50BB-47B2-8C12-0ACCCE100006");
    public static readonly Guid UserViewer = Guid.Parse("6A95D67E-50BB-47B2-8C12-0ACCCE100007");

    public static readonly Guid ProjectOne = Guid.Parse("907F5355-2AD0-4AA9-A198-30B432100001");
    public static readonly Guid ProjectTwo = Guid.Parse("907F5355-2AD0-4AA9-A198-30B432100002");
    public static readonly Guid ProjectThree = Guid.Parse("907F5355-2AD0-4AA9-A198-30B432100003");
    public static readonly Guid ProjectFour = Guid.Parse("907F5355-2AD0-4AA9-A198-30B432100004");
    public static readonly Guid ProjectFive = Guid.Parse("907F5355-2AD0-4AA9-A198-30B432100005");

    public static readonly Guid GateProjectOne = Guid.Parse("B07F5355-2AD0-4AA9-A198-30B432100001");
    public static readonly Guid GateProjectTwo = Guid.Parse("B07F5355-2AD0-4AA9-A198-30B432100002");
    public static readonly Guid GateProjectThree = Guid.Parse("B07F5355-2AD0-4AA9-A198-30B432100003");
    public static readonly Guid GateProjectFour = Guid.Parse("B07F5355-2AD0-4AA9-A198-30B432100004");
    public static readonly Guid GateProjectFive = Guid.Parse("B07F5355-2AD0-4AA9-A198-30B432100005");

    public static readonly Guid NotificationOne = Guid.Parse("C07F5355-2AD0-4AA9-A198-30B432100001");
    public static readonly Guid NotificationTwo = Guid.Parse("C07F5355-2AD0-4AA9-A198-30B432100002");
    public static readonly Guid NotificationThree = Guid.Parse("C07F5355-2AD0-4AA9-A198-30B432100003");
    public static readonly Guid NotificationFour = Guid.Parse("C07F5355-2AD0-4AA9-A198-30B432100004");
}

internal static class ModelBuilderSeedExtensions
{
    public static void ApplySeedData(this ModelBuilder modelBuilder)
    {
        var createdAt = new DateTime(2026, 03, 18, 0, 0, 0, DateTimeKind.Utc);
        const string seededBy = "seed";

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = SeedDataIds.RolePmoAdmin, Name = SystemRoles.PmoAdmin, NormalizedName = SystemRoles.PmoAdmin, Description = "PMO Yöneticisi", CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new Role { Id = SeedDataIds.RoleProjectManager, Name = SystemRoles.ProjectManager, NormalizedName = SystemRoles.ProjectManager, Description = "Proje Yöneticisi", CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new Role { Id = SeedDataIds.RoleProductManager, Name = SystemRoles.ProductManager, NormalizedName = SystemRoles.ProductManager, Description = "Ürün Yöneticisi", CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new Role { Id = SeedDataIds.RoleTechLead, Name = SystemRoles.TechLead, NormalizedName = SystemRoles.TechLead, Description = "Teknik Lider", CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new Role { Id = SeedDataIds.RoleQa, Name = SystemRoles.Qa, NormalizedName = SystemRoles.Qa, Description = "Kalite Güvence", CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new Role { Id = SeedDataIds.RoleCto, Name = SystemRoles.Cto, NormalizedName = SystemRoles.Cto, Description = "CTO", CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new Role { Id = SeedDataIds.RoleViewer, Name = SystemRoles.Viewer, NormalizedName = SystemRoles.Viewer, Description = "Gözlemci", CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false }
        );

        modelBuilder.Entity<User>().HasData(
            new User { Id = SeedDataIds.UserAdmin, FirstName = "Pelin", LastName = "Yılmaz", Email = "admin@pmo.local", PasswordHash = "3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121", IsActive = true, CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new User { Id = SeedDataIds.UserPm, FirstName = "Emre", LastName = "Kaya", Email = "pm@pmo.local", PasswordHash = "f769c1b9afc265d893a90c9518e3e56c4fbacb64f737e42f251a426ec13f6435", IsActive = true, CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new User { Id = SeedDataIds.UserProduct, FirstName = "Selin", LastName = "Aksoy", Email = "product@pmo.local", PasswordHash = "0a0c7d6782d01e5d84bb6ce527757e94e9dba60e5a1de73c49a4fd0c5d946670", IsActive = true, CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new User { Id = SeedDataIds.UserTechLead, FirstName = "Mert", LastName = "Demir", Email = "techlead@pmo.local", PasswordHash = "090368d31d3a9252525bd7054b042d1d4d9b15c3e8f2d3824c1354b5be1ea269", IsActive = true, CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new User { Id = SeedDataIds.UserQa, FirstName = "Zeynep", LastName = "Akın", Email = "qa@pmo.local", PasswordHash = "681973b8bfe0e2aec109b9b67bcdf2354778cbfb90c6c48bb4dc50a3063666ce", IsActive = true, CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new User { Id = SeedDataIds.UserCto, FirstName = "Can", LastName = "Arslan", Email = "cto@pmo.local", PasswordHash = "40f0011a0fc99df63574b4ca7c06af4670c938cdec09d66ec6e93dbb11b827ef", IsActive = true, CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false },
            new User { Id = SeedDataIds.UserViewer, FirstName = "Ayşe", LastName = "Şahin", Email = "viewer@pmo.local", PasswordHash = "dcf4b36fc6332ad1b6a8e0b5d59f4e7eaf6975dd61522699d1e05df0ca0d3b76", IsActive = true, CreatedAt = createdAt, CreatedBy = seededBy, IsDeleted = false }
        );

        modelBuilder.Entity<UserRole>().HasData(
            new UserRole { UserId = SeedDataIds.UserAdmin, RoleId = SeedDataIds.RolePmoAdmin },
            new UserRole { UserId = SeedDataIds.UserPm, RoleId = SeedDataIds.RoleProjectManager },
            new UserRole { UserId = SeedDataIds.UserProduct, RoleId = SeedDataIds.RoleProductManager },
            new UserRole { UserId = SeedDataIds.UserTechLead, RoleId = SeedDataIds.RoleTechLead },
            new UserRole { UserId = SeedDataIds.UserQa, RoleId = SeedDataIds.RoleQa },
            new UserRole { UserId = SeedDataIds.UserCto, RoleId = SeedDataIds.RoleCto },
            new UserRole { UserId = SeedDataIds.UserViewer, RoleId = SeedDataIds.RoleViewer }
        );

        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = SeedDataIds.ProjectOne,
                Name = "Regülasyon Uyum Projesi",
                Code = "PMO-REG-001",
                Type = ProjectType.Regulation,
                Status = ProjectStatus.Active,
                Description = "Yeni regülasyon maddelerine uyum için süreç ve sistem geliştirmeleri.",
                BusinessOwner = "Operasyon Direktörlüğü",
                RagStatus = RagStatus.Red,
                Sponsor = "Ceren Yıldız",
                Priority = ProjectPriority.Critical,
                Stage = ProjectStage.Test,
                PlannedStartDate = new DateTime(2025, 12, 15, 0, 0, 0, DateTimeKind.Utc),
                PlannedEndDate = new DateTime(2026, 03, 05, 0, 0, 0, DateTimeKind.Utc),
                ExpectedGoLiveDate = new DateTime(2026, 03, 10, 0, 0, 0, DateTimeKind.Utc),
                ActualGoLiveDate = null,
                Budget = 2750000m,
                Department = "Uyum ve Operasyon",
                Notes = "UAT reject oranı yüksek olduğu için yakın takipte.",
                ProjectManagerId = SeedDataIds.UserPm,
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Project
            {
                Id = SeedDataIds.ProjectTwo,
                Name = "Mobil Cüzdan v2",
                Code = "PMO-PRD-002",
                Type = ProjectType.Product,
                Status = ProjectStatus.Active,
                Description = "Mobil cüzdan uygulamasının ikinci faz ürün geliştirmeleri.",
                BusinessOwner = "Dijital Kanallar",
                RagStatus = RagStatus.Yellow,
                Sponsor = "Burak Deniz",
                Priority = ProjectPriority.High,
                Stage = ProjectStage.Development,
                PlannedStartDate = new DateTime(2026, 01, 05, 0, 0, 0, DateTimeKind.Utc),
                PlannedEndDate = new DateTime(2026, 03, 15, 0, 0, 0, DateTimeKind.Utc),
                ExpectedGoLiveDate = new DateTime(2026, 03, 20, 0, 0, 0, DateTimeKind.Utc),
                ActualGoLiveDate = null,
                Budget = 1800000m,
                Department = "Ürün Yönetimi",
                Notes = "Dış paydaş API bağımlılığı nedeniyle sarı riskte.",
                ProjectManagerId = SeedDataIds.UserPm,
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Project
            {
                Id = SeedDataIds.ProjectThree,
                Name = "API Gateway Modernizasyonu",
                Code = "PMO-INF-003",
                Type = ProjectType.Infrastructure,
                Status = ProjectStatus.Planned,
                Description = "API katmanının modernizasyonu ve güvenlik iyileştirmeleri.",
                BusinessOwner = "Platform Mühendisliği",
                RagStatus = RagStatus.Green,
                Sponsor = "Murat Korkmaz",
                Priority = ProjectPriority.Medium,
                Stage = ProjectStage.Initiation,
                PlannedStartDate = new DateTime(2026, 07, 01, 0, 0, 0, DateTimeKind.Utc),
                PlannedEndDate = new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc),
                ExpectedGoLiveDate = new DateTime(2026, 11, 01, 0, 0, 0, DateTimeKind.Utc),
                ActualGoLiveDate = null,
                Budget = 950000m,
                Department = "Altyapı",
                Notes = "Charter henüz oluşturulmadı; empty state senaryosu için bırakıldı.",
                ProjectManagerId = SeedDataIds.UserPm,
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Project
            {
                Id = SeedDataIds.ProjectFour,
                Name = "Fraud Detection v3",
                Code = "PMO-PRD-004",
                Type = ProjectType.Product,
                Status = ProjectStatus.Planned,
                Description = "Sahtekarlık tespit motorunun üçüncü versiyon geliştirmesi.",
                BusinessOwner = "Risk Yönetimi",
                RagStatus = RagStatus.Yellow,
                Sponsor = "Duygu Akalın",
                Priority = ProjectPriority.High,
                Stage = ProjectStage.Initiation,
                PlannedStartDate = new DateTime(2026, 05, 10, 0, 0, 0, DateTimeKind.Utc),
                PlannedEndDate = new DateTime(2026, 10, 01, 0, 0, 0, DateTimeKind.Utc),
                ExpectedGoLiveDate = new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc),
                ActualGoLiveDate = null,
                Budget = 2100000m,
                Department = "Risk ve Analitik",
                Notes = "Bütçe komitesi onayı bekleniyor.",
                ProjectManagerId = SeedDataIds.UserPm,
                CreatedAt = createdAt.AddDays(-3),
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Project
            {
                Id = SeedDataIds.ProjectFive,
                Name = "Kart Servisi Entegrasyon",
                Code = "PMO-INT-005",
                Type = ProjectType.Integration,
                Status = ProjectStatus.Completed,
                Description = "Kart servisleri ile dış sistem entegrasyonu tamamlandı.",
                BusinessOwner = "Kart Operasyonları",
                RagStatus = RagStatus.Green,
                Sponsor = "Selçuk Taş",
                Priority = ProjectPriority.Medium,
                Stage = ProjectStage.Closure,
                PlannedStartDate = new DateTime(2025, 11, 15, 0, 0, 0, DateTimeKind.Utc),
                PlannedEndDate = new DateTime(2026, 03, 12, 0, 0, 0, DateTimeKind.Utc),
                ExpectedGoLiveDate = new DateTime(2026, 03, 17, 0, 0, 0, DateTimeKind.Utc),
                ActualGoLiveDate = new DateTime(2026, 03, 17, 0, 0, 0, DateTimeKind.Utc),
                Budget = 1200000m,
                Department = "Entegrasyon",
                Notes = "Closure raporu hazırlanıyor.",
                ProjectManagerId = SeedDataIds.UserPm,
                CreatedAt = createdAt.AddDays(-30),
                CreatedBy = seededBy,
                IsDeleted = false
            }
        );

        modelBuilder.Entity<ProjectCharter>().HasData(
            new ProjectCharter
            {
                Id = Guid.Parse("A07F5355-2AD0-4AA9-A198-30B432100001"),
                ProjectId = SeedDataIds.ProjectOne,
                Purpose = "Regülasyon maddelerine tam uyum sağlamak.",
                Objectives = "Uyum checklist'ini kapatmak, manuel operasyonu azaltmak.",
                Scope = "Uyum ekranları, onay akışları ve raporlama.",
                OutOfScope = "Mobil uygulama redesign çalışmaları.",
                SuccessCriteria = "Tüm regülasyon maddeleri için denetimden geçmek.",
                RisksAndAssumptions = "Regülasyon değişikliklerinin sabit kalacağı varsayılıyor.",
                Dependencies = "Uyum ekibi geri bildirimleri ve vendor entegrasyonları.",
                Stakeholders = "Uyum, Operasyon, Teknoloji, PMO",
                TimelineSummary = "Q1 sonunda canlıya geçiş hedefi.",
                BudgetSummary = "2.75M TL toplam bütçe.",
                ApprovalNotes = "PMO ön incelemesinden geçti.",
                Version = 2,
                LastReviewedAt = createdAt.AddDays(-2),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new ProjectCharter
            {
                Id = Guid.Parse("A07F5355-2AD0-4AA9-A198-30B432100002"),
                ProjectId = SeedDataIds.ProjectTwo,
                Purpose = "Mobil cüzdan deneyimini ikinci faz ile genişletmek.",
                Objectives = "Yeni ödeme akışları ve sadakat entegrasyonları sunmak.",
                Scope = "Mobil cüzdan backend ve frontend iyileştirmeleri.",
                OutOfScope = "Yeni KYC platformu entegrasyonu.",
                SuccessCriteria = "Aktif kullanıcı oranında %20 artış.",
                RisksAndAssumptions = "Finekra API teslimatının takvime uyacağı varsayılıyor.",
                Dependencies = "Partner API ve güvenlik testi tamamlanması.",
                Stakeholders = "Ürün, Teknoloji, Güvenlik, PMO",
                TimelineSummary = "Mart sonu release hazırlığı.",
                BudgetSummary = "1.8M TL ürün bütçesi.",
                ApprovalNotes = "Ürün yönetimi notları eklendi.",
                Version = 1,
                LastReviewedAt = createdAt.AddDays(-1),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new ProjectCharter
            {
                Id = Guid.Parse("A07F5355-2AD0-4AA9-A198-30B432100003"),
                ProjectId = SeedDataIds.ProjectFive,
                Purpose = "Kart servisi entegrasyonunu merkezi hale getirmek.",
                Objectives = "Dış servis bağımlılıklarını azaltmak ve SLA iyileştirmek.",
                Scope = "Kart servisleri, entegrasyon adaptörleri ve izleme panelleri.",
                OutOfScope = "Kart ürün roadmap revizyonu.",
                SuccessCriteria = "Entegrasyon başarısında %99.5 SLA.",
                RisksAndAssumptions = "Vendor bakım pencereleri sınırlı olacaktır.",
                Dependencies = "Kart operasyonları ve vendor test ortamları.",
                Stakeholders = "Kart Operasyonları, Entegrasyon, PMO",
                TimelineSummary = "Q1 içinde tamamlandı.",
                BudgetSummary = "1.2M TL harcama ile kapatıldı.",
                ApprovalNotes = "Closure öncesi son versiyon.",
                Version = 3,
                LastReviewedAt = createdAt.AddDays(-10),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            }
        );

        modelBuilder.Entity<Gate>().HasData(
            new Gate
            {
                Id = SeedDataIds.GateProjectOne,
                ProjectId = SeedDataIds.ProjectOne,
                GateNo = 4,
                Name = "Gate 4 - Test & UAT",
                Status = GateStatus.WaitingApproval,
                OpenDate = createdAt.AddDays(-8),
                DueDate = createdAt.AddDays(-1),
                Description = "QA test raporu ve UAT kanıtları bekleniyor.",
                RequiredEvidenceCount = 2,
                CurrentStep = "Onay Bekliyor",
                CurrentOwner = "QA, PRODUCT_MANAGER, PMO_ADMIN",
                OpenedAt = createdAt.AddDays(-8),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Gate
            {
                Id = SeedDataIds.GateProjectTwo,
                ProjectId = SeedDataIds.ProjectTwo,
                GateNo = 3,
                Name = "Gate 3 - Dev Tamamlanma",
                Status = GateStatus.MissingEvidence,
                OpenDate = createdAt.AddDays(-3),
                DueDate = createdAt.AddDays(5),
                Description = "Release notları ve unit test raporu eksik.",
                RequiredEvidenceCount = 2,
                CurrentStep = "Eksik Kanıt",
                CurrentOwner = "Emre Kaya",
                OpenedAt = createdAt.AddDays(-3),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Gate
            {
                Id = SeedDataIds.GateProjectThree,
                ProjectId = SeedDataIds.ProjectThree,
                GateNo = 1,
                Name = "Gate 1 - Charter Onayı",
                Status = GateStatus.Draft,
                OpenDate = createdAt,
                DueDate = createdAt.AddDays(7),
                Description = "Charter dokümanı hazırlanıyor.",
                RequiredEvidenceCount = 1,
                CurrentStep = "Taslak",
                CurrentOwner = "Emre Kaya",
                OpenedAt = createdAt,
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Gate
            {
                Id = SeedDataIds.GateProjectFour,
                ProjectId = SeedDataIds.ProjectFour,
                GateNo = 1,
                Name = "Gate 1 - Charter Onayı",
                Status = GateStatus.Draft,
                OpenDate = createdAt.AddDays(-1),
                DueDate = createdAt.AddDays(10),
                Description = "Planlanan proje için charter bekleniyor.",
                RequiredEvidenceCount = 1,
                CurrentStep = "Taslak",
                CurrentOwner = "Emre Kaya",
                OpenedAt = createdAt.AddDays(-1),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Gate
            {
                Id = SeedDataIds.GateProjectFive,
                ProjectId = SeedDataIds.ProjectFive,
                GateNo = 6,
                Name = "Gate 6 - Kapanış",
                Status = GateStatus.Approved,
                OpenDate = createdAt.AddDays(-15),
                DueDate = createdAt.AddDays(-5),
                Description = "Lessons learned ve kapanış onayı tamamlandı.",
                RequiredEvidenceCount = 1,
                CurrentStep = "Tamamlandı",
                OpenedAt = createdAt.AddDays(-15),
                ClosedDate = createdAt.AddDays(-2),
                ClosedAt = createdAt.AddDays(-2),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            }
        );

        modelBuilder.Entity<Notification>().HasData(
            new Notification
            {
                Id = SeedDataIds.NotificationOne,
                RecipientUserId = SeedDataIds.UserAdmin,
                ProjectId = SeedDataIds.ProjectOne,
                GateId = SeedDataIds.GateProjectOne,
                Title = "Gate 4 Onayı Bekliyor",
                Content = "Regülasyon Uyum Projesi için QA onayı 8 gündür bekliyor.",
                Type = NotificationType.GateApproval,
                IsRead = false,
                SentAt = createdAt.AddMinutes(-20),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Notification
            {
                Id = SeedDataIds.NotificationTwo,
                RecipientUserId = SeedDataIds.UserPm,
                ProjectId = SeedDataIds.ProjectTwo,
                GateId = SeedDataIds.GateProjectTwo,
                Title = "Milestone Gecikmesi",
                Content = "Mobil Cüzdan v2 projesinde geliştirme milestone hedefi gecikti.",
                Type = NotificationType.MilestoneDelayed,
                IsRead = false,
                SentAt = createdAt.AddHours(-2),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Notification
            {
                Id = SeedDataIds.NotificationThree,
                RecipientUserId = SeedDataIds.UserCto,
                ProjectId = SeedDataIds.ProjectOne,
                GateId = SeedDataIds.GateProjectOne,
                Title = "Kritik Risk Eskalasyonu",
                Content = "Regülasyon Uyum Projesi kritik risk seviyesine yükseldi.",
                Type = NotificationType.RiskEscalation,
                IsRead = true,
                SentAt = createdAt.AddHours(-5),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            },
            new Notification
            {
                Id = SeedDataIds.NotificationFour,
                RecipientUserId = SeedDataIds.UserViewer,
                ProjectId = SeedDataIds.ProjectFive,
                GateId = SeedDataIds.GateProjectFive,
                Title = "Haftalık Dashboard Hazır",
                Content = "Haftalık portföy özeti üretildi.",
                Type = NotificationType.GateApproval,
                IsRead = false,
                SentAt = createdAt.AddMinutes(-5),
                CreatedAt = createdAt,
                CreatedBy = seededBy,
                IsDeleted = false
            }
        );
    }
}
