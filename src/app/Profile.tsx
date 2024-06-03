"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { useOctoKitContext } from "@/components/OctoKitContext";
import { useQuery } from "@tanstack/react-query";
import { env } from "@/env";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { type Endpoints } from "@octokit/types";
import { cn } from "@/lib/utils";

const ActualProfile: FC<{
  data: Endpoints["GET /user"]["response"]["data"];
}> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((a) => !a);

  return (
    <div
      onClick={toggle}
      className={cn(
        "fixed bottom-3 flex items-center bg-neutral-800 p-2 shadow transition-all",
        open
          ? "right-auto mx-3 h-auto w-[calc(100%_-_12px_*_2)] justify-between rounded-xl"
          : "right-3 mx-0 h-14 w-14 justify-center rounded-full",
      )}
    >
      <Link
        href="/-/my/"
        className={cn(
          open
            ? "h-auto w-auto text-xl underline opacity-100"
            : "h-0 w-0 opacity-0",
        )}
      >
        My page
      </Link>
      <div className={cn("flex items-center", open ? "gap-3" : "")}>
        <Link
          href={data.html_url}
          className={cn(
            open
              ? "h-auto w-auto underline opacity-100"
              : "hidden h-0 w-0 opacity-0",
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

const Profile: FC = () => {
  const { octokit, token } = useOctoKitContext();

  const { data, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => octokit!.request("GET /user"),
    enabled: !!token,
  });

  if (error) {
    return <div> {error.message} </div>;
  }

  return data ? (
    <ActualProfile data={data.data} />
  ) : (
    <Link
      href={
        "https://github.com/login/oauth/authorize?client_id=" +
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
};

export default Profile;
