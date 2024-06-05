import { type FC } from "react";
import type { Endpoints } from "@octokit/types";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  data: Endpoints["GET /user"]["response"]["data"];
};

/*

== user ==
!login
!name
!avatar_url
!html_url
!bio
!hireable
!email

*/

const UserPart: FC<Props> = ({ data }) => {
  return (
    <>
      <div className="relative flex items-center justify-center">
        <Image
          className="rounded-full"
          src={data.avatar_url}
          width={128}
          height={128}
          alt={data.login}
        />
        {data.hireable ? (
          <span className="absolute left-1/2 top-1/2 translate-y-[50px] rounded bg-amber-500 p-1 font-mono font-bold leading-tight md:-right-3">
            hireable
          </span>
        ) : null}
      </div>
      <div className="flex max-w-60 flex-col gap-4 self-center">
        <div className="flex flex-col gap-1">
          <Link
            href={data.html_url}
            className="border-b-2 border-b-transparent font-mono text-lg font-bold transition hover:border-b-white md:text-2xl"
          >
            {data.name}
          </Link>
          <Link
            href={data.html_url}
            className="text-md border-b-2 border-b-transparent font-mono transition hover:border-b-white md:text-xl"
          >
            {data.login}
          </Link>
          <Link
            href={"mailto:" + data.email}
            className="text-md border-b-2 border-b-transparent font-mono transition hover:border-b-white md:text-lg"
          >
            {data.email}
          </Link>
        </div>
      </div>
      <p className="max-w-60">{data.bio}</p>
    </>
  );
};

export const UserPartLoading: FC = () => {
  return (
    <>
      <div className="relative flex items-center justify-center">
        <Skeleton className="h-[128px] w-[128px] rounded-full" />
      </div>
      <div className="flex max-w-60 flex-col gap-4 self-center">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-32 border-b-2 border-b-transparent font-mono text-lg font-bold transition hover:border-b-white md:text-2xl">
            {/*{data.name}*/}
          </Skeleton>
          <Skeleton className="text-md h-6 w-32 border-b-2 border-b-transparent font-mono transition hover:border-b-white md:text-xl"></Skeleton>
          <Skeleton className="text-md h-6 w-44 border-b-2 border-b-transparent font-mono transition hover:border-b-white md:text-lg">
            {/*{data.email}*/}
          </Skeleton>
        </div>
      </div>
      <Skeleton className="h-6 w-40 max-w-60">{/*{data.bio}*/}</Skeleton>
    </>
  );
};

export default UserPart;
