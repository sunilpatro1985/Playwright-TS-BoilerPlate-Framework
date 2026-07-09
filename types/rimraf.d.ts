// rimraf v4+ includes its own type definitions
// This file is kept for compatibility but exports are now named
declare module 'rimraf' {
  export function rimraf(path: string, options?: object): Promise<boolean>;
  export function rimrafSync(path: string, options?: object): boolean;
}
