import { initializeApp } from "firebase/app";
import { getEnv } from "../common/lib/env";

const { apiKey, appId, projectId } = getEnv();

console.log({ apiKey, appId, projectId });

export const app = initializeApp({
  apiKey,
  appId,
  projectId,
});
