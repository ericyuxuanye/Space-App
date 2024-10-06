import { ChevronLast, ChevronFirst } from "lucide-react";
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false); // Sidebar starts collapsed by default

  return (
    <aside className={`h-screen ${expanded ? 'sidebar' : 'sidebar collapsed'}`}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          {/* Button to toggle the sidebar's expanded state */}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Only render children (Sidebar Items) if expanded */}
        {expanded && (
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              {children}
            </ul>
          </SidebarContext.Provider>
        )}
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }) {
    const { expanded } = useContext(SidebarContext); // Access the expanded state from context
  
    return (
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
  
        {/* Text visibility depends on whether the sidebar is expanded */}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
        >
          {text}
        </span>
  
        {/* Optional alert indicator (a small dot) */}
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
          />
        )}
  
        {/* Tooltip when sidebar is collapsed */}
        {!expanded && (
          <div
            className="
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-indigo-100 text-indigo-800 text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            "
          >
            {text}
          </div>
        )}
      </li>
    );
  }