import { IPaginationQuery } from 'src/interfaces';

export const queriesFilter = (
  queries: IPaginationQuery,
): Record<string, IPaginationQuery> => {
  return Object.entries(queries)
    .filter(([key, value]) => value != '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};
