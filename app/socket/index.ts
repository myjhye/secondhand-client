import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import client, { baseURL } from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { Profile, updateAuthState } from "app/store/auth";
import { TokenResponse } from "hooks/useClient";
import { io } from "socket.io-client";

const socket = io(baseURL, {
  path: "/socket-message",
  transports: ["websocket"], // WebSocket만 사용
  autoConnect: false,
});

export const handleSocketConnection = (profile: Profile, dispatch: Dispatch<UnknownAction>) => {

    socket.auth = {
        token: profile?.accessToken,
    };

    socket.connect();

    // 5초 뒤 수동 재연결 (만료 시뮬레이션)
    setTimeout(() => {
      console.log("⏰ [CLIENT] reconnecting manually for test");
      socket.disconnect();
      socket.connect();
    }, 5000);

    socket.on("connect_error", async (error) => {
    if (error.message === "jwt expired") {
      console.log("[CLIENT] 🔄 trying refresh token...");
      const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);

      const res = await runAxiosAsync<TokenResponse>(
        client.post(`${baseURL}/auth/refresh-token`, { refreshToken })
      );

      if (res) {
        await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
        await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
        dispatch(updateAuthState({
          profile: { 
            ...profile, 
            accessToken: res.tokens.access 
          },
          pending: false,
        }));

        socket.auth = { token: res.tokens.access };
        socket.connect(); // 재연결
      }
    }
  });
};

export default socket;
