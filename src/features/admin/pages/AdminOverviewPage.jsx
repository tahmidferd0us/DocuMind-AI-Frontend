import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Database,
  FileCode,
  FileDown,
  FileSpreadsheet,
  FileText,
  HardDrive,
  Layers,
  MessageSquare,
  RefreshCw,
  Server,
  ShieldAlert,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Spinner } from '@components/ui';
import { formatBytes, formatDate } from '@lib/format';
import { PATHS, documentPath } from '@routes/paths';
import { useGetAdminAnalyticsQuery } from '../adminApi';

const STATUS_TONES = {
  READY: 'success',
  PROCESSING: 'warning',
  FAILED: 'danger',
};

const formatUptime = (seconds) => {
  if (!seconds || seconds < 60) return `${seconds || 0}s`;
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  return parts.join(' ');
};

const getMimeLabel = (mime) => {
  if (mime?.includes('pdf')) return 'PDF Document';
  if (mime?.includes('word') || mime?.includes('officedocument')) return 'Word Document';
  if (mime?.includes('text')) return 'Plain Text';
  return mime || 'Other';
};

const AdminOverviewPage = () => {
  const { data: analytics, isLoading, isFetching, refetch } = useGetAdminAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  const { users, documents, ai, system, recentActivity } = analytics || {};
  const totalDocs = documents?.total || 0;
  const readyCount = documents?.byStatus?.ready || 0;
  const processingCount = documents?.byStatus?.processing || 0;
  const failedCount = documents?.byStatus?.failed || 0;

  const readyPct = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0;
  const procPct = totalDocs > 0 ? Math.round((processingCount / totalDocs) * 100) : 0;
  const failPct = totalDocs > 0 ? Math.round((failedCount / totalDocs) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Bar with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Platform Overview & Metrics</h2>
          <p className="text-xs text-slate-500">Live consolidated indicators across users, documents, and compute nodes.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          leftIcon={<RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
        >
          {isFetching ? 'Refreshing…' : 'Refresh Data'}
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Users KPI */}
        <Card className="p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Platform Users</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Users className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">{users?.total ?? 0}</span>
              <p className="mt-0.5 text-xs text-slate-500">
                {users?.active ?? 0} active &middot; {users?.admins ?? 1} admin
              </p>
            </div>
            {users?.recentSignups > 0 && (
              <Badge tone="brand" className="text-[10px]">
                +{users.recentSignups} this week
              </Badge>
            )}
          </div>
        </Card>

        {/* Documents KPI */}
        <Card className="p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Processed Documents</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{documents?.total ?? 0}</span>
            <p className="mt-0.5 text-xs text-slate-500">
              {(documents?.totalPages || 0).toLocaleString()} pages &middot; {(documents?.totalWords || 0).toLocaleString()} words
            </p>
          </div>
        </Card>

        {/* Storage Volume KPI */}
        <Card className="p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Platform Storage</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Database className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {formatBytes(documents?.totalSizeBytes || 0)}
            </span>
            <p className="mt-0.5 text-xs text-slate-500">
              Avg {totalDocs ? formatBytes(Math.round((documents?.totalSizeBytes || 0) / totalDocs)) : '0 B'} / doc
            </p>
          </div>
        </Card>

        {/* AI Ingested Insights KPI */}
        <Card className="p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Intelligence</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Sparkles className="size-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {(ai?.totalSummaries || 0) + (ai?.totalQaMessages || 0) + (ai?.totalEntitySets || 0)}
            </span>
            <p className="mt-0.5 text-xs text-slate-500">
              {ai?.totalSummaries || 0} summaries &middot; {ai?.totalQaMessages || 0} Q&A
            </p>
          </div>
        </Card>
      </div>

      {/* Analytics Breakdown Row: Document Processing Health & File Types */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Processing Pipeline Health */}
        <Card className="shadow-xs">
          <CardHeader
            title="Document Pipeline Health"
            description="Operational status distribution across all uploaded files."
          />
          <CardBody className="flex flex-col gap-5">
            {/* Visual Multi-segment Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 flex">
                <div
                  style={{ width: `${readyPct}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title={`Ready: ${readyCount} (${readyPct}%)`}
                />
                <div
                  style={{ width: `${procPct}%` }}
                  className="bg-amber-400 transition-all duration-500"
                  title={`Processing: ${processingCount} (${procPct}%)`}
                />
                <div
                  style={{ width: `${failPct}%` }}
                  className="bg-rose-500 transition-all duration-500"
                  title={`Failed: ${failedCount} (${failPct}%)`}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{totalDocs} Total Ingested</span>
                <span className="font-medium text-emerald-600">{readyPct}% Success Rate</span>
              </div>
            </div>

            {/* Status Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-line bg-surface-muted/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Ready</span>
                </div>
                <div className="mt-1 text-xl font-bold text-slate-900">{readyCount}</div>
                <div className="text-[11px] text-slate-500">{readyPct}% of library</div>
              </div>

              <div className="rounded-xl border border-line bg-surface-muted/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-amber-700">
                  <Activity className="size-3.5 text-amber-500" />
                  <span>Processing</span>
                </div>
                <div className="mt-1 text-xl font-bold text-slate-900">{processingCount}</div>
                <div className="text-[11px] text-slate-500">{procPct}% queue</div>
              </div>

              <div className="rounded-xl border border-line bg-surface-muted/50 p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-rose-700">
                  <XCircle className="size-3.5 text-rose-500" />
                  <span>Failed</span>
                </div>
                <div className="mt-1 text-xl font-bold text-slate-900">{failedCount}</div>
                <div className="text-[11px] text-slate-500">{failPct}% error rate</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Format Distribution & AI Operations */}
        <Card className="shadow-xs">
          <CardHeader
            title="File Formats & AI Modules"
            description="Composition of document formats and active AI capability usage."
          />
          <CardBody className="flex flex-col gap-4">
            {/* Formats distribution */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Ingested File Types</p>
              <div className="space-y-2">
                {documents?.byMimeType?.length > 0 ? (
                  documents.byMimeType.map((item) => {
                    const pct = totalDocs > 0 ? Math.round((item.count / totalDocs) * 100) : 0;
                    return (
                      <div key={item.mimeType} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 flex items-center gap-2">
                          <FileText className="size-3.5 text-brand-500" />
                          {getMimeLabel(item.mimeType)}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-10 text-right font-semibold text-slate-900">{item.count}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400">No documents uploaded yet.</p>
                )}
              </div>
            </div>

            {/* AI Capabilities stats */}
            <div className="border-t border-line pt-3 mt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">AI Insights Breakdown</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-surface-muted p-2.5">
                  <span className="text-[11px] text-slate-500 block">Summaries</span>
                  <span className="text-sm font-bold text-slate-900">{ai?.totalSummaries ?? 0}</span>
                </div>
                <div className="rounded-lg bg-surface-muted p-2.5">
                  <span className="text-[11px] text-slate-500 block">Q&A Queries</span>
                  <span className="text-sm font-bold text-slate-900">{ai?.totalQaMessages ?? 0}</span>
                </div>
                <div className="rounded-lg bg-surface-muted p-2.5">
                  <span className="text-[11px] text-slate-500 block">NER Entity Sets</span>
                  <span className="text-sm font-bold text-slate-900">{ai?.totalEntitySets ?? 0}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Infrastructure & Services Diagnostics */}
      <Card className="shadow-xs">
        <CardHeader
          title="Infrastructure Diagnostics & Services Health"
          description="Internal server process parameters, microservice connectivity, and memory consumption."
        />
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Database Health */}
            <div className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">PostgreSQL DB</span>
                <span
                  className={`size-2 rounded-full ${
                    system?.services?.database === 'healthy' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </div>
              <div className="mt-2 text-base font-semibold text-slate-900 capitalize">
                {system?.services?.database || 'healthy'}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Supabase Connection Pool</p>
            </div>

            {/* NLP Sidecar Service */}
            <div className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">FastAPI NLP Sidecar</span>
                <span
                  className={`size-2 rounded-full ${
                    system?.services?.nlpService?.status === 'online'
                      ? 'bg-emerald-500'
                      : system?.services?.nlpService?.status === 'offline'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
              <div className="mt-2 text-base font-semibold text-slate-900 capitalize">
                {system?.services?.nlpService?.status || 'offline'}
              </div>
              <p className="mt-1 truncate text-[11px] text-slate-500">
                {system?.services?.nlpService?.url || 'http://localhost:8000'}
              </p>
            </div>

            {/* Server Runtime & Uptime */}
            <div className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Node.js Runtime</span>
                <Server className="size-3.5 text-slate-400" />
              </div>
              <div className="mt-2 text-base font-semibold text-slate-900">
                {system?.nodeVersion || 'v20.x'}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Uptime: {formatUptime(system?.uptimeSeconds)} &middot; {system?.nodeEnv || 'dev'}
              </p>
            </div>

            {/* Memory Usage */}
            <div className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Memory (RSS / Heap)</span>
                <Cpu className="size-3.5 text-slate-400" />
              </div>
              <div className="mt-2 text-base font-semibold text-slate-900">
                {formatBytes(system?.memory?.rssBytes || 0)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Heap Used: {formatBytes(system?.memory?.heapUsedBytes || 0)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recent Platform Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Global Documents */}
        <Card className="shadow-xs">
          <CardHeader
            title="Recent Document Ingestions"
            description="Latest files uploaded by any user across the platform."
            action={
              <Link
                to={PATHS.adminDocuments}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            }
          />
          <CardBody className="p-0">
            {recentActivity?.recentDocuments?.length > 0 ? (
              <div className="divide-y divide-line">
                {recentActivity.recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3.5 transition-colors hover:bg-surface-muted/40">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <FileText className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={documentPath(doc.id)}
                          className="truncate text-xs font-semibold text-slate-900 hover:text-brand-600 block"
                        >
                          {doc.filename}
                        </Link>
                        <p className="truncate text-[11px] text-slate-500">
                          by {doc.user?.email || 'Unknown'} &middot; {formatBytes(doc.sizeBytes)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge tone={STATUS_TONES[doc.status]} className="text-[10px]">
                        {doc.status}
                      </Badge>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">{formatDate(doc.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">No recent documents found.</div>
            )}
          </CardBody>
        </Card>

        {/* Recent Registered Users */}
        <Card className="shadow-xs">
          <CardHeader
            title="Global User Signups & Activity"
            description="Recently joined users and administrative access logs."
            action={
              <Link
                to={PATHS.adminUsers}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View directory <ArrowRight className="size-3" />
              </Link>
            }
          />
          <CardBody className="p-0">
            {recentActivity?.recentUsers?.length > 0 ? (
              <div className="divide-y divide-line">
                {recentActivity.recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3.5 transition-colors hover:bg-surface-muted/40">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {(u.fullName || u.email || 'U').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-900">{u.fullName || 'User'}</p>
                        <p className="truncate text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge tone={u.role === 'ADMIN' ? 'brand' : 'neutral'} className="text-[10px]">
                        {u.role}
                      </Badge>
                      <Badge tone={u.isActive ? 'success' : 'danger'} className="text-[10px]">
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">No users found.</div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
