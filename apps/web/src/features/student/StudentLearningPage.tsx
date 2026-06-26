import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { enrollmentsQuery } from '@/lib/queries';
import { Button, Card, EmptyState, Loading, PageHeading, ProgressBar } from '@/components/ui';

export function StudentLearningPage() {
  const { data: enrollments, isLoading } = useQuery(enrollmentsQuery());

  return (
    <div>
      <PageHeading title="My learning" subtitle="Pick up where you left off" />

      {isLoading && <Loading />}

      <div className="space-y-4">
        {enrollments?.map((e) => (
          <Card key={e.enrollmentId}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold">{e.course.title}</h3>
                <p className="mt-1 text-xs text-ink/50">
                  {e.completedCount} of {e.totalLessons} lessons complete
                </p>
                <div className="mt-2 max-w-md">
                  <ProgressBar percent={e.percentComplete} />
                </div>
              </div>
              <Link to={`/student/courses/${e.course.id}`}>
                <Button variant="ghost">{e.percentComplete === 100 ? 'Review' : 'Continue'}</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {enrollments && enrollments.length === 0 && (
        <EmptyState>
          You haven&apos;t enrolled in any courses yet.{' '}
          <Link to="/student" className="font-medium text-ribbon hover:underline">
            Browse the catalog
          </Link>
          .
        </EmptyState>
      )}
    </div>
  );
}
