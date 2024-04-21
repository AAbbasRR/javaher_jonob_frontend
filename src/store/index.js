import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
	persist(
		(set, get) => ({
			accessToken: null,
			refreshToken: null,
			userInfo: null,
			login: ({ token, ...rest }) => {
				set({
					accessToken: token.access,
					refreshToken: token.refresh,
					userInfo: rest,
				});
			},
			logout: () => {
				set({ accessToken: null, refreshToken: null, userInfo: null });
			},
			updateUserInfo: (userInfo) => {
				set({
					userInfo: userInfo,
				});
			},
		}),
		{
			name: "user",
		},
	),
);

export default useAuthStore;
