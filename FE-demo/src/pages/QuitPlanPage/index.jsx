import React from "react";
import QuitPlanPage from "../../components/quitPlan/QuitPlanPage";
import { Navbar } from "../../components/home/homePage";

function QuitPlan() {
  return (
    <div className="quit-plan-page-wrapper">
      <Navbar />
      <QuitPlanPage />
    </div>
  );
}

export default QuitPlan;