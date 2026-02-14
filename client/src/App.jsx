import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Plus } from "lucide-react";
import Layout from "./components/Layout";
import JobCard from "./components/JobCard";
import JobDetail from "./components/JobDetail";
import AddJobModal from "./components/AddJobModal";
import AddManualEntryModal from "./components/AddManualEntryModal";
import { useJobs } from "./hooks/useJobs";
import { useEntries } from "./hooks/useEntries";

function App() {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  const { jobs, loading, error, activeJobsCount, createJob, deleteJob, clockIn, clockOut, refreshJobs } = useJobs();
  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const { entries, loading: entriesLoading, addEntry, updateEntryComment, deleteEntry, refreshEntries } = useEntries(selectedJob?.id);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  async function handleClockToggle(job) {
    try {
      if (job.activeEntry) {
        await clockOut(job.id);
      } else {
        await clockIn(job.id);
      }
      await refreshEntries();
    } catch (err) {
      alert(err.response?.data?.message ?? "Clock action failed");
    }
  }

  async function handleCreateJob(payload) {
    try {
      setSubmitting(true);
      const created = await createJob(payload);
      setSelectedJobId(created.id);
      setShowAddJob(false);
    } catch (err) {
      alert(err.response?.data?.message ?? "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm("Delete this job and all its entries?")) return;
    try {
      await deleteJob(jobId);
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
      }
    } catch (err) {
      alert(err.response?.data?.message ?? "Failed to delete job");
    }
  }

  async function handleAddEntry(payload) {
    try {
      setSubmitting(true);
      await addEntry(payload);
      await refreshJobs();
      setShowManualEntry(false);
    } catch (err) {
      alert(err.response?.data?.message ?? "Failed to save entry");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateComment(entryId, comment) {
    try {
      await updateEntryComment(entryId, comment);
      await refreshJobs();
    } catch (err) {
      alert(err.response?.data?.message ?? "Failed to update comment");
    }
  }

  async function handleDeleteEntry(entryId) {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteEntry(entryId);
      await refreshJobs();
    } catch (err) {
      alert(err.response?.data?.message ?? "Failed to delete entry");
    }
  }

  return (
    <>
      <Layout
        sidebar={
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-white">Work Hour Tracker</h1>
                  <p className="text-sm text-slate-400">{activeJobsCount} active jobs running</p>
                </div>
                <BriefcaseBusiness className="text-sky-400" size={22} />
              </div>
              <button
                type="button"
                onClick={() => setShowAddJob(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/60 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
              >
                <Plus size={16} />
                Add Job
              </button>
            </div>

            {loading && <p className="text-sm text-slate-400">Loading jobs...</p>}
            {error && <p className="rounded-xl border border-rose-500/50 bg-rose-950/50 p-3 text-sm text-rose-200">{error}</p>}

            <div className="space-y-3">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  nowMs={nowMs}
                  isSelected={selectedJobId === job.id}
                  onSelect={setSelectedJobId}
                  onClockToggle={handleClockToggle}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          </section>
        }
      >
        <JobDetail
          job={selectedJob}
          entries={entries}
          entriesLoading={entriesLoading}
          onClockToggle={handleClockToggle}
          onOpenManualEntry={() => setShowManualEntry(true)}
          onSaveComment={handleUpdateComment}
          onDeleteEntry={handleDeleteEntry}
        />
      </Layout>

      <AddJobModal open={showAddJob} onClose={() => setShowAddJob(false)} onSubmit={handleCreateJob} loading={submitting} />
      <AddManualEntryModal
        open={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onSubmit={handleAddEntry}
        loading={submitting}
      />
    </>
  );
}

export default App;
