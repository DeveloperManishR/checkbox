import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import {
  CheckBoxSize,
  CheckBoxState,
  CheckBoxStateKey,
} from "../../modules/checkbox/checkbox.service.js";
import { publisher, subscriber, redis } from "../utils/redis-connection.js";
const userSocketMap: Record<string, string> = {};
const rateLimitingHashMap = new Map();

export async function initSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  await subscriber.subscribe("internal-server:checkbox:change");
  subscriber.on("message", (channel, message) => {
    if (channel == "internal-server:checkbox:change") {
      const { checked, index } = JSON.parse(message);
      // CheckBoxState.checkboxes[index] = checked;
      io.emit("server:checkbox:change", { index, checked });
    }
  });

  io.on("connection", (socket) => {
    socket.on("client:checkbox:change", async (data) => {
      console.log(`[Socket:${socket.id}]:client:checkbox:change`, data);

      const lastOperationTime = await redis.get(`rate-limiting:${socket.id}`);

      if (lastOperationTime) {
        const lastTime = Number(lastOperationTime); // or parseInt

        console.log("lastTime", lastTime);

        const timeElapsed = Date.now() - lastTime;

        if (timeElapsed < 5.5 * 1000) {
          socket.emit("server:error", { error: `Please Wait` });
          return;
        }
      }
      await redis.set(`rate-limiting:${socket.id}`, Date.now());
      const existingState = await redis.get(CheckBoxStateKey);

      const index = data.index;

      if (existingState) {
        const remoteData = JSON.parse(existingState);
        remoteData.checkboxes[index] = data.checked;
        await redis.set(CheckBoxStateKey, JSON.stringify(remoteData));
      } else {
        await redis.set(CheckBoxStateKey, JSON.stringify(CheckBoxState));
      }

      //
      await publisher.publish(
        "internal-server:checkbox:change",
        JSON.stringify(data),
      );
    });
  });

  return io;
}
