import { ReactElement } from "react";

import { Outlet } from "react-router-dom";

import { NavBar } from "../navbar/NavBar";
import "./MainLayout.scss";

export const MainLayout = (): ReactElement => {
  return (
    <div className="layout">
      <NavBar />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};
