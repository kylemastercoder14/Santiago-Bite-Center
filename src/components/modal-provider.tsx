"use client";

import { useEffect } from "react";
import React, { useState } from "react";
import AdminModal from "./admin-modal";
import BranchModal from "./branch-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AdminModal />
      <BranchModal />
    </>
  );
};
