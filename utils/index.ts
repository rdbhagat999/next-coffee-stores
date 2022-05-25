export const isEmpty = (obj: object) => {
  console.log("isEmpty: ", obj);
  return obj && Object.keys(obj).length === 0;
};

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
