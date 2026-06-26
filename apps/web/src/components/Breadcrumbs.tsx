import { Fragment, type ReactNode } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { CourseDetail } from '@ribbon/shared';
import { api } from '@/lib/api';

interface Crumb {
  label: ReactNode;
  to?: string;
}

/**
 * Resolves a course's title for the breadcrumb trail. Reuses the exact query
 * key + endpoint the page itself uses, so this is a cache hit (no extra fetch)
 * and stays reactive — the title fills in once the page's data loads.
 */
function CourseTitleCrumb({ endpoint, queryKey }: { endpoint: string; queryKey: unknown[] }) {
  const { data } = useQuery({
    queryKey,
    queryFn: () => api.get<CourseDetail>(endpoint),
  });
  return <>{data?.title ?? 'Course'}</>;
}

type CrumbResolver = (id: string) => Crumb[];

/**
 * Breadcrumb trail per dashboard route. Patterns are matched exactly (`end:
 * true`), so order is irrelevant and the most specific route always wins.
 */
const ROUTES: { path: string; crumbs: CrumbResolver }[] = [
  // Admin
  { path: '/admin', crumbs: () => [{ label: 'Users' }] },

  // Teacher
  { path: '/teacher', crumbs: () => [{ label: 'My Courses' }] },
  {
    path: '/teacher/courses/:id',
    crumbs: (id) => [
      { label: 'My Courses', to: '/teacher' },
      {
        label: <CourseTitleCrumb endpoint={`/courses/${id}`} queryKey={['course-edit', id]} />,
      },
    ],
  },
  {
    path: '/teacher/courses/:id/analytics',
    crumbs: (id) => [
      { label: 'My Courses', to: '/teacher' },
      {
        label: <CourseTitleCrumb endpoint={`/courses/${id}`} queryKey={['course-edit', id]} />,
        to: `/teacher/courses/${id}`,
      },
      { label: 'Analytics' },
    ],
  },

  // Student
  { path: '/student', crumbs: () => [{ label: 'Catalog' }] },
  { path: '/student/learning', crumbs: () => [{ label: 'My Learning' }] },
  {
    path: '/student/courses/:id',
    crumbs: (id) => [
      { label: 'Catalog', to: '/student' },
      {
        label: <CourseTitleCrumb endpoint={`/catalog/${id}`} queryKey={['catalog-detail', id]} />,
      },
    ],
  },
];

export function Breadcrumbs() {
  const { pathname } = useLocation();

  const matched = ROUTES.map((route) => ({
    route,
    match: matchPath({ path: route.path, end: true }, pathname),
  })).find((entry) => entry.match);

  if (!matched?.match) return null;

  const id = matched.match.params.id ?? '';
  const crumbs = matched.route.crumbs(id);
  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={index}>
              {index > 0 && (
                <span aria-hidden className="text-ink/30">
                  /
                </span>
              )}
              <li>
                {crumb.to && !isLast ? (
                  <Link to={crumb.to} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? 'font-medium text-ink' : undefined}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
