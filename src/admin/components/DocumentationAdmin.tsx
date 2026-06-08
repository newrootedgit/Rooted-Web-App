import { useState, useRef } from 'react';
import { FileText, Trash2, Upload } from 'lucide-react';
import { trpc } from '../lib/trpc';

const SUGGESTED_CATEGORIES = ['Manuals', 'Safety', 'Maintenance', 'Guides', 'Warranty'];

export function DocumentationAdmin() {
  const utils = trpc.useUtils();
  const [tenantId, setTenantId] = useState('');
  const [farmId, setFarmId] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: tenants } = trpc.admin.getAllTenants.useQuery();
  const { data: farms } = trpc.admin.getTenantFarms.useQuery(
    { tenantId },
    { enabled: !!tenantId }
  );
  const { data: docs, isLoading: docsLoading } = trpc.documentation.listForFarm.useQuery(
    { farmId },
    { enabled: !!farmId }
  );

  const getUploadUrl = trpc.documentation.getUploadUrl.useMutation();
  const createDoc = trpc.documentation.create.useMutation({
    onSuccess: () => utils.documentation.listForFarm.invalidate({ farmId }),
  });
  const deleteDoc = trpc.documentation.delete.useMutation({
    onSuccess: () => utils.documentation.listForFarm.invalidate({ farmId }),
  });

  function resetForm() {
    setTitle('');
    setCategory('');
    setDescription('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!farmId || !file) return;

    try {
      setStatus('uploading');
      const { uploadUrl, s3Key } = await getUploadUrl.mutateAsync({
        farmId,
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
      });

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      });
      if (!uploadRes.ok) throw new Error('Failed to upload file to storage');

      setStatus('saving');
      await createDoc.mutateAsync({
        farmId,
        title: title.trim(),
        category: category.trim() || undefined,
        description: description.trim() || undefined,
        s3Key,
        fileName: file.name,
        contentType: file.type || undefined,
        fileSize: file.size,
      });

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setStatus('idle');
    }
  }

  const selectClass =
    'px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary';
  const isBusy = status !== 'idle';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Upload documentation files that farm users will see in their Machines tab.
        </p>
      </div>

      {/* Tenant + farm selection */}
      <div className="bg-card border border-border rounded-lg p-6 flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Tenant</label>
          <select
            value={tenantId}
            onChange={(e) => {
              setTenantId(e.target.value);
              setFarmId('');
            }}
            className={selectClass}
          >
            <option value="">Select a tenant…</option>
            {tenants?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Farm</label>
          <select
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            disabled={!tenantId}
            className={`${selectClass} disabled:opacity-50`}
          >
            <option value="">Select a farm…</option>
            {farms?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!farmId && (
        <div className="bg-secondary/50 border border-border rounded-lg p-8 text-center text-muted-foreground">
          Select a tenant and farm to manage its documentation.
        </div>
      )}

      {farmId && (
        <>
          {/* Upload form */}
          <form onSubmit={handleUpload} className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Upload a document</h2>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={selectClass}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Category</label>
                <input
                  type="text"
                  list="doc-categories"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Manuals"
                  className={selectClass}
                />
                <datalist id="doc-categories">
                  {SUGGESTED_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className={`${selectClass} resize-none`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">File *</label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-sm text-foreground file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-secondary file:text-foreground hover:file:bg-primary hover:file:text-primary-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isBusy || !file || !title.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Upload size={16} />
              {status === 'uploading' ? 'Uploading…' : status === 'saving' ? 'Saving…' : 'Upload'}
            </button>
          </form>

          {/* Existing docs */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Existing documents</h2>
            {docsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading documents…</div>
            ) : !docs || docs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No documents uploaded yet.</div>
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.category ? `${doc.category} · ` : ''}
                          {doc.fileName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${doc.title}"?`)) deleteDoc.mutate({ id: doc.id });
                      }}
                      disabled={deleteDoc.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
