import { taskBackground } from "@/assets";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen ">
      <div className="flex justify-center items-center gap-16 p-4">
        <div className="">
          <Image className="p-4 aspect-[427/255]" src={taskBackground} alt="Task Icon" priority />
        </div>
        <div className="border-l-[1px] border-gray-300 h-full"></div>
        {children}
      </div>
    </div>
  );
}
