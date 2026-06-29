import { createContext, useContext, useState } from "react";

const CollectionsContext = createContext();

export function CollectionsProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Contador que se incrementa cada vez que se guarda una película en una colección.
  // Collections.jsx lo usa como dependencia de useEffect para saber cuándo recargar.
  const [savedVersion, setSavedVersion] = useState(0);
  // Contador para cambios en wishlist (añadir o eliminar).
  // Wishlist.jsx y SearchView.jsx lo usan para recargar automáticamente.
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const openSaveModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const closeSaveModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const notifyCollectionSaved = () => setSavedVersion(v => v + 1);
  const notifyWishlistChanged = () => setWishlistVersion(v => v + 1);

  return (
    <CollectionsContext.Provider
      value={{
        showModal,
        selectedMovie,
        openSaveModal,
        closeSaveModal,
        savedVersion,
        notifyCollectionSaved,
        wishlistVersion,
        notifyWishlistChanged,
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