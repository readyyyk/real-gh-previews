import { env } from '@/env';
import {
    type GHAuthResp,
    type GHAuthRespError,
    GHAuthRespErrorSchema,
    GHAuthRespSchema,
} from '@/schemas';

type Result =
    | { success: true; data: GHAuthResp }
    | { success: false; errorData: GHAuthRespError };

export async function getAccessToken(code: string): Promise<Result> {
    const url = new URL('https://github.com/login/oauth/access_token');
    url.search = new URLSearchParams({
        client_id: env.NEXT_PUBLIC_GH_CLIENT_ID,
        client_secret: env.GH_CLIENT_SECRET,
        code: code,
        // grant_type: "refresh_token",
    }).toString();

    const result = (await fetch(url.href, {
        method: 'POST',
        headers: { Accept: 'application/json' },
    }).then((a) => a.json())) as unknown;

    const errorParsed = GHAuthRespErrorSchema.safeParse(result);
    if (errorParsed.success) {
        return { success: false, errorData: errorParsed.data };
    }

    return { success: true, data: GHAuthRespSchema.parse(result) };
}
