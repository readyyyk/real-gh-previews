import { type NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/app/api/gh-callback/github";
import { cookies } from "next/headers";
import { Octokit } from "@octokit/rest";
import { GH_COOKIE_ATTRS, GH_COOKIE_NAME } from "@/config";

export async function GET(req: NextRequest) {
  const ghCode = req.nextUrl.searchParams.get("code");
  if (ghCode === null) {
    return new NextResponse(null, { status: 500 });
  }

  const userData = await getAccessToken(ghCode);
  if (!userData.success) {
    return new NextResponse(userData.errorData.error_description, {
      status: 500,
    });
  }

  cookies().set(GH_COOKIE_NAME, userData.data.access_token, GH_COOKIE_ATTRS);

  const octokit = new Octokit({
    auth: userData.data.access_token,
  });
  const userGHData = await octokit.request("GET /user");

  console.log(userGHData.data.id);

  return NextResponse.redirect(new URL("/", req.url));
}
