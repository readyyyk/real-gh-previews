import { type FC } from 'react';
import { cookies } from 'next/headers';
import { GH_COOKIE_NAME } from '@/config';
import ErrorComp from '@/components/Error';
import { Octokit } from '@octokit/rest';
import UserPart from '@/components/UserPart';
import Repo from '@/components/Repo';
import { api } from '@/trpc/server';

const Page: FC = async () => {
    // TODO rewrite with Promise.all
    const access_token = cookies().get(GH_COOKIE_NAME)?.value;

    if (!access_token) {
        return <ErrorComp error="Unauthorized" />;
    }

    const octokit = new Octokit({
        auth: access_token,
    });

    const userResult = await octokit
        .request('GET /user')
        .catch((e) => ({ error: e as unknown }));

    if ('error' in userResult) {
        return <ErrorComp error={userResult.error} />;
    }

    const reposResult = await octokit
        .request('GET /users/{username}/repos', {
            username: userResult.data.login,
            sort: 'updated',
            per_page: 100,
        })
        .catch((e) => ({ error: e as unknown }));

    if ('error' in reposResult) {
        return <ErrorComp error={reposResult.error} />;
    }

    const resourses = await api.repos.get_sources({
        user_id: userResult.data.id,
    });

    const username = userResult.data.login;

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center pb-12">
            <div className="grid w-[95dvw] max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-full flex items-center justify-center p-5 pt-9">
                    <span className="border-2 border-blue-500 p-5 font-mono text-3xl font-semibold text-blue-500">
                        Admin page
                    </span>
                </div>
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
                        admin
                    />
                ))}
            </div>
        </div>
    );
};

export default Page;
