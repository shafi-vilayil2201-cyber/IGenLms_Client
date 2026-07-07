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

async function parseCommonResponse<T>(response: Response): Promise<CommonResponse<T>> {
    const rawBody = await response.text();

    if (!rawBody) {
        return {
            success: response.ok,
            message: response.statusText,
            data: null,
            errors: response.ok ? [] : [response.statusText],
        };
    }

    try {
        return JSON.parse(rawBody) as CommonResponse<T>;
    } catch {
        return {
            success: false,
            message: rawBody,
            data: null,
            errors: [rawBody],
        };
    }
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

    const result = await parseCommonResponse<T>(response);

    if (!response.ok || !result.success || !result.data) {
        const message = result.errors[0] ?? result.message ?? "Request failed.";
        throw new Error(message);
    }

    return result.data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            },
            body: JSON.stringify(body),
        });
    } catch {
        throw new Error("Unable to reach the server. Check that the API is running and CORS is configured.");
    }

    const result = await parseCommonResponse<T>(response);

    if (!response.ok || !result.success || !result.data) {
        const message = result.errors[0] ?? result.message ?? "Request failed.";
        throw new Error(message);
    }

    return result.data;
}
