"use client";
import { taskContext } from "@/context/taskContext";
import { ITask } from "@/interface/ITask";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { TiArrowUnsorted } from "react-icons/ti";

type TaskSortArrowsProps = {
  column: keyof ITask;
};

export function TaskSortArrows({ column }: TaskSortArrowsProps) {
  const { tasks, sortConfig, setSortConfig, setSortedTasks } = taskContext();

  const handleSort = () => {
    let nextSortDirection: "asc" | "desc" | undefined;
    if (sortConfig.column === column) {
      nextSortDirection =
        sortConfig.direction === "asc"
          ? "desc"
          : sortConfig.direction === "desc"
            ? undefined
            : "asc";
    } else {
      nextSortDirection = "asc";
    }

    if (nextSortDirection === undefined) {
      setSortedTasks([...tasks]);
      setSortConfig({ column, direction: nextSortDirection });
      return;
    }

    const filteredTasks = [...tasks].sort((a, b) => {
      if (a[column] > b[column]) return nextSortDirection === "asc" ? 1 : -1;
      if (a[column] < b[column]) return nextSortDirection === "asc" ? -1 : 1;
      return 0;
    });

    setSortedTasks(filteredTasks);
    setSortConfig({ column, direction: nextSortDirection });
  };

  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={handleSort}>
      {sortConfig.column === column ? (
        sortConfig.direction === "asc" ? (
          <FaCaretUp />
        ) : sortConfig.direction === "desc" ? (
          <FaCaretDown />
        ) : (
          <TiArrowUnsorted />
        )
      ) : (
        <TiArrowUnsorted />
      )}
    </div>
  );
}
