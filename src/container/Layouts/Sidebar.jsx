"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { IconComponent } from "@muatmuat/ui/IconComponent";

const Sidebar = ({ sidebarOpen = true }) => {
  const pathname = usePathname();

  const allMenuItems = [
    {
      name: "Pencairan Muatrans",
      icon: "/icons/nav/kontrak.svg",
      href: "/pencairan",
      expandable: false,
      permissionKey: null,
    },
  ];

  // Filter menu items based on permissions
  const menuItems = useMemo(() => {
    return allMenuItems.filter((item) => {
      if (!item.permissionKey) return true;
      return true;
    });
  }, []);

  // initialize expanded parents that are active
  const [expanded, setExpanded] = useState(() =>
    menuItems
      .filter(
        (it) =>
          Array.isArray(it.children) &&
          it.children.length > 0 &&
          (pathname === it.href || pathname.startsWith(`${it.href}/`))
      )
      .map((it) => it.href)
  );

  return (
    <div className="flex h-full flex-col bg-white shadow-[2px_0px_16px_0px_#00000026]">
      <div
        className={`flex flex-grow flex-col gap-[5px] overflow-y-auto py-2 ${sidebarOpen ? "px-[13px]" : "px-2"}`}
      >
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const hasChildren =
            item.expandable &&
            Array.isArray(item.children) &&
            item.children.length > 0;
          const isExpanded = expanded.includes(item.href);
          // when parent has children and is expanded, don't apply active style to parent
          const parentActive = hasChildren ? !isExpanded && isActive : isActive;

          return (
            <div key={index}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) =>
                      prev.includes(item.href)
                        ? prev.filter((p) => p !== item.href)
                        : [...prev, item.href]
                    )
                  }
                  aria-expanded={isExpanded}
                  className={`flex w-full items-center rounded-lg py-2 transition-colors duration-200 ${
                    sidebarOpen
                      ? "justify-between px-[10px]"
                      : "justify-center px-0"
                  } ${
                    parentActive ? "bg-white text-black" : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center ${!sidebarOpen && "justify-center"}`}
                  >
                    <div className={sidebarOpen ? "mr-3" : ""}>
                      <IconComponent
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                        color="black"
                      />
                    </div>
                    {sidebarOpen && (
                      <span className="text-sm font-semibold">{item.name}</span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <IconComponent
                      src="/icons/chevron-right.svg"
                      alt="Chevron Right"
                      width={20}
                      height={20}
                      color="black"
                      className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  )}
                </button>
              ) : (
                sidebarOpen && (
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-[10px] py-2 transition-colors duration-200 ${
                      parentActive ? "bg-white text-black" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        <IconComponent
                          src={item.icon}
                          alt={item.name}
                          width={24}
                          height={24}
                          color="black"
                        />
                      </div>
                      <span className="text-sm font-semibold text-black">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )
              )}
              {hasChildren && sidebarOpen && (
                <div
                  className={`flex flex-col space-y-[5px] overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.children.map((child, ci) => {
                    const childActive =
                      pathname === child.href ||
                      pathname.startsWith(`${child.href}/`);
                    return (
                      <Link
                        key={ci}
                        href={child.href}
                        className={`flex w-full items-center justify-between rounded-lg p-[10px] pl-10 text-sm transition-colors duration-200 ${
                          childActive
                            ? "bg-white text-black"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <span
                            className={`mr-1.5 inline-block size-1.5 rounded-full bg-black`}
                          />
                          <span className="truncate text-sm font-semibold">
                            {child.name}
                          </span>
                        </div>
                        <div />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
