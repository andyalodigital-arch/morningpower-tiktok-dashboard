"use client";

import { useState, useMemo } from "react";

function fmt(n) {
  return Number(n || 0).toLocaleString("id-ID");
}

function fmtDate(createTime) {
  if (!createTime) return "-";
  try {
    return new Date(createTime * 1000).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function shortTitle(v) {
  const t = (v.title || v.video_description || "").trim();
  if (!t) return "(tanpa teks)";
  return t.length > 70 ? t.slice(0, 70) + "…" : t;
}

const COLUMNS = [
  { key: "create_time", label: "Tanggal", num: false },
  { key: "view_count", label: "Views", num: true },
  { key: "like_count", label: "Likes", num: true },
  { key: "comment_count", label: "Komen", num: true },
  { key: "share_count", label: "Share", num: true },
];

export default function PostTable({ videos }) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("create_time");
  const [sortDir, setSortDir] = useState("desc");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = videos;
    if (needle) {
      list = list.filter((v) =>
        ((v.title || "") + " " + (v.video_description || "")).toLowerCase().includes(needle)
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => ((a[sortKey] || 0) - (b[sortKey] || 0)) * dir);
  }, [videos, q, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const th = { padding: "10px 8px", textAlign: "left", color: "#8aa0c4", fontWeight: 600 };
  const td = { padding: "10px 8px", verticalAlign: "top" };
  const tdNum = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
  const arrow = (key) => (sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "");

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Post terbaru ({rows.length})</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari post (kata di caption)..."
          style={{
            marginLeft: "auto",
            padding: "8px 12px",
            minWidth: 240,
            background: "#0f1830",
            border: "1px solid #1e2c49",
            borderRadius: 8,
            color: "#e8eef9",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e2c49" }}>
              <th style={{ ...th, width: 56 }}></th>
              <th style={th}>Post</th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c.key)}
                  style={{
                    ...th,
                    textAlign: c.num ? "right" : "left",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    userSelect: "none",
                    color: sortKey === c.key ? "#cdd8ec" : "#8aa0c4",
                  }}
                  title="Klik untuk urutkan"
                >
                  {c.label}{arrow(c.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} style={{ borderBottom: "1px solid #16223b" }}>
                <td style={td}>
                  {v.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.cover_image_url}
                      alt=""
                      width={40}
                      height={56}
                      style={{ borderRadius: 6, objectFit: "cover", background: "#16223b" }}
                    />
                  ) : (
                    <div style={{ width: 40, height: 56, borderRadius: 6, background: "#16223b" }} />
                  )}
                </td>
                <td style={{ ...td, maxWidth: 360, color: "#cdd8ec" }}>{shortTitle(v)}</td>
                <td style={{ ...td, whiteSpace: "nowrap", color: "#8aa0c4" }}>{fmtDate(v.create_time)}</td>
                <td style={tdNum}>{fmt(v.view_count)}</td>
                <td style={tdNum}>{fmt(v.like_count)}</td>
                <td style={tdNum}>{fmt(v.comment_count)}</td>
                <td style={tdNum}>{fmt(v.share_count)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "16px 8px", color: "#8aa0c4" }}>Tidak ada post yang cocok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
