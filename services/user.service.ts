import api from "@/lib/axios";

export const getCurrentUser = () =>
    api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/users/me`);