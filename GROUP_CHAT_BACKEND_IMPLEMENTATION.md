# Group Chat Backend Implementation

## Overview

This document describes the complete group chat backend system implemented for the Birkbeck Judo Club application using Convex. The implementation includes database schema, permissions system, group management, and real-time messaging capabilities.

## Implementation Date

January 21, 2026

---

## 1. Database Schema Updates

### File: `/home/user/JUDO/convex/schema.ts`

Added three new tables to support group chat functionality:

### Groups Table

Stores chat group information with support for different group types.

**Fields:**
- `name` (string) - Group name
- `description` (string, optional) - Group description
- `type` (union) - Group type: club-wide, sub-group, competition, class-based
- `createdBy` (Id<members>) - Member who created the group
- `isPrivate` (boolean) - Whether group requires invitation to join
- `autoJoin` (boolean) - Automatically add all active members
- `avatar` (string, optional) - Group avatar URL
- `settings` (object, optional):
  - `allowMemberInvites` (boolean) - Allow non-admin members to invite
  - `allowFileSharing` (boolean) - Enable file attachments
  - `maxMembers` (number, optional) - Maximum member limit
- `classId` (Id<classes>, optional) - Linked class for class-based groups
- `active` (boolean) - Soft delete flag
- `createdAt` (number) - Creation timestamp
- `updatedAt` (number) - Last update timestamp

**Indexes:**
- `by_type` - Query groups by type
- `by_createdBy` - Find groups created by a member
- `by_classId` - Find groups linked to a class
- `by_active` - Query active groups

### Group Memberships Table

Manages member participation in groups with role-based permissions.

**Fields:**
- `groupId` (Id<groups>) - Reference to group
- `memberId` (Id<members>) - Reference to member
- `role` (union) - Member role: owner, admin, member
- `joinedAt` (number) - Join timestamp
- `lastReadAt` (number, optional) - Last read message timestamp
- `notificationsEnabled` (boolean) - Notification preferences
- `isMuted` (boolean) - Mute group notifications
- `isPinned` (boolean) - Pin group to top

**Indexes:**
- `by_groupId` - Get all members of a group
- `by_memberId` - Get all groups for a member
- `by_groupId_memberId` - Composite index for membership lookup
- `by_memberId_isPinned` - Query pinned groups for a member

### Messages Table

Stores all chat messages with support for replies, reactions, and read receipts.

**Fields:**
- `groupId` (Id<groups>) - Reference to group
- `senderId` (Id<members>) - Message sender
- `senderName` (string) - Sender's display name
- `content` (string) - Message content
- `type` (union) - Message type: text, image, file, system
- `replyTo` (Id<messages>, optional) - Reply reference
- `attachments` (array, optional) - File attachments with metadata
- `reactions` (array, optional) - Emoji reactions with member info
- `readBy` (array of Id<members>) - Members who read the message
- `edited` (boolean) - Edit flag
- `editedAt` (number, optional) - Edit timestamp
- `deleted` (boolean) - Deletion flag
- `deletedAt` (number, optional) - Deletion timestamp
- `createdAt` (number) - Creation timestamp

**Indexes:**
- `by_groupId` - Get messages for a group
- `by_senderId` - Get messages by sender
- `by_groupId_createdAt` - Composite index for efficient pagination
- `by_createdAt` - Query messages by time

---

## 2. Permissions System

### File: `/home/user/JUDO/convex/functions/permissions.ts`

Comprehensive permission helper functions for access control.

### Key Functions

#### `isActiveMember(ctx, memberId)`
Checks if a member has an active subscription.

#### `canCreateGroup(ctx, memberId, groupType)`
Validates group creation permissions:
- **Club-wide groups**: Only admins can create
- **Sub-groups**: Active members, max 3 per member
- **Competition groups**: Only admins can create
- **Class-based groups**: Only admins can create

**Returns:** `{ allowed: boolean, reason?: string }`

#### `canJoinGroup(ctx, memberId, groupId)`
Validates if a member can join a group:
- Must be an active member
- Group must be active
- Cannot already be a member
- Public groups allow direct joining
- Private groups require invitation
- Respects max member limits

