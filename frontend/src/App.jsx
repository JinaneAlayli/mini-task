// frontend/src/App.jsx
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Could not load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on first render
  useEffect(() => {
    fetchTasks();
  }, []);

  // Create new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      setError('');
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setTitle('');
    } catch (err) {
      console.error(err);
      setError('Could not create task. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Toggle done
  const handleToggle = async (id) => {
    try {
      setError('');
      const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        throw new Error('Failed to toggle task');
      }
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (err) {
      console.error(err);
      setError('Could not toggle task.');
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;

    try {
      setError('');
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      setError('Could not delete task.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        color: '#111827',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem 1.75rem',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.25rem',
            gap: '0.5rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                margin: 0,
                marginBottom: '0.25rem',
              }}
            >
              Mini Tasks Cloud
            </h1>
            <p
              style={{
                margin: 0,
                color: '#6b7280',
                fontSize: '0.9rem',
              }}
            >
              Simple full-stack demo: React, Node.js, MongoDB Atlas.
            </p>
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#6b7280',
              textAlign: 'right',
            }}
          >
            <div>
              Total tasks:{' '}
              <span style={{ fontWeight: 600 }}>{tasks.length}</span>
            </div>
            <button
              type="button"
              onClick={fetchTasks}
              style={{
                marginTop: '0.35rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                border: '1px solid #d1d5db',
                background: '#ffffff',
                color: '#4b5563',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              marginBottom: '0.9rem',
              fontSize: '0.85rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

        {/* Add form */}
        <form
          onSubmit={handleAddTask}
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: 1,
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: '#f9fafb',
              color: '#111827',
              outline: 'none',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: creating ? 'default' : 'pointer',
              background: creating ? '#9ca3af' : '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              boxShadow: creating
                ? 'none'
                : '0 10px 18px rgba(37, 99, 235, 0.25)',
              transition: 'transform 0.08s ease, box-shadow 0.08s ease',
            }}
          >
            {creating ? 'Adding...' : 'Add task'}
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading tasks...</p>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <div
            style={{
              padding: '0.9rem 0.75rem',
              borderRadius: '8px',
              background: '#f9fafb',
              border: '1px dashed #d1d5db',
              color: '#6b7280',
              fontSize: '0.9rem',
            }}
          >
            You don’t have any tasks yet. Start by adding your first task.
          </div>
        )}

        {/* Task list */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginTop: tasks.length ? '0.25rem' : 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={() => handleToggle(task._id)}
                  style={{ cursor: 'pointer' }}
                />
                <span
                  style={{
                    textDecoration: task.isDone ? 'line-through' : 'none',
                    color: task.isDone ? '#9ca3af' : '#111827',
                    fontSize: '0.95rem',
                  }}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => handleDelete(task._id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '0.1rem 0.3rem',
                  lineHeight: 1,
                }}
                aria-label="Delete task"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
