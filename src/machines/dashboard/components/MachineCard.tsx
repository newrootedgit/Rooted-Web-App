import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Settings, Calendar, Cpu, Wifi } from 'lucide-react';
import type { Machine } from '../../../../shared';
import { getMachineImage } from '../../lib/machine-images';

interface MachineCardProps {
  machine: Machine;
  onDelete: (id: string) => void;
}

export default function MachineCard({ machine, onDelete }: MachineCardProps) {
  const machineImage = getMachineImage(machine.name);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${machine.name}"?`)) {
      onDelete(machine.deviceId);
    }
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement update functionality
  };

  return (
    <div
      className={`bg-card border rounded-lg cursor-pointer transition-all overflow-hidden ${
        isExpanded ? 'border-primary shadow-lg' : 'border-border hover:border-border/80 hover:shadow-md'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">{machine.name}</span>
          <span className="text-sm text-muted-foreground font-mono">{machine.deviceId}</span>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className={`flex gap-6 py-4 ${machineImage ? 'flex-row' : 'flex-col'}`}>
            {machineImage && (
              <>
                <img src={machineImage} alt={machine.name} className="w-64 h-64 object-contain flex-shrink-0" />
                <div className="w-px bg-border my-2" />
              </>
            )}
            <div className={`flex flex-col gap-4 ${machineImage ? 'flex-1 pl-2' : 'grid grid-cols-3 gap-4'}`}>
              <div className="flex items-start gap-2">
                <Cpu size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Machine ID</span>
                  <span className="text-sm text-foreground break-all">{machine.id}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Added On</span>
                  <span className="text-sm text-foreground">{formatDate(machine.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wifi size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</span>
                  <span className="flex items-center gap-1.5 text-sm text-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-border">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary border border-border rounded-md text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={handleUpdate}
            >
              <Settings size={16} />
              Configure
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-destructive rounded-md text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}