import { useRouter } from "next/router";

export const useReplaceQueryParams = () => {
  const router = useRouter();

  const replaceQueryParams = (key: string, val: any) => {
    router.query[key] = val;
    router.push({
      pathname: router.pathname,
      query: { [key]: val },
    });
  };

  return { replaceQueryParams };
};
