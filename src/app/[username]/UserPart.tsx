import { type FC } from "react";
import type { Endpoints } from "@octokit/types";
import Image from "next/image";
import Link from "next/link";

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
      <div className="relative flex items-center">
        <Image
          className="h-auto w-auto rounded-full"
          src={data.avatar_url}
          width={100}
          height={100}
          alt={data.login}
        />
        {data.hireable ? (
          <span className="absolute -right-3 top-1/2 translate-y-[50px] rounded bg-amber-500 p-1 font-mono font-bold leading-tight">
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

export default UserPart;
