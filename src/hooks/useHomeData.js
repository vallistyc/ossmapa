import { useEffect, useState } from "react";
import { fetchHomeData } from "../lib/homeDataApi";

export const useHomeData = () => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    fetchHomeData().then((result) => {
      if (active) {
        setState({ data: result.data, loading: false, error: result.error });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return state;
};
