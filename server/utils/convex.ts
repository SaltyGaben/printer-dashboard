import { ConvexHttpClient } from 'convex/browser'

export const convex = new ConvexHttpClient(process.env.NUXT_PUBLIC_CONVEX_URL!)
