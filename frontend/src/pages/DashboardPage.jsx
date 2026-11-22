import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Copy, Trash2, Clock, MoreVertical, Sparkles, ArrowUpRight } from 'lucide-react';
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
    <div className="min-h-screen p-5 sm:p-7 lg:p-10 animate-fade-in">
      <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Your workspace</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 lg:text-4xl">My resumes</h1>
          <p className="mt-2 text-surface-500">Build a career story you’re proud to share.</p>
        </div>
        <button onClick={handleCreate} className="btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New Resume
        </button>
      </div>

      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 via-indigo-950 to-brand-900 p-6 text-white shadow-xl shadow-brand-900/15 sm:p-8">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Make your next move count
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Turn experience into opportunity.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/75">Create an ATS-friendly resume with a live preview, thoughtful templates, and guidance that keeps your story focused.</p>
          <button onClick={handleCreate} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-surface-900 transition hover:bg-brand-50">
            Start a new resume <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
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
        <>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-surface-900">Your documents</p>
              <p className="mt-0.5 text-xs text-surface-500">{resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'} in your workspace</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="card group relative cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10"
                onClick={() => navigate(`/resume/${resume._id}`)}
              >
              <div className="p-5">
                <div className="mb-4 flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 via-indigo-50 to-cyan-50 ring-1 ring-brand-100/70">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg shadow-brand-900/10">
                    <FileText className="h-7 w-7" />
                  </div>
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
        </>
      )}
      </div>
    </div>
  );
}
