import React from "react";
import TopBar from "../components/TopBar";
import AssetsModule from "../components/AssetsModule";

export default function PatrimonioPage({ onOpenSidebar }) {
  return (
    <div>
      <TopBar title="Patrimônio" onOpenSidebar={onOpenSidebar} />
      <div className="max-w-xl">
        <AssetsModule />
      </div>
    </div>
  );
}
