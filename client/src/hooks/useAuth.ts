import { useContext } from "react";

import AuthContext from "../context/AuthContext";
import type { AuthContextValue } from "../context/AuthContext";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth trebuie folosit în interiorul AuthProvider");
  }
  return context;
};
