import { ReactElement } from "react";

import { Outlet } from "react-router-dom";

import { Navbar } from "../navBar/NavBar";
import "./MainLayout.scss";

export const MainLayout = (): ReactElement => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};
