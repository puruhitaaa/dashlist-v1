import { type NextPage } from "next";
import Head from "next/head";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { trpc } from "../utils/trpc";
import Modal from "../components/Modal";
import { useRouter } from "next/router";
import React from "react";

const Home: NextPage = () => {
  const { data, isLoading, isError } = trpc.todo.getTodos.useQuery();
  const router = useRouter();

  if (isLoading) {
    return (
      <p className="text-center text-2xl font-bold text-slate-800">
        Loading...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-2xl text-red-700">
        Some error has occured, please try again later.
      </p>
    );
  }

  return (
    <>
      <Head>
        <title>Dashlist</title>
        <meta
          name="description"
          content="A simple todolist app made with T3 stack."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="relative flex min-h-screen flex-col items-center justify-center space-y-10 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="after:mt-1 after:block after:h-1 after:bg-white">
          <h1 className="text-4xl font-bold text-white">My todo list</h1>
        </div>

        {data.length ? (
          <div className="flex h-96 w-full max-w-[640px] flex-col items-center space-y-10 overflow-y-auto p-5">
            {data.map((todo) => (
              <div
                className="relative flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-white p-5 text-xl font-bold text-black outline-none transition-colors ease-out hover:bg-slate-200"
                key={todo.id}
              >
                <Modal todo={todo} type="check" />

                <p
                  className="mx-auto max-w-[500px] overflow-x-auto scrollbar-hide hover:text-blue-500"
                  onClick={() => router.push(`/todo/${todo.id}`)}
                >
                  {todo.task}
                </p>

                <Modal todo={todo} type="manage" />
              </div>
            ))}
          </div>
        ) : (
          <h5 className="text-xl tracking-wide text-white">No todos yet.</h5>
        )}

        <Modal type="add" />
      </main>
    </>
  );
};

export default Home;
