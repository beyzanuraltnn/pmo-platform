using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PMO.Platform.Application.Common.Interfaces.Security;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Persistence;

public static class ApplicationDbInitializer
{
    public static async Task SeedAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("ApplicationDbInitializer");
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        await dbContext.Database.MigrateAsync(cancellationToken);
        await EnsureProjectMetadataAsync(dbContext, cancellationToken);
        await EnsureProjectChartersAsync(dbContext, cancellationToken);
        await EnsureRaidItemsAsync(dbContext, cancellationToken);

        if (!await dbContext.GateApprovals.AnyAsync(cancellationToken))
        {
            logger.LogInformation("Stage Gate seed verileri uygulanıyor.");

            dbContext.Notifications.RemoveRange(dbContext.Notifications);
            dbContext.EvidenceFiles.RemoveRange(dbContext.EvidenceFiles);
            dbContext.GateApprovals.RemoveRange(dbContext.GateApprovals);
            dbContext.Gates.RemoveRange(dbContext.Gates);
            await dbContext.SaveChangesAsync(cancellationToken);

            await EnsureGateWorkflowSeedAsync(dbContext, cancellationToken);
        }

        var users = await dbContext.Users.ToListAsync(cancellationToken);
        foreach (var user in users.Where(x => x.PasswordHash.StartsWith("DEMO_HASH_", StringComparison.OrdinalIgnoreCase)))
        {
            user.PasswordHash = user.Email switch
            {
                "admin@pmo.local" => passwordHasher.Hash("Admin123!"),
                "pm@pmo.local" => passwordHasher.Hash("Pm123!"),
                "product@pmo.local" => passwordHasher.Hash("Product123!"),
                "techlead@pmo.local" => passwordHasher.Hash("Tech123!"),
                "qa@pmo.local" => passwordHasher.Hash("Qa123!"),
                "cto@pmo.local" => passwordHasher.Hash("Cto123!"),
                "viewer@pmo.local" => passwordHasher.Hash("Viewer123!"),
                _ => user.PasswordHash
            };
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureGateWorkflowSeedAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        var createdAt = DateTime.UtcNow;
        var projects = await dbContext.Projects.Include(x => x.ProjectManager).OrderBy(x => x.Name).ToListAsync(cancellationToken);
        var users = await dbContext.Users.ToListAsync(cancellationToken);
        var userRoles = await dbContext.UserRoles.Include(x => x.Role).ToListAsync(cancellationToken);

        User GetUserByRole(string role) =>
            users.First(x => userRoles.Any(ur => ur.UserId == x.Id && ur.Role.Name == role));

        var admin = GetUserByRole(SystemRoles.PmoAdmin);
        var product = GetUserByRole(SystemRoles.ProductManager);
        var techLead = GetUserByRole(SystemRoles.TechLead);
        var qa = GetUserByRole(SystemRoles.Qa);
        var cto = GetUserByRole(SystemRoles.Cto);

        foreach (var project in projects)
        {
            var baseDueDate = (project.ExpectedGoLiveDate ?? createdAt).Date;

            var gates = new List<Gate>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    GateNo = 1,
                    Name = "Gate 1 - Charter Onayı",
                    Description = "Charter belgesi ve kapsam onayı.",
                    Status = GateStatus.Approved,
                    OpenDate = createdAt.AddDays(-20),
                    DueDate = baseDueDate.AddDays(-45),
                    ClosedDate = createdAt.AddDays(-19),
                    RequiredEvidenceCount = 1,
                    CurrentStep = "Tamamlandı",
                    OpenedAt = createdAt.AddDays(-20),
                    ClosedAt = createdAt.AddDays(-19),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    GateNo = 2,
                    Name = "Gate 2 - Analiz Onayı",
                    Description = "Analiz çıktıları ve wireframe doğrulaması.",
                    Status = project.Status == ProjectStatus.Planned ? GateStatus.Draft : GateStatus.WaitingApproval,
                    OpenDate = createdAt.AddDays(-10),
                    DueDate = baseDueDate.AddDays(-25),
                    RequiredEvidenceCount = 2,
                    CurrentStep = project.Status == ProjectStatus.Planned ? "Taslak" : "Onay Bekliyor",
                    CurrentOwner = project.Status == ProjectStatus.Planned ? project.ProjectManager.Email : "PMO_ADMIN, TECH_LEAD",
                    OpenedAt = createdAt.AddDays(-10),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    GateNo = 3,
                    Name = "Gate 3 - Dev Tamamlanma",
                    Description = "Kod inceleme ve release notu doğrulaması.",
                    Status = project.Status == ProjectStatus.Completed ? GateStatus.Approved : GateStatus.MissingEvidence,
                    OpenDate = createdAt.AddDays(-5),
                    DueDate = baseDueDate.AddDays(-10),
                    ClosedDate = project.Status == ProjectStatus.Completed ? createdAt.AddDays(-4) : null,
                    RequiredEvidenceCount = 2,
                    CurrentStep = project.Status == ProjectStatus.Completed ? "Tamamlandı" : "Eksik Kanıt",
                    CurrentOwner = project.Status == ProjectStatus.Completed ? null : $"{project.ProjectManager.FirstName} {project.ProjectManager.LastName}",
                    OpenedAt = createdAt.AddDays(-5),
                    ClosedAt = project.Status == ProjectStatus.Completed ? createdAt.AddDays(-4) : null,
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                }
            };

