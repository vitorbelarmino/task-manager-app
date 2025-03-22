"use client";

import { MdOutlineEdit } from "react-icons/md";
import { RiCloseLargeLine } from "react-icons/ri";

interface Idata {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface TableProps {
  data: Idata[];
  title: string;
  deleteTask: (id: string) => void;
}

export function Table({ data, title, deleteTask }: TableProps) {
  const columns = ["Título", "Descrição", "Status", "Data de criação", "Editar/Excluir"];

  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col w-11/12 m-2">
        <div className="flex items-center justify-between">
          <h1 className="text-center text-2xl flex-1">{title}</h1>
          <div className="flex justify-end">
            <button className="text-white bg-blue-600 rounded-md p-3 m-2 cursor-pointer">
              Addicionar tarefa
            </button>
          </div>
        </div>
        <div className="h-[75vh] overflow-y-auto p-3 bg-gray-200 text-black">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                {columns.map((item, index) => (
                  <th className="text-start h-10" key={index}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((task, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.entries(task).map(([key, value], i) => (
                    <>
                      {key === "id" ? (
                        <td className="text-center border-b-2 h-10 pl-3" key={i}>
                          <div className="flex gap-3">
                            <MdOutlineEdit className="cursor-pointer" />
                            <RiCloseLargeLine
                              color="red"
                              className="cursor-pointer"
                              onClick={() => deleteTask(task.id)}
                            />
                          </div>
                        </td>
                      ) : (
                        <td className="text-start border-b-2 h-10 px-2" key={i}>
                          {value}
                        </td>
                      )}
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
