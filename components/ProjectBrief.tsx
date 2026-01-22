'use client';

import { useState, useEffect } from 'react';
import { getProgress, saveProjectBrief, ProjectBrief as ProjectBriefType } from '@/lib/progress';

interface ProjectBriefProps {
  editable?: boolean;
  className?: string;
  onUpdate?: (brief: ProjectBriefType) => void;
}

export default function ProjectBrief({
  editable = false,
  className = '',
  onUpdate,
}: ProjectBriefProps) {
  const [brief, setBrief] = useState<ProjectBriefType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBrief, setEditedBrief] = useState<Partial<ProjectBriefType>>({});

  useEffect(() => {
    const progress = getProgress();
    if (progress.projectBrief) {
      setBrief(progress.projectBrief);
      setEditedBrief(progress.projectBrief);
    }
  }, []);

  const handleSave = () => {
    if (editedBrief) {
      saveProjectBrief(editedBrief);
      setBrief(editedBrief as ProjectBriefType);
      setIsEditing(false);
      onUpdate?.(editedBrief as ProjectBriefType);
    }
  };

  const handleCancel = () => {
    setEditedBrief(brief || {});
    setIsEditing(false);
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...(editedBrief.tasks || [])];
    newTasks[index] = value;
    setEditedBrief({ ...editedBrief, tasks: newTasks });
  };

  const addTask = () => {
    setEditedBrief({
      ...editedBrief,
      tasks: [...(editedBrief.tasks || []), ''],
    });
  };

  const removeTask = (index: number) => {
    const newTasks = [...(editedBrief.tasks || [])];
    newTasks.splice(index, 1);
    setEditedBrief({ ...editedBrief, tasks: newTasks });
  };

  if (!brief && !editable) {
    return (
      <div className={`bg-card rounded-xl p-6 border border-border ${className}`}>
        <div className="text-center text-muted-foreground">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No project brief yet.</p>
          <p className="text-sm mt-1">Complete the Orientation module to create one.</p>
        </div>
      </div>
    );
  }

  const displayBrief = isEditing ? editedBrief : brief;

  return (
    <div className={`bg-card rounded-xl overflow-hidden border border-border ${className}`}>
      {/* Header */}
      <div className="bg-foreground px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-background">
            {displayBrief?.projectTitle || 'Your Project'}
          </h3>
          {displayBrief?.businessName && (
            <p className="text-background/70 text-sm">for {displayBrief.businessName}</p>
          )}
        </div>
        {editable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-background/20 hover:bg-background/30 text-background px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-1.5">
            Description
          </label>
          {isEditing ? (
            <textarea
              value={editedBrief.projectDescription || ''}
              onChange={(e) => setEditedBrief({ ...editedBrief, projectDescription: e.target.value })}
              className="w-full bg-muted text-foreground rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={2}
            />
          ) : (
            <p className="text-foreground">{displayBrief?.projectDescription || 'No description yet'}</p>
          )}
        </div>

        {/* Problem Solved */}
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-1.5">
            Problem Solved
          </label>
          {isEditing ? (
            <textarea
              value={editedBrief.problemSolved || ''}
              onChange={(e) => setEditedBrief({ ...editedBrief, problemSolved: e.target.value })}
              className="w-full bg-muted text-foreground rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={2}
            />
          ) : (
            <p className="text-foreground">{displayBrief?.problemSolved || 'Not specified'}</p>
          )}
        </div>

        {/* Target Users */}
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-1.5">
            Who Will Use It
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedBrief.targetUsers || ''}
              onChange={(e) => setEditedBrief({ ...editedBrief, targetUsers: e.target.value })}
              className="w-full bg-muted text-foreground rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <p className="text-foreground">{displayBrief?.targetUsers || 'Not specified'}</p>
          )}
        </div>

        {/* Tasks */}
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Tasks ({displayBrief?.tasks?.length || 0})
          </label>
          {isEditing ? (
            <div className="space-y-2">
              {(editedBrief.tasks || []).map((task, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-muted-foreground w-6 text-right mt-2.5">{index + 1}.</span>
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    className="flex-1 bg-muted text-foreground rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => removeTask(index)}
                    className="text-destructive hover:text-destructive/80 px-2 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                onClick={addTask}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                + Add task
              </button>
            </div>
          ) : (
            <ol className="space-y-2">
              {(displayBrief?.tasks || []).map((task, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-muted-foreground w-6 text-right">{index + 1}.</span>
                  <span className="text-foreground">{task}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Edit buttons */}
        {isEditing && (
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary px-4 py-2"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for sidebar/navigation
export function ProjectBriefCompact({ className = '' }: { className?: string }) {
  const [brief, setBrief] = useState<ProjectBriefType | null>(null);

  useEffect(() => {
    const progress = getProgress();
    if (progress.projectBrief) {
      setBrief(progress.projectBrief);
    }
  }, []);

  if (!brief?.projectTitle) {
    return null;
  }

  const completedTasks = 0; // TODO: Track completed tasks
  const totalTasks = brief.tasks?.length || 0;

  return (
    <div className={`bg-card rounded-xl p-4 border border-border ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-foreground font-medium truncate">{brief.projectTitle}</h4>
          <p className="text-muted-foreground text-sm">
            {completedTasks}/{totalTasks} tasks complete
          </p>
        </div>
      </div>
    </div>
  );
}
