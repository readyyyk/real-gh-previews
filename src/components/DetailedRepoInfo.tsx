import { type FC, type ReactNode } from 'react';
import type { Endpoints } from '@octokit/types';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import { GitForkIcon, StarIcon } from 'lucide-react';
import { ImageSourceVariants } from '@/server/db/schema';
import { SingleRepoType } from '@/components/Repo';
import Image from 'next/image';

export type Props = {
    data: SingleRepoType & {
        image_source: ImageSourceVariants;
        custom_link: string | null;
    };
    iframeLink: string | null;
};

const DetailedRepoInfo: FC<Props> = ({ data, iframeLink }) => {
    let preview: ReactNode | null = (
        <span className="border-2 border-red-600 p-5 font-mono font-semibold text-red-600">
            No preview found
        </span>
    );

    if (data.image_source === 'default' && iframeLink) {
        preview = (
            <iframe
                style={{
                    width: '250%',
                    height: '250%',
                    scale: 0.4,
                    transformOrigin: '0 0',
                }}
                src={iframeLink}
                className="absolute left-0 top-0 bg-white"
            />
        );
    }
    if (data.image_source === 'custom_link' && data.custom_link) {
        preview = (
            <Image
                src={data.custom_link}
                alt={data.full_name}
                width={320}
                height={176}
                className="h-auto w-full"
            />
        );
    }

    const Description = data.description ? (
        <>
            <span className="text-xl">Description:</span>
            <p className="-mt-4 ml-6"> {data.description} </p>
        </>
    ) : null;

    const Badges = [
        data.stargazers_count ? (
            <Link
                className="relative flex aspect-square h-12 w-12 items-center justify-center"
                href={data.stargazers_url}
            >
                <StarIcon className="h-full w-full fill-amber-500 text-yellow-600" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
                    {data.stargazers_count}
                </span>
            </Link>
        ) : null,
        data.forks_count ? (
            <Link
                className="relative flex aspect-square h-12 w-12 items-center justify-center"
                href={data.forks_url}
            >
                <GitForkIcon className="h-full w-full fill-blue-600 text-indigo-700" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full font-bold">
                    {data.forks_count}
                </span>
            </Link>
        ) : null,
    ].filter((a) => a !== null);

    return (
        <DialogContent className="w-[700px] max-w-[95dvw]">
            <DialogTitle className="underline" asChild>
                <Link href={data.html_url}>{data.full_name}</Link>
            </DialogTitle>

            <div className="relative flex aspect-[320/176] h-auto w-full items-center justify-center overflow-clip rounded-xl border border-neutral-600">
                {preview}
            </div>

            {Description}

            {Badges.length ? (
                <div className="flex justify-center gap-2 py-2">
                    {...Badges}
                </div>
            ) : null}
        </DialogContent>
    );
};

export default DetailedRepoInfo;