#### `getMemberRole(ctx, memberId, groupId)`
Returns member's role in a group: owner, admin, member, or null.

#### `canSendMessage(ctx, memberId, groupId)`
Checks if member can send messages (must be active and in group).

#### `canModifyMessage(ctx, memberId, messageId)`
Validates message edit/delete permissions:
- Message creator can always modify their messages
- Group admins/owners can modify any message
- System messages cannot be modified

#### `canManageGroup(ctx, memberId, groupId)`
Checks if member can manage group (add/remove members, update settings).
Only owners and admins have this permission.

#### `canInviteToGroup(ctx, memberId, groupId)`
Validates invitation permissions:
- Owners and admins can always invite
- Regular members can invite if `allowMemberInvites` is enabled

---

## 3. Group Management Functions

### File: `/home/user/JUDO/convex/functions/groups.ts`

Complete CRUD operations for group management.

### Query Functions

#### `getAll()`
Returns all active groups.

#### `getById(groupId)`
Returns group details with:
- Member count
- Latest message preview

#### `getByType(type)`
Returns groups filtered by type (club-wide, sub-group, competition, class-based).
Includes member counts for each group.

#### `getUserGroups(memberId)`
Returns all groups for a member with:
- Membership details (role, join date, notification settings)
- Unread message count
- Latest message preview
- Member count
- Sorted by pinned status and latest activity

#### `getMembers(groupId)`
Returns all members of a group with their roles and join dates.

#### `checkCanCreateGroup(memberId, type)`
Validates if user can create a group of specified type.

### Mutation Functions

#### `create(memberId, name, description, type, isPrivate, autoJoin, classId, settings)`
Creates a new group:
- Validates permissions
- Adds creator as owner
- If `autoJoin` is true, adds all active members
- Creates system message announcing group creation

**Returns:** Group ID

#### `update(groupId, memberId, name, description, isPrivate, settings)`
Updates group details (requires admin/owner permission).

#### `deleteGroup(groupId, memberId)`
Soft deletes a group (sets `active` to false).
Only the owner can delete a group.

#### `addMember(groupId, memberId, addedBy, role)`
Adds a member to a group:
- Validates permissions
- Creates membership record
- Creates system message announcing addition

#### `removeMember(groupId, memberId, removedBy)`
Removes a member from a group:
- Cannot remove the owner
- Creates system message announcing removal

#### `updateMemberRole(groupId, memberId, newRole, updatedBy)`
Changes a member's role (owner only).
Cannot change owner's role.

#### `leaveGroup(groupId, memberId)`
Allows member to leave a group.
Owners must transfer ownership or delete the group first.

#### `updateMembershipSettings(groupId, memberId, notificationsEnabled, isMuted, isPinned)`
Updates member's personal group settings.

---

## 4. Message Functions

### File: `/home/user/JUDO/convex/functions/messages.ts`

Real-time messaging with advanced features.

### Query Functions

#### `getByGroup(groupId, limit, before)`
Returns paginated messages for a group:
- Default limit: 50 messages
- Supports pagination with `before` timestamp
- Includes reply details
- Ordered chronologically

#### `getUnreadCount(memberId)`
Returns total unread message count across all groups for a member.

#### `search(groupId, searchTerm, limit)`
Searches messages in a group:
- Case-insensitive content search
- Searches sender names
- Excludes deleted messages

#### `getById(messageId)`
Returns message details including reply information.

### Mutation Functions

#### `send(groupId, senderId, content, type, replyTo, attachments)`
Sends a new message:
- Validates send permissions
- Automatically marks as read by sender
- Supports text, image, and file types
- Can reply to other messages
- Supports file attachments

**Returns:** Message ID

#### `edit(messageId, memberId, newContent)`
Edits an existing message:
- Validates permissions
- Marks message as edited with timestamp
- Cannot edit deleted messages

#### `deleteMessage(messageId, memberId)`
Soft deletes a message:
- Replaces content with "This message has been deleted"
- Sets `deleted` flag
- Preserves message for thread integrity

