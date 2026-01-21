import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Permission helper functions for group chat system
 */

// Max sub-groups a member can create
const MAX_SUBGROUPS_PER_MEMBER = 3;

/**
 * Check if a member is active (has active subscription)
 */
export async function isActiveMember(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">
): Promise<boolean> {
  const member = await ctx.db.get(memberId);
  if (!member) return false;
  return member.subscriptionStatus === "active";
}

/**
 * Check if a member can create a group based on type
 */
export async function canCreateGroup(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">,
  groupType: "club-wide" | "sub-group" | "competition" | "class-based"
): Promise<{ allowed: boolean; reason?: string }> {
  // Check if member exists and is active
  const member = await ctx.db.get(memberId);
  if (!member) {
    return { allowed: false, reason: "Member not found" };
  }

  if (member.subscriptionStatus !== "active") {
    return { allowed: false, reason: "Only active members can create groups" };
  }

  // Check admin status for club-wide groups
  if (groupType === "club-wide") {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", member.userId))
      .first();

    if (!admin) {
      return { allowed: false, reason: "Only admins can create club-wide groups" };
    }
  }

  // Check sub-group limit
  if (groupType === "sub-group") {
    const userGroups = await ctx.db
      .query("groups")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", memberId))
      .filter((q) => q.eq(q.field("type"), "sub-group"))
      .collect();

    if (userGroups.length >= MAX_SUBGROUPS_PER_MEMBER) {
      return {
        allowed: false,
        reason: `You can only create up to ${MAX_SUBGROUPS_PER_MEMBER} sub-groups`,
      };
    }
  }

  // Check admin status for competition groups
  if (groupType === "competition") {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", member.userId))
      .first();

    if (!admin) {
      return { allowed: false, reason: "Only admins can create competition groups" };
    }
  }

  // Check admin status for class-based groups
  if (groupType === "class-based") {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_userId", (q) => q.eq("userId", member.userId))
      .first();

    if (!admin) {
      return { allowed: false, reason: "Only admins can create class-based groups" };
    }
  }

  return { allowed: true };
}

/**
 * Check if a member can join a group
 */
export async function canJoinGroup(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">,
  groupId: Id<"groups">
): Promise<{ allowed: boolean; reason?: string }> {
  // Check if member exists and is active
  const member = await ctx.db.get(memberId);
  if (!member) {
    return { allowed: false, reason: "Member not found" };
  }

  if (member.subscriptionStatus !== "active") {
    return { allowed: false, reason: "Only active members can join groups" };
  }

  // Check if group exists
  const group = await ctx.db.get(groupId);
  if (!group) {
    return { allowed: false, reason: "Group not found" };
  }

  if (!group.active) {
    return { allowed: false, reason: "Group is not active" };
  }

  // Check if already a member
  const existingMembership = await ctx.db
    .query("groupMemberships")
    .withIndex("by_groupId_memberId", (q) =>
      q.eq("groupId", groupId).eq("memberId", memberId)
    )
    .first();

  if (existingMembership) {
    return { allowed: false, reason: "Already a member of this group" };
  }

  // Check if group is private (requires invitation)
  if (group.isPrivate) {
    return { allowed: false, reason: "This is a private group. You need an invitation to join." };
  }

  // Check max members limit
  if (group.settings?.maxMembers) {
    const memberCount = await ctx.db
      .query("groupMemberships")
      .withIndex("by_groupId", (q) => q.eq("groupId", groupId))
      .collect();

    if (memberCount.length >= group.settings.maxMembers) {
      return { allowed: false, reason: "Group has reached maximum capacity" };
    }
  }

  return { allowed: true };
}

/**
 * Get member's role in a group
 */
export async function getMemberRole(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">,
  groupId: Id<"groups">
): Promise<"owner" | "admin" | "member" | null> {
  const membership = await ctx.db
    .query("groupMemberships")
    .withIndex("by_groupId_memberId", (q) =>
      q.eq("groupId", groupId).eq("memberId", memberId)
    )
    .first();

  return membership?.role ?? null;
}

/**
 * Check if a member can send messages in a group
 */
export async function canSendMessage(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">,
  groupId: Id<"groups">
): Promise<{ allowed: boolean; reason?: string }> {
  // Check if member is active
  const member = await ctx.db.get(memberId);
  if (!member) {
    return { allowed: false, reason: "Member not found" };
  }

  if (member.subscriptionStatus !== "active") {
    return { allowed: false, reason: "Only active members can send messages" };
  }

  // Check if member is in the group
  const membership = await ctx.db
    .query("groupMemberships")
    .withIndex("by_groupId_memberId", (q) =>
      q.eq("groupId", groupId).eq("memberId", memberId)
    )
    .first();

  if (!membership) {
    return { allowed: false, reason: "You must be a member of this group to send messages" };
  }

  return { allowed: true };
}

/**
 * Check if a member can edit/delete a message
 */
export async function canModifyMessage(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">,
  messageId: Id<"messages">
): Promise<{ allowed: boolean; reason?: string }> {
  const message = await ctx.db.get(messageId);
  if (!message) {
    return { allowed: false, reason: "Message not found" };
  }

  // System messages cannot be modified
  if (message.type === "system") {
    return { allowed: false, reason: "System messages cannot be modified" };
  }

  // Message creator can always edit their own messages
  if (message.senderId === memberId) {
    return { allowed: true };
  }

  // Check if user is group admin/owner
  const role = await getMemberRole(ctx, memberId, message.groupId);
  if (role === "owner" || role === "admin") {
    return { allowed: true };
  }

  return { allowed: false, reason: "You can only modify your own messages" };
}

/**
 * Check if a member can manage group (add/remove members, update settings)
 */
export async function canManageGroup(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">,
  groupId: Id<"groups">
): Promise<{ allowed: boolean; reason?: string }> {
  const role = await getMemberRole(ctx, memberId, groupId);

  if (role === "owner" || role === "admin") {
    return { allowed: true };
  }

  return { allowed: false, reason: "Only group owners and admins can manage the group" };
}

/**
 * Check if a member can invite others to a group
 */
export async function canInviteToGroup(
  ctx: QueryCtx | MutationCtx,
  memberId: Id<"members">,
  groupId: Id<"groups">
): Promise<{ allowed: boolean; reason?: string }> {
  const group = await ctx.db.get(groupId);
  if (!group) {
    return { allowed: false, reason: "Group not found" };
  }

  // Check if member is in the group
  const role = await getMemberRole(ctx, memberId, groupId);
  if (!role) {
    return { allowed: false, reason: "You must be a member of this group to invite others" };
  }

  // Owners and admins can always invite
  if (role === "owner" || role === "admin") {
    return { allowed: true };
  }

  // Check group settings for member invites
  if (group.settings?.allowMemberInvites) {
    return { allowed: true };
  }

  return { allowed: false, reason: "Only group admins can invite members to this group" };
}
