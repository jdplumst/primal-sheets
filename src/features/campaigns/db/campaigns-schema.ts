import { relations } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "@/db/table-creator";
import { user } from "@/features/auth/db/auth-schema";

// Lookup table for invitation status
export const invitationStatus = pgTable("invitation_status", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
});

// Lookup table for campaign member roles
export const campaignMemberRole = pgTable("campaign_member_role", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description"),
});

// Campaign table
export const campaign = pgTable("campaign", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	createdBy: text("created_by")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Campaign member table (with role)
export const campaignMember = pgTable("campaign_member", {
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
	joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Campaign invitation table (using status lookup)
export const campaignInvitation = pgTable("campaign_invitation", {
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
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Relations
export const invitationStatusRelations = relations(
	invitationStatus,
	({ many }) => ({
		invitations: many(campaignInvitation),
	}),
);

export const campaignMemberRoleRelations = relations(
	campaignMemberRole,
	({ many }) => ({
		members: many(campaignMember),
	}),
);

export const campaignRelations = relations(campaign, ({ one, many }) => ({
	creator: one(user, {
		fields: [campaign.createdBy],
		references: [user.id],
	}),
	members: many(campaignMember),
	invitations: many(campaignInvitation),
}));

export const campaignMemberRelations = relations(campaignMember, ({ one }) => ({
	campaign: one(campaign, {
		fields: [campaignMember.campaignId],
		references: [campaign.id],
	}),
	user: one(user, {
		fields: [campaignMember.userId],
		references: [user.id],
	}),
	role: one(campaignMemberRole, {
		fields: [campaignMember.roleId],
		references: [campaignMemberRole.id],
	}),
}));

export const campaignInvitationRelations = relations(
	campaignInvitation,
	({ one }) => ({
		campaign: one(campaign, {
			fields: [campaignInvitation.campaignId],
			references: [campaign.id],
		}),
		invitedUser: one(user, {
			fields: [campaignInvitation.invitedUserId],
			references: [user.id],
		}),
		inviter: one(user, {
			fields: [campaignInvitation.invitedByUserId],
			references: [user.id],
		}),
		status: one(invitationStatus, {
			fields: [campaignInvitation.statusId],
			references: [invitationStatus.id],
		}),
	}),
);
