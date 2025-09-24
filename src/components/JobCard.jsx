import { Link } from "react-router-dom";
import {
  Edit,
  Archive,
  ArchiveRestore,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";

function JobCard({ job, onEdit, onArchive }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 p-6 h-full flex flex-col hover:border-blue-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/jobs/${job.slug}`}
            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-2 leading-tight"
          >
            {job.title}
          </Link>
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{job.location || "Remote"}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{job.type || "Full-time"}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {job.salary}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ml-4 flex-shrink-0 ${
            job.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {job.status === "active" ? "Active" : "Archived"}
        </span>
      </div>

      {/* Description */}
      {job.description && (
        <div className="mb-4 flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {job.description}
          </p>
        </div>
      )}

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {job.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
        <div className="text-xs text-gray-500">
          Created {new Date(job.createdAt).toLocaleDateString()}
        </div>

        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit job"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={onArchive}
            className={`p-2 rounded-lg transition-colors ${
              job.status === "active"
                ? "text-gray-500 hover:text-red-600 hover:bg-red-50"
                : "text-gray-500 hover:text-green-600 hover:bg-green-50"
            }`}
            title={job.status === "active" ? "Archive job" : "Restore job"}
          >
            {job.status === "active" ? (
              <Archive className="w-4 h-4" />
            ) : (
              <ArchiveRestore className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
