import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import { useJob } from "../hooks/useJob";

function JobDetailPage() {
  const { jobId } = useParams();
  const { data: job, isLoading, error } = useJob(jobId);

  useEffect(() => {
    document.title = job
      ? `${job.title} - TalentFlow`
      : "Job Details - TalentFlow";
  }, [job]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">
          {error ? `Error: ${error.message}` : "Job not found"}
        </div>
        <Link
          to="/jobs"
          className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{job.type || "Full-time"}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                job.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {job.status === "active" ? "Active" : "Archived"}
            </span>
          </div>
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-6 text-sm text-gray-500 pt-6 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          {job.updatedAt !== job.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Updated {new Date(job.updatedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Job Description
        </h2>
        {job.description ? (
          <div className="prose prose-gray max-w-none">
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
        ) : (
          <p className="text-gray-500">No description provided.</p>
        )}
      </div>
    </div>
  );
}

export default JobDetailPage;
