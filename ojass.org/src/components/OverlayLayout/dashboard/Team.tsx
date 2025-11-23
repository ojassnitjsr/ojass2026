"use client";

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaCheck,
  FaUsers,
  FaTrash,
  FaSave,
  FaCopy,
  FaLink,
} from "react-icons/fa";

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
  const { theme } = useTheme();
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState<string | null>(null);
  const [newMemberOjassId, setNewMemberOjassId] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isSavingTeamName, setIsSavingTeamName] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>(teamData);

  // 🎨 Theme-based colors
  const isUtopia = theme === "utopia";
  const glow = isUtopia ? "#00ffff" : "#cc7722";
  const borderColor = isUtopia ? "border-cyan-400" : "border-amber-500";
  const textPrimary = isUtopia ? "text-cyan-300" : "text-amber-400";
  const textSecondary = isUtopia ? "text-cyan-200/70" : "text-amber-200/70";
  const bgMain = isUtopia
    ? "from-cyan-500/10 to-blue-500/5 hover:from-cyan-500/20 hover:to-blue-500/10"
    : "from-amber-500/10 to-orange-500/5 hover:from-amber-500/20 hover:to-orange-500/10";
  const borderSoft = isUtopia ? "border-cyan-400/20" : "border-amber-500/20";
  const buttonBorder = isUtopia ? "border-cyan-400/50" : "border-amber-500/50";
  const buttonHover = isUtopia ? "hover:bg-cyan-500/10" : "hover:bg-amber-500/10";
  const accentBg = isUtopia ? "bg-cyan-500/10" : "bg-amber-500/10";

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
          team._id === teamId ? { ...team, teamName: editedTeamName.trim() } : team
        )
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
        const actualTeams = updatedTeams.filter((team: any) => !team.isIndividual);
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
              const memberId = typeof member === "object" ? member._id : member;
              const leaderId = typeof team.teamLeader === "object"
                ? team.teamLeader._id
                : team.teamLeader;
              return memberId.toString() !== leaderId.toString();
            })
            .map((member: any) => ({
              _id: typeof member === "object" ? member._id : member,
              name: typeof member === "object" ? member.name : "Unknown",
              ojassId: typeof member === "object" ? member.ojassId : undefined,
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
    const teamLeaderId = typeof teams.find((t) => t._id === teamId)?.teamLeader === "object"
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

      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove member");
      }

      // Update local state
      setTeams((prev) =>
        prev.map((team) =>
          team._id === teamId
            ? { ...team, teamMembers: team.teamMembers.filter((m) => m._id !== memberId) }
            : team
        )
      );
      alert("Member removed successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to remove member");
    } finally {
      setIsRemovingMember(null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team? All members will be unregistered from the event.")) {
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
      
      alert(data.message || "Team deleted successfully! All members have been unregistered from the event.");
    } catch (error: any) {
      alert(error.message || "Failed to delete team");
    }
  };

  const handleCopyInviteLink = (joinToken: string) => {
    const inviteLink = `${window.location.origin}/teams/join/${joinToken}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert("Invitation link copied to clipboard!");
    }).catch((err) => {
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
    <div className="space-y-3">
      {teams.map((team) => {
        const teamLeaderId = typeof team.teamLeader === 'object' 
          ? team.teamLeader._id 
          : team.teamLeader;
        const isLeader = teamLeaderId === currentUserId;
        const isOpen = openTeams[team._id];
        const isEditing = editingTeam === team._id;

        return (
          <div
            key={team._id}
            className={`p-4 border ${borderSoft} bg-gradient-to-r ${bgMain} transition-all backdrop-blur-sm`}
            style={{
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
              boxShadow: `0 0 15px ${glow}40`,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editedTeamName}
                      onChange={(e) => setEditedTeamName(e.target.value)}
                      className={`text-sm font-semibold ${accentBg} border ${buttonBorder} rounded px-2 py-1 text-white focus:outline-none focus:border-[${glow}]`}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveTeamName(team._id)}
                      disabled={isSavingTeamName}
                      className="text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                      {isSavingTeamName ? (
                        <span className="text-xs">Saving...</span>
                      ) : (
                        <FaSave size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingTeam(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`text-sm font-semibold text-white`}>
                      {team.teamName}
                    </div>
                    {isLeader && (
                      <button
                        onClick={() => handleEditTeam(team._id, team.teamName)}
                        className={`${textPrimary} hover:opacity-80`}
                      >
                        <FaEdit size={13} />
                      </button>
                    )}
                  </div>
                )}

                <div className={`text-xs ${textPrimary} mt-1`}>
                  Event: {team.eventName}
                </div>
                <p className={`text-sm ${textSecondary}`}>
                  Team Leader: {typeof team.teamLeader === 'object' 
                    ? (team.teamLeader.name || team.teamLeader.ojassId || team.teamLeader._id)
                    : team.teamLeader}
                  {typeof team.teamLeader === 'object' && team.teamLeader.ojassId && (
                    <span className="text-gray-500 ml-2">({team.teamLeader.ojassId})</span>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span
                  className={`text-xs font-mono px-2 py-1 rounded ${
                    isUtopia ? "bg-green-500/20 text-green-300" : "bg-lime-600/20 text-lime-300"
                  }`}
                >
                  {team.status}
                </span>
                {isLeader && (
                  <button
                    onClick={() => handleDeleteTeam(team._id)}
                    className="text-xs px-2 py-1 bg-red-500/20 border border-red-400/50 rounded text-red-400 hover:bg-red-500/30 flex items-center gap-1 justify-center"
                  >
                    <FaTrash size={11} /> Delete
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleMembers(team._id)}
                className={`text-xs px-2 py-1 border ${buttonBorder} rounded ${textPrimary} ${buttonHover} flex items-center gap-1`}
              >
                {isOpen ? (
                  <>
                    <FaTimes size={12} /> Hide
                  </>
                ) : (
                  <>
                    <FaUsers size={12} /> Members
                  </>
                )}
              </button>
              {isLeader && team.joinToken && (
                <button
                  onClick={() => handleCopyInviteLink(team.joinToken)}
                  className={`text-xs px-2 py-1 border ${buttonBorder} rounded ${textPrimary} ${buttonHover} flex items-center gap-1`}
                  title="Copy invitation link"
                >
                  <FaLink size={12} /> Copy Link
                </button>
              )}
            </div>

            {isOpen && (
              <div className="mt-3 space-y-2">
                {/* Filter out leader from members list */}
                {team.teamMembers
                  .filter((member) => {
                    const memberId = member._id;
                    const leaderId = typeof team.teamLeader === 'object' 
                      ? team.teamLeader._id 
                      : team.teamLeader;
                    return memberId !== leaderId;
                  })
                  .map((member) => (
                    <div
                      key={member._id}
                      className={`px-2 py-1 rounded ${accentBg} flex items-center justify-between gap-2`}
                    >
                      <span className="text-xs text-gray-300">
                        {member.name} {member.ojassId && <span className="text-gray-400">({member.ojassId})</span>}
                      </span>
                      {isLeader && (
                        <button
                          onClick={() => handleRemoveMember(team._id, member._id)}
                          disabled={isRemovingMember === member._id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          title="Remove member"
                        >
                          {isRemovingMember === member._id ? (
                            <span className="text-xs">Removing...</span>
                          ) : (
                            <FaTimes size={10} />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                {isLeader && (
                  <button
                    onClick={() => handleAddMember(team._id)}
                    className={`flex items-center gap-1 px-2 py-1 ${textPrimary} border ${buttonBorder} rounded hover:bg-opacity-10 ${buttonHover}`}
                  >
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
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
          onClick={() => setShowAddMemberModal(null)}
        >
          <div
            className={`bg-gradient-to-br ${
              isUtopia ? "from-gray-900 to-gray-800" : "from-[#1e130c] to-[#9a8478]"
            } p-6 border ${buttonBorder} max-w-md w-full mx-4`}
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              boxShadow: `0 0 30px ${glow}40`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaPlus className={textPrimary} /> Add Team Member
            </h3>
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block">
                Enter OJASS ID (e.g., OJASS26A7B2)
              </label>
              <input
                type="text"
                value={newMemberOjassId}
                onChange={(e) => setNewMemberOjassId(e.target.value.toUpperCase())}
                placeholder="OJASS26XXXX"
                className={`w-full ${accentBg} border ${buttonBorder} rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[${glow}] font-mono`}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isAddingMember) {
                    handleConfirmAddMember(showAddMemberModal);
                  }
                }}
                maxLength={11}
              />
              <p className="text-xs text-gray-500 mt-1">
                Only verified and paid users can be added
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddMemberModal(null)}
                className="px-4 py-2 border border-gray-500/50 rounded text-gray-300 hover:bg-gray-500/10 flex items-center gap-2"
              >
                <FaTimes size={12} /> Cancel
              </button>
              <button
                onClick={() => handleConfirmAddMember(showAddMemberModal)}
                disabled={isAddingMember || !newMemberOjassId.trim()}
                className={`px-4 py-2 ${accentBg} border ${buttonBorder} rounded ${textPrimary} hover:opacity-80 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAddingMember ? (
                  <>
                    <span className="text-xs">Adding...</span>
                  </>
                ) : (
                  <>
                    <FaCheck size={12} /> Add Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
