"use client";
import { ITask } from "@/types/tasks";
import { FaRegEdit, FaRegTrashAlt, FaRegCheckSquare } from "react-icons/fa";
import Modal from "./Modal";
import { completeTodo, deleteTodo, editTodo } from "@/api";
import { useRouter } from "next/navigation";
import { useState, FormEventHandler } from "react";

interface TaskProps {
  task: ITask;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [openModalComplete, setOpenModalComplete] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo({
      id: task.id,
      text: taskToEdit,
      completed: task.completed,
    });
    setTaskToEdit("");
    setOpenModalEdit(false);
    router.refresh();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTodo(id);
    setOpenModalDelete(false);
    router.refresh();
  };

  const handleCompleteTask = async (id: string) => {
    await completeTodo({
      id,
      text: task.text,
      completed: true,
    });
    setOpenModalComplete(false);
    router.refresh();
  };

  return (
    <tr key={task.id}>
      <td className={task.completed ? "line-through" : ""}>{task.text}</td>
      <td className="flex gap-5">
        <FaRegEdit
          cursor="pointer"
          size={20}
          onClick={() => setOpenModalEdit(true)}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className="font-bold text-lg">Edit your task</h3>
            <div className="modal-action">
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <FaRegTrashAlt
          onClick={() => setOpenModalDelete(true)}
          cursor="pointer"
          className="text-red-400"
          size={20}
        />
        <Modal modalOpen={openModalDelete} setModalOpen={setOpenModalDelete}>
          <h3 className="text-lg">
            Are you sure you want to delete this task?
          </h3>
          <div className="modal-action">
            <button onClick={() => handleDeleteTask(task.id)} className="btn">
              Yes
            </button>
          </div>
        </Modal>

        <FaRegCheckSquare
          cursor="pointer"
          className="text-green-300"
          size={20}
          onClick={() => setOpenModalComplete(true)}
        />
        <Modal
          modalOpen={openModalComplete}
          setModalOpen={setOpenModalComplete}
        >
          <h3 className="text-lg">Do you want to mark it complete?</h3>
          <div className="modal-action">
            <button onClick={() => handleCompleteTask(task.id)} className="btn">
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
