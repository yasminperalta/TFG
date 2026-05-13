const API_URL = import.meta.env.VITE_API_URL; // Tu backend local

export const getFriendStatus = async (token, friend_id) => {
    try {
        const response = await fetch(`${API_URL}/friends/?friend=${friend_id}&mine=true`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status == 400) {
            return null;
        }
        else if (!response.ok) throw new Error("Error al obtener estado de amistad");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de amigos:", error);
        throw error;
    }
};

export const getIncomingFriendStatus = async (token) => {
    try {
        const response = await fetch(`${API_URL}/friends/incoming/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Error al obtener estado de amistad");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de amigos:", error);
        throw error;
    }
};

export const acceptRequest = async (token, req) => {
    if (!req || !req.user || !req.friend) {
        throw new Error("La petición de amistad no existe");
    }

    try {
        const response = await fetch(`${API_URL}/friends/${req.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: "friend"
            })
        });

        if (!response.ok) throw new Error("Error al actualizar estado de amistad");

        const data = await response.json();

    } catch (error) {
        console.error("Error en el servicio de amigos:", error);
        throw error;
    }

    try {
        const response = await fetch(`${API_URL}/friends/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: req.friend,
                friend: req.user,
                status: "friend"
            })
        });

        if (!response.ok) throw new Error("Error al agregar como amigo");

        const data = await response.json();

    } catch (error) {
        console.error("Error en el servicio de amigos:", error);
        throw error;
    }
};

export const removeRequest = async (req) => {
    if (!req || !req.user || !req.friend) {
        throw new Error("La petición de amistad no existe");
    }

    try {
        const response = await fetch(`${API_URL}/friends/${req.id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Error al eliminar amigo");

    } catch (error) {
        console.error("Error en el servicio de amigos:", error);
        throw error;
    }
};

export const sendRequest = async (token, user_id) => {
    try {
        if (!user_id) {
            throw new Error("El usuario no existe");
        }

        const response = await fetch(`${API_URL}/friends/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                friend: user_id,
                status: "requested"
            }),
        });

        if (!response.ok) throw new Error("Error al enviar petición de amistad");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en el servicio de amigos:", error);
        throw error;
    }
};