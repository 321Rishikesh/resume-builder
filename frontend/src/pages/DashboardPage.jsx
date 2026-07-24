import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Copy, Trash2, Clock, MoreVertical } from 'lucide-react';
import api from '../api/axios';
import { getErrorMessage } from '../utils/validation';

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/resumes');
      setResumes(data);
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
    setMenuOpen(null);
  };

  const handleDuplicate = async (id) => {
    try {
      const { data } = await api.post(`/resumes/${id}/duplicate`);
      setResumes((prev) => [data, ...prev]);
    } catch (err) {
      alert(getErrorMessage(err));
    }
    setMenuOpen(null);
  };

  const handleCreate = async () => {
    try {
      const { data } = await api.post('/resumes', { title: 'Untitled Resume' });
      navigate(`/resume/${data._id}`);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="p-6 lg:p-10 animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 lg:text-3xl">My Resumes</h1>
          <p className="mt-1 text-surface-500">Create and manage your professional resumes</p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Resume
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
            <FileText className="h-8 w-8 text-brand-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-surface-900">No resumes yet</h3>
          <p className="mb-6 max-w-sm text-surface-500">
            Create your first resume and start building your professional profile
          </p>
          <button onClick={handleCreate} className="btn-primary">
            <Plus className="h-4 w-4" />
            Create Resume
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="card group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => navigate(`/resume/${resume._id}`)}
            >
              <div className="p-5">
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100">
                  <FileText className="h-10 w-10 text-brand-400" />
                </div>
                <h3 className="font-semibold text-surface-900 truncate">{resume.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-surface-500">
                  <Clock className="h-3.5 w-3.5" />
                  Updated {formatDate(resume.updatedAt)}
                </div>
                <span className="mt-2 inline-block rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium capitalize text-surface-600">
                  {resume.template}
                </span>
              </div>

              <div className="absolute right-3 top-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === resume._id ? null : resume._id);
                  }}
                  className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-100"
                >
                  <MoreVertical className="h-4 w-4 text-surface-500" />
                </button>
                {menuOpen === resume._id && (
                  <div className="absolute right-0 top-8 z-10 w-40 rounded-xl border border-surface-200 bg-white py-1 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(resume._id);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50"
                    >
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(resume._id);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
