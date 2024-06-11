'use client';

import { type FC, useState } from 'react';

import { type Props } from '@/components/DetailedRepoInfo';
import Link from 'next/link';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/trpc/react';
import {
    image_source_variants,
    type ImageSourceVariants,
} from '@/server/db/schema';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoaderCircleIcon } from 'lucide-react';

const DialogContentAdmin: FC<Props & { close: () => void }> = ({
    data,
    close,
}) => {
    const { mutateAsync, isPending, error } =
        api.repos.update_source.useMutation();

    const tools = api.useUtils();

    const [initial, setInitial] = useState({
        custom_link: data.custom_link ?? '',
        image_source: data.image_source,
    });

    const [customLink, setCustomLink] = useState(initial.custom_link);
    const [imageSource, setImageSource] = useState(initial.image_source);

    const isDisabled =
        imageSource === data.image_source && customLink === data.custom_link;

    async function handleSubmit() {
        await mutateAsync({
            image_source: imageSource,
            custom_link: customLink.trim(),
            repo_gh_id: data.id,
        });
        if (error) {
            console.log(error);
            return;
        }
        setInitial({
            image_source: imageSource,
            custom_link: customLink.trim(),
        });
        await tools.repos.get_sources.invalidate();
        close();
    }

    return (
        <DialogContent className="w-[700px] max-w-[95dvw]">
            <DialogTitle className="underline" asChild>
                <Link href={data.html_url}>{data.full_name}</Link>
            </DialogTitle>

            {!!error && (
                <div className="flex justify-center"> {error.message} </div>
            )}

            <div className="relative flex aspect-[320/176] h-auto w-full flex-col items-center justify-center gap-3 overflow-clip rounded-xl border border-neutral-600 p-3">
                <Select
                    defaultValue={data.image_source}
                    onValueChange={(value) =>
                        setImageSource(value as ImageSourceVariants)
                    }
                    value={imageSource}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Image source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={image_source_variants[0]}>
                            {image_source_variants[0]}
                        </SelectItem>
                        <SelectItem value={image_source_variants[1]}>
                            {image_source_variants[1]}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                    placeholder="Custom image link"
                    disabled={imageSource !== image_source_variants[1]}
                />

                <Button
                    className="flex gap-2 bg-green-500"
                    onClick={handleSubmit}
                    disabled={isDisabled || isPending}
                >
                    {isPending && <LoaderCircleIcon className="animate-spin" />}
                    Submit
                </Button>
            </div>

            <div className="flex">
                <ul className={'flex flex-col gap-2'}>
                    <li
                        className={
                            'transition ' +
                            (imageSource === image_source_variants[0]
                                ? 'opacity-100'
                                : 'opacity-60')
                        }
                    >
                        <span
                            className={cn(
                                'border-b border-transparent font-mono font-bold transition',
                                imageSource === image_source_variants[0]
                                    ? 'border-neutral-300'
                                    : '',
                            )}
                        >
                            {image_source_variants[0]}
                        </span>{' '}
                        - get link like {'{username}.github.io/{repo}'} or
                        homepage if defined and show in iframe
                    </li>
                    <li
                        className={
                            'transition ' +
                            (imageSource === image_source_variants[1]
                                ? 'opacity-100'
                                : 'opacity-60')
                        }
                    >
                        <span
                            className={cn(
                                'border-b border-transparent font-mono font-bold transition',
                                imageSource === image_source_variants[1]
                                    ? 'border-neutral-300'
                                    : '',
                            )}
                        >
                            {image_source_variants[1]}
                        </span>{' '}
                        - you provide custom link for image that would be
                        displayed instead of iframe
                    </li>
                </ul>
            </div>
        </DialogContent>
    );
};

export default DialogContentAdmin;