            await dbContext.Gates.AddRangeAsync(gates, cancellationToken);

            var approvedGate = gates[0];
            await dbContext.EvidenceFiles.AddAsync(new EvidenceFile
            {
                Id = Guid.NewGuid(),
                GateId = approvedGate.Id,
                UploadedById = project.ProjectManagerId,
                UploadedByName = $"{project.ProjectManager.FirstName} {project.ProjectManager.LastName}",
                FileName = $"gate1-{project.Id:N}.pdf",
                OriginalFileName = "charter.pdf",
                FilePath = $"uploads/gates/{approvedGate.Id}/charter.pdf",
                ContentType = "application/pdf",
                FileSize = 1024,
                UploadedAt = createdAt.AddDays(-20),
                IsRequired = true,
                Category = EvidenceCategory.Diger,
                CreatedAt = createdAt,
                CreatedBy = "seed"
            }, cancellationToken);

            await dbContext.GateApprovals.AddRangeAsync(
                new[]
                {
                new GateApproval
                {
                    Id = Guid.NewGuid(),
                    GateId = approvedGate.Id,
                    ApproverId = admin.Id,
                    ApproverName = $"{admin.FirstName} {admin.LastName}",
                    Role = SystemRoles.PmoAdmin,
                    Status = ApprovalStatus.Approved,
                    Note = "Onaylandı",
                    DecisionAt = createdAt.AddDays(-19),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new GateApproval
                {
                    Id = Guid.NewGuid(),
                    GateId = approvedGate.Id,
                    ApproverId = product.Id,
                    ApproverName = $"{product.FirstName} {product.LastName}",
                    Role = SystemRoles.ProductManager,
                    Status = ApprovalStatus.Approved,
                    Note = "Onaylandı",
                    DecisionAt = createdAt.AddDays(-19),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                },
                cancellationToken);

            if (gates[1].Status == GateStatus.WaitingApproval)
            {
                await dbContext.EvidenceFiles.AddRangeAsync(
                    new EvidenceFile
                    {
                        Id = Guid.NewGuid(),
                        GateId = gates[1].Id,
                        UploadedById = project.ProjectManagerId,
                        UploadedByName = $"{project.ProjectManager.FirstName} {project.ProjectManager.LastName}",
                        FileName = $"analysis-{project.Id:N}.pdf",
                        OriginalFileName = "analysis.pdf",
                        FilePath = $"uploads/gates/{gates[1].Id}/analysis.pdf",
                        ContentType = "application/pdf",
                        FileSize = 2048,
                        UploadedAt = createdAt.AddDays(-9),
                        IsRequired = true,
                        Category = EvidenceCategory.Diger,
                        CreatedAt = createdAt,
                        CreatedBy = "seed"
                    },
                    new EvidenceFile
                    {
                        Id = Guid.NewGuid(),
                        GateId = gates[1].Id,
                        UploadedById = project.ProjectManagerId,
                        UploadedByName = $"{project.ProjectManager.FirstName} {project.ProjectManager.LastName}",
                        FileName = $"wireframe-{project.Id:N}.png",
                        OriginalFileName = "wireframe.png",
                        FilePath = $"uploads/gates/{gates[1].Id}/wireframe.png",
                        ContentType = "image/png",
                        FileSize = 4096,
                        UploadedAt = createdAt.AddDays(-9),
                        IsRequired = true,
                        Category = EvidenceCategory.Diger,
                        CreatedAt = createdAt,
                        CreatedBy = "seed"
                    },
                    cancellationToken);

                await dbContext.GateApprovals.AddRangeAsync(
                    new[]
                    {
                    new GateApproval
                    {
                        Id = Guid.NewGuid(),
                        GateId = gates[1].Id,
                        ApproverId = admin.Id,
                        ApproverName = $"{admin.FirstName} {admin.LastName}",
                        Role = SystemRoles.PmoAdmin,
                        Status = ApprovalStatus.Pending,
                        CreatedAt = createdAt,
                        CreatedBy = "seed"
                    },
                    new GateApproval
                    {
                        Id = Guid.NewGuid(),
                        GateId = gates[1].Id,
                        ApproverId = techLead.Id,
                        ApproverName = $"{techLead.FirstName} {techLead.LastName}",
                        Role = SystemRoles.TechLead,
                        Status = ApprovalStatus.Pending,
                        CreatedAt = createdAt,
                        CreatedBy = "seed"
                    },
                    new GateApproval
                    {
                        Id = Guid.NewGuid(),
                        GateId = gates[1].Id,
                        ApproverId = product.Id,
                        ApproverName = $"{product.FirstName} {product.LastName}",
                        Role = SystemRoles.ProductManager,
                        Status = ApprovalStatus.Pending,
                        CreatedAt = createdAt,
                        CreatedBy = "seed"
                    },
                    },
                    cancellationToken);
            }

            if (gates[2].Status == GateStatus.MissingEvidence)
            {
                await dbContext.EvidenceFiles.AddAsync(new EvidenceFile
                {
                    Id = Guid.NewGuid(),
                    GateId = gates[2].Id,
                    UploadedById = project.ProjectManagerId,
                    UploadedByName = $"{project.ProjectManager.FirstName} {project.ProjectManager.LastName}",
                    FileName = $"release-{project.Id:N}.txt",
                    OriginalFileName = "release-notes.txt",
                    FilePath = $"uploads/gates/{gates[2].Id}/release-notes.txt",
                    ContentType = "text/plain",
                    FileSize = 512,
                    UploadedAt = createdAt.AddDays(-4),
                    IsRequired = true,
                    Category = EvidenceCategory.Operasyon,
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                }, cancellationToken);
            }
        }

        var pmProject = projects.FirstOrDefault();
        if (pmProject is not null)
        {
            await dbContext.Notifications.AddRangeAsync(
                new[]
                {
                new Notification
                {
                    Id = Guid.NewGuid(),
                    RecipientUserId = qa.Id,
                    ProjectId = pmProject.Id,
                    Title = "Gate 4 Onayı Bekliyor",
                    Content = $"{pmProject.Name} için test onayı bekleniyor.",
                    Type = NotificationType.GateApproval,
                    IsRead = false,
                    SentAt = createdAt.AddMinutes(-25),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new Notification
                {
                    Id = Guid.NewGuid(),
                    RecipientUserId = admin.Id,
                    ProjectId = pmProject.Id,
                    Title = "Stage Gate Güncellemesi",
                    Content = $"{pmProject.Name} üzerinde yeni stage gate aktivitesi var.",
                    Type = NotificationType.GateApproval,
                    IsRead = false,
                    SentAt = createdAt.AddMinutes(-10),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                },
                cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureProjectMetadataAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        var projects = await dbContext.Projects.ToListAsync(cancellationToken);

        foreach (var project in projects)
        {
            switch (project.Id)
            {
                case var id when id == SeedDataIds.ProjectOne:
                    project.Code = "PMO-REG-001";
                    project.Description = "Yeni regülasyon maddelerine uyum için süreç ve sistem geliştirmeleri.";
                    project.BusinessOwner = "Operasyon Direktörlüğü";
                    project.Sponsor = "Ceren Yıldız";
                    project.Priority = ProjectPriority.Critical;
                    project.PlannedStartDate = new DateTime(2025, 12, 15, 0, 0, 0, DateTimeKind.Utc);
                    project.PlannedEndDate = new DateTime(2026, 03, 05, 0, 0, 0, DateTimeKind.Utc);
                    project.ExpectedGoLiveDate = new DateTime(2026, 03, 10, 0, 0, 0, DateTimeKind.Utc);
                    project.ActualGoLiveDate = null;
                    project.Budget = 2750000m;
                    project.Department = "Uyum ve Operasyon";
                    project.Notes = "UAT reject oranı yüksek olduğu için yakın takipte.";
                    break;
                case var id when id == SeedDataIds.ProjectTwo:
                    project.Code = "PMO-PRD-002";
                    project.Description = "Mobil cüzdan uygulamasının ikinci faz ürün geliştirmeleri.";
                    project.BusinessOwner = "Dijital Kanallar";
                    project.Sponsor = "Burak Deniz";
                    project.Priority = ProjectPriority.High;
                    project.PlannedStartDate = new DateTime(2026, 01, 05, 0, 0, 0, DateTimeKind.Utc);
                    project.PlannedEndDate = new DateTime(2026, 03, 15, 0, 0, 0, DateTimeKind.Utc);
                    project.ExpectedGoLiveDate = new DateTime(2026, 03, 20, 0, 0, 0, DateTimeKind.Utc);
                    project.ActualGoLiveDate = null;
                    project.Budget = 1800000m;
                    project.Department = "Ürün Yönetimi";
                    project.Notes = "Dış paydaş API bağımlılığı nedeniyle sarı riskte.";
                    break;
                case var id when id == SeedDataIds.ProjectThree:
                    project.Code = "PMO-INF-003";
                    project.Description = "API katmanının modernizasyonu ve güvenlik iyileştirmeleri.";
                    project.BusinessOwner = "Platform Mühendisliği";
                    project.Sponsor = "Murat Korkmaz";
                    project.Priority = ProjectPriority.Medium;
                    project.PlannedStartDate = new DateTime(2026, 07, 01, 0, 0, 0, DateTimeKind.Utc);
                    project.PlannedEndDate = new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc);
                    project.ExpectedGoLiveDate = new DateTime(2026, 11, 01, 0, 0, 0, DateTimeKind.Utc);
                    project.ActualGoLiveDate = null;
                    project.Budget = 950000m;
                    project.Department = "Altyapı";
                    project.Notes = "Charter henüz oluşturulmadı; empty state senaryosu için bırakıldı.";
                    break;
                case var id when id == SeedDataIds.ProjectFour:
                    project.Code = "PMO-PRD-004";
                    project.Description = "Sahtekarlık tespit motorunun üçüncü versiyon geliştirmesi.";
                    project.BusinessOwner = "Risk Yönetimi";
                    project.Sponsor = "Duygu Akalın";
                    project.Priority = ProjectPriority.High;
                    project.PlannedStartDate = new DateTime(2026, 05, 10, 0, 0, 0, DateTimeKind.Utc);
                    project.PlannedEndDate = new DateTime(2026, 10, 01, 0, 0, 0, DateTimeKind.Utc);
                    project.ExpectedGoLiveDate = new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc);
                    project.ActualGoLiveDate = null;
                    project.Budget = 2100000m;
                    project.Department = "Risk ve Analitik";
                    project.Notes = "Bütçe komitesi onayı bekleniyor.";
                    break;
                case var id when id == SeedDataIds.ProjectFive:
                    project.Code = "PMO-INT-005";
                    project.Description = "Kart servisleri ile dış sistem entegrasyonu tamamlandı.";
                    project.BusinessOwner = "Kart Operasyonları";
                    project.Sponsor = "Selçuk Taş";
                    project.Priority = ProjectPriority.Medium;
                    project.PlannedStartDate = new DateTime(2025, 11, 15, 0, 0, 0, DateTimeKind.Utc);
                    project.PlannedEndDate = new DateTime(2026, 03, 12, 0, 0, 0, DateTimeKind.Utc);
                    project.ExpectedGoLiveDate = new DateTime(2026, 03, 17, 0, 0, 0, DateTimeKind.Utc);
                    project.ActualGoLiveDate = new DateTime(2026, 03, 17, 0, 0, 0, DateTimeKind.Utc);
                    project.Budget = 1200000m;
                    project.Department = "Entegrasyon";
                    project.Notes = "Closure raporu hazırlanıyor.";
                    break;
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureProjectChartersAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        if (await dbContext.ProjectCharters.AnyAsync(cancellationToken))
        {
            return;
        }

        var createdAt = DateTime.UtcNow;
        await dbContext.ProjectCharters.AddRangeAsync(
            new[]
            {
                new ProjectCharter
                {
                    Id = Guid.NewGuid(),
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
                    CreatedBy = "seed"
                },
                new ProjectCharter
                {
                    Id = Guid.NewGuid(),
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
                    CreatedBy = "seed"
                },
                new ProjectCharter
                {
                    Id = Guid.NewGuid(),
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
                    CreatedBy = "seed"
                }
            },
            cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureRaidItemsAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        if (await dbContext.RaidItems.AnyAsync(cancellationToken))
        {
            return;
        }

        var createdAt = DateTime.UtcNow;
        var projects = await dbContext.Projects.Include(x => x.ProjectManager).ToListAsync(cancellationToken);
        var adminId = await dbContext.UserRoles
            .AsNoTracking()
            .Where(x => x.Role.Name == SystemRoles.PmoAdmin)
            .Select(x => x.UserId)
            .FirstAsync(cancellationToken);

        foreach (var project in projects)
        {
            var ownerName = $"{project.ProjectManager.FirstName} {project.ProjectManager.LastName}".Trim();
            var expectedDate = project.ExpectedGoLiveDate ?? createdAt.AddDays(30);

            var items = new[]
            {
                new RaidItem
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    Type = RaidItemType.Risk,
                    Title = $"{project.Name} kritik entegrasyon riski",
                    Description = "Dış paydaş teslimat gecikirse proje takvimi etkilenebilir.",
                    Status = project.Id == SeedDataIds.ProjectOne ? RaidStatus.Open : RaidStatus.InProgress,
                    Priority = project.Id == SeedDataIds.ProjectOne ? RaidPriority.Critical : RaidPriority.High,
                    Impact = RaidImpact.High,
                    Owner = ownerName,
                    ActionPlan = "Haftalık eskalasyon ve alternatif plan hazırlanacak.",
                    DueDate = expectedDate.AddDays(-15),
                    ResolvedDate = null,
                    Note = project.Id == SeedDataIds.ProjectOne ? "Kritik seviyede takip ediliyor." : "Mitigasyon çalışması başladı.",
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new RaidItem
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    Type = RaidItemType.Risk,
                    Title = $"{project.Name} kapasite riski",
                    Description = "Ekip kapasitesi sprint hedeflerini zorlayabilir.",
                    Status = RaidStatus.Mitigated,
                    Priority = RaidPriority.Medium,
                    Impact = RaidImpact.Medium,
                    Owner = ownerName,
                    ActionPlan = "Kaynak planı güncellendi.",
                    DueDate = expectedDate.AddDays(-7),
                    ResolvedDate = createdAt.AddDays(-2),
                    Note = "Ek kaynak devreye alındı.",
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new RaidItem
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    Type = RaidItemType.Issue,
                    Title = $"{project.Name} test ortamı sorunu",
                    Description = "Test ortamında sertifika uyuşmazlığı gözlendi.",
                    Status = project.Id == SeedDataIds.ProjectTwo ? RaidStatus.Open : RaidStatus.Closed,
                    Priority = RaidPriority.High,
                    Impact = RaidImpact.High,
                    Owner = ownerName,
                    ActionPlan = "Altyapı ekibi ile sertifika yenilemesi planlandı.",
                    DueDate = project.Id == SeedDataIds.ProjectTwo ? createdAt.AddDays(-3) : createdAt.AddDays(-10),
                    ResolvedDate = project.Id == SeedDataIds.ProjectTwo ? null : createdAt.AddDays(-1),
                    Note = project.Id == SeedDataIds.ProjectTwo ? "Overdue issue senaryosu." : "Kapatıldı.",
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new RaidItem
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    Type = RaidItemType.Assumption,
                    Title = $"{project.Name} dış onay varsayımı",
                    Description = "İlgili iş biriminin onaylarının planlanan tarihte geleceği varsayılıyor.",
                    Status = RaidStatus.Accepted,
                    Priority = null,
                    Impact = null,
                    Owner = ownerName,
                    ActionPlan = "Haftalık kontrol yapılacak.",
                    DueDate = expectedDate.AddDays(-20),
                    ResolvedDate = null,
                    Note = "Varsayım kaydı",
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                },
                new RaidItem
                {
                    Id = Guid.NewGuid(),
                    ProjectId = project.Id,
                    Type = RaidItemType.Dependency,
                    Title = $"{project.Name} vendor bağımlılığı",
                    Description = "Vendor teknik ekibinden doküman teslimi bekleniyor.",
                    Status = RaidStatus.Blocked,
                    Priority = null,
                    Impact = null,
                    Owner = ownerName,
                    ActionPlan = "Vendor toplantısı planlandı.",
                    DueDate = expectedDate.AddDays(-12),
                    ResolvedDate = null,
                    Note = "Harici bağımlılık",
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                }
            };

            await dbContext.RaidItems.AddRangeAsync(items, cancellationToken);

            if (items[0].Priority == RaidPriority.Critical)
            {
                await dbContext.Notifications.AddAsync(new Notification
                {
                    Id = Guid.NewGuid(),
                    RecipientUserId = adminId,
                    ProjectId = project.Id,
                    Title = "Kritik RAID Riski",
                    Content = $"{project.Name} projesinde kritik risk kaydı seed edildi.",
                    Type = NotificationType.RaidAlert,
                    IsRead = false,
                    SentAt = createdAt.AddMinutes(-15),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                }, cancellationToken);
            }

            if (project.Id == SeedDataIds.ProjectTwo)
            {
                await dbContext.Notifications.AddAsync(new Notification
                {
                    Id = Guid.NewGuid(),
                    RecipientUserId = project.ProjectManagerId,
                    ProjectId = project.Id,
                    Title = "Overdue RAID Issue",
                    Content = $"{project.Name} projesinde geciken issue mevcut.",
                    Type = NotificationType.RaidAlert,
                    IsRead = false,
                    SentAt = createdAt.AddMinutes(-5),
                    CreatedAt = createdAt,
                    CreatedBy = "seed"
                }, cancellationToken);
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
