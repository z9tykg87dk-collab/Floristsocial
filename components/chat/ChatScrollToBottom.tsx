"use client";

import { useEffect, useRef } from "react";

export default function ChatScrollToBottom() {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, []);

  return <div ref={bottomRef} style={{ height: 16 }} />;
}
