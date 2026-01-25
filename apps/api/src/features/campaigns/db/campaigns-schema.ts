import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "@/features/auth/db/auth-schema";

// Lookup table for invitation status
export const invitationStatus = sqliteTable("invitation_status", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
});

// Lookup table for campaign member roles
export const campaignMemberRole = sqliteTable("campaign_member_role", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
});

// Campaign table
export const campaign = sqliteTable("campaign", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	createdBy: text("created_by")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
});

// Campaign member table (with role)
export const campaignMember = sqliteTable("campaign_member", {
	id: text("id").primaryKey(),
	campaignId: text("campaign_id")
		.notNull()
		.references(() => campaign.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	roleId: text("role_id")
		.notNull()
		.references(() => campaignMemberRole.id, { onDelete: "restrict" }),
	joinedAt: integer("joined_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

// Campaign invitation table (using status lookup)
export const campaignInvitation = sqliteTable("campaign_invitation", {
	id: text("id").primaryKey(),
	campaignId: text("campaign_id")
		.notNull()
		.references(() => campaign.id, { onDelete: "cascade" }),
	invitedUserId: text("invited_user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	invitedByUserId: text("invited_by_user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	statusId: text("status_id")
		.notNull()
		.references(() => invitationStatus.id, { onDelete: "restrict" }),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date()),
});
