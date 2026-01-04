"use client";

import React, { useState } from "react";
import { useLoginTheme } from "@/components/login/theme";
import {
    FaPlus,
    FaTimes,
    FaEdit,
    FaCheck,
    FaUsers,
    FaTrash,
    FaSave,
    FaLink,
    FaSignOutAlt,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

type Member = { _id: string; name: string; ojassId?: string };
type Team = {
    _id: string;
    eventId: string;
    eventName: string;
    isIndividual: boolean;
    teamName: string;
    teamLeader: string | { _id: string; name: string; ojassId?: string };
    teamMembers: Member[];
    joinToken: string;
    status: string;
};

type TeamProps = {
    teamData: Team[];
    currentUserId: string;
};

export default function Team({ teamData, currentUserId }: TeamProps) {
    const theme = useLoginTheme();
    const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
    const [editingTeam, setEditingTeam] = useState<string | null>(null);
    const [editedTeamName, setEditedTeamName] = useState("");
    const [showAddMemberModal, setShowAddMemberModal] = useState<string | null>(
        null,
    );
    const [newMemberOjassId, setNewMemberOjassId] = useState("");
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [isSavingTeamName, setIsSavingTeamName] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState<string | null>(
        null,
    );
    const [teams, setTeams] = useState<Team[]>(teamData);

    const toggleMembers = (teamId: string) => {
        setOpenTeams((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
    };

    const handleEditTeam = (teamId: string, currentName: string) => {
        setEditingTeam(teamId);
        setEditedTeamName(currentName);
    };

    const handleSaveTeamName = async (teamId: string) => {
        if (!editedTeamName.trim()) {
            setEditingTeam(null);
            setEditedTeamName("");
            return;
        }

        setIsSavingTeamName(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to update team name");
                return;
            }

            const response = await fetch(`/api/teams/${teamId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    teamName: editedTeamName.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update team name");
            }

            // Update local state
            setTeams((prev) =>
                prev.map((team) =>
                    team._id === teamId
                        ? { ...team, teamName: editedTeamName.trim() }
                        : team,
                ),
            );
            setEditingTeam(null);
            setEditedTeamName("");
            alert("Team name updated successfully!");
        } catch (error: any) {
            alert(error.message || "Failed to update team name");
        } finally {
            setIsSavingTeamName(false);
        }
    };

    const handleAddMember = (teamId: string) => {
        setShowAddMemberModal(teamId);
        setNewMemberOjassId("");
    };

    const handleConfirmAddMember = async (teamId: string) => {
        if (!newMemberOjassId.trim()) {
            alert("Please enter OJASS ID");
            return;
        }

        // Validate OJASS ID format
        if (!/^OJASS26[A-Z0-9]{4}$/i.test(newMemberOjassId.trim())) {
            alert("Invalid OJASS ID format. Format should be: OJASS26XXXX");
            return;
        }

        setIsAddingMember(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to add members");
                return;
            }

            const response = await fetch(`/api/teams/${teamId}/members/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ojassId: newMemberOjassId.trim().toUpperCase(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to add member");
            }

            // Refresh teams data
            const teamsRes = await fetch("/api/teams", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (teamsRes.ok) {
                const updatedTeams = await teamsRes.json();
                const actualTeams = updatedTeams.filter(
                    (team: any) => !team.isIndividual,
                );
                const transformedTeams = actualTeams.map((team: any) => ({
                    _id: team._id,
                    eventId: team.eventId?._id || team.eventId,
                    eventName: team.eventId?.name || "Unknown Event",
                    isIndividual: team.isIndividual,
                    teamName: team.teamName || "Individual",
                    teamLeader:
                        typeof team.teamLeader === "object"
                            ? {
                                _id: team.teamLeader._id,
                                name: team.teamLeader.name || "Unknown",
                                ojassId: team.teamLeader.ojassId,
                            }
                            : team.teamLeader,
                    teamMembers: team.teamMembers
                        .filter((member: any) => {
                            // Filter out leader from members list
                            const memberId =
                                typeof member === "object"
                                    ? member._id
                                    : member;
                            const leaderId =
                                typeof team.teamLeader === "object"
                                    ? team.teamLeader._id
                                    : team.teamLeader;
                            return memberId.toString() !== leaderId.toString();
                        })
                        .map((member: any) => ({
                            _id:
                                typeof member === "object"
                                    ? member._id
                                    : member,
                            name:
                                typeof member === "object"
                                    ? member.name
                                    : "Unknown",
                            ojassId:
                                typeof member === "object"
                                    ? member.ojassId
                                    : undefined,
                        })),
                    joinToken: team.joinToken || "",
                    status: "Active",
                }));
                setTeams(transformedTeams);
            }

            setShowAddMemberModal(null);
            setNewMemberOjassId("");
            alert("Member added successfully!");
        } catch (error: any) {
            alert(error.message || "Failed to add member");
        } finally {
            setIsAddingMember(false);
        }
    };

    const handleRemoveMember = async (teamId: string, memberId: string) => {
        const teamLeaderId =
            typeof teams.find((t) => t._id === teamId)?.teamLeader === "object"
                ? (teams.find((t) => t._id === teamId)?.teamLeader as any)?._id
                : teams.find((t) => t._id === teamId)?.teamLeader;

        // Prevent leader from removing themselves
        if (memberId === teamLeaderId || memberId === currentUserId) {
            alert("Team leader cannot remove themselves");
            return;
        }

        if (!confirm("Are you sure you want to remove this member?")) {
            return;
        }

        setIsRemovingMember(memberId);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to remove members");
                return;
            }

            const response = await fetch(
                `/api/teams/${teamId}/members/${memberId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to remove member");
            }

            // Update local state
            setTeams((prev) =>
                prev.map((team) =>
                    team._id === teamId
                        ? {
                            ...team,
                            teamMembers: team.teamMembers.filter(
                                (m) => m._id !== memberId,
                            ),
                        }
                        : team,
                ),
            );
            alert("Member removed successfully!");
        } catch (error: any) {
            alert(error.message || "Failed to remove member");
        } finally {
            setIsRemovingMember(null);
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        if (
            !confirm(
                "Are you sure you want to delete this team? All members will be unregistered from the event.",
            )
        ) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to delete team");
                return;
            }

            const response = await fetch(`/api/teams/${teamId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete team");
            }

            // Remove team from local state
            setTeams((prev) => prev.filter((team) => team._id !== teamId));

            alert(
                data.message ||
                "Team deleted successfully! All members have been unregistered from the event.",
            );
        } catch (error: any) {
            alert(error.message || "Failed to delete team");
        }
    };

    const handleLeaveTeam = async (teamId: string) => {
        if (!confirm("Are you sure you want to leave this team?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to leave team");
                return;
            }

            const response = await fetch(`/api/teams/${teamId}/leave`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to leave team");
            }

            // Remove team from local state
            setTeams((prev) => prev.filter((team) => team._id !== teamId));

            alert(data.message || "Successfully left the team");
        } catch (error: any) {
            alert(error.message || "Failed to leave team");
        }
    };

    const handleCopyInviteLink = (joinToken: string) => {
        const inviteLink = `${window.location.origin}/teams/join/${joinToken}`;
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => {
                alert("Invitation link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy link:", err);
                // Fallback: select text
                const textArea = document.createElement("textarea");
                textArea.value = inviteLink;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert("Invitation link copied to clipboard!");
            });
    };

    return (
        <div className="space-y-4">
            {teams.map((team) => {
                const teamLeaderId =
                    typeof team.teamLeader === "object"
                        ? team.teamLeader._id
                        : team.teamLeader;
                const isLeader = teamLeaderId === currentUserId;
                const isOpen = openTeams[team._id];
                const isEditing = editingTeam === team._id;

                return (
                    <div
                        key={team._id}
                        className={cn(
                            "p-6 border rounded-xl backdrop-blur-md transition-all relative overflow-hidden",
                            theme.borderColorDim,
                            theme.bgGlass,
                        )}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                                {isEditing ? (
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={editedTeamName}
                                            onChange={(e) =>
                                                setEditedTeamName(
                                                    e.target.value,
                                                )
                                            }
                                            className={cn(
                                                "text-sm font-semibold rounded px-2 py-1 bg-black/50 border border-white/20 focus:outline-none",
                                                theme.textColor,
                                            )}
                                            autoFocus
                                        />
                                        <button
                                            onClick={() =>
                                                handleSaveTeamName(team._id)
                                            }
                                            disabled={isSavingTeamName}
                                            className="text-green-400 hover:text-green-300 disabled:opacity-50">
                                            {isSavingTeamName ? (
                                                <span className="text-xs">
                                                    Saving...
                                                </span>
                                            ) : (
                                                <FaSave size={14} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setEditingTeam(null)}
                                            className="text-red-400 hover:text-red-300">
                                            <FaTimes size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mb-1">
                                        <div
                                            className={cn(
                                                "text-lg font-bold tracking-wide",
                                                theme.textColor,
                                            )}>
                                            {team.teamName}
                                        </div>
                                        {isLeader && (
                                            <button
                                                onClick={() =>
                                                    handleEditTeam(
                                                        team._id,
                                                        team.teamName,
                                                    )
                                                }
                                                className={cn(
                                                    "opacity-70 hover:opacity-100",
                                                    theme.textColor,
                                                )}>
                                                <FaEdit size={12} />
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        "text-xs uppercase tracking-wider mb-2",
                                        theme.textColorDim,
                                    )}>
                                    {team.eventName}
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <span className="opacity-50 text-xs uppercase tracking-wide">
                                        Leader:
                                    </span>
                                    <span>
                                        {typeof team.teamLeader === "object"
                                            ? team.teamLeader.name ||
                                            team.teamLeader.ojassId ||
                                            team.teamLeader._id
                                            : team.teamLeader}
                                    </span>
                                    {typeof team.teamLeader === "object" &&
                                        team.teamLeader.ojassId && (
                                            <span className="text-slate-500 text-xs bg-white/5 px-1.5 py-0.5 rounded ml-1">
                                                {team.teamLeader.ojassId}
                                            </span>
                                        )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 items-end">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                                    {team.status}
                                </span>
                                {isLeader ? (
                                    <button
                                        onClick={() =>
                                            handleDeleteTeam(team._id)
                                        }
                                        className="text-[10px] px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400 hover:bg-red-500/20 flex items-center gap-1 transition-all">
                                        <FaTrash size={10} /> DELETE TEAM
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            handleLeaveTeam(team._id)
                                        }
                                        className="text-[10px] px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 hover:bg-amber-500/20 flex items-center gap-1 transition-all">
                                        <FaSignOutAlt size={10} /> LEAVE TEAM
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                            <button
                                onClick={() => toggleMembers(team._id)}
                                className={cn(
                                    "text-xs px-3 py-1.5 border rounded flex items-center gap-2 transition-all",
                                    theme.buttonOutline,
                                )}>
                                {isOpen ? (
                                    <>
                                        <FaTimes size={12} /> Hide Members
                                    </>
                                ) : (
                                    <>
                                        <FaUsers size={12} />{" "}
                                        {team.teamMembers.length} Members
                                    </>
                                )}
                            </button>
                            {team.joinToken && (
                                <button
                                    onClick={() =>
                                        handleCopyInviteLink(team.joinToken)
                                    }
                                    className={cn(
                                        "text-xs px-3 py-1.5 border rounded flex items-center gap-2 transition-all",
                                        theme.buttonOutline,
                                    )}
                                    title="Copy invitation link">
                                    <FaLink size={12} /> Invite Link
                                </button>
                            )}
                        </div>

                        {isOpen && (
                            <div className="mt-4 space-y-2 pl-2 border-l-2 border-white/5 ml-1">
                                {/* Filter out leader from members list */}
                                {team.teamMembers
                                    .filter((member) => {
                                        const memberId = member._id;
                                        const leaderId =
                                            typeof team.teamLeader === "object"
                                                ? team.teamLeader._id
                                                : team.teamLeader;
                                        return memberId !== leaderId;
                                    })
                                    .map((member) => (
                                        <div
                                            key={member._id}
                                            className="px-3 py-2 rounded bg-white/5 flex items-center justify-between gap-2 border border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-200 font-medium">
                                                    {member.name}
                                                </span>
                                                {member.ojassId && (
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {member.ojassId}
                                                    </span>
                                                )}
                                            </div>

                                            {isLeader && (
                                                <button
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            team._id,
                                                            member._id,
                                                        )
                                                    }
                                                    disabled={
                                                        isRemovingMember ===
                                                        member._id
                                                    }
                                                    className="text-red-400 hover:text-red-300 disabled:opacity-50 p-1.5 hover:bg-red-500/10 rounded"
                                                    title="Remove member">
                                                    {isRemovingMember ===
                                                        member._id ? (
                                                        <span className="text-[10px]">
                                                            ..
                                                        </span>
                                                    ) : (
                                                        <FaTimes size={10} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                {isLeader && (
                                    <button
                                        onClick={() =>
                                            handleAddMember(team._id)
                                        }
                                        className={cn(
                                            "w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed rounded hover:bg-white/5 mt-2 transition-all text-sm",
                                            theme.borderColorDim,
                                            theme.textColorDim,
                                        )}>
                                        <FaPlus size={10} /> Add Member
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Add Member Modal */}
            {showAddMemberModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowAddMemberModal(null)}>
                    <div
                        className={cn(
                            "p-6 border rounded-xl max-w-md w-full mx-4 shadow-2xl bg-black",
                            theme.borderColor,
                        )}
                        onClick={(e) => e.stopPropagation()}>
                        <h3
                            className={cn(
                                "text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-wide",
                                theme.textColor,
                            )}>
                            <FaPlus /> Add Team Member
                        </h3>
                        <div className="mb-6">
                            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-semibold">
                                OJASS ID
                            </label>
                            <input
                                type="text"
                                value={newMemberOjassId}
                                onChange={(e) =>
                                    setNewMemberOjassId(
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="OJASS26XXXX"
                                className={cn(
                                    "w-full bg-white/5 border rounded px-4 py-3 text-white placeholder-slate-600 focus:outline-none font-mono text-lg",
                                    theme.borderColorDim,
                                )}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" && !isAddingMember) {
                                        handleConfirmAddMember(
                                            showAddMemberModal,
                                        );
                                    }
                                }}
                                maxLength={11}
                            />
                            <p className="text-[10px] text-slate-500 mt-2">
                                User must be verified and paid to be added.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowAddMemberModal(null)}
                                className="px-5 py-2.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider">
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleConfirmAddMember(showAddMemberModal)
                                }
                                disabled={
                                    isAddingMember || !newMemberOjassId.trim()
                                }
                                className={cn(
                                    "px-6 py-2.5 border rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider",
                                    theme.buttonPrimary,
                                )}>
                                {isAddingMember ? "Adding..." : "Add Member"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
