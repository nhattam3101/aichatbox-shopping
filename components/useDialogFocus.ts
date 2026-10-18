"use client";

import { useEffect, useRef } from "react";

type DialogEntry = { dialog: HTMLDivElement };
const dialogs: DialogEntry[] = [];
let bodyOverflow = "";
const inertBefore = new Map<HTMLElement, boolean>();

// Keep only the most recently opened dialog interactive, including nested overlays.
function updateBackground() {
  inertBefore.forEach((inert, element) => { element.inert = inert; });
  inertBefore.clear();
  const active = dialogs.at(-1)?.dialog;
  if (!active) return;
  let branch: HTMLElement = active;
  while (branch.parentElement) {
    for (const sibling of Array.from(branch.parentElement.children)) {
      if (sibling !== branch && sibling instanceof HTMLElement) {
        inertBefore.set(sibling, sibling.inert);
        sibling.inert = true;
      }
    }
    if (branch.parentElement === document.body) break;
    branch = branch.parentElement;
  }
}

/** Keep keyboard navigation inside a dialog, then return to its trigger. */
export function useDialogFocus(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialogs.length === 0) bodyOverflow = document.body.style.overflow;
    const entry = { dialog };
    dialogs.push(entry);
    updateBackground();
    document.body.style.overflow = "hidden";
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
    )).filter(element => element.getClientRects().length > 0);
    (controls()[0] ?? dialog).focus();
    const handleKey = (event: KeyboardEvent) => {
      if (dialogs.at(-1) !== entry) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); close.current(); return; }
      if (event.key !== "Tab") return;
      const items = controls();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      const wasTop = dialogs.at(-1) === entry;
      const index = dialogs.indexOf(entry);
      if (index >= 0) dialogs.splice(index, 1);
      updateBackground();
      if (dialogs.length === 0) document.body.style.overflow = bodyOverflow;
      if (wasTop && previous?.isConnected && !previous.closest("[inert]")) previous.focus();
    };
  }, [open]);
  return ref;
}
