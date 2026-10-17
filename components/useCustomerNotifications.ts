"use client";
import { useEffect, useState } from "react";
import { CUSTOMER_DATA_EVENT } from "@/data/orders";
import { getNotifications, type CustomerNotification } from "@/data/notifications";

export function useCustomerNotifications() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => { if (active) { setNotifications(getNotifications(Date.now())); setLoaded(true); } };
    queueMicrotask(refresh);
    const interval = setInterval(refresh, 15000);
    for (const event of [CUSTOMER_DATA_EVENT, "storage", "focus"]) window.addEventListener(event, refresh);
    return () => { active = false; clearInterval(interval); for (const event of [CUSTOMER_DATA_EVENT, "storage", "focus"]) window.removeEventListener(event, refresh); };
  }, []);
  return { notifications, loaded, unreadCount: notifications.filter(notification => !notification.read).length };
}
