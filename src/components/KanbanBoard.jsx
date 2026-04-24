import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { moveJob, deleteJob } from '../store/slices/jobsSlice';
import { Trash2, GripVertical, Building2, ShieldAlert, BadgeCheck } from 'lucide-react';

const JobCard = ({ job, isOverlay }) => {
  const dispatch = useDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-obsidian-800/60 border border-slate-700/50 p-4 rounded-xl backdrop-blur-md mb-3 group transition-all hover:border-violet-glow/30 ${isOverlay ? 'shadow-[0_0_20px_rgba(189,194,255,0.15)] ring-1 ring-violet-glow/50' : ''}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{job.company || 'Unknown Corp'}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-violet-glow transition-colors line-clamp-1">{job.title || 'Job Application'}</h3>
        </div>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-slate-600 hover:text-slate-400">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          {job.score ? (
            <div className={`text-[10px] font-mono font-bold flex items-center gap-1 ${getScoreColor(job.score)}`}>
              {job.score >= 80 ? <BadgeCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
              {job.score}%
            </div>
          ) : (
            <span className="text-[10px] text-slate-600 font-mono italic">UNCALIBRATED</span>
          )}
        </div>
        <button 
          onClick={() => dispatch(deleteJob(job.id))}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-600 hover:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const KanbanColumn = ({ id, jobs }) => {
  return (
    <div className="flex flex-col w-64 bg-obsidian-900/40 border border-slate-800/30 rounded-2xl p-4 min-h-[500px]">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{id}</h2>
        <span className="text-[10px] font-mono bg-slate-800/50 text-slate-400 px-1.5 py-0.5 rounded-full">{jobs.length}</span>
      </div>
      
      <SortableContext id={id} items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {jobs.length === 0 && (
            <div className="h-full border-2 border-dashed border-slate-800/30 rounded-xl flex items-center justify-center p-8">
              <span className="text-[10px] text-slate-700 font-bold uppercase tracking-widest text-center">Empty Slot</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const { jobs, columns } = useSelector((state) => state.jobs);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeJob = jobs.find(j => j.id === activeId);
    const overContainer = over.data.current?.sortable?.containerId || over.id;

    if (activeJob && columns.includes(overContainer) && activeJob.status !== overContainer) {
      dispatch(moveJob({ jobId: activeId, newStatus: overContainer }));
    }
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Logic for sorting within column could be added here if we want specific ordering
  };

  const activeJob = activeId ? jobs.find(j => j.id === activeId) : null;

  return (
    <div className="min-h-screen bg-obsidian-900 p-8 pt-12 overflow-x-auto">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Application Pipeline</h1>
          <p className="text-slate-500 uppercase tracking-widest text-xs font-bold border-l-2 border-violet-glow/30 pl-4 py-1">
            Kinetic Archive | Career Trajectory Tracking
          </p>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 pb-8">
            {columns.map((columnId) => (
              <KanbanColumn 
                key={columnId} 
                id={columnId} 
                jobs={jobs.filter(j => j.status === columnId)} 
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}>
            {activeJob ? (
              <JobCard job={activeJob} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
