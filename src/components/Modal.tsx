import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Fragment, useState } from "react";
import { trpc } from "../utils/trpc";
import type { Todo } from "@prisma/client";

interface Props {
  type: "manage" | "add" | "update" | "delete" | "check";
  todo?: Todo;
}

type Inputs = {
  task: string;
  dueDate: Date;
};

export default function Modal({ type = "add", todo }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { refetch } = trpc.todo.getTodos.useQuery();
  const { mutate, isLoading, error } = trpc.todo.addTodo.useMutation({
    onSuccess() {
      refetch();
      reset();
      setShowModal(false);
    },
  });
  const {
    mutate: updateTodo,
    isLoading: loadingUpdate,
    error: errorUpdate,
  } = trpc.todo.updateTodo.useMutation({
    onSuccess() {
      refetch();
      reset();
      setShowModal(false);
    },
  });
  const {
    mutate: markTodoAsDone,
    isLoading: loadingMarkAsDone,
    error: errorMarkAsDone,
  } = trpc.todo.markTodoAsDone.useMutation({
    onSuccess() {
      refetch();
      reset();
      setShowModal(false);
    },
  });
  const {
    mutate: deleteTodo,
    isLoading: loadingDeleteTodo,
    error: deleteError,
  } = trpc.todo.deleteTodo.useMutation({
    onSuccess() {
      refetch();
      setShowModal(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: todo
      ? {
          task: todo.task,
          dueDate: todo.dueDate,
        }
      : undefined,
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (type === "add") {
      mutate({ task: data.task, dueDate: new Date(data.dueDate) });
    } else if (type === "update") {
      todo &&
        updateTodo({
          id: todo.id,
          task: data.task,
          dueDate: new Date(data.dueDate),
        });
    }
  };

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  switch (type) {
    case "add":
      return (
        <>
          <div
            className="absolute right-10 bottom-10 h-14 w-14 cursor-pointer rounded-full bg-white transition-transform ease-out hover:scale-105"
            onClick={openModal}
          >
            <PlusSmallIcon className="h-14 text-black" />
          </div>

          <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Add a new todo
                      </Dialog.Title>

                      <>
                        <form
                          id="addTask"
                          className="mt-5 space-y-2.5"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="flex flex-col space-y-0.5">
                            <label
                              className="font-semibold tracking-wide"
                              htmlFor="task"
                            >
                              Task
                            </label>
                            <input
                              id="task"
                              className="bg-slate-200 p-2.5 outline-none"
                              placeholder="Enter task name..."
                              type="text"
                              {...register("task", {
                                required: {
                                  value: true,
                                  message: "Please enter a valid task name!",
                                },
                              })}
                            />
                            {errors?.task && (
                              <p className="text-[13px] font-semibold tracking-wide text-red-700">
                                {errors.task.message}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col space-y-0.5">
                            <label
                              className="font-semibold tracking-wide"
                              htmlFor="dueDate"
                            >
                              Due date
                            </label>
                            <input
                              id="dueDate"
                              className="bg-slate-200 p-2.5 outline-none"
                              type="datetime-local"
                              {...register("dueDate", {
                                required: {
                                  value: true,
                                  message: "Please input a valid datetime",
                                },
                              })}
                            />
                            {errors?.dueDate && (
                              <p className="text-[13px] font-semibold tracking-wide text-red-700">
                                {errors.dueDate.message}
                              </p>
                            )}
                          </div>
                        </form>

                        {error && (
                          <p className="mt-3.5 text-[13px] font-semibold tracking-wide text-red-700">
                            {error.message}
                          </p>
                        )}
                      </>

                      <div className="mt-10">
                        <button
                          disabled={isLoading}
                          form="addTask"
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/70 focus-visible:ring-offset-2 disabled:bg-black/50"
                        >
                          {!isLoading ? (
                            "Add"
                          ) : (
                            <ArrowPathIcon className="h-5 animate-spin" />
                          )}
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      );

    case "update":
      return (
        <>
          <button
            className="bg-yellow-600 px-5 py-2 font-semibold text-white outline-none"
            onClick={openModal}
          >
            Update
          </button>

          <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Update todo
                      </Dialog.Title>

                      <>
                        <form
                          id="updateTask"
                          className="mt-5 space-y-2.5"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="flex flex-col space-y-0.5">
                            <label
                              className="font-semibold tracking-wide"
                              htmlFor="task"
                            >
                              Task
                            </label>
                            <input
                              id="task"
                              className="bg-slate-200 p-2.5 outline-none"
                              placeholder="Enter task name..."
                              type="text"
                              {...register("task", {
                                required: {
                                  value: true,
                                  message: "Please enter a valid task name!",
                                },
                              })}
                            />
                            {errors?.task && (
                              <p className="text-[13px] font-semibold tracking-wide text-red-700">
                                {errors.task.message}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col space-y-0.5">
                            <label
                              className="font-semibold tracking-wide"
                              htmlFor="dueDate"
                            >
                              Due date
                            </label>
                            <input
                              id="dueDate"
                              className="bg-slate-200 p-2.5 outline-none"
                              type="datetime-local"
                              {...register("dueDate", {
                                required: {
                                  value: true,
                                  message: "Please input a valid datetime",
                                },
                              })}
                            />
                            {errors?.dueDate && (
                              <p className="text-[13px] font-semibold tracking-wide text-red-700">
                                {errors.dueDate.message}
                              </p>
                            )}
                          </div>
                        </form>

                        {error && (
                          <p className="mt-3.5 text-[13px] font-semibold tracking-wide text-red-700">
                            {error.message}
                          </p>
                        )}
                      </>

                      <div className="mt-10">
                        <button
                          disabled={isLoading}
                          form="updateTask"
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/70 focus-visible:ring-offset-2 disabled:bg-black/50"
                        >
                          {!loadingUpdate ? (
                            "Update"
                          ) : (
                            <ArrowPathIcon className="h-5 animate-spin" />
                          )}
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      );

    case "check":
      return (
        <>
          {!todo?.isDone ? (
            <CheckCircleIcon
              className="absolute left-2 h-10 transition-colors hover:text-green-700"
              onClick={openModal}
            />
          ) : (
            <CheckCircleIcon
              className="absolute left-2 h-10 text-green-700 transition-colors hover:text-black"
              onClick={openModal}
            />
          )}

          <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {todo && !todo.isDone
                          ? "Are you sure to mark this task as done?"
                          : "Are you sure to undo this task?"}
                      </Dialog.Title>

                      {todo && (
                        <div className="mt-5 space-x-3.5">
                          <button
                            className="bg-red-600 px-5 py-2 font-semibold text-white outline-none"
                            onClick={() =>
                              markTodoAsDone({
                                id: todo.id,
                                isDone: !todo.isDone,
                              })
                            }
                          >
                            Yes
                          </button>

                          <button
                            className="bg-green-600 px-5 py-2 font-semibold text-white outline-none"
                            onClick={closeModal}
                          >
                            No
                          </button>
                        </div>
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      );

    case "manage":
      return (
        <>
          <EllipsisVerticalIcon
            className="absolute right-2 h-10 hover:text-blue-700"
            onClick={openModal}
          />

          <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Manage todo
                      </Dialog.Title>

                      {todo && (
                        <div className="mt-5 space-x-3.5">
                          <Modal todo={todo} type="update" />

                          <button
                            className="bg-red-600 px-5 py-2 font-semibold text-white outline-none"
                            onClick={() => deleteTodo({ id: todo.id })}
                          >
                            {!loadingDeleteTodo ? (
                              "Delete"
                            ) : (
                              <ArrowPathIcon className="h-6 animate-spin" />
                            )}
                          </button>
                        </div>
                      )}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      );
    default:
      return null;
  }
}
