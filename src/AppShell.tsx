import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Cube, Storefront, BookOpenText, Info } from "@phosphor-icons/react";
import { PageTemplate, SidebarItem, Tab } from "@node42/ui-kit";

// Two-tab report shell: "Product & Functional Promise" and "Markets" are the
// primary structure; Glossary and About stay reachable. The market drilldown
// lives under the Markets tab (so /markets/:naics keeps Markets active).

interface TabDef {
  label: string;
  path: string;
  match: (pathname: string) => boolean;
  icon: ReactNode;
}

const TABS: TabDef[] = [
  {
    label: "Product & Functional Promise",
    path: "/product",
    match: (p) => p === "/" || p.startsWith("/product"),
    icon: <Cube size={16} weight="regular" />,
  },
  {
    label: "Markets",
    path: "/markets",
    match: (p) => p.startsWith("/markets"),
    icon: <Storefront size={16} weight="regular" />,
  },
  {
    label: "Glossary",
    path: "/glossary",
    match: (p) => p.startsWith("/glossary"),
    icon: <BookOpenText size={16} weight="regular" />,
  },
  {
    label: "About",
    path: "/about",
    match: (p) => p.startsWith("/about"),
    icon: <Info size={16} weight="regular" />,
  },
];

interface AppShellProps {
  title: string;
  description?: ReactNode;
  breadcrumb?: ReactNode;
  titleAside?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  title,
  description,
  breadcrumb,
  titleAside,
  children,
}: AppShellProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabStrip = (
    <div
      style={{
        display: "flex",
        gap: "var(--space-300)",
        borderBottom: "1px solid var(--border-default-default)",
        flexWrap: "wrap",
      }}
    >
      {TABS.map((t) => (
        <Tab
          key={t.path}
          selected={t.match(pathname)}
          prefixIcon={t.icon}
          onClick={() => navigate(t.path)}
        >
          {t.label}
        </Tab>
      ))}
    </div>
  );

  const sidebar = (
    <>
      {TABS.map((t) => (
        <SidebarItem
          key={t.path}
          label={t.label}
          icon={t.icon}
          selected={t.match(pathname)}
          onClick={() => navigate(t.path)}
        />
      ))}
    </>
  );

  return (
    <PageTemplate
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      beforeTitle={tabStrip}
      titleAside={titleAside}
      sidebar={sidebar}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-700)",
          marginTop: "var(--space-600)",
        }}
      >
        {children}
      </div>
    </PageTemplate>
  );
}

export default AppShell;
