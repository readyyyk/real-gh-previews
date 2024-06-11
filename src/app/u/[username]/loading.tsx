import { type FC } from 'react';
import { RepoLoading } from '@/components/Repo';
import { UserPartLoading } from '@/components/UserPart';

const Loading: FC = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center py-12">
            <div className="grid w-[95dvw] max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-full mb-8 flex flex-col items-center gap-6 rounded-2xl bg-neutral-800 p-5 md:flex-row">
                    <UserPartLoading />
                </div>
                {Array(7)
                    .fill(0)
                    .map((_, i) => (
                        <RepoLoading key={'repo-preview-loading-' + i} />
                    ))}
            </div>
        </div>
    );
};

export default Loading;
