import type { FC } from 'react';

const ErrorComp: FC<{ error: unknown }> = ({ error }) => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <span className="max-w-96 break-words border-2 border-red-500 p-5 font-mono text-xl text-red-500">
                {String(error)}
            </span>
        </div>
    );
};

export default ErrorComp;
