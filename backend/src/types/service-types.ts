// Service method data types
// Using Record<string, unknown> for flexible data objects that come from API requests
// This is more type-safe than 'any' while still allowing dynamic properties

export type CreateData = Record<string, unknown>;
export type UpdateData = Record<string, unknown>;
export type FilterData = Record<string, unknown>;
export type QueryData = Record<string, unknown>;
