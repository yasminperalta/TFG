const API_URL = import.meta.env.VITE_API_URL;

export const getFriendStatus = async (token, friend_id) => {
    try {
        const response = await fetch(`${API_URL}/friends/?friend=${friend_id}&mine=true`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.status === 400) return null;
        if (!response.ok) throw new Error("Error al obtener estado de amistad");

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

    // Actualizar el registro existente a "friend"
    const patchRes = await fetch(`${API_URL}/friends/${req.id}/`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "friend" })
    });
    if (!patchRes.ok) throw new Error("Error al actualizar estado de amistad");

    // Crear el registro inverso (bidireccional)
    const postRes = await fetch(`${API_URL}/friends/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            friend: req.user,
            status: "friend"
        })
    });
    if (!postRes.ok) throw new Error("Error al crear relación inversa de amistad");
};

export const removeRequest = async (req) => {
    if (!req || !req.id) {
        throw new Error("La petición de amistad no existe");
    }

    const response = await fetch(`${API_URL}/friends/${req.id}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) throw new Error("Error al eliminar relación de amistad");
};

/**
 * Elimina la amistad bilateral: borra el registro propio y el inverso.
 * myReq = el registro donde user=yo, friend=ellos (devuelto por getFriendStatus).
 */
export const removeFriendship = async (token, myReq) => {
    // 1. Borrar mi registro
    await removeRequest(myReq);

    // 2. Buscar y borrar el registro inverso (user=ellos, friend=yo)
    try {
        const response = await fetch(
            `${API_URL}/friends/?user=${myReq.friend}&friend=${myReq.user}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        );
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                await removeRequest(data[0]);
            }
        }
    } catch {
        // El registro inverso podría no existir, no es crítico
    }
};

/**
 * Sigue directamente a un usuario de perfil público (sin solicitud pendiente).
 */
export const directFollow = async (token, user_id) => {
    if (!user_id) throw new Error("El usuario no existe");

    const response = await fetch(`${API_URL}/friends/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend: user_id, status: "friend" }),
    });

    if (!response.ok) throw new Error("Error al seguir usuario");
    return response.json();
};

export const sendRequest = async (token, user_id) => {
    if (!user_id) throw new Error("El usuario no existe");

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
};
