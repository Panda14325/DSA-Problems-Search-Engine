import { createContext } from "react";

const appContext = createContext({
  loading: false,
  results: [],
  error: false,
  handleSubmit: () => {},
  hasSearched: false,
});

export default appContext;
