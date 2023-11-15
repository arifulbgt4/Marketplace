import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { AnyObject } from "../types";

type CALLBACK_VALUE = { name: string; value: string | number };

const useQueryString = () => {
  const searchParams = useSearchParams();

  const getQuery = (keys: string[]) => {
    let query: AnyObject = {};
    keys.map((k) => {
      const v = searchParams.get(k);
      if (!!v) {
        query[k] = v;
      }
    });
    return query;
  };

  const createQuery = useCallback(
    (query: CALLBACK_VALUE[]) => {
      const params = new URLSearchParams(searchParams);
      query.map((s) => {
        params.delete(s.name);
        if (s.value !== undefined) {
          params.set(s.name, s.value.toString().trim());
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  return { createQuery, getQuery };
};

export default useQueryString;
