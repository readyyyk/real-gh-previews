import { type FC } from 'react';
import { Octokit } from '@octokit/rest';
import { env } from '@/env';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import UserPart from '@/components/UserPart';
import Repo from '@/components/Repo';
import { type Metadata } from 'next';
import { cookies } from 'next/headers';
import { GH_COOKIE_NAME } from '@/config';
import ErrorComp from '@/components/Error';
import { api } from '@/trpc/server';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: params.username + ' github showcase',
    };
}

type Props = {
    params: { username: string };
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
        .request('GET /users/{username}', {
            username: username,
        })
        .catch((a) => ({ error: a as unknown }));

    const reposResult = await octokit
        .request('GET /users/{username}/repos', {
            username: username,
            sort: 'updated',
            per_page: 100,
        })
        .catch((a) => ({ error: a as unknown }));

    if ('error' in userResult) {
        return <ErrorComp error={userResult.error} />;
    }
    if ('error' in reposResult) {
        return <ErrorComp error={reposResult.error} />;
    }

    const resourses = await api.repos.get_sources();

    console.warn('requests done');

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center py-12">
            <div className="grid w-[95dvw] max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-full mb-8 flex flex-col items-center gap-6 rounded-2xl bg-neutral-800 p-5 md:flex-row">
                    <UserPart data={userResult.data} />
                </div>
                {reposResult.data.map((el) => (
                    <Repo
                        data={{
                            ...el,
                            image_source:
                                resourses[el.id]?.image_source ?? 'default',
                            custom_link: resourses[el.id]?.custom_link ?? null,
                        }}
                        username={username}
                        key={el.full_name}
                    />
                ))}
            </div>
        </div>
    );
};

export default Page;
