import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@/hooks/useAuth";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { GroupList } from "@/components/chat/GroupList";
import { GroupHeader } from "@/components/chat/GroupHeader";
import { MessageThread } from "@/components/chat/MessageThread";
import { MessageInput } from "@/components/chat/MessageInput";
import { EmptyGroupState } from "@/components/chat/EmptyGroupState";
import { CreateGroupModal } from "@/components/chat/CreateGroupModal";
import { GroupSettings } from "@/components/chat/GroupSettings";
import { AddMembersModal } from "@/components/chat/AddMembersModal";
import { GroupMembersList } from "@/components/chat/GroupMembersList";
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup, useLeaveGroup, useUpdateMembershipSettings } from "@/hooks/useGroups";
import { useMessages, useSendMessage, useEditMessage, useDeleteMessage, useMarkAsRead, useAddReaction, useRemoveReaction } from "@/hooks/useMessages";
import { useGroupMembers, useAddMember, useRemoveMember, useUpdateMemberRole } from "@/hooks/useGroupMembers";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<Id<"groups"> | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [addMembersModalOpen, setAddMembersModalOpen] = useState(false);
  const [membersListModalOpen, setMembersListModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    messageId: string;
    content: string;
    senderName: string;
  } | null>(null);
  const [editingMessage, setEditingMessage] = useState<{
    messageId: string;
    content: string;
  } | null>(null);

  // Get current member
  const currentMember = useQuery(
    api.functions.members.getByUserId,
    user?.userId ? { userId: user.userId } : "skip"
  );

  // Get groups
  const { groups, isLoading: groupsLoading } = useGroups(currentMember?._id);

  // Get selected group details
  const selectedGroup = groups.find((g: any) => g._id === selectedGroupId);

  // Get messages for selected group
  const { messages, isLoading: messagesLoading } = useMessages(
    selectedGroupId || undefined
  );

  // Get group members
  const { members: groupMembers } = useGroupMembers(selectedGroupId || undefined);

  // Get all active members for add member modal
  // Note: Convex generated types (api, Id) are expected to be generated when running `npx convex dev`
  const allMembers = useQuery(api.functions.members.getAll);
  const activeMembers = allMembers?.filter(
    (m: any) => m.subscriptionStatus === "active"
  ) || [];

  // Mutations
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();
  const leaveGroup = useLeaveGroup();
  const updateMembershipSettings = useUpdateMembershipSettings();
  const sendMessage = useSendMessage();
  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();
  const markAsRead = useMarkAsRead();
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const addMember = useAddMember();
  const removeMember = useRemoveMember();
  const updateMemberRole = useUpdateMemberRole();

  // Auto-select first group on load
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0]._id as Id<"groups">);
    }
  }, [groups, selectedGroupId]);

  // Mark messages as read when group is selected
  useEffect(() => {
    if (selectedGroupId && currentMember?._id) {
      markAsRead(selectedGroupId, currentMember._id);
    }
  }, [selectedGroupId, currentMember?._id, messages.length]);

  // Show sidebar on desktop by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handlers
  const handleCreateGroup = async (data: any): Promise<void> => {
    if (!currentMember) return;
    const groupId = await createGroup({
      ...data,
      memberId: currentMember._id,
    });
    setSelectedGroupId(groupId as Id<"groups">);
  };

  const handleUpdateGroup = async (data: any): Promise<void> => {
    if (!selectedGroupId || !currentMember) return;
    await updateGroup({
      groupId: selectedGroupId,
      memberId: currentMember._id,
      ...data,
    });
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroupId || !currentMember) return;
    await deleteGroup(selectedGroupId, currentMember._id);
    setSelectedGroupId(null);
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroupId || !currentMember) return;
    await leaveGroup(selectedGroupId, currentMember._id);
    setSelectedGroupId(null);
  };

  const handleTogglePin = async () => {
    if (!selectedGroupId || !currentMember || !selectedGroup) return;
    await updateMembershipSettings({
      groupId: selectedGroupId,
      memberId: currentMember._id,
      isPinned: !selectedGroup.membership?.isPinned,
    });
  };

  const handleToggleMute = async () => {
    if (!selectedGroupId || !currentMember || !selectedGroup) return;
    await updateMembershipSettings({
      groupId: selectedGroupId,
      memberId: currentMember._id,
      isMuted: !selectedGroup.membership?.isMuted,
    });
  };

  const handleSendMessage = async (content: string, replyTo?: string) => {
    if (!selectedGroupId || !currentMember) return;
    await sendMessage({
      groupId: selectedGroupId,
      senderId: currentMember._id,
      content,
      replyTo: replyTo as Id<"messages"> | undefined,
    });
    setReplyingTo(null);
    setEditingMessage(null);
  };

  const handleEditMessage = async (messageId: string, content: string) => {
    if (!currentMember) return;
    if (editingMessage) {
      await editMessage(editingMessage.messageId as Id<"messages">, currentMember._id, content);
      setEditingMessage(null);
    } else {
      setEditingMessage({ messageId, content });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentMember) return;
    await deleteMessage(messageId as Id<"messages">, currentMember._id);
  };

  const handleReply = (messageId: string) => {
    const message = messages.find((m: any) => m._id === messageId);
    if (message) {
      setReplyingTo({
        messageId,
        content: message.content,
        senderName: message.senderName,
      });
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    if (!currentMember) return;

    const message = messages.find((m: any) => m._id === messageId);
    const hasReacted = message?.reactions?.some(
      (r: any) => r.memberId === currentMember._id && r.emoji === emoji
    );

    if (hasReacted) {
      await removeReaction(messageId as Id<"messages">, currentMember._id, emoji);
    } else {
      await addReaction(messageId as Id<"messages">, currentMember._id, emoji);
    }
  };

  const handleAddMember = async (memberId: Id<"members">) => {
    if (!selectedGroupId || !currentMember) return;
    await addMember(selectedGroupId, memberId, currentMember._id);
  };

  const handleRemoveMember = async (memberId: Id<"members">) => {
    if (!selectedGroupId || !currentMember) return;
    await removeMember(selectedGroupId, memberId, currentMember._id);
  };

  const handlePromoteToAdmin = async (memberId: Id<"members">) => {
    if (!selectedGroupId || !currentMember) return;
    await updateMemberRole(selectedGroupId, memberId, "admin", currentMember._id);
  };

  const handleDemoteToMember = async (memberId: Id<"members">) => {
    if (!selectedGroupId || !currentMember) return;
    await updateMemberRole(selectedGroupId, memberId, "member", currentMember._id);
  };

  // Loading state
  if (!currentMember || groupsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </motion.div>
      </div>
    );
  }

  // No groups state
  if (groups.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <EmptyGroupState onCreateGroup={() => setCreateGroupModalOpen(true)} />
        <CreateGroupModal
          open={createGroupModalOpen}
          onOpenChange={setCreateGroupModalOpen}
          onSubmit={handleCreateGroup}
        />
      </div>
    );
  }

  return (
    <>
      <ChatLayout
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        sidebar={
          <GroupList
            groups={groups}
            activeGroupId={selectedGroupId || undefined}
            onGroupSelect={(groupId) => {
              setSelectedGroupId(groupId as Id<"groups">);
              if (window.innerWidth < 768) {
                setShowSidebar(false);
              }
            }}
            onCreateGroup={() => setCreateGroupModalOpen(true)}
          />
        }
        main={
          selectedGroup ? (
            <>
              <GroupHeader
                group={selectedGroup}
                onToggleSidebar={() => setShowSidebar(!showSidebar)}
                onOpenSettings={() => setSettingsModalOpen(true)}
                onOpenMembers={() => setMembersListModalOpen(true)}
                onTogglePin={handleTogglePin}
                onToggleMute={handleToggleMute}
              />
              <MessageThread
                messages={messages}
                currentMemberId={currentMember._id}
                groupName={selectedGroup.name}
                isLoading={messagesLoading}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReply={handleReply}
                onReact={handleReact}
              />
              <MessageInput
                onSend={handleSendMessage}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
                placeholder={`Message ${selectedGroup.name}...`}
              />
            </>
          ) : (
            <EmptyGroupState />
          )
        }
      />

      {/* Modals */}
      <CreateGroupModal
        open={createGroupModalOpen}
        onOpenChange={setCreateGroupModalOpen}
        onSubmit={handleCreateGroup}
      />

      {selectedGroup && (
        <>
          <GroupSettings
            open={settingsModalOpen}
            onOpenChange={setSettingsModalOpen}
            group={selectedGroup}
            onUpdate={handleUpdateGroup}
            onLeave={handleLeaveGroup}
            onDelete={handleDeleteGroup}
          />

          <AddMembersModal
            open={addMembersModalOpen}
            onOpenChange={setAddMembersModalOpen}
            availableMembers={activeMembers}
            existingMemberIds={groupMembers.map((m: any) => m._id)}
            onAddMember={handleAddMember}
          />

          <GroupMembersList
            open={membersListModalOpen}
            onOpenChange={setMembersListModalOpen}
            members={groupMembers as any}
            currentMemberRole={selectedGroup.membership?.role}
            currentMemberId={currentMember._id}
            onAddMembers={() => {
              setMembersListModalOpen(false);
              setAddMembersModalOpen(true);
            }}
            onRemoveMember={handleRemoveMember}
            onPromoteToAdmin={handlePromoteToAdmin}
            onDemoteToMember={handleDemoteToMember}
          />
        </>
      )}
    </>
  );
}
