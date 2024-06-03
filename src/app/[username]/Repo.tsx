import { type FC } from "react";
import type { Endpoints } from "@octokit/types";
import { ChevronDownIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DetailedRepoInfo from "@/app/[username]/DetailedRepoInfo";

type Props = {
  data: Endpoints["GET /users/{username}/repos"]["response"]["data"][0];
  username: string;
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

const Repo: FC<Props> = ({ data, username }) => {
  const iframeLink = data.has_pages
    ? `https://${username}.github.io/` + data.name
    : data.homepage
      ? data.homepage
      : null;

  return (
    <div className="flex flex-col items-center">
      {/*  176 x 320 */}
      <div className="relative flex h-44 w-80 items-center justify-center overflow-clip rounded-xl border-2 border-neutral-600 font-mono font-bold">
        {iframeLink ? (
          <iframe
            style={{
              scale: 0.2,
              transformOrigin: "0 0",
              width: 320 * 5,
              height: 176 * 5,
            }}
            src={iframeLink}
            className="absolute left-0 top-0 bg-white"
          />
        ) : (
          data.name
        )}
      </div>
      <div className="flex w-full justify-center">
        <Dialog>
          <DialogTrigger>
            <ChevronDownIcon className="h-8 opacity-50 hover:opacity-100" />
          </DialogTrigger>
          <DetailedRepoInfo data={data} iframeLink={iframeLink} />
        </Dialog>
      </div>
    </div>
  );
};

export default Repo;
