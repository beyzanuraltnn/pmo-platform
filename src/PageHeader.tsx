using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PMO.Platform.Infrastructure.Persistence;

#nullable disable

namespace PMO.Platform.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("PMO.Platform.Domain.Entities.EvidenceFile", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<Guid?>("GateApprovalId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("GateId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<DateTime>("UploadedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("UploadedById")
                        .HasColumnType("uuid");

                    b.HasKey("Id");

                    b.HasIndex("GateApprovalId");

                    b.HasIndex("GateId");

                    b.HasIndex("UploadedById");

                    b.ToTable("evidence_files", (string)null);
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.Gate", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("ClosedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<int>("GateNo")
                        .HasColumnType("integer");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<DateTime>("OpenedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId", "GateNo")
                        .IsUnique();

                    b.ToTable("gates", (string)null);
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.GateApproval", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("ApproverId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<DateTime?>("DecisionAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("GateId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("Note")
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("ApproverId");

                    b.HasIndex("GateId");

                    b.ToTable("gate_approvals", (string)null);
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.Notification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<Guid?>("GateId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsRead")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<Guid?>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RecipientUserId")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("SentAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("GateId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("RecipientUserId");

                    b.ToTable("notifications", (string)null);
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<DateTime?>("GoLiveDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<Guid>("ProjectManagerId")
                        .HasColumnType("uuid");

                    b.Property<int>("RagStatus")
                        .HasColumnType("integer");

                    b.Property<int>("Stage")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("ProjectManagerId");

                    b.ToTable("projects", (string)null);

                    b.HasData(
                        new
                        {
                            Id = new Guid("907f5355-2ad0-4aa9-a198-30b432100001"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            GoLiveDate = new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc),
                            IsDeleted = false,
                            Name = "Regülasyon Uyum Projesi",
                            ProjectManagerId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"),
                            RagStatus = 2,
                            Stage = 2,
                            Status = 2,
                            Type = 1
                        },
                        new
                        {
                            Id = new Guid("907f5355-2ad0-4aa9-a198-30b432100002"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            GoLiveDate = new DateTime(2026, 8, 15, 0, 0, 0, DateTimeKind.Utc),
                            IsDeleted = false,
                            Name = "Mobil Cüzdan v2",
                            ProjectManagerId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"),
                            RagStatus = 3,
                            Stage = 3,
                            Status = 2,
                            Type = 3
                        },
                        new
                        {
                            Id = new Guid("907f5355-2ad0-4aa9-a198-30b432100003"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            GoLiveDate = new DateTime(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc),
                            IsDeleted = false,
                            Name = "API Gateway Modernizasyonu",
                            ProjectManagerId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"),
                            RagStatus = 1,
                            Stage = 1,
                            Status = 1,
                            Type = 4
                        });
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.ProjectCharter", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("ApprovalStatus")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<string>("Purpose")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("character varying(1000)");

                    b.Property<string>("Risks")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)");

                    b.Property<string>("Scope")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)");

                    b.Property<string>("Stakeholders")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId")
                        .IsUnique();

                    b.ToTable("project_charters", (string)null);
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("character varying(250)");

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("NormalizedName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.HasIndex("NormalizedName")
                        .IsUnique();

                    b.ToTable("roles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200001"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Description = "PMO Yöneticisi",
                            IsDeleted = false,
                            Name = "PMO_ADMIN",
                            NormalizedName = "PMO_ADMIN"
                        },
                        new
                        {
                            Id = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200002"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Description = "Proje Yöneticisi",
                            IsDeleted = false,
                            Name = "PROJECT_MANAGER",
                            NormalizedName = "PROJECT_MANAGER"
                        },
                        new
                        {
                            Id = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200003"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Description = "Ürün Yöneticisi",
                            IsDeleted = false,
                            Name = "PRODUCT_MANAGER",
                            NormalizedName = "PRODUCT_MANAGER"
                        },
                        new
                        {
                            Id = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200004"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Description = "Teknik Lider",
                            IsDeleted = false,
                            Name = "TECH_LEAD",
                            NormalizedName = "TECH_LEAD"
                        },
                        new
                        {
                            Id = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200005"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Description = "Kalite Güvence",
                            IsDeleted = false,
                            Name = "QA",
                            NormalizedName = "QA"
                        },
                        new
                        {
                            Id = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200006"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Description = "CTO",
                            IsDeleted = false,
                            Name = "CTO",
                            NormalizedName = "CTO"
                        },
                        new
                        {
                            Id = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200007"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Description = "Gözlemci",
                            IsDeleted = false,
                            Name = "VIEWER",
                            NormalizedName = "VIEWER"
                        });
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("CreatedBy")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<bool>("IsActive")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(true);

                    b.Property<bool>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("character varying(512)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UpdatedBy")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("users", (string)null);

                    b.HasData(
                        new
                        {
                            Id = new Guid("6a95d67e-50bb-47b2-8c12-0accce100001"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Email = "admin@pmo.local",
                            FirstName = "Pelin",
                            IsActive = true,
                            IsDeleted = false,
                            LastName = "Yılmaz",
                            PasswordHash = "DEMO_HASH_ADMIN"
                        },
                        new
                        {
                            Id = new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Email = "pm@pmo.local",
                            FirstName = "Emre",
                            IsActive = true,
                            IsDeleted = false,
                            LastName = "Kaya",
                            PasswordHash = "DEMO_HASH_PM"
                        },
                        new
                        {
                            Id = new Guid("6a95d67e-50bb-47b2-8c12-0accce100003"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Email = "product@pmo.local",
                            FirstName = "Selin",
                            IsActive = true,
                            IsDeleted = false,
                            LastName = "Aksoy",
                            PasswordHash = "DEMO_HASH_PRODUCT"
                        },
                        new
                        {
                            Id = new Guid("6a95d67e-50bb-47b2-8c12-0accce100004"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Email = "techlead@pmo.local",
                            FirstName = "Mert",
                            IsActive = true,
                            IsDeleted = false,
                            LastName = "Demir",
                            PasswordHash = "DEMO_HASH_TECHLEAD"
                        },
                        new
                        {
                            Id = new Guid("6a95d67e-50bb-47b2-8c12-0accce100005"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Email = "qa@pmo.local",
                            FirstName = "Zeynep",
                            IsActive = true,
                            IsDeleted = false,
                            LastName = "Akın",
                            PasswordHash = "DEMO_HASH_QA"
                        },
                        new
                        {
                            Id = new Guid("6a95d67e-50bb-47b2-8c12-0accce100006"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Email = "cto@pmo.local",
                            FirstName = "Can",
                            IsActive = true,
                            IsDeleted = false,
                            LastName = "Arslan",
                            PasswordHash = "DEMO_HASH_CTO"
                        },
                        new
                        {
                            Id = new Guid("6a95d67e-50bb-47b2-8c12-0accce100007"),
                            CreatedAt = new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc),
                            CreatedBy = "seed",
                            Email = "viewer@pmo.local",
                            FirstName = "Ayşe",
                            IsActive = true,
                            IsDeleted = false,
                            LastName = "Şahin",
                            PasswordHash = "DEMO_HASH_VIEWER"
                        });
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.UserRole", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uuid");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("user_roles", (string)null);

                    b.HasData(
                        new { UserId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100001"), RoleId = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200001") },
                        new { UserId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), RoleId = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200002") },
                        new { UserId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100003"), RoleId = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200003") },
                        new { UserId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100004"), RoleId = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200004") },
                        new { UserId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100005"), RoleId = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200005") },
                        new { UserId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100006"), RoleId = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200006") },
                        new { UserId = new Guid("6a95d67e-50bb-47b2-8c12-0accce100007"), RoleId = new Guid("3d16d95f-87af-42e5-9d44-39a2ce200007") });
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.EvidenceFile", b =>
                {
                    b.HasOne("PMO.Platform.Domain.Entities.GateApproval", "GateApproval")
                        .WithMany("EvidenceFiles")
                        .HasForeignKey("GateApprovalId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("PMO.Platform.Domain.Entities.Gate", "Gate")
                        .WithMany("EvidenceFiles")
                        .HasForeignKey("GateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PMO.Platform.Domain.Entities.User", "UploadedBy")
                        .WithMany("UploadedEvidenceFiles")
                        .HasForeignKey("UploadedById")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Gate");

                    b.Navigation("GateApproval");

                    b.Navigation("UploadedBy");
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.Gate", b =>
                {
                    b.HasOne("PMO.Platform.Domain.Entities.Project", "Project")
                        .WithMany("Gates")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.GateApproval", b =>
                {
                    b.HasOne("PMO.Platform.Domain.Entities.User", "Approver")
                        .WithMany("GateApprovals")
                        .HasForeignKey("ApproverId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("PMO.Platform.Domain.Entities.Gate", "Gate")
                        .WithMany("Approvals")
                        .HasForeignKey("GateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Approver");

                    b.Navigation("Gate");
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.Notification", b =>
                {
                    b.HasOne("PMO.Platform.Domain.Entities.Gate", "Gate")
                        .WithMany("Notifications")
                        .HasForeignKey("GateId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("PMO.Platform.Domain.Entities.Project", "Project")
                        .WithMany("Notifications")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("PMO.Platform.Domain.Entities.User", "RecipientUser")
                        .WithMany("Notifications")
                        .HasForeignKey("RecipientUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gate");

                    b.Navigation("Project");

                    b.Navigation("RecipientUser");
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.Project", b =>
                {
                    b.HasOne("PMO.Platform.Domain.Entities.User", "ProjectManager")
                        .WithMany("ManagedProjects")
                        .HasForeignKey("ProjectManagerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("ProjectManager");
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.ProjectCharter", b =>
                {
                    b.HasOne("PMO.Platform.Domain.Entities.Project", "Project")
                        .WithOne("Charter")
                        .HasForeignKey("PMO.Platform.Domain.Entities.ProjectCharter", "ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("PMO.Platform.Domain.Entities.UserRole", b =>
                {
                    b.HasOne("PMO.Platform.Domain.Entities.Role", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PMO.Platform.Domain.Entities.User", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });
        }
    }
}
