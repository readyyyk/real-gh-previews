import z from "zod";

// github
export const GHAuthRespSchema = z.object({
  access_token: z.string(),
  // expires_in: z.string(),
  // refresh_token: z.string(),
  // refresh_token_expires_in: z.string(),
  scope: z.string(),
  token_type: z.string(),
});

export const GHAuthRespErrorSchema = z.object({
  error: z.string(),
  error_description: z.string(),
  error_uri: z.string().url(),
});

// api
export const UserLoggedSchema = z.object({
  id: z.number(),
});

export type GHAuthResp = z.infer<typeof GHAuthRespSchema>;
export type GHAuthRespError = z.infer<typeof GHAuthRespErrorSchema>;
