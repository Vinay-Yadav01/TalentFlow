import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { GripVertical } from "lucide-react";

function SortableJobCard({ job, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        className={`absolute left-2 top-4 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}

function DragDropContainer({ jobs, onReorder, renderJob }) {
  const [activeId, setActiveId] = useState(null);
  const [draggedJob, setDraggedJob] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setDraggedJob(jobs.find((job) => job.id === active.id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveId(null);
    setDraggedJob(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = jobs.findIndex((job) => job.id === active.id);
    const newIndex = jobs.findIndex((job) => job.id === over.id);

    if (oldIndex !== newIndex) {
      const newOrder = arrayMove(jobs, oldIndex, newIndex);
      const newJobIds = newOrder.map((job) => job.id);

      try {
        await onReorder(newJobIds);
      } catch (error) {
        console.error("Failed to reorder jobs:", error);
        // Error handling is done in the hook with rollback
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={jobs.map((job) => job.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <SortableJobCard key={job.id} job={job}>
              {renderJob(job)}
            </SortableJobCard>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && draggedJob ? (
          <div className="opacity-90 rotate-3 transform scale-105">
            {renderJob(draggedJob)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default DragDropContainer;
