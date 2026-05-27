import { useState, useRef } from "react";

interface FileEntry {
  id: string;
  name: string;
  size: string;
  encrypted: boolean;
  date: string;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function App() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [encrypt, setEncrypt] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload(filesList: FileList | null) {
    if (!filesList) return;
    setUploading(true);
    const newFiles: FileEntry[] = [];

    Array.from(filesList).forEach((file, i) => {
      setTimeout(() => {
        newFiles.push({
          id: randomId(),
          name: file.name,
          size: formatSize(file.size),
          encrypted: encrypt,
          date: new Date().toLocaleDateString(),
        });
        if (i === filesList.length - 1) {
          setFiles((prev) => [...newFiles, ...prev]);
          setUploading(false);
        }
      }, i * 300);
    });
  }

  function handleDelete(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <span style={{ color: "var(--cyan)" }}>◆</span> CyberVault
          </h1>
          <p style={{ color: "var(--gray)", fontSize: 13, marginTop: 4 }}>
            Zero-knowledge encrypted file storage
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <label style={styles.toggle}>
            <input
              type="checkbox"
              checked={encrypt}
              onChange={(e) => setEncrypt(e.target.checked)}
              style={{ accentColor: "var(--cyan)" }}
            />
            <span style={{ fontSize: 13, color: "var(--gray)" }}>Encrypt files</span>
          </label>
          <button onClick={() => inputRef.current?.click()} style={styles.uploadBtn}>
            + Upload
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            style={{ display: "none" }}
          />
        </div>
      </header>

      {uploading && (
        <div style={styles.uploadingBar}>
          <div style={styles.uploadingProgress}></div>
          <span style={{ fontSize: 13, color: "var(--cyan)", marginLeft: 12 }}>
            Encrypting & uploading...
          </span>
        </div>
      )}

      <div style={styles.stats}>
        {[
          { label: "Total Files", value: files.length },
          { label: "Encrypted", value: files.filter((f) => f.encrypted).length },
          { label: "Storage Used", value: "0.0 GB" },
          { label: "Status", value: "Secure" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ fontSize: 12, color: "var(--gray)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s.label}
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Orbitron, sans-serif" }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.fileArea}>
        <div style={styles.fileHeader}>
          <span style={{ flex: 3, color: "var(--gray)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</span>
          <span style={{ flex: 1, color: "var(--gray)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Size</span>
          <span style={{ flex: 1, color: "var(--gray)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</span>
          <span style={{ flex: 1, color: "var(--gray)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</span>
          <span style={{ width: 40 }}></span>
        </div>

        {files.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <p style={{ color: "var(--gray)", fontSize: 14 }}>Drop files or click Upload to add encrypted storage.</p>
          </div>
        )}

        {files.map((file) => (
          <div key={file.id} style={styles.fileRow}>
            <span style={{ flex: 3, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <span style={{ fontSize: 14 }}>{file.name}</span>
            </span>
            <span style={{ flex: 1, fontSize: 13, color: "var(--gray)" }}>{file.size}</span>
            <span style={{ flex: 1, fontSize: 13, color: "var(--cyan)" }}>
              {file.encrypted ? "🔒 Encrypted" : "📄 Plain"}
            </span>
            <span style={{ flex: 1, fontSize: 13, color: "var(--gray)" }}>{file.date}</span>
            <button onClick={() => handleDelete(file.id)} style={styles.deleteBtn}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--gray)" }}>
          <span>🔐 AES-256-GCM encryption</span>
          <span>⚡ Zero-knowledge architecture</span>
          <span>🔄 Real-time sync</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "40px 24px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    flexWrap: "wrap" as const,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Orbitron, sans-serif",
    fontWeight: 700,
    color: "#fff",
  },
  toggle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  uploadBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, var(--cyan), var(--purple))",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  uploadingBar: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    background: "rgba(0, 240, 255, 0.06)",
    border: "1px solid rgba(0, 240, 255, 0.15)",
    borderRadius: 10,
    marginBottom: 24,
    animation: "fade-in 0.3s ease-out",
  },
  uploadingProgress: {
    width: 16,
    height: 16,
    border: "2px solid var(--cyan)",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    flexShrink: 0,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "16px 20px",
    backdropFilter: "blur(12px)",
  },
  fileArea: {
    flex: 1,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    overflow: "hidden",
    backdropFilter: "blur(12px)",
  },
  fileHeader: {
    display: "flex",
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    background: "rgba(0,0,0,0.15)",
  },
  fileRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    transition: "background 0.2s",
  },
  deleteBtn: {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--gray)",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "Inter, sans-serif",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  footer: {
    marginTop: 24,
    padding: "16px 20px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    backdropFilter: "blur(12px)",
  },
};
