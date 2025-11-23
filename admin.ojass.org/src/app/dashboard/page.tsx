'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eventAPI, authAPI, userAPI, teamAPI, registrationAPI, User, Team, Event, CreateEventData } from '@/lib/api';
import EventForm from '@/components/EventForm';

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'events' | 'students' | 'ambassadors' | 'team'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSearch, setEventSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [teamEventFilter, setTeamEventFilter] = useState<string | 'all'>('all');
  const [selectedEventParticipants, setSelectedEventParticipants] = useState<string | null>(null);
  const [selectedAmbassadorReferrals, setSelectedAmbassadorReferrals] = useState<number | null>(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState<string | null>(null);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<string | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [studentsPage, setStudentsPage] = useState(1);
  const [teamsPage, setTeamsPage] = useState(1);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load events on mount
  useEffect(() => {
    if (mounted) {
      loadEvents();
      loadStudents();
      loadTeams();
    }
  }, [mounted]);

  // Load students when filters change
  useEffect(() => {
    if (mounted) {
      loadStudents();
    }
  }, [studentSearch, paymentFilter, studentsPage, mounted]);

  // Load teams when filters change
  useEffect(() => {
    if (mounted) {
      loadTeams();
    }
  }, [teamEventFilter, teamsPage, mounted]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await eventAPI.getAll();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await userAPI.getAll({
        page: studentsPage,
        limit: 50,
        search: studentSearch,
        paymentStatus: paymentFilter,
      });
      setStudents(response.users);
    } catch (err: any) {
      console.error('Error loading students:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadTeams = async () => {
    try {
      setLoadingTeams(true);
      const eventId = teamEventFilter === 'all' ? undefined : teamEventFilter;
      const response = await teamAPI.getAll({
        page: teamsPage,
        limit: 50,
        eventId,
      });
      setTeams(response.teams);
    } catch (err: any) {
      console.error('Error loading teams:', err);
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/');
    }
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setShowAddEventModal(true);
  };

  const handleCloseAddEvent = () => {
    setShowAddEventModal(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowAddEventModal(true);
  };

  const handleSubmitEvent = async (eventData: CreateEventData) => {
    try {
      setSubmitting(true);
      setError('');
      if (editingEvent) {
        await eventAPI.update(editingEvent._id, eventData);
      } else {
        await eventAPI.create(eventData);
      }
      await loadEvents();
      handleCloseAddEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      setError('');
      await eventAPI.delete(eventId);
      await loadEvents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
      alert(err.message || 'Failed to delete event');
    }
  };

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
  };

  const handleCloseViewEvent = () => {
    setViewingEvent(null);
  };

  const getEventParticipants = async (eventId: string) => {
    try {
      const registrations = await registrationAPI.getByEvent(eventId);
      return registrations.map((reg: Team) => {
        const leader = typeof reg.teamLeader === 'object' ? reg.teamLeader : null;
        return {
          student: leader ? {
            _id: leader._id,
            name: leader.name,
            email: leader.email,
            ojassId: leader.ojassId,
          } : null,
          teamName: reg.teamName || 'Individual',
          teamOjassId: reg._id,
        };
      }).filter((p: any) => p.student !== null);
    } catch (err) {
      console.error('Error fetching participants:', err);
      return [];
    }
  };

  const getAmbassadorReferrals = (ambassadorId: number) => {
    // Filter students by referral count > 0 (ambassadors)
    const ambassadors = students.filter(s => s.referralCount > 0);
    if (ambassadorId && ambassadors[ambassadorId - 1]) {
      // Return referrals for specific ambassador (simplified - would need referral tracking)
      return students.slice(0, 3).map(student => ({
        _id: student._id,
        name: student.name,
        email: student.email,
        college: student.collegeName,
        registeredAt: new Date(student.createdAt).toLocaleDateString(),
        events: 0, // Would need to count from registrations
        ojassId: student.ojassId,
        paymentStatus: student.isPaid ? 'paid' : 'unpaid',
        referralDate: new Date(student.createdAt).toLocaleDateString(),
      }));
    }
    return [];
  };

  const getTeamMembers = (teamId: string) => {
    const team = teams.find(t => t._id === teamId);
    if (!team || !team.teamMembers) return [];
    
    return team.teamMembers.map((member: any) => {
      if (typeof member === 'object') {
        return member;
      }
      return students.find(s => s._id === member);
    }).filter(Boolean);
  };

  const filteredEvents = events.filter((event) => {
    if (!event || !event.name) return false;
    
    // If search is empty, show all events
    const searchTerm = eventSearch || '';
    if (searchTerm.trim() === '') {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    return (event.name?.toLowerCase().includes(searchLower) ?? false) ||
           (event._id?.toLowerCase().includes(searchLower) ?? false) ||
           (event.description?.toLowerCase().includes(searchLower) ?? false);
  });

  const filteredStudents = students.filter((student) => {
    const searchTerm = studentSearch || '';
    if (searchTerm.trim() === '') {
      // If no search term, only filter by payment status
      return paymentFilter === 'all' || (paymentFilter === 'paid' ? student.isPaid : !student.isPaid);
    }
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = student.name?.toLowerCase().includes(searchLower) ||
      student.ojassId?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.collegeName?.toLowerCase().includes(searchLower);
    
    const matchesPayment = paymentFilter === 'all' ||
      (paymentFilter === 'paid' ? student.isPaid : !student.isPaid);
    
    return matchesSearch && matchesPayment;
  });

  const filteredTeams = teams.filter((team) => {
    if (teamEventFilter === 'all') return true;
    const eventId = typeof team.eventId === 'object' ? team.eventId._id : team.eventId;
    return eventId === teamEventFilter;
  });

  // Prevent hydration mismatch by not rendering event-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OJASS Admin Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OJASS Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-lg shadow-md p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'events', label: 'Events' },
              { key: 'students', label: 'Students' },
              { key: 'ambassadors', label: 'Ambassadors' },
              { key: 'team', label: 'Team' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key as any)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === tab.key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Events Section */}
          {activeSection === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Events</h2>
                <button
                  onClick={handleOpenAddEvent}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  + Add Event
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, ID, or description..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading events...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No events found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEvents.map((event) => (
                    <div key={event._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow relative">
                      {event.img && (
                        <img src={event.img} alt={event.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.isTeamEvent ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {event.isTeamEvent ? 'Team' : 'Individual'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2"><strong>Team Size:</strong> {event.teamSizeMin}-{event.teamSizeMax}</p>
                      {event.organizer && (
                        <p className="text-gray-600 mb-2"><strong>Organizer:</strong> {event.organizer}</p>
                      )}
                      {event.description && (
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2"><strong>Description:</strong> {event.description}</p>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Participants Modal */}
              {selectedEventParticipants && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEventParticipants(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Participants - {events.find(e => e._id === selectedEventParticipants)?.name}
                      </h3>
                      <button
                        onClick={() => setSelectedEventParticipants(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team OJASS ID</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                              Click on an event to view participants
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* View Event Modal */}
              {viewingEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseViewEvent}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Event Details</h3>
                      <button
                        onClick={handleCloseViewEvent}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Event Image */}
                      {viewingEvent.img && (
                        <div>
                          <img 
                            src={viewingEvent.img} 
                            alt={viewingEvent.name} 
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                          <p className="text-gray-900 font-semibold">{viewingEvent.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            viewingEvent.isTeamEvent ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {viewingEvent.isTeamEvent ? 'Team Event' : 'Individual Event'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                          <p className="text-gray-900">{viewingEvent.teamSizeMin} - {viewingEvent.teamSizeMax} {viewingEvent.isTeamEvent ? 'members' : 'participant'}</p>
                        </div>
                        {viewingEvent.organizer && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                            <p className="text-gray-900">{viewingEvent.organizer}</p>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{viewingEvent.description}</p>
                      </div>

                      {/* Prizes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prizes</label>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Prize:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.total || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Winner:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.winner || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">First Runner-up:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.first_runner_up || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Second Runner-up:</span>
                            <span className="text-gray-900 font-semibold">{viewingEvent.prizes?.second_runner_up || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      {viewingEvent.details && viewingEvent.details.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Details</label>
                          <ul className="list-disc list-inside space-y-1 bg-gray-50 rounded-lg p-4">
                            {viewingEvent.details.map((detail, index) => (
                              <li key={index} className="text-gray-900">{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Rules */}
                      {viewingEvent.rules && viewingEvent.rules.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
                          <ul className="list-disc list-inside space-y-1 bg-gray-50 rounded-lg p-4">
                            {viewingEvent.rules.map((rule, index) => (
                              <li key={index} className="text-gray-900">{rule}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Event Head */}
                      {viewingEvent.event_head && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Head</label>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900"><strong>Name:</strong> {viewingEvent.event_head.name}</p>
                            <p className="text-gray-900"><strong>Phone:</strong> {viewingEvent.event_head.Phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {viewingEvent.rulebookurl && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rulebook URL</label>
                            <a 
                              href={viewingEvent.rulebookurl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              {viewingEvent.rulebookurl}
                            </a>
                          </div>
                        )}
                        {viewingEvent.redirect && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect Path</label>
                            <p className="text-gray-900 break-all">{viewingEvent.redirect}</p>
                          </div>
                        )}
                      </div>

                      {/* Winners */}
                      {viewingEvent.winners && viewingEvent.winners.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Winners</label>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600 text-sm">{viewingEvent.winners.length} winner(s) declared</p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                          onClick={handleCloseViewEvent}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            setViewingEvent(null);
                            setEditingEvent(viewingEvent);
                            setShowAddEventModal(true);
                          }}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                          Edit Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Edit Event Modal */}
              {showAddEventModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseAddEvent}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {editingEvent ? 'Edit Event' : 'Add New Event'}
                      </h3>
                      <button
                        onClick={handleCloseAddEvent}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <EventForm
                      event={editingEvent || undefined}
                      onSubmit={handleSubmitEvent}
                      onCancel={handleCloseAddEvent}
                      loading={submitting}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Section */}
          {activeSection === 'students' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Students</h2>
              
              {/* Search Bar and Filter */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, OJASS ID, or email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="paid">With Payment</option>
                    <option value="unpaid">Without Payment</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingStudents ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                          Loading students...
                        </td>
                      </tr>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.ojassId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{student.collegeName}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {student.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {student.referralCount || 0}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            <button
                              onClick={() => setSelectedStudentDetails(student._id)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="View Details"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                          No students found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Student Details Modal */}
              {selectedStudentDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedStudentDetails(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Student Details
                      </h3>
                      <button
                        onClick={() => setSelectedStudentDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const student = students.find(s => s._id === selectedStudentDetails);
                      if (!student) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Loading student details...</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Student ID</label>
                              <p className="text-lg font-semibold text-gray-900">{student._id.slice(-6)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">OJASS ID</label>
                              <p className="text-lg font-semibold text-gray-900">{student.ojassId}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Name</label>
                              <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Email</label>
                              <p className="text-lg text-gray-900">{student.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">College</label>
                              <p className="text-lg text-gray-900">{student.collegeName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Payment Status</label>
                              <p className="text-lg">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  student.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {student.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Date</label>
                              <p className="text-lg text-gray-900">{new Date(student.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Referral Count</label>
                              <p className="text-lg font-semibold text-gray-900">{student.referralCount || 0}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ambassadors Section */}
          {activeSection === 'ambassadors' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ambassadors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.filter(s => s.referralCount > 0).map((ambassador, index) => (
                  <div key={ambassador._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{ambassador.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-2 text-sm">{ambassador.email}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Referrals:</span>
                        <span className="font-semibold">{ambassador.referralCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Paid:</span>
                        <span className="font-semibold text-green-600">{ambassador.isPaid ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">OJASS ID:</span>
                        <span className="font-semibold">{ambassador.ojassId}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedAmbassadorReferrals(index + 1)}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      View Referral Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Referral Details Modal */}
              {selectedAmbassadorReferrals && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedAmbassadorReferrals(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Referral Details - {students.filter(s => s.referralCount > 0)[(selectedAmbassadorReferrals || 1) - 1]?.name || 'Unknown'}
                      </h3>
                      <button
                        onClick={() => setSelectedAmbassadorReferrals(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getAmbassadorReferrals(selectedAmbassadorReferrals).map((referral, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{referral.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.ojassId}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.email}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.college}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  referral.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {referral.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{referral.referralDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team Section */}
          {activeSection === 'team' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Teams</h2>
                  <select
                    value={teamEventFilter}
                    onChange={(e) => setTeamEventFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>{event.name}</option>
                    ))}
                  </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leader</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingTeams ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                          Loading teams...
                        </td>
                      </tr>
                    ) : filteredTeams.length > 0 ? (
                      filteredTeams.map((team) => {
                        const eventName = typeof team.eventId === 'object' ? team.eventId.name : 'Unknown';
                        const leader = typeof team.teamLeader === 'object' ? team.teamLeader.name : 'Unknown';
                        return (
                          <tr key={team._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.teamName || 'Individual'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{eventName}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{leader}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{team.teamMembers?.length || 0}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(team.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                              <button
                                onClick={() => setSelectedTeamDetails(team._id)}
                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                title="View Details"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                          No teams found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Team Details Modal */}
              {selectedTeamDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedTeamDetails(null)}>
                  <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Team Details
                      </h3>
                      <button
                        onClick={() => setSelectedTeamDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {(() => {
                      const team = teams.find(t => t._id === selectedTeamDetails);
                      if (!team) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Loading team details...</p>
                          </div>
                        );
                      }
                      const members = getTeamMembers(team._id);
                      const eventName = typeof team.eventId === 'object' ? team.eventId.name : 'Unknown Event';
                      const leader = typeof team.teamLeader === 'object' ? team.teamLeader : null;
                      return (
                        <div className="space-y-6">
                          {/* Team Information */}
                          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team Name</label>
                              <p className="text-lg font-semibold text-gray-900">{team.teamName || 'Individual'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team ID</label>
                              <p className="text-lg font-semibold text-gray-900">{team._id.slice(-6)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Event</label>
                              <p className="text-lg text-gray-900">{eventName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Team Leader</label>
                              <p className="text-lg text-gray-900">{leader?.name || 'Unknown'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Total Members</label>
                              <p className="text-lg font-semibold text-gray-900">{team.teamMembers?.length || 0}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Registration Date</label>
                              <p className="text-lg text-gray-900">{new Date(team.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* Team Members */}
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-4">Team Members</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OJASS ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {members.length > 0 ? (
                                    members.map((member: any) => (
                                      member && (
                                        <tr key={member._id || member} className="hover:bg-gray-50">
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {typeof member === 'object' ? member._id?.slice(-6) : member.slice(-6)}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {typeof member === 'object' ? member.ojassId : 'N/A'}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {typeof member === 'object' ? member.name : 'Unknown'}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {typeof member === 'object' ? member.email : 'N/A'}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {typeof member === 'object' ? member.collegeName : 'N/A'}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            {(() => {
                                              // Get payment status from member object or find in students array
                                              let isPaid = false;
                                              if (typeof member === 'object') {
                                                isPaid = member.isPaid || false;
                                              } else {
                                                const student = students.find(s => s._id === member);
                                                isPaid = student?.isPaid || false;
                                              }
                                              return (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                  isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                  {isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                              );
                                            })()}
                                          </td>
                                        </tr>
                                      )
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No members found.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
