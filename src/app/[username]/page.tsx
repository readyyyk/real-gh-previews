import { type FC } from "react";
import { Octokit } from "@octokit/rest";
import { env } from "@/env";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import UserPart from "@/app/[username]/UserPart";
import Repo from "@/app/[username]/Repo";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { GH_COOKIE_NAME } from "@/config";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.username + " github showcase",
  };
}

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
  const userToken = cookies().get(GH_COOKIE_NAME)?.value;

  const octokit = userToken
    ? new Octokit({
        auth: userToken,
      })
    : new Octokit({
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
        <div className="col-span-full mb-8 flex flex-col items-center gap-6 rounded-2xl bg-neutral-800 p-5 md:flex-row">
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
