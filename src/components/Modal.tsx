import { Dialog, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Fragment } from "react";
import { useAddTodoModal } from "../store/addTodoModal";
import { trpc } from "../utils/trpc";
import { useManageTodoModal } from "../store/manageTodoModal";
import type { Todo } from "@prisma/client";

interface Props {
  type: "manage" | "add";
  todo?: Todo;
}

type Inputs = {
  task: string;
  dueDate: Date;
};

export default function Modal({ type, todo }: Props) {
  const { refetch } = trpc.todo.getTodos.useQuery();
  const { mutate, isLoading, error } = trpc.todo.addTodo.useMutation({
    onSuccess() {
      refetch();
      reset();
      setShowModal(false);
    },
  });
  const { mutate: deleteTodo, error: deleteError } =
    trpc.todo.deleteTodo.useMutation({
      onSuccess() {
        refetch();
      },
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutate({ task: data.task, dueDate: new Date(data.dueDate) });
  };

  const { showModal, setShowModal } = useAddTodoModal((state) => ({
    showModal: state.showModal,
    setShowModal: state.setShowModal,
  }));

  const { showModal: showManageModal, setShowModal: setShowManageModal } =
    useManageTodoModal((state) => ({
      showModal: state.showModal,
      setShowModal: state.setShowModal,
    }));

  function closeModal() {
    if (type === "add") {
      setShowModal(false);
    } else {
      setShowManageModal(false);
    }
  }

  function openModal() {
    if (type === "add") {
      setShowModal(true);
    } else {
      setShowManageModal(true);
    }
  }

  return (
    <>
      {type === "add" ? (
        <div
          className="absolute right-10 bottom-10 h-14 w-14 cursor-pointer rounded-full bg-white transition-transform ease-out hover:scale-105"
          onClick={openModal}
        >
          <PlusSmallIcon className="h-14 text-black" />
        </div>
      ) : (
        <EllipsisVerticalIcon
          className="absolute right-2 h-10 hover:text-blue-700"
          onClick={openModal}
        />
      )}

      <Transition
        appear
        show={type === "add" ? showModal : showManageModal}
        as={Fragment}
      >
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
                    {type === "add" ? "Add a new todo" : "Manage todo"}
                  </Dialog.Title>

                  {type === "add" ? (
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
                  ) : (
                    todo && (
                      <div className="mt-5 space-x-3.5">
                        <button className="bg-yellow-600 px-5 py-2 font-semibold text-white outline-none">
                          Update
                        </button>

                        <button
                          className="bg-red-600 px-5 py-2 font-semibold text-white outline-none"
                          onClick={() => deleteTodo({ id: todo.id })}
                        >
                          Delete
                        </button>
                      </div>
                    )
                  )}

                  {type === "add" && (
                    <div className="mt-10">
                      <button
                        disabled={isLoading}
                        form="addTask"
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/70 focus-visible:ring-offset-2 disabled:bg-black/50"
                      >
                        Add
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
}
