import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const title = "The Leader Board".split("");

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Leaderboard</title>
        <meta name="description" content="View the leaderboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="grid grid-cols-10 min-h-[3rem]">
        <div className="grid grid-cols-2 col-span-2 col-start-[9] place-items-center text-blue-400">
          <Link passHref href="/login-in">
            <a className="">Log In</a>
          </Link>
          <Link passHref href="/sign-up">
            <a className="">Sign Up</a>
          </Link>
        </div>
      </header>
      <main>
        <h2 aria-label="The Leader Board" className="title">
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
                name="view"
                value=""
                className="h-[3rem] text-2xl border-x-slate-800 p-2 text-blue-400 appearance-none pl-6 pr-12 rounded-md"
                style={{
                  backgroundImage: 'linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%)',
                  backgroundPosition: 'calc(100% - 20px) calc(1px + 50%),calc(100% - 16px) calc(1px + 50%)',
                  backgroundSize: '4px 4px, 4px 4px',
                  backgroundRepeat: 'no-repeat'                 
                }}
              >
                <option value="hundred">Top 100</option>
                <option value="global">Global</option>
              </select>
              <input name="event_name" placeholder="Gamer" className="h-[3rem] text-2xl border-x-slate-800 p-2 text-blue-400 appearance-none pl-6 pr-12 rounded-md" />
              <button className="border-blue-400 bg-black text-blue-400 text-2xl px-3 py-1 border-2 h-[3rem] rounded-md hover:bg-gray-900 transition-colors duration-500">
                Rank
              </button>
            </header>
            <div
              className="bg-slate-800 border-b-2 border-t-2 border-t-slate-800 border-b-blue-400 text-white mb-[-8rem] ml-[4rem] w-full min-h-[40vmax] max-h-[90vmin]"
              style={{
                backgroundImage: "linear-gradient(45deg, black, transparent)",
              }}
            >
              <div className="flex relative items-center gap-8 bg-blue-400 px-2 md:p-8">
                <div className="flex flex-wrap gap-2">
                  <div className="rounded-full border-blue-400 border-4 h-[6rem] w-[6rem] grid place-items-center text-6xl text-blue-400" style={{backgroundImage: "linear-gradient(45deg, black 45%, transparent)"}}>
                    1
                  </div>
                  <div className="rounded-full overflow-clip h-[6rem] w-[6rem] grid place-items-center">
                    <Image
                      src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                      alt="blah"
                      layout="fixed"
                      width="100%"
                      height="100%"
                    />
                  </div>
                </div>
                <h3 className="text-2xl flex-1">Gamer Name</h3>
                <div className="text-4xl flex-1 text-right" aria-label="Score">
                  500,000,000
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer></footer>
    </div>
  );
};

export default Home;
