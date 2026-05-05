"use client";

import { useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { sendAudioMessage } from "@/app/florist-chat/actions/sendAudioMessage";

export default function VoiceRecorder({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    if (recording || uploading) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    chunksRef.current = [];

    const recorder = new MediaRecorder(stream, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      setUploading(true);

      try {
        const audioBlob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("conversation_id", conversationId);
        formData.append("audio", audioBlob, `audio-${Date.now()}.webm`);

        await sendAudioMessage(formData);
        router.refresh();
      } catch (error) {
        console.error("AUDIO SEND ERROR", error);
      } finally {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        chunksRef.current = [];
        setRecording(false);
        setUploading(false);
      }
    };

    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    if (!recording) return;
    recorderRef.current?.stop();
  }

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={recording ? stopRecording : startRecording}
        disabled={uploading}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid #e5e7eb",
          background: recording ? "#ef4444" : uploading ? "#f59e0b" : "#fff",
          color: recording || uploading ? "#fff" : "#111827",
          cursor: uploading ? "not-allowed" : "pointer",
          display: "grid",
          placeItems: "center",
          boxShadow: recording
            ? "0 0 0 6px rgba(239,68,68,0.16)"
            : "0 2px 8px rgba(0,0,0,0.04)",
          transition: "all 160ms ease",
        }}
      >
        {uploading ? (
          <Loader2 size={18} />
        ) : recording ? (
          <Square size={16} fill="currentColor" />
        ) : (
          <Mic size={18} />
        )}
      </button>

      {recording && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: -30,
            background: "#ef4444",
            color: "#fff",
            padding: "7px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(239,68,68,0.28)",
          }}
        >
          Spelar in...
        </div>
      )}

      {uploading && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: -32,
            background: "#f59e0b",
            color: "#fff",
            padding: "7px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 20px rgba(245,158,11,0.28)",
          }}
        >
          Laddar upp...
        </div>
      )}
    </div>
  );
}
