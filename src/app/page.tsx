"use client";
import { useEffect, useState } from "react";
import { TaskTable } from "./components/shared/tables/TaskTable";
import { Loading } from "./components/UI/Loading";
import { Auth } from "@/context/authContext";

export default function Home() {
  const { userId } = Auth();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userId) {
      setLoading(false);
    }
  }, [userId]);

  return (
    <div>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <Loading size={60} />
        </div>
      ) : (
        <TaskTable />
      )}
    </div>
  );
}
