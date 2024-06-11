import { type FC } from 'react';
import { env } from '@/env';
import Link from 'next/link';
import { UserIcon } from 'lucide-react';
import ActualProfile from '@/app/ActualProfile';
import { Octokit } from '@octokit/rest';
import { cookies } from 'next/headers';
import { GH_COOKIE_NAME } from '@/config';

const Profile: FC = async () => {
    const token = cookies().get(GH_COOKIE_NAME)?.value;

    if (!token) {
        return (
            <Link
                href={
                    'https://github.com/login/oauth/authorize?client_id=' +
                    env.NEXT_PUBLIC_GH_CLIENT_ID
                }
            >
                <div className="fixed bottom-3 right-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 p-2 shadow">
                    <UserIcon
                        className="rounded-full border-4 border-neutral-700 bg-neutral-700"
                        width={56 - 12 - 4}
                        height={56 - 12 - 4}
                    />
                </div>
            </Link>
        );
    }

    const result = await new Octokit({ auth: token })
        .request('GET /user')
        .catch((e) => ({ error: e as unknown }));

    if ('error' in result) {
        return <div> {String(result.error)} </div>;
    }

    return <ActualProfile data={result.data} />;
};

export default Profile;
