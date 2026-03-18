using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PMO.Platform.Infrastructure.Persistence.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NormalizedName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user_roles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_roles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_user_roles_roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_roles_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    RagStatus = table.Column<int>(type: "integer", nullable: false),
                    Stage = table.Column<int>(type: "integer", nullable: false),
                    GoLiveDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectManagerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_projects_users_ProjectManagerId",
                        column: x => x.ProjectManagerId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "gates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    GateNo = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    OpenedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClosedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_gates_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipientUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    GateId = table.Column<Guid>(type: "uuid", nullable: true),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notifications_gates_GateId",
                        column: x => x.GateId,
                        principalTable: "gates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_notifications_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_notifications_users_RecipientUserId",
                        column: x => x.RecipientUserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_charters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Purpose = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Scope = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Stakeholders = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Risks = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    ApprovalStatus = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_charters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_project_charters_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "gate_approvals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GateId = table.Column<Guid>(type: "uuid", nullable: false),
                    ApproverId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    DecisionAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gate_approvals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_gate_approvals_gates_GateId",
                        column: x => x.GateId,
                        principalTable: "gates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_gate_approvals_users_ApproverId",
                        column: x => x.ApproverId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "evidence_files",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GateId = table.Column<Guid>(type: "uuid", nullable: false),
                    GateApprovalId = table.Column<Guid>(type: "uuid", nullable: true),
                    UploadedById = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_evidence_files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_evidence_files_gate_approvals_GateApprovalId",
                        column: x => x.GateApprovalId,
                        principalTable: "gate_approvals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_evidence_files_gates_GateId",
                        column: x => x.GateId,
                        principalTable: "gates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_evidence_files_users_UploadedById",
                        column: x => x.UploadedById,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Description", "Name", "NormalizedName", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200001"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "PMO Yöneticisi", "PMO_ADMIN", "PMO_ADMIN", null, null },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200002"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "Proje Yöneticisi", "PROJECT_MANAGER", "PROJECT_MANAGER", null, null },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200003"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "Ürün Yöneticisi", "PRODUCT_MANAGER", "PRODUCT_MANAGER", null, null },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200004"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "Teknik Lider", "TECH_LEAD", "TECH_LEAD", null, null },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200005"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "Kalite Güvence", "QA", "QA", null, null },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200006"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "CTO", "CTO", "CTO", null, null },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200007"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "Gözlemci", "VIEWER", "VIEWER", null, null }
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Email", "FirstName", "LastName", "PasswordHash", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("6a95d67e-50bb-47b2-8c12-0accce100001"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "admin@pmo.local", "Pelin", "Yılmaz", "DEMO_HASH_ADMIN", null, null },
                    { new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "pm@pmo.local", "Emre", "Kaya", "DEMO_HASH_PM", null, null },
                    { new Guid("6a95d67e-50bb-47b2-8c12-0accce100003"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "product@pmo.local", "Selin", "Aksoy", "DEMO_HASH_PRODUCT", null, null },
                    { new Guid("6a95d67e-50bb-47b2-8c12-0accce100004"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "techlead@pmo.local", "Mert", "Demir", "DEMO_HASH_TECHLEAD", null, null },
                    { new Guid("6a95d67e-50bb-47b2-8c12-0accce100005"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "qa@pmo.local", "Zeynep", "Akın", "DEMO_HASH_QA", null, null },
                    { new Guid("6a95d67e-50bb-47b2-8c12-0accce100006"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "cto@pmo.local", "Can", "Arslan", "DEMO_HASH_CTO", null, null },
                    { new Guid("6a95d67e-50bb-47b2-8c12-0accce100007"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", "viewer@pmo.local", "Ayşe", "Şahin", "DEMO_HASH_VIEWER", null, null }
                });

            migrationBuilder.InsertData(
                table: "projects",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "GoLiveDate", "Name", "ProjectManagerId", "RagStatus", "Stage", "Status", "Type", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("907f5355-2ad0-4aa9-a198-30b432100001"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc), "Regülasyon Uyum Projesi", new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), 2, 2, 2, 1, null, null },
                    { new Guid("907f5355-2ad0-4aa9-a198-30b432100002"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", new DateTime(2026, 8, 15, 0, 0, 0, DateTimeKind.Utc), "Mobil Cüzdan v2", new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), 3, 3, 2, 3, null, null },
                    { new Guid("907f5355-2ad0-4aa9-a198-30b432100003"), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", new DateTime(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc), "API Gateway Modernizasyonu", new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), 1, 1, 1, 4, null, null }
                });

            migrationBuilder.InsertData(
                table: "user_roles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200001"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100001") },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200002"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100002") },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200003"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100003") },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200004"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100004") },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200005"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100005") },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200006"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100006") },
                    { new Guid("3d16d95f-87af-42e5-9d44-39a2ce200007"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100007") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_evidence_files_GateApprovalId",
                table: "evidence_files",
                column: "GateApprovalId");

            migrationBuilder.CreateIndex(
                name: "IX_evidence_files_GateId",
                table: "evidence_files",
                column: "GateId");

            migrationBuilder.CreateIndex(
                name: "IX_evidence_files_UploadedById",
                table: "evidence_files",
                column: "UploadedById");

            migrationBuilder.CreateIndex(
                name: "IX_gate_approvals_ApproverId",
                table: "gate_approvals",
                column: "ApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_gate_approvals_GateId",
                table: "gate_approvals",
                column: "GateId");

            migrationBuilder.CreateIndex(
                name: "IX_gates_ProjectId_GateNo",
                table: "gates",
                columns: new[] { "ProjectId", "GateNo" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_notifications_GateId",
                table: "notifications",
                column: "GateId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_ProjectId",
                table: "notifications",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_RecipientUserId",
                table: "notifications",
                column: "RecipientUserId");

            migrationBuilder.CreateIndex(
                name: "IX_project_charters_ProjectId",
                table: "project_charters",
                column: "ProjectId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_projects_ProjectManagerId",
                table: "projects",
                column: "ProjectManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_roles_Name",
                table: "roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_roles_NormalizedName",
                table: "roles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_RoleId",
                table: "user_roles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "evidence_files");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "project_charters");

            migrationBuilder.DropTable(
                name: "user_roles");

            migrationBuilder.DropTable(
                name: "gate_approvals");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "gates");

            migrationBuilder.DropTable(
                name: "projects");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
