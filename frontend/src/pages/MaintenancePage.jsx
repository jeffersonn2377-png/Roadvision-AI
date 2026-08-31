import React, { useState, useEffect } from 'react';
import { maintenanceAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Wrench, CheckCircle2, Clock, UserCheck, RotateCw, Edit, Save } from 'lucide-react';

export default function MaintenancePage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const data = await maintenanceAPI.getAll();
      setList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditStatus(item.status);
    setEditAssignee(item.assigned_to);
    setEditNotes(item.notes || '');
  };

  const handleSaveEdit = async (id) => {
    try {
      await maintenanceAPI.update(id, {
        status: editStatus,
        assigned_to: editAssignee,
        notes: editNotes,
        completed_date: editStatus === 'Completed' ? new Date().toISOString().split('T')[0] : null
      });
      setEditingId(null);
      fetchMaintenance();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredList = list.filter((m) => {
    if (activeTab === 'ALL') return true;
    return m.status === activeTab;
  });

  const pendingCount = list.filter(m => m.status === 'Pending').length;
  const assignedCount = list.filter(m => m.status === 'Assigned').length;
  const inProgressCount = list.filter(m => m.status === 'In Progress').length;
  const completedCount = list.filter(m => m.status === 'Completed').length;

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="font-['Outfit'] text-2xl lg:text-3xl font-extrabold text-white flex items-center space-x-3">
            <Wrench className="w-6 h-6 text-cyan-400" />
            <span>Municipal Maintenance Dispatch Portal</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-400">
            Work order lifecycle management. All status updates persist in SQLite database.
          </p>
        </div>
        <button
          onClick={fetchMaintenance}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
          <p className="text-[11px] text-amber-400 font-semibold uppercase">Pending Repairs</p>
          <p className="font-['Outfit'] text-2xl font-bold text-amber-400">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30">
          <p className="text-[11px] text-cyan-400 font-semibold uppercase">Assigned Repairs</p>
          <p className="font-['Outfit'] text-2xl font-bold text-cyan-400">{assignedCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30">
          <p className="text-[11px] text-indigo-400 font-semibold uppercase">In Progress</p>
          <p className="font-['Outfit'] text-2xl font-bold text-indigo-400">{inProgressCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
          <p className="text-[11px] text-emerald-400 font-semibold uppercase">Completed</p>
          <p className="font-['Outfit'] text-2xl font-bold text-emerald-400">{completedCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs w-full sm:w-auto self-start overflow-x-auto">
        {['ALL', 'Pending', 'Assigned', 'In Progress', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Maintenance Cards List */}
      <div className="space-y-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-cyan-400 font-bold text-xs">TICKET #{item.id}</span>
                <h3 className="font-['Outfit'] font-bold text-base text-white">
                  {item.damage_record?.road_name || 'Road Segment'}
                </h3>
                <StatusBadge type="status" value={item.status} />
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Est. Repair Cost: <span className="text-emerald-400 font-bold">₹{Math.round(item.estimated_cost).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {editingId === item.id ? (
              /* Edit Form inside Card */
              <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-cyan-500/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Assigned Crew</label>
                    <input
                      type="text"
                      value={editAssignee}
                      onChange={(e) => setEditAssignee(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Dispatch Notes</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Update</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Static View inside Card */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-slate-300">
                  <p>Defect: <strong className="text-cyan-300">{item.damage_record?.damage_type}</strong></p>
                  <p>Assigned Crew: <strong className="text-white">{item.assigned_to}</strong></p>
                  <p className="text-slate-400 italic">"{item.notes || 'No notes added.'}"</p>
                </div>

                <button
                  onClick={() => handleStartEdit(item)}
                  className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400 hover:bg-slate-700 flex items-center space-x-1.5 self-end sm:self-auto"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
