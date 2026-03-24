// SearchContext.jsx
import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

// Proveedor
export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

// Hook personalizado
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch debe usarse dentro de SearchProvider");
  }
  return context;
}
