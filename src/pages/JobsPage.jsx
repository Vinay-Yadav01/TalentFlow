import { useState, useEffect } from "react";
import { Search, Plus, Filter } from "lucide-react";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import Pagination from "../components/Pagination";
import DragDropContainer from "../components/DragDropContainer";
import SkeletonJobCard from "../components/SkeletonJobCard";
import { useJobs } from "../hooks/useJobs";

function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const {
    data,
    isLoading,
    error,
    createJob,
    updateJob,
    toggleJobStatus,
    reorderJobs,
  } = useJobs({
    page: currentPage,
    pageSize: 8,
    search: searchTerm,
    status: statusFilter,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleCreateJob = async (jobData) => {
    await createJob(jobData);
    setIsModalOpen(false);
  };

  const handleEditJob = async (jobData) => {
    await updateJob(editingJob.id, jobData);
    setEditingJob(null);
    setIsModalOpen(false);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleArchive = async (job) => {
    const newStatus = job.status === "active" ? "archived" : "active";
    await toggleJobStatus(job.id, newStatus);
  };

  const handleReorder = async (newJobIds) => {
    await reorderJobs(newJobIds);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">
          Error loading jobs: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            Create Job
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonJobCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {data?.jobs?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No jobs found</div>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <DragDropContainer
                jobs={data?.jobs || []}
                onReorder={handleReorder}
                renderJob={(job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={() => handleEdit(job)}
                    onArchive={() => handleArchive(job)}
                  />
                )}
              />

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={data.pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Job Modal */}
      {isModalOpen && (
        <JobModal
          job={editingJob}
          onSave={editingJob ? handleEditJob : handleCreateJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default JobsPage;
