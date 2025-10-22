# Notes regarding frontend

## Services and data fetching:

- Currently, I am using per day query keys for sessions: queryKey: `["sessions", user?.sub, localDate]` and storing sessions as nested data containing its pe's, exercises, and sets
- This means I need to invalidate every query starting with the prefix `["sessions", user?.sub]` on ANY mutation (exercise, set, session, pe), because that mutation might modify any of the sessions and we don't know which because it's deeply nested
- Later I would like to invalidate only the session that uses the exercise, pe, or set (`["sessions", user?.sub, localDate]`), but this requires me to find the correct localDate for the parent data and gets more complicated, so I will start with invalidating all sessions' data (even if I have say 21 sessions cached because I loaded 3 weeks, and I will have to refetch all 21 eventually instead of just 1)
- I am even using `["sessions", user?.sub]` as the query key for my exercises, which makes no sense semantically but allows me to invalidate EVERYTHING by just invalidating the query key `["sessions", user?.sub]`

- Also note that some errors from the backend (404, 409, 422), have meaning and should not trigger refetches. For this I include `retry: (failureCount, error) =>
  ![404].includes(error.response?.status ?? 0)` in my useQuery, and then I can use the error and isError states from the useQuery and useMutation hooks to handle these cases in the UI
