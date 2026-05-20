import { API_BASE_URL } from "./apiConfig";
import { useAuthStore } from "../auth/authStore";
import type { CommonResponse } from "../auth/auth.types";

function getAuthHeaders(): HeadersInit {
    const accessToken = useAuthStore.getState().currentUser?.accessToken;

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

export async function apiGet<T>(path: string): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: "GET",
            credentials: "include",
            headers: {
                ...getAuthHeaders(),
            },
        });
    } catch {
        throw new Error("Unable to reach the server. Check that the API is running and CORS is configured.");
    }

    const result = (await response.json()) as CommonResponse<T>;

    if (!response.ok || !result.success || !result.data) {
        const message = result.errors[0] ?? result.message ?? "Request failed.";
        throw new Error(message);
    }

    return result.data;
}