#### `markAsRead(groupId, memberId, upToTimestamp)`
Marks messages as read:
- Updates `lastReadAt` in membership
- Adds member to `readBy` array for affected messages
- Useful for batch read receipts

**Returns:** Count of messages marked

#### `addReaction(messageId, memberId, emoji)`
Adds an emoji reaction to a message:
- Must be group member
- Cannot duplicate reactions
- Stores reactor's ID and name

#### `removeReaction(messageId, memberId, emoji)`
Removes a member's reaction from a message.

---

## 5. Seed Data

### File: `/home/user/JUDO/convex/seed.ts`

Updated to include sample group chat data.

### Groups Created

1. **Birkbeck Judo Club** (club-wide)
   - Auto-join for all active members
   - All members pinned this group
   - 4 sample messages

2. **BUCS Competition Squad 2026** (competition)
   - 5 members (higher belt ranks)
   - 4 sample messages about training coordination

3. **Monday Evening Crew** (class-based)
   - 4 members from Monday class
   - 3 sample messages about attendance

### Sample Data Counts

- **Groups:** 3
- **Group Memberships:** ~15 (varies by active member count)
- **Messages:** 11 across all groups

---

## 6. API Reference

### Group Management

```typescript
// Query all groups
const groups = await api.functions.groups.getAll();

// Get user's groups with unread counts
const myGroups = await api.functions.groups.getUserGroups({ memberId });

// Create a sub-group
const groupId = await api.functions.groups.create({
  memberId,
  name: "Training Partners",
  description: "Extra training sessions",
  type: "sub-group",
  isPrivate: false,
  settings: {
    allowMemberInvites: true,
    allowFileSharing: true,
    maxMembers: 10
  }
});

// Add member to group
await api.functions.groups.addMember({
  groupId,
  memberId: newMemberId,
  addedBy: currentMemberId
});

// Update personal settings
await api.functions.groups.updateMembershipSettings({
  groupId,
  memberId,
  isPinned: true,
  notificationsEnabled: true
});
```

### Messaging

```typescript
// Get messages (paginated)
const messages = await api.functions.messages.getByGroup({
  groupId,
  limit: 50,
  before: lastMessageTimestamp // optional for pagination
});

// Send a message
const messageId = await api.functions.messages.send({
  groupId,
  senderId: memberId,
  content: "Hello everyone!",
  type: "text"
});

// Reply to a message
await api.functions.messages.send({
  groupId,
  senderId: memberId,
  content: "Great idea!",
  replyTo: originalMessageId
});

// Add reaction
await api.functions.messages.addReaction({
  messageId,
  memberId,
  emoji: "👍"
});

// Mark as read
await api.functions.messages.markAsRead({
  groupId,
  memberId,
  upToTimestamp: Date.now()
});

// Get unread count
const unreadCount = await api.functions.messages.getUnreadCount({ memberId });

// Search messages
const results = await api.functions.messages.search({
  groupId,
  searchTerm: "training",
  limit: 20
});
```

---

## 7. Permission Model Summary

### Group Types & Creation Permissions

| Group Type | Who Can Create | Notes |
|------------|---------------|-------|
| Club-wide | Admins only | Auto-join for all active members |
| Sub-group | All active members | Max 3 per member |
| Competition | Admins only | For coordinating competitions |
| Class-based | Admins only | Linked to specific class |

### Group Roles

| Role | Permissions |
|------|-------------|
| Owner | Full control (manage, delete, transfer ownership) |
| Admin | Manage members, update settings, moderate messages |
| Member | Send messages, invite others (if enabled) |

### Message Permissions

- **Send:** Must be active member of the group
- **Edit/Delete Own:** Message creator anytime
- **Edit/Delete Others:** Group admins/owners only
- **React:** All group members
- **System Messages:** Cannot be modified

---

## 8. Real-time Features

The Convex backend automatically provides real-time updates for:

1. **New Messages** - Instant delivery to all group members
2. **Group Updates** - Name, description, settings changes
3. **Membership Changes** - Member joins/leaves
4. **Message Reactions** - Live emoji updates
5. **Read Receipts** - Real-time read status
6. **Typing Indicators** - Can be implemented with ephemeral state

