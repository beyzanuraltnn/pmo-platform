using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PMO.Platform.Infrastructure.Persistence.Migrations
{
    public partial class AddProjectAndCharterDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ActualGoLiveDate",
                table: "projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Budget",
                table: "projects",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BusinessOwner",
                table: "projects",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "projects",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "projects",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "projects",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpectedGoLiveDate",
                table: "projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "projects",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "PlannedEndDate",
                table: "projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PlannedStartDate",
                table: "projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "projects",
                type: "integer",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.AddColumn<string>(
                name: "Sponsor",
                table: "projects",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ApprovalNotes",
                table: "project_charters",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BudgetSummary",
                table: "project_charters",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Dependencies",
                table: "project_charters",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastReviewedAt",
                table: "project_charters",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Objectives",
                table: "project_charters",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OutOfScope",
                table: "project_charters",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RisksAndAssumptions",
                table: "project_charters",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SuccessCriteria",
                table: "project_charters",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TimelineSummary",
                table: "project_charters",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "project_charters",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.DropColumn(
                name: "GoLiveDate",
                table: "projects");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "project_charters");

            migrationBuilder.DropColumn(
                name: "Risks",
                table: "project_charters");

            migrationBuilder.CreateIndex(
                name: "IX_projects_Code",
                table: "projects",
                column: "Code",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_projects_Code",
                table: "projects");

            migrationBuilder.AddColumn<DateTime>(
                name: "GoLiveDate",
                table: "projects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApprovalStatus",
                table: "project_charters",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Risks",
                table: "project_charters",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.DropColumn(name: "ActualGoLiveDate", table: "projects");
            migrationBuilder.DropColumn(name: "Budget", table: "projects");
            migrationBuilder.DropColumn(name: "BusinessOwner", table: "projects");
            migrationBuilder.DropColumn(name: "Code", table: "projects");
            migrationBuilder.DropColumn(name: "Department", table: "projects");
            migrationBuilder.DropColumn(name: "Description", table: "projects");
            migrationBuilder.DropColumn(name: "ExpectedGoLiveDate", table: "projects");
            migrationBuilder.DropColumn(name: "Notes", table: "projects");
            migrationBuilder.DropColumn(name: "PlannedEndDate", table: "projects");
            migrationBuilder.DropColumn(name: "PlannedStartDate", table: "projects");
            migrationBuilder.DropColumn(name: "Priority", table: "projects");
            migrationBuilder.DropColumn(name: "Sponsor", table: "projects");
            migrationBuilder.DropColumn(name: "ApprovalNotes", table: "project_charters");
            migrationBuilder.DropColumn(name: "BudgetSummary", table: "project_charters");
            migrationBuilder.DropColumn(name: "Dependencies", table: "project_charters");
            migrationBuilder.DropColumn(name: "LastReviewedAt", table: "project_charters");
            migrationBuilder.DropColumn(name: "Objectives", table: "project_charters");
            migrationBuilder.DropColumn(name: "OutOfScope", table: "project_charters");
            migrationBuilder.DropColumn(name: "RisksAndAssumptions", table: "project_charters");
            migrationBuilder.DropColumn(name: "SuccessCriteria", table: "project_charters");
            migrationBuilder.DropColumn(name: "TimelineSummary", table: "project_charters");
            migrationBuilder.DropColumn(name: "Version", table: "project_charters");
        }
    }
}
