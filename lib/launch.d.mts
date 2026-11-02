export type LaunchState = {
  launchRequested: boolean;
  productionDeployment: boolean;
  siteUrl: string | null;
  isIndexable: boolean;
};

export function resolveLaunch(env?: Record<string, string | undefined>): LaunchState;
export const launch: LaunchState;
export const isIndexable: boolean;
export const siteUrl: string | null;
export const NOINDEX_HEADER_VALUE: string;
export const PROVISIONAL_PATHS: string[];