---

## 9. Performance Optimizations

### Indexes

All frequently queried fields have indexes:
- Groups by type, creator, class
- Memberships with composite index for fast lookups
- Messages by group with timestamp for pagination

### Pagination

- Messages use cursor-based pagination with `before` timestamp
- Default limit of 50 messages per query
- Efficient for large message histories

### Caching

- Convex automatically caches query results
- Real-time subscriptions minimize unnecessary queries
- Client-side optimistic updates recommended

---

## 10. Next Steps for Frontend Implementation

### Required Components

1. **Group List** - Display user's groups with unread counts
2. **Group Chat View** - Message list with infinite scroll
3. **Message Composer** - Text input with file upload
4. **Group Settings** - Manage members and preferences
5. **Create Group Modal** - Group creation form
6. **Member List** - Show group members with roles

### State Management

```typescript
// Subscribe to user's groups
const groups = useQuery(api.functions.groups.getUserGroups, { memberId });

// Subscribe to messages
const messages = useQuery(api.functions.messages.getByGroup, { groupId });

// Send message
const sendMessage = useMutation(api.functions.messages.send);
```

### UI/UX Recommendations

- Show unread badges on group list
- Pin club-wide group at top
- Use different colors for group types
- Show typing indicators
- Display read receipts (optional)
- Support markdown formatting
- Image/file preview
- Reply threads visually indented
- Reaction picker emoji menu

---

## 11. Testing Recommendations

### Unit Tests

- Permission functions for all scenarios
- Group creation with various types
- Message send/edit/delete flows
- Reaction add/remove
- Read receipt tracking

### Integration Tests

- Full group lifecycle (create, add members, message, leave, delete)
- Multiple users in same group
- Private vs public group access
- Admin permission escalation

### Load Tests

- 100+ members in a group
- 1000+ messages in a group
- Concurrent message sending
- Real-time subscription performance

---

## 12. Security Considerations

### Implemented

- Permission checks on all mutations
- Active member validation
- Role-based access control
- Soft deletes to preserve data integrity
- Cannot remove group owner
- System messages protected from modification

### Recommended

- Rate limiting on message sending
- File upload validation (size, type)
- Content moderation for inappropriate messages
- Report/block functionality
- Audit logs for admin actions

---

## 13. File Summary

### Created Files

1. `/home/user/JUDO/convex/functions/permissions.ts` (7.8 KB)
   - Permission helper functions
   - 8 exported functions

2. `/home/user/JUDO/convex/functions/groups.ts` (17 KB)
   - Group management operations
   - 6 query functions, 8 mutation functions

3. `/home/user/JUDO/convex/functions/messages.ts` (11 KB)
   - Message operations
   - 4 query functions, 6 mutation functions

### Modified Files

1. `/home/user/JUDO/convex/schema.ts`
   - Added 3 new tables (groups, groupMemberships, messages)
   - 11 indexes for performance

2. `/home/user/JUDO/convex/seed.ts`
   - Added seed data for 3 groups
   - Created 11 sample messages

---

## 14. Compliance with Requirements

All requirements from the detailed plan have been implemented:

- ✅ Complete schema with all specified fields and indexes
- ✅ Permission system with role-based access control
- ✅ Group management functions (CRUD + member management)
- ✅ Message functions with reactions, replies, and read receipts
- ✅ Real-time capabilities (built-in with Convex)
- ✅ Seed data with diverse scenarios
- ✅ Soft deletes for data preservation
- ✅ Auto-join for club-wide groups
- ✅ Sub-group creation limits
- ✅ Class-based group support
- ✅ Private/public group modes
- ✅ File attachment support in schema
- ✅ Search functionality
- ✅ Pagination for messages

---

## Contact

For questions about this implementation, refer to:
- Convex documentation: https://docs.convex.dev
- Project repository: https://github.com/giquina/JUDO
- Live site: https://judo-club-app.vercel.app

---

**Implementation Status:** ✅ Complete and ready for frontend integration
