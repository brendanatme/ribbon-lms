import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { Button, Card } from './ui';

/**
 * Route-level fallback rendered via a route's `errorElement`. Catches render
 * errors thrown below it (e.g. a bad API shape) and offers a way to recover
 * instead of dropping the user on React Router's default developer screen.
 */
export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'An unexpected error occurred.';

  return (
    <Card>
      <h2 className="mb-2 font-display text-xl font-semibold text-ink">Something went wrong</h2>
      <p className="mb-4 text-sm text-ink/60">{message}</p>
      <div className="flex gap-2">
        <Button onClick={() => navigate(0)}>Reload</Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    </Card>
  );
}
