"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Renders modal overlays and lightboxes directly into document.body,
 * guaranteeing that position: fixed inset-0 is never constrained by
 * ancestor CSS transforms, perspectives, or containing blocks.
 */
export function Portal({ children }: PortalProps) {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}
