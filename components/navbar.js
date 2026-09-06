"use client";

import { Fragment } from "react";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import cx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import LogoImg from "@/public/img/logo.png";
import { SITE_NAME } from "@/lib/seo";

export default function Navbar(props) {
  const categories = props.categories || [];

  const leftmenu = [
    { label: "Hjem", href: "/" },
    {
      label: "Kategorier",
      href: "/archive",
      children: [
        { title: "Alle innlegg", path: "/archive" },
        ...categories
          .filter(cat => cat?.slug?.current)
          .map(cat => ({
            title: cat.title,
            path: `/category/${cat.slug.current}`
          }))
      ]
    }
  ];

  const rightmenu = [
    { label: "Om oss", href: "/about" },
    { label: "Kontakt", href: "/contact" }
  ];

  const mobilemenu = [...leftmenu, ...rightmenu];

  const linkClass =
    "px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-brand text-charcoal/80 transition-colors hover:text-accent";

  return (
    <header className="border-b border-line/60 bg-mist">
      <Container className="!py-3 lg:!py-4" alt>
        <nav>
          <Disclosure>
            {({ open }) => (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 md:flex-nowrap md:gap-8">
                  <div className="order-1 hidden w-full flex-col items-center justify-end md:order-none md:flex md:w-auto md:flex-1 md:flex-row">
                    {leftmenu.map((item, index) => (
                      <Fragment key={`${item.label}${index}`}>
                        {item.children?.length ? (
                          <DropdownMenu
                            menu={item}
                            items={item.children}
                            linkClass={linkClass}
                          />
                        ) : (
                          <Link href={item.href} className={linkClass}>
                            {item.label}
                          </Link>
                        )}
                      </Fragment>
                    ))}
                  </div>

                  <div className="flex w-full items-center justify-between md:w-auto">
                    <Link href="/" className="relative block h-10 w-44 md:h-11 md:w-48">
                      <Image
                        src={LogoImg}
                        alt={SITE_NAME}
                        priority
                        fill
                        className="object-contain object-left"
                        sizes="200px"
                      />
                    </Link>
                    <Disclosure.Button
                      aria-label="Toggle Menu"
                      className="ml-auto rounded-md p-2 text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden">
                      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                        {open ? (
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                          />
                        )}
                      </svg>
                    </Disclosure.Button>
                  </div>

                  <div className="order-2 hidden w-full flex-col items-center justify-start md:order-none md:flex md:w-auto md:flex-1 md:flex-row">
                    {rightmenu.map((item, index) => (
                      <Link
                        key={`${item.label}${index}`}
                        href={item.href}
                        className={linkClass}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Disclosure.Panel>
                  <div className="mt-4 flex w-full flex-col border-t border-charcoal/10 pt-3 md:hidden">
                    {mobilemenu.map((item, index) => (
                      <Fragment key={`${item.label}${index}`}>
                        {item.children?.length ? (
                          <DropdownMenu
                            menu={item}
                            items={item.children}
                            mobile
                            linkClass={linkClass}
                          />
                        ) : (
                          <Link
                            href={item.href}
                            className={cx(linkClass, "w-full py-3")}>
                            {item.label}
                          </Link>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </nav>
      </Container>
    </header>
  );
}

const DropdownMenu = ({ menu, items, mobile, linkClass }) => (
  <Menu as="div" className={cx("relative text-left", mobile && "w-full")}>
    {({ open }) => (
      <>
        <Menu.Button
          className={cx(
            linkClass,
            "inline-flex items-center gap-1",
            open && "text-accent",
            mobile && "w-full py-3"
          )}>
          <span>{menu.label}</span>
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <Menu.Items
            className={cx(
              "z-30 origin-top-left focus:outline-none md:absolute md:left-0 md:mt-2 md:w-56 md:rounded-sm md:border md:border-line md:bg-paper md:shadow-sm",
              mobile && "w-full pl-3"
            )}>
            <div className="py-2">
              {items.map((item, index) => (
                <Menu.Item key={`${item.title}${index}`}>
                  {({ active }) => (
                    <Link
                      href={item?.path || "#"}
                      className={cx(
                        "block px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-brand",
                        active ? "text-accent" : "text-charcoal/80"
                      )}>
                      {item.title}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </>
    )}
  </Menu>
);
