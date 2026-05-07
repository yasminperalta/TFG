import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Páginas
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Collection from "../pages/Collection";
import Wishlist from "../pages/Wishlist";
import Search from "../pages/Search";
import SharedCollection from "../pages/SharedCollection";

export const AppRouter = ({ friends, requests }) => {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/shared/:id" element={<SharedCollection />} />

            {/* Rutas Protegidas */}
            <Route
                path="/collection"
                element={
                    <ProtectedRoute>
                        <Collection />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/wishlist"
                element={
                    <ProtectedRoute>
                        <Wishlist />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile/:id?"
                element={
                    <ProtectedRoute>
                        <Profile friends={friends} requests={requests} />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};