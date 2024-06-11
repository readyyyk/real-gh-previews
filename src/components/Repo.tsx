'use client';

import { type FC, type ReactNode, useState } from 'react';
import type { Endpoints } from '@octokit/types';
import { ChevronDownIcon } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import DetailedRepoInfo from '@/components/DetailedRepoInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { type ImageSourceVariants } from '@/server/db/schema';
import Image from 'next/image';
import DialogContentAdmin from '@/app/me/DialogContentAdmin';

export type SingleRepoType =
    Endpoints['GET /users/{username}/repos']['response']['data'][0];

type Props = {
    data: SingleRepoType & {
        image_source: ImageSourceVariants;
        custom_link: string | null;
    };
    username: string;
    admin?: boolean;
};

/*
== repo ==
name
description
fork
html_url
-- homepage
!stargazers_count
language
-- has_pages
forks_count
archived
 */

const Repo: FC<Props> = ({ data, username, admin }) => {
    const iframeLink = data.has_pages
        ? `https://${username}.github.io/` + data.name
        : !!data.homepage
          ? data.homepage
          : null;

    const [modalOpen, setModalOpen] = useState(false);

    let preview: ReactNode | null;

    if (data.image_source === 'default') {
        preview = iframeLink ? (
            <iframe
                style={{
                    scale: 0.2,
                    transformOrigin: '0 0',
                    width: 320 * 5,
                    height: 176 * 5,
                }}
                src={iframeLink}
                className="absolute left-0 top-0 bg-white"
            />
        ) : (
            data.name
        );
    }
    if (data.image_source === 'custom_link') {
        preview = data.custom_link ? (
            <Image
                width={320}
                height={176}
                src={data.custom_link}
                alt={data.full_name}
            />
        ) : (
            data.name
        );
    }

    return (
        <div className="flex flex-col items-center">
            {/*  176 x 320 */}
            <div className="relative flex h-44 w-80 items-center justify-center overflow-clip rounded-xl border-2 border-neutral-600 font-mono font-bold">
                {preview}
            </div>
            <div className="flex w-full justify-center">
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger>
                        <ChevronDownIcon className="h-8 opacity-50 hover:opacity-100" />
                    </DialogTrigger>
                    {admin ? (
                        <DialogContentAdmin
                            data={data}
                            close={() => setModalOpen(false)}
                            iframeLink={iframeLink}
                        />
                    ) : (
                        <DetailedRepoInfo data={data} iframeLink={iframeLink} />
                    )}
                </Dialog>
            </div>
        </div>
    );
};

export const RepoLoading: FC = () => {
    return (
        <div className="flex flex-col items-center">
            {/*  176 x 320 */}
            <Skeleton className="relative flex h-44 w-80 items-center justify-center overflow-clip rounded-xl border-2 border-neutral-600 font-mono font-bold"></Skeleton>
            <div className="flex w-full justify-center">
                <ChevronDownIcon className="h-8 opacity-50 hover:opacity-100" />
            </div>
        </div>
    );
};

export default Repo;
