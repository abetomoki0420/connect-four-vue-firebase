const apiKey = import.meta.env.VITE_API_KEY ?? ""
const projectId = import.meta.env.VITE_PROJECT_ID ?? ""
const appId = import.meta.env.VITE_APP_ID ?? ""

export const getEnv = () => {
  return {
    apiKey,
    projectId,
    appId
  }
}