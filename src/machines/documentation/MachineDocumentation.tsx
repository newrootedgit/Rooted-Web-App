import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { trpc } from '../../lib/trpc';

const UNCATEGORIZED = 'Other';

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MachineDocumentation() {
  const { data: docs, isLoading } = trpc.documentation.list.useQuery();
  const utils = trpc.useUtils();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleDownload(id: string) {
    setDownloadingId(id);
    try {
      const { url } = await utils.documentation.getDownloadUrl.fetch({ id });
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading documentation…</p>
      </div>
    );
  }

  if (!docs || docs.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Documentation</h1>
        <p className="text-muted-foreground py-8">
          No documentation has been added for your farm yet.
        </p>
      </div>
    );
  }

  // Group by category, preserving the (category asc) order from the API.
  const groups = new Map<string, typeof docs>();
  for (const doc of docs) {
    const key = doc.category?.trim() || UNCATEGORIZED;
    const list = groups.get(key) ?? [];
    list.push(doc);
    groups.set(key, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Manuals and guides for your farm's machines.
        </p>
      </div>

      {[...groups.entries()].map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {category}
          </h2>
          <div className="space-y-2">
            {items.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{doc.title}</p>
                    {doc.description && (
                      <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {doc.fileName}
                      {doc.fileSize ? ` · ${formatSize(doc.fileSize)}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(doc.id)}
                  disabled={downloadingId === doc.id}
                  className="flex items-center gap-1 px-3 py-2 bg-secondary border border-border rounded-md text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-50 shrink-0"
                >
                  <Download size={16} />
                  <span className="text-sm">{downloadingId === doc.id ? 'Opening…' : 'Download'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
