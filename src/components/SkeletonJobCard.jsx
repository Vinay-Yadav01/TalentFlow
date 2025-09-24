function SkeletonJobCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 h-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16 ml-4"></div>
      </div>

      {/* Description skeleton */}
      <div className="mb-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Tags skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-18"></div>
      </div>

      {/* Actions skeleton */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="flex gap-1">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonJobCard;
