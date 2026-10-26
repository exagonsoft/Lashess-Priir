"use client";
import NextLink from "next/link";
import { usePathname, useRouter, useParams as nextParams, useSearchParams as nextSearch } from "next/navigation";
import type { ComponentProps } from "react";
type Props = Omit<ComponentProps<typeof NextLink>, "href"> & { to: string };
export function Link({ to, ...props }: Props) { return <NextLink href={to} {...props} />; }
export function NavLink({ to, end = false, className, ...props }: Omit<Props, "className"> & { end?: boolean; className?: string | ((state: { isActive: boolean }) => string) }) {
 const pathname = usePathname();
 const isActive = pathname === to || (!end && to !== "/" && pathname.startsWith(to + "/"));
 return <NextLink href={to} aria-current={isActive ? "page" : undefined} className={typeof className === "function" ? className({ isActive }) : className} {...props} />;
}
export function useNavigate() { const router = useRouter(); return (to: string) => router.push(to); }
export function useLocation() { return { pathname: usePathname() }; }
export const useParams = nextParams;
export function useSearchParams() { return [nextSearch()] as const; }
