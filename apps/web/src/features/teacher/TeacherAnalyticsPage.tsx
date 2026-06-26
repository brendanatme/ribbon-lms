import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CourseAnalytics } from '@ribbon/shared';
import { api } from '@/lib/api.js';
import { Card, PageHeading } from '@/components/ui.js';

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ribbon">{value}</p>
    </Card>
  );
}

export function TeacherAnalyticsPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', id],
    queryFn: () => api.get<CourseAnalytics>(`/analytics/courses/${id}`),
  });

  if (isLoading || !data) return <p className="text-ink/40">Loading analytics…</p>;

  return (
    <div>
      <PageHeading title={data.title} subtitle="Course analytics" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Kpi label="Enrollments" value={String(data.enrollmentCount)} />
        <Kpi label="Completion rate" value={`${data.completionRate}%`} />
        <Kpi label="Avg progress" value={`${data.averageProgress}%`} />
      </div>

      <Card>
        <h3 className="mb-4 font-display text-lg font-semibold">Completions by lesson</h3>
        {data.lessonCompletion.length === 0 ? (
          <p className="text-sm text-ink/40">No lessons in this course yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.lessonCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completedCount" fill="#3a5a9b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
