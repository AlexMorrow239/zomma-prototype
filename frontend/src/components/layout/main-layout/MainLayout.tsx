import { Outlet } from "react-router-dom";

import { NavBar } from "../navBar/NavBar";
import "./MainLayout.scss";
import { ReactElement } from "react";

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
