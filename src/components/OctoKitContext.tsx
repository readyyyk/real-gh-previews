"use client";

import { Octokit } from "@octokit/rest";
import {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { GH_COOKIE_NAME } from "@/config";
import { getClientCookie } from "@/lib/utils";

type OctoKitContextType = {
  octokit: Octokit | null;
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
};

const OctoKitContext = createContext({} as OctoKitContextType);

export const useOctoKitContext = () => useContext(OctoKitContext);

export const OctoKitContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initial = getClientCookie(GH_COOKIE_NAME) ?? "";
  const [token, setToken] = useState(initial);
  const [octokit, setOctokit] = useState<Octokit>(new Octokit());

  useEffect(() => {
    if (!token) {
      setOctokit(new Octokit());
      return;
    }

    // cookies.set(GH_COOKIE_NAME, token, GH_COOKIE_ATTRS);
    setOctokit(new Octokit({ auth: token }));
  }, [token]);

  return (
    <OctoKitContext.Provider value={{ octokit, token, setToken }}>
      {children}
    </OctoKitContext.Provider>
  );
};
