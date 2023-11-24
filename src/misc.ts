export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const instanseOfAny = (v: any, arr: Array<any>) => {
  return arr.some((arrv) => v instanceof arrv);
};
