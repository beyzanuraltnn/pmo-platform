using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PMO.Platform.Infrastructure.Persistence.Migrations
{
    public partial class AddStageGateWorkflowColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrentOwner",
                table: "gates",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentStep",
                table: "gates",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedDate",
                table: "gates",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "gates",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "gates",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "gates",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "OpenDate",
                table: "gates",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2026, 3, 19, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.AddColumn<int>(
                name: "RequiredEvidenceCount",
                table: "gates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ApproverName",
                table: "gate_approvals",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "gate_approvals",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "evidence_files",
                type: "integer",
                nullable: false,
                defaultValue: 6);

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "evidence_files",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "application/octet-stream");

            migrationBuilder.AddColumn<long>(
                name: "FileSize",
                table: "evidence_files",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                table: "evidence_files",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OriginalFileName",
                table: "evidence_files",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UploadedByName",
                table: "evidence_files",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "CurrentOwner", table: "gates");
            migrationBuilder.DropColumn(name: "CurrentStep", table: "gates");
            migrationBuilder.DropColumn(name: "ClosedDate", table: "gates");
            migrationBuilder.DropColumn(name: "Description", table: "gates");
            migrationBuilder.DropColumn(name: "DueDate", table: "gates");
            migrationBuilder.DropColumn(name: "Name", table: "gates");
            migrationBuilder.DropColumn(name: "OpenDate", table: "gates");
            migrationBuilder.DropColumn(name: "RequiredEvidenceCount", table: "gates");
            migrationBuilder.DropColumn(name: "ApproverName", table: "gate_approvals");
            migrationBuilder.DropColumn(name: "Role", table: "gate_approvals");
            migrationBuilder.DropColumn(name: "Category", table: "evidence_files");
            migrationBuilder.DropColumn(name: "ContentType", table: "evidence_files");
            migrationBuilder.DropColumn(name: "FileSize", table: "evidence_files");
            migrationBuilder.DropColumn(name: "IsRequired", table: "evidence_files");
            migrationBuilder.DropColumn(name: "OriginalFileName", table: "evidence_files");
            migrationBuilder.DropColumn(name: "UploadedByName", table: "evidence_files");
        }
    }
}
