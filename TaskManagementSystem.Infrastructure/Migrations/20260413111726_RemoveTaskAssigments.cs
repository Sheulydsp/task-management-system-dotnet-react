using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManagementSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTaskAssigments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignments_Tasks_TaskId",
                table: "TaskAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignments_Users_UserId",
                table: "TaskAssignments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskAssignments",
                table: "TaskAssignments");

            migrationBuilder.RenameTable(
                name: "TaskAssignments",
                newName: "TaskAssignment");

            migrationBuilder.RenameIndex(
                name: "IX_TaskAssignments_UserId",
                table: "TaskAssignment",
                newName: "IX_TaskAssignment_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskAssignments_TaskId",
                table: "TaskAssignment",
                newName: "IX_TaskAssignment_TaskId");

            migrationBuilder.AddColumn<int>(
                name: "AssigneeId",
                table: "Tasks",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskAssignment",
                table: "TaskAssignment",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AssigneeId",
                table: "Tasks",
                column: "AssigneeId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignment_Tasks_TaskId",
                table: "TaskAssignment",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignment_Users_UserId",
                table: "TaskAssignment",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_AssigneeId",
                table: "Tasks",
                column: "AssigneeId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignment_Tasks_TaskId",
                table: "TaskAssignment");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskAssignment_Users_UserId",
                table: "TaskAssignment");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_AssigneeId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_AssigneeId",
                table: "Tasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskAssignment",
                table: "TaskAssignment");

            migrationBuilder.DropColumn(
                name: "AssigneeId",
                table: "Tasks");

            migrationBuilder.RenameTable(
                name: "TaskAssignment",
                newName: "TaskAssignments");

            migrationBuilder.RenameIndex(
                name: "IX_TaskAssignment_UserId",
                table: "TaskAssignments",
                newName: "IX_TaskAssignments_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskAssignment_TaskId",
                table: "TaskAssignments",
                newName: "IX_TaskAssignments_TaskId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskAssignments",
                table: "TaskAssignments",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignments_Tasks_TaskId",
                table: "TaskAssignments",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAssignments_Users_UserId",
                table: "TaskAssignments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
