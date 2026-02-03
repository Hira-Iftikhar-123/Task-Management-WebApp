import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, deleteTask } from '../services/taskService';
import TaskForm from '../components/TaskForm';

const TASKS_PER_PAGE = 5;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { user, logout } = useAuth();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await getTasks({
      page,
      limit: TASKS_PER_PAGE,
      search: searchQuery,
      status: filterStatus !== 'All' ? filterStatus : undefined,
    });
    setLoading(false);

    if (result.success) {
      setTasks(result.data.tasks);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    } else {
      setError(result.message);
    }
  }, [page, searchQuery, filterStatus]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.success) {
        fetchTasks();
      } else {
        setError(result.message);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-400/30 text-green-200 border border-green-400/50';
      case 'In Progress':
        return 'bg-yellow-400/30 text-yellow-200 border border-yellow-400/50';
      case 'Pending':
        return 'bg-purple-400/30 text-purple-200 border border-purple-400/50';
      default:
        return 'bg-purple-400/30 text-purple-200 border border-purple-400/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-800 to-purple-900">
      <header className="bg-purple-600/50 backdrop-blur-sm border-b border-purple-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Task Management</h1>
              <p className="text-sm text-purple-200">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-purple-200 bg-white/10 border border-purple-400/30 rounded-xl hover:bg-white/20 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="px-5 py-2.5 bg-purple-400 text-purple-900 font-semibold rounded-xl hover:bg-purple-300 transition-all shadow-lg"
          >
            + Create New Task
          </button>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 min-w-[180px] sm:min-w-0">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-purple-800/50 border border-purple-600/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-purple-200 whitespace-nowrap">Filter:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 bg-purple-800/50 border border-purple-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/20 border border-red-500/50 p-4">
            <div className="text-sm text-red-200">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-purple-200 text-lg">
                  {searchQuery || filterStatus !== 'All'
                    ? 'No tasks match your filters.'
                    : 'No tasks yet. Create your first task!'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-purple-800/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-600/30 hover:border-purple-400/40 transition-all shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-purple-200 mb-4 line-clamp-3">{task.description}</p>
                      )}
                      <p className="text-xs text-purple-400 mb-4">
                        Created: {new Date(task.createdDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-purple-900 bg-purple-400 rounded-xl hover:bg-purple-300 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-red-200 bg-red-500/30 border border-red-400/50 rounded-xl hover:bg-red-500/40 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2.5 text-sm font-medium bg-purple-800/50 border border-purple-400/30 rounded-xl text-purple-200 hover:bg-purple-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2.5 text-sm text-purple-200">
                      Page {page} of {totalPages} ({total} tasks)
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-4 py-2.5 text-sm font-medium bg-purple-800/50 border border-purple-400/30 rounded-xl text-purple-200 hover:bg-purple-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      {showForm && (
        <TaskForm task={editingTask} onClose={handleFormClose} onSuccess={handleFormClose} />
      )}
    </div>
  );
};

export default TaskList;