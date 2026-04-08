import { createContext, useContext, useState } from "react";

const CollectionsContext = createContext();

export function CollectionsProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const openSaveModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeSaveModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  return (
    <CollectionsContext.Provider
      value={{
        showModal,
        selectedMovie,
        openSaveModal,
        closeSaveModal,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionsProvider");
  }
  return context;
};