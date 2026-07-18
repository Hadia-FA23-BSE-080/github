'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Plus, Edit, Trash2, Eye, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { deleteBlog, publishBlog } from '@/lib/admin-actions';
import { createClient } from '@/lib/supabase/client';

const S = {
  btn: (color: string, bg: string): React.CSSProperties => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: bg, color, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" }),
  input: { width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, color: "#ddd", fontSize: 13, padding: "9px 12px 9px 38px", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
  th: { padding: "12px 16px", fontSize: 11, fontWeight: 600, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" as const, textAlign: "left" as const, borderBottom: "1px solid #222", background: "#141414" },
  td: { padding: "14px 16px", borderBottom: "1px solid #1e1e1e", verticalAlign: "middle" as const, fontSize: 13 },
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    published: { bg: "rgba(0,182,122,0.15)", color: "#00B67A" },
    draft:     { bg: "rgba(255,107,0,0.12)",  color: "#FF6B00" },
  };
  const s = map[status] || map.draft;
  return <span style={{ ...s, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{status || "draft"}</span>;
}

export default function AdminBlogsPage() {
  const [blogs,    setBlogs]    = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [debounced, setDebounced] = useState('');
  const [publishing, setPublishing] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 450);
    return () => clearTimeout(t);
  }, [search]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase.from('blogs').select('id, title, status, created_at, featured_image, categories(name)').order('created_at', { ascending: false });
    if (debounced) q = q.ilike('title', `%${debounced}%`);
    const { data, error } = await q;
    if (error) toast.error('Failed to load blogs');
    else setBlogs(data || []);
    setLoading(false);
  }, [debounced]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post permanently?')) return;
    try { await deleteBlog(id); toast.success('Deleted'); setBlogs(b => b.filter(x => x.id !== id)); }
    catch { toast.error('Delete failed'); }
  };

  const handlePublish = async (id: string) => {
    setPublishing(id);
    try {
      await publishBlog(id);
      toast.success('Published!');
      setBlogs(b => b.map(x => x.id === id ? { ...x, status: 'published', published_at: new Date().toISOString() } : x));
    } catch { toast.error('Publish failed'); }
    setPublishing(null);
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>Blog Posts</h1>
          <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>Manage articles, reviews, and insights.</p>
        </div>
        <Link href="/admin/blogs/new" style={S.btn("#fff", "#0055FE")}>
          <Plus style={{ width: 15, height: 15 }} /> Write Post
        </Link>
      </div>

      <div style={{ position: "relative", maxWidth: 320, marginBottom: 20 }}>
        <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#444" }} />
        <input style={S.input} placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Post", "Category", "Status", "Views", "Actions"].map((h, i) => (
                <th key={h} style={{ ...S.th, textAlign: i === 4 ? "right" : "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", color: "#444", padding: 40 }}>Loading posts…</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", color: "#444", padding: 40 }}>No posts found. <Link href="/admin/blogs/new" style={{ color: "#0055FE" }}>Write one</Link>.</td></tr>
            ) : blogs.map(blog => (
              <tr key={blog.id}
                onMouseEnter={e => (e.currentTarget.style.background = "#1e1e1e")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={S.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {blog.featured_image && (
                      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                        <img src={blog.featured_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: 600, color: "#ddd", margin: 0, fontSize: 13, maxWidth: 280, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{blog.title}</p>
                      <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0" }}>{new Date(blog.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td style={{ ...S.td, color: "#666" }}>{(blog.categories as any)?.name || "Uncategorized"}</td>
                <td style={S.td}><StatusBadge status={blog.status} /></td>
                <td style={{ ...S.td, color: "#555" }}>—</td>
                <td style={{ ...S.td, textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                    {/* Edit */}
                    <Link
                      href={`/admin/blogs/new?id=${blog.id}`}
                      title="Edit"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(0,85,254,0.1)", color: "#0055FE", border: "1px solid rgba(0,85,254,0.2)", textDecoration: "none" }}
                    >
                      <Edit style={{ width: 13, height: 13 }} />
                    </Link>

                    {/* Preview */}
                    <Link
                      href={`/blog/${blog.id}`}
                      target="_blank"
                      title="Preview"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(100,100,100,0.1)", color: "#888", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}
                    >
                      <Eye style={{ width: 13, height: 13 }} />
                    </Link>

                    {/* Publish (only if draft) */}
                    {blog.status !== 'published' && (
                      <button
                        onClick={() => handlePublish(blog.id)}
                        disabled={publishing === blog.id}
                        title="Publish"
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(0,182,122,0.1)", color: "#00B67A", border: "1px solid rgba(0,182,122,0.2)", cursor: "pointer" }}
                      >
                        <Globe style={{ width: 13, height: 13 }} />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(blog.id)}
                      title="Delete"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer" }}
                    >
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
