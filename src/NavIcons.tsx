using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PMO.Platform.Infrastructure.Persistence.Migrations
{
    public partial class SeedDashboardAndAuthData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("6a95d67e-50bb-47b2-8c12-0accce100001"),
                column: "PasswordHash",
                value: "3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"),
                column: "PasswordHash",
                value: "f769c1b9afc265d893a90c9518e3e56c4fbacb64f737e42f251a426ec13f6435");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("6a95d67e-50bb-47b2-8c12-0accce100003"),
                column: "PasswordHash",
                value: "0a0c7d6782d01e5d84bb6ce527757e94e9dba60e5a1de73c49a4fd0c5d946670");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("6a95d67e-50bb-47b2-8c12-0accce100004"),
                column: "PasswordHash",
                value: "090368d31d3a9252525bd7054b042d1d4d9b15c3e8f2d3824c1354b5be1ea269");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("6a95d67e-50bb-47b2-8c12-0accce100005"),
                column: "PasswordHash",
                value: "681973b8bfe0e2aec109b9b67bcdf2354778cbfb90c6c48bb4dc50a3063666ce");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("6a95d67e-50bb-47b2-8c12-0accce100006"),
                column: "PasswordHash",
                value: "40f0011a0fc99df63574b4ca7c06af4670c938cdec09d66ec6e93dbb11b827ef");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("6a95d67e-50bb-47b2-8c12-0accce100007"),
                column: "PasswordHash",
                value: "dcf4b36fc6332ad1b6a8e0b5d59f4e7eaf6975dd61522699d1e05df0ca0d3b76");

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "Id",
                keyValue: new Guid("907f5355-2ad0-4aa9-a198-30b432100001"),
                columns: new[] { "GoLiveDate", "RagStatus", "Stage" },
                values: new object[] { new DateTime(2026, 3, 10, 0, 0, 0, DateTimeKind.Utc), 3, 4 });

            migrationBuilder.UpdateData(
                table: "projects",
                keyColumn: "Id",
                keyValue: new Guid("907f5355-2ad0-4aa9-a198-30b432100002"),
                columns: new[] { "GoLiveDate", "RagStatus" },
                values: new object[] { new DateTime(2026, 3, 20, 0, 0, 0, DateTimeKind.Utc), 2 });

            migrationBuilder.InsertData(
                table: "projects",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "GoLiveDate", "Name", "ProjectManagerId", "RagStatus", "Stage", "Status", "Type", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("907f5355-2ad0-4aa9-a198-30b432100004"), new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc), "seed", new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc), "Fraud Detection v3", new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), 2, 1, 1, 3, null, null },
                    { new Guid("907f5355-2ad0-4aa9-a198-30b432100005"), new DateTime(2026, 2, 17, 0, 0, 0, DateTimeKind.Utc), "seed", new DateTime(2026, 3, 17, 0, 0, 0, DateTimeKind.Utc), "Kart Servisi Entegrasyon", new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), 1, 6, 3, 2, null, null }
                });

            migrationBuilder.InsertData(
                table: "gates",
                columns: new[] { "Id", "ClosedAt", "CreatedAt", "CreatedBy", "GateNo", "OpenedAt", "ProjectId", "Status", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("b07f5355-2ad0-4aa9-a198-30b432100001"), null, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", 4, new DateTime(2026, 3, 10, 0, 0, 0, DateTimeKind.Utc), new Guid("907f5355-2ad0-4aa9-a198-30b432100001"), 1, null, null },
                    { new Guid("b07f5355-2ad0-4aa9-a198-30b432100002"), null, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", 3, new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc), new Guid("907f5355-2ad0-4aa9-a198-30b432100002"), 2, null, null },
                    { new Guid("b07f5355-2ad0-4aa9-a198-30b432100003"), null, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", 1, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), new Guid("907f5355-2ad0-4aa9-a198-30b432100003"), 1, null, null },
                    { new Guid("b07f5355-2ad0-4aa9-a198-30b432100004"), null, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", 1, new DateTime(2026, 3, 17, 0, 0, 0, DateTimeKind.Utc), new Guid("907f5355-2ad0-4aa9-a198-30b432100004"), 1, null, null },
                    { new Guid("b07f5355-2ad0-4aa9-a198-30b432100005"), new DateTime(2026, 3, 16, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", 6, new DateTime(2026, 3, 3, 0, 0, 0, DateTimeKind.Utc), new Guid("907f5355-2ad0-4aa9-a198-30b432100005"), 3, null, null }
                });

            migrationBuilder.InsertData(
                table: "notifications",
                columns: new[] { "Id", "Content", "CreatedAt", "CreatedBy", "GateId", "ProjectId", "RecipientUserId", "SentAt", "Title", "Type", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { new Guid("c07f5355-2ad0-4aa9-a198-30b432100001"), "Regülasyon Uyum Projesi için QA onayı 8 gündür bekliyor.", new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", new Guid("b07f5355-2ad0-4aa9-a198-30b432100001"), new Guid("907f5355-2ad0-4aa9-a198-30b432100001"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100001"), new DateTime(2026, 3, 17, 23, 40, 0, DateTimeKind.Utc), "Gate 4 Onayı Bekliyor", 1, null, null },
                    { new Guid("c07f5355-2ad0-4aa9-a198-30b432100002"), "Mobil Cüzdan v2 projesinde geliştirme milestone hedefi gecikti.", new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", new Guid("b07f5355-2ad0-4aa9-a198-30b432100002"), new Guid("907f5355-2ad0-4aa9-a198-30b432100002"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100002"), new DateTime(2026, 3, 17, 22, 0, 0, DateTimeKind.Utc), "Milestone Gecikmesi", 3, null, null },
                    { new Guid("c07f5355-2ad0-4aa9-a198-30b432100003"), "Regülasyon Uyum Projesi kritik risk seviyesine yükseldi.", new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", new Guid("b07f5355-2ad0-4aa9-a198-30b432100001"), new Guid("907f5355-2ad0-4aa9-a198-30b432100001"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100006"), new DateTime(2026, 3, 17, 19, 0, 0, DateTimeKind.Utc), "Kritik Risk Eskalasyonu", 4, null, null },
                    { new Guid("c07f5355-2ad0-4aa9-a198-30b432100004"), "Haftalık portföy özeti üretildi.", new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), "seed", new Guid("b07f5355-2ad0-4aa9-a198-30b432100005"), new Guid("907f5355-2ad0-4aa9-a198-30b432100005"), new Guid("6a95d67e-50bb-47b2-8c12-0accce100007"), new DateTime(2026, 3, 17, 23, 55, 0, DateTimeKind.Utc), "Haftalık Dashboard Hazır", 1, null, null }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(table: "notifications", keyColumn: "Id", keyValue: new Guid("c07f5355-2ad0-4aa9-a198-30b432100001"));
            migrationBuilder.DeleteData(table: "notifications", keyColumn: "Id", keyValue: new Guid("c07f5355-2ad0-4aa9-a198-30b432100002"));
            migrationBuilder.DeleteData(table: "notifications", keyColumn: "Id", keyValue: new Guid("c07f5355-2ad0-4aa9-a198-30b432100003"));
            migrationBuilder.DeleteData(table: "notifications", keyColumn: "Id", keyValue: new Guid("c07f5355-2ad0-4aa9-a198-30b432100004"));

            migrationBuilder.DeleteData(table: "gates", keyColumn: "Id", keyValue: new Guid("b07f5355-2ad0-4aa9-a198-30b432100001"));
            migrationBuilder.DeleteData(table: "gates", keyColumn: "Id", keyValue: new Guid("b07f5355-2ad0-4aa9-a198-30b432100002"));
            migrationBuilder.DeleteData(table: "gates", keyColumn: "Id", keyValue: new Guid("b07f5355-2ad0-4aa9-a198-30b432100003"));
            migrationBuilder.DeleteData(table: "gates", keyColumn: "Id", keyValue: new Guid("b07f5355-2ad0-4aa9-a198-30b432100004"));
            migrationBuilder.DeleteData(table: "gates", keyColumn: "Id", keyValue: new Guid("b07f5355-2ad0-4aa9-a198-30b432100005"));

            migrationBuilder.DeleteData(table: "projects", keyColumn: "Id", keyValue: new Guid("907f5355-2ad0-4aa9-a198-30b432100004"));
            migrationBuilder.DeleteData(table: "projects", keyColumn: "Id", keyValue: new Guid("907f5355-2ad0-4aa9-a198-30b432100005"));
        }
    }
}
