import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "../components/spinner";

const title = "The Leader Board".split("");
const filterKeys = ["page", "event_name", "view", "sortOrder"];
const updateQuery = (
  router: NextRouter,
  params: { [s: string]: string | number }
) => {
  router.push({
    query: {
      ...router.query,
      ...params,
    },
  });
};

type Leader = {
  id: number;
  name: string;
  pic: string;
  rank: number;
  score: number;
};

type LeaderResponse = {
  nextPage: number;
  sort: "-1" | "1";
  entries: Leader[];
};

const useDebounce = (value: string | number, timeout: number = 500) => {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const to = setTimeout(() => {
      setVal(value);
    }, timeout);
    return () => {
      clearTimeout(to);
    };
  }, [value, timeout]);

  return val;
};

const Home: NextPage = () => {
  const router = useRouter();
  const queryState = router.query;
  const sortOrder = queryState.sortOrder as string;
  const eventName = queryState.event_name as string;
  const leaderName = useDebounce(eventName);
  const leaders = useQuery(
    [
      "leaderboard",
      {
        view: queryState.view,
        sortOrder: queryState.sortOrder,
        event_name: leaderName,
        page: queryState.page,
      },
    ],
    async () => {
      const params = new URLSearchParams();
      filterKeys.forEach((k) => {
        if (queryState[k]) params.append(k, queryState[k] as string);
      });
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_HOST
        }/api/v1/leaderboard?${params.toString()}`
      );
      if (!response.ok) throw Error(response.statusText);
      return response.json() as Promise<LeaderResponse>;
    },
    {
      keepPreviousData: true,
      retry(failureCount, error) {
        return !(failureCount > 1);
      },
    }
  );

  return (
    <div>
      <Head>
        <title>
          The Leaderboard -{" "}
          {queryState.view === "hundred" ? "Top 100" : "Global"}
        </title>
        <meta name="description" content="View the leaderboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="grid grid-cols-10 min-h-[3rem]">
        <div className="grid grid-cols-2 col-span-2 col-start-[9] gap-4 place-items-center text-blue-400">
          <div className="flex gap-4 col-span-2">
            <Link passHref href="/login-in">
              <a className="">Log In</a>
            </Link>
            <Link passHref href="/sign-up">
              <a className="">Sign Up</a>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <h2
          aria-label={`The ${
            queryState.view === "hundred" ? "Top 100" : "Global"
          } Leaderboard`}
          className="title"
        >
          {title.map((letter, idx) => (
            <span
              aria-hidden
              key={`${letter}-${idx}`}
              className="letter"
              data-blank={letter === " "}
              style={{ "--title-idx": `${idx}` } as React.CSSProperties}
            >
              {letter}
            </span>
          ))}
        </h2>
        <section className="fade-in">
          <div
            className="bg-blue-400 py-8 max-w-[95%] min-w-[90vmin] md:max-w-lg m-auto relative"
            style={{
              left: "-3rem",
              backgroundImage: "linear-gradient(45deg, black, transparent)",
            }}
          >
            <header className="ml-12 p-4 flex flex-wrap items-center gap-4">
              <select
                aria-label="View leaderboard by"
                disabled={leaders.isFetching}
                name="view"
                onChange={(e) => {
                  updateQuery(router, { view: e.target.value, page: 1 });
                }}
                value={queryState.view}
                className="h-[3rem] text-2xl border-x-slate-800 p-2 text-blue-400 appearance-none pl-6 pr-12 rounded-md"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%)",
                  backgroundPosition:
                    "calc(100% - 20px) calc(1px + 50%),calc(100% - 16px) calc(1px + 50%)",
                  backgroundSize: "4px 4px, 4px 4px",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="hundred">Top 100</option>
                <option value="global">Global</option>
              </select>
              <input
                name="event_name"
                placeholder="Gamer"
                onChange={(e) => {
                  updateQuery(router, { event_name: e.target.value, page: 1 });
                }}
                value={eventName ?? ""}
                className="h-[3rem] text-2xl border-x-slate-800 p-2 text-blue-400 appearance-none pl-6 pr-12 rounded-md"
              />
              <button
                disabled={leaders.isFetching}
                onClick={() => {
                  updateQuery(router, { sortOrder: -1 * Number(sortOrder) });
                }}
                className="flex items-center border-blue-400 bg-black text-blue-400 text-2xl px-3 py-1 h-[3rem] rounded-md hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-500"
              >
                Rank{" "}
                <span
                  className={`inline-block w-[0.5rem] h-[0.5rem] border-blue-400 ml-2 bg-transparent`}
                  aria-label={`sorted in ${
                    sortOrder === "1" ? "ascending" : "descending"
                  } order`}
                  style={{
                    borderWidth: "0 3px 3px 0",
                    transform:
                      sortOrder === "1" ? "rotate(225deg)" : "rotate(45deg)",
                    transition: "transform 0.5s ease-in-out",
                  }}
                />
              </button>
            </header>
            <nav className="text-center mb-2">
              <Link
                href={{
                  query: { ...router.query, page: Number(queryState.page) - 1 },
                }}
                passHref
              >
                <a
                  className={`p-2 inline-block hover:text-blue-200 focus:text-blue-200 ${
                    Number(queryState.page) > 1 ? "" : "pointer-events-none"
                  }`}
                >
                  Previous Page
                </a>
              </Link>
              <Link
                href={{
                  query: { ...router.query, page: leaders.data?.nextPage },
                }}
                passHref
              >
                <a
                  className={`p-2 inline-block hover:text-blue-200 focus:text-blue-200 ${
                    leaders.data?.nextPage !== -1 ? "" : "pointer-events-none"
                  }`}
                >
                  Next Page
                </a>
              </Link>
            </nav>
            {queryState.page === "2" && (
              <p className="text-center text-xs text-white">
                Page 2 simulates network latency
              </p>
            )}
            <div
              className="relative bg-slate-800 border-b-2 border-t-2 border-t-slate-800 border-b-blue-400 text-white mb-[-8rem] ml-[4rem] w-full min-h-[40vmax]"
              style={{
                backgroundImage: "linear-gradient(45deg, black, transparent)",
              }}
            >
              {leaders.isError && !leaders.data?.entries.length && (
                <div className="absolute inset-0 grid place-content-center">
                  <h3 className="text-3xl">Unable to retrieve leaderboard</h3>
                </div>
              )}
              {leaders.data?.entries?.map((l) => (
                <div
                  key={l.id}
                  tabIndex={0}
                  className={`flex relative items-center gap-8 focus:bg-gradient-to-tr from-black to-blue-400 focus:scale-105 focus:z-10 transition-transform ${
                    l.rank === 1
                      ? "bg-blue-400"
                      : "bg-black border-b-2 border-blue-400"
                  } px-2 md:p-8`}
                >
                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`rounded-full border-blue-400 border-4 h-[6rem] w-[6rem] grid place-items-center text-blue-400 ${
                        l.rank > 99 ? "text-4xl" : "text-6xl"
                      }`}
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, black 45%, transparent)",
                      }}
                    >
                      {l.rank}
                    </div>
                    <div className="rounded-full overflow-clip h-[6rem] w-[6rem] grid place-items-center">
                      <Image
                        src={l.pic}
                        alt="blah"
                        layout="fixed"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl flex-1">{l.name}</h3>
                  <div
                    className="text-4xl flex-1 text-right"
                    aria-label="Score"
                  >
                    {Intl.NumberFormat().format(l.score)}
                  </div>
                </div>
              ))}
              <div
                className={`absolute bg-blue-900 opacity-70 ${
                  leaders.isLoading || leaders.isFetching ? "inset-0" : "hidden"
                }`}
              />
              <div
                className={`absolute inset-0 grid place-content-center ${
                  leaders.isLoading || leaders.isFetching ? "" : "hidden"
                }`}
              >
                <Spinner size="xl" />
              </div>
            </div>
          </div>
          <div className="mt-24 text-blue-400 text-center">
            <Link
              href={{
                query: { ...router.query, page: Number(queryState.page) - 1 },
              }}
              passHref
            >
              <a
                className={`p-8 inline-block hover:text-blue-200 focus:text-blue-200 ${
                  Number(queryState.page) > 1 ? "" : "pointer-events-none"
                }`}
              >
                Previous Page
              </a>
            </Link>
            <Link
              href={{
                query: { ...router.query, page: leaders.data?.nextPage },
              }}
              passHref
            >
              <a
                className={`p-8 inline-block hover:text-blue-200 focus:text-blue-200 ${
                  leaders.data?.nextPage !== -1 ? "" : "pointer-events-none"
                }`}
              >
                Next Page
              </a>
            </Link>
          </div>
        </section>
      </main>
      <footer></footer>
    </div>
  );
};

export default Home;
