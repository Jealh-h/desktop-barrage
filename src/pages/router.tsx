import React from "react";
import { Routes, Route } from "react-router";
import { Main } from "./main";
import { Barrage } from "./barrage";

export const RouterView = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/barrage" element={<Barrage />} />
    </Routes>
  );
};
