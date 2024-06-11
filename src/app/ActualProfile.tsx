'use client';

import { type FC, useState } from 'react';
import type { Endpoints } from '@octokit/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const ActualProfile: FC<{
    data: Endpoints['GET /user']['response']['data'];
}> = ({ data }) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen((a) => !a);

    return (
        <div
            onClick={toggle}
            className={cn(
                'fixed bottom-3 flex items-center bg-neutral-800 p-2 shadow transition-all',
                open
                    ? 'right-auto mx-3 h-auto w-[calc(100%_-_12px_*_2)] justify-between rounded-xl'
                    : 'right-3 mx-0 h-14 w-14 justify-center rounded-full',
            )}
        >
            <Link
                href="/me/"
                className={cn(
                    open
                        ? 'h-auto w-auto text-xl underline opacity-100'
                        : 'h-0 w-0 opacity-0',
                )}
            >
                My page
            </Link>
            <div className={cn('flex items-center', open ? 'gap-3' : '')}>
                <Link
                    href={data.html_url}
                    className={cn(
                        open
                            ? 'h-auto w-auto underline opacity-100'
                            : 'hidden h-0 w-0 opacity-0',
                    )}
                >
                    @{data.login}
                </Link>
                <Image
                    src={data.avatar_url}
                    alt={data.login}
                    className="rounded-full"
                    width={56 - 12}
                    height={56 - 12}
                />
            </div>
        </div>
    );
};

export default ActualProfile;
