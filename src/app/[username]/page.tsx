import { type FC } from "react";
import { Octokit } from "@octokit/rest";
import { env } from "@/env";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import UserPart from "@/app/[username]/UserPart";
import Repo from "@/app/[username]/Repo";

export const revalidate = 3600;

type Props = {
  params: { username: string };
};

const ErrorComp: FC<{ error: unknown }> = ({ error }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <span className="max-w-96 break-words border-2 border-red-500 p-5 font-mono text-xl text-red-500">
        {String(error)}
      </span>
    </div>
  );
};

const Page: FC<Props> = async ({ params: { username } }) => {
  const octokit = new Octokit({
    request: {
      fetch: (url: string, init: RequestInit | undefined) =>
        fetch(url, { ...init, next: { revalidate: 3600 } }),
    },
    authStrategy: createOAuthAppAuth,
    auth: {
      clientId: env.NEXT_PUBLIC_GH_CLIENT_ID,
      clientSecret: env.GH_CLIENT_SECRET,
    },
  });

  const userResult = await octokit
    .request("GET /users/{username}", {
      username: username,
    })
    .catch((a) => ({ error: a as unknown }));

  const reposResult = await octokit
    .request("GET /users/{username}/repos", {
      username: username,
      sort: "updated",
      per_page: 100,
    })
    .catch((a) => ({ error: a as unknown }));

  if ("error" in userResult) {
    return <ErrorComp error={userResult.error} />;
  }
  if ("error" in reposResult) {
    return <ErrorComp error={reposResult.error} />;
  }
  console.warn("requests done");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-12">
      <div className="grid w-[95dvw] max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full flex gap-6 rounded-2xl bg-neutral-800 p-5">
          <UserPart data={userResult.data} />
        </div>
        {reposResult.data.map((el) => (
          <Repo data={el} username={username} key={el.full_name} />
        ))}
      </div>
    </div>
  );
};

export default Page;
