import { useEffect, useState } from "react";
import { ArrowLeft, Download, LogOut, Search, Users, UserCheck, UserX, Clock3, Heart, Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { adminApi, publicApi } from "../lib/api";
import "./AdminPage.css";

const statusLabels = { attending: "Sẽ tham dự", declined: "Không tham dự", pending: "Chưa xác nhận" };

function formatDate(value) {
  if (!value) return "Chưa xác nhận";
  return new Date(value).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("graduation_admin_token") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("graduation_admin_name") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [stats, setStats] = useState({ total: 0, attending: 0, declined: 0, pending: 0 });
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const request = (config) => adminApi({ ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } });

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      request({ url: "/dashboard" }),
      request({ url: "/guests", params: { page, limit: 12, search, status: statusFilter || undefined } }),
    ]).then(([dashboard, list]) => {
      if (!active) return;
      setStats(dashboard.data);
      setGuests(list.data.guests);
      setPages(Math.max(1, list.data.pages));
    }).catch((err) => {
      if (!active) return;
      if (err.response?.status === 401) logout();
      else setError(err.response?.data?.error || "Không tải được dữ liệu quản trị.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  // `request` is intentionally recreated from the current token; the listed values define reloads.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, search, statusFilter, refreshKey]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await publicApi.post("/admin/login", { username, password });
      localStorage.setItem("graduation_admin_token", data.token);
      localStorage.setItem("graduation_admin_name", data.username);
      setUsername(data.username);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Không thể đăng nhập. Vui lòng thử lại.");
    }
  }

  function logout() {
    localStorage.removeItem("graduation_admin_token");
    localStorage.removeItem("graduation_admin_name");
    setToken("");
    setGuests([]);
    setStats({ total: 0, attending: 0, declined: 0, pending: 0 });
  }

  async function changeStatus(guest, status) {
    try {
      await request({ method: "PATCH", url: `/guests/${guest._id}`, data: { status } });
      setNotice(`Đã cập nhật trạng thái của ${guest.name}.`);
      refresh();
    } catch (err) { setError(err.response?.data?.error || "Không cập nhật được trạng thái."); }
  }

  function refresh() {
    setRefreshKey((value) => value + 1);
  }

  async function addGuest(event) {
    event.preventDefault();
    try {
      await request({ method: "POST", url: "/guests", data: { name: newName, status: "pending" } });
      setNewName("");
      setShowAdd(false);
      setNotice("Đã thêm khách mời vào danh sách.");
      setRefreshKey((value) => value + 1);
    } catch (err) { setError(err.response?.data?.error || "Không thêm được khách mời."); }
  }

  async function saveName(guest) {
    try {
      await request({ method: "PATCH", url: `/guests/${guest._id}`, data: { name: editingName } });
      setEditingId("");
      setNotice("Đã cập nhật tên khách mời.");
      setRefreshKey((value) => value + 1);
    } catch (err) { setError(err.response?.data?.error || "Không cập nhật được tên."); }
  }

  async function deleteGuest(guest) {
    if (!window.confirm(`Xóa ${guest.name} khỏi danh sách khách mời?`)) return;
    try {
      await request({ method: "DELETE", url: `/guests/${guest._id}` });
      setNotice(`Đã xóa ${guest.name}.`);
      setRefreshKey((value) => value + 1);
    } catch (err) { setError(err.response?.data?.error || "Không xóa được khách mời."); }
  }

  async function exportExcel() {
    try {
      const { data } = await request({ url: "/guests/export", responseType: "blob" });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "danh-sach-khach-moi.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch { setError("Không xuất được file Excel."); }
  }

  if (!token) {
    return (
      <main className="admin-shell admin-login-shell">
        <a className="admin-back" href="/"><ArrowLeft size={16} /> Về thiệp mời</a>
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="admin-brand-mark"><Users size={24} /></div>
          <p className="admin-kicker">QUẢN LÝ SỰ KIỆN</p>
          <h1>ĐĂNG NHẬP</h1>
          <p className="admin-muted">Đăng nhập để xem danh sách khách mời và lời chúc.</p>
          <label htmlFor="admin-user">TÊN ĐĂNG NHẬP</label>
          <input id="admin-user" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <label htmlFor="admin-password">MẬT KHẨU</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="admin-error">{error}</p>}
          <button className="gold-button admin-submit" type="submit">ĐĂNG NHẬP</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="admin-brand" href="/"><span className="admin-brand-mark"><Users size={20} /></span><span>GRADUATION<span className="gold">.</span><small>QUẢN TRỊ KHÁCH MỜI</small></span></a>
        <div className="admin-header-actions"><span>Xin chào, {username}</span><button className="admin-logout" onClick={logout}><LogOut size={15} /> Đăng xuất</button></div>
      </header>

      <section className="admin-content">
        <div className="admin-title-row"><div><p className="admin-kicker">TỔNG QUAN SỰ KIỆN</p><h1>KHÁCH MỜI & LỜI CHÚC</h1></div><button className="admin-export" onClick={exportExcel}><Download size={16} /> Xuất Excel</button></div>

        {error && <p className="admin-banner admin-error">{error}</p>}
        {notice && <p className="admin-banner admin-notice">{notice}<button onClick={() => setNotice("")} aria-label="Đóng">×</button></p>}

        <div className="admin-stat-grid">
          <StatCard icon={<Users />} label="TỔNG KHÁCH MỜI" value={stats.total} />
          <StatCard icon={<UserCheck />} label="SẼ THAM DỰ" value={stats.attending} />
          <StatCard icon={<UserX />} label="KHÔNG THAM DỰ" value={stats.declined} />
          <StatCard icon={<Clock3 />} label="CHƯA XÁC NHẬN" value={stats.pending} />
        </div>

        <div className="admin-list-panel">
          <div className="admin-list-heading"><div><h2>DANH SÁCH KHÁCH</h2><p>Lời chúc được lưu cùng phản hồi tham dự.</p></div><button className="admin-add" onClick={() => setShowAdd((value) => !value)}>{showAdd ? <X size={16} /> : <Plus size={16} />}{showAdd ? "Đóng" : "Thêm khách"}</button></div>
          {showAdd && <form className="admin-add-form" onSubmit={addGuest}><input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Họ tên khách mời" maxLength={100} required /><button type="submit" className="gold-button"><Check size={15} /> LƯU KHÁCH</button></form>}

          <div className="admin-filters"><label className="admin-search"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm theo tên khách..." /></label><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option value="">Tất cả trạng thái</option><option value="attending">Sẽ tham dự</option><option value="declined">Không tham dự</option><option value="pending">Chưa xác nhận</option></select></div>

          {loading ? <p className="admin-empty">Đang tải danh sách...</p> : guests.length === 0 ? <p className="admin-empty">Chưa có khách mời phù hợp.</p> : (
            <div className="admin-guest-list">
              {guests.map((guest) => <article className="admin-guest-card" key={guest._id}>
                <div className="guest-card-top">
                  <div className="guest-name-line">
                    {editingId === guest._id ? <><input className="guest-edit-input" value={editingName} onChange={(event) => setEditingName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveName(guest); }} autoFocus /><button className="icon-action" onClick={() => saveName(guest)} aria-label="Lưu tên"><Check size={16} /></button><button className="icon-action" onClick={() => setEditingId("")} aria-label="Hủy"><X size={16} /></button></> : <><h3>{guest.name}</h3><button className="icon-action" onClick={() => { setEditingId(guest._id); setEditingName(guest.name); }} aria-label="Sửa tên"><Pencil size={14} /></button></>}
                  </div>
                  <button className="icon-action delete-action" onClick={() => deleteGuest(guest)} aria-label={`Xóa ${guest.name}`}><Trash2 size={16} /></button>
                </div>
                <div className="guest-card-meta"><span className={`guest-status status-${guest.status}`}>{statusLabels[guest.status]}</span><span><Clock3 size={13} /> {formatDate(guest.respondedAt)}</span></div>
                <div className="guest-wish"><p><Heart size={14} /> LỜI CHÚC</p><blockquote>{guest.message?.trim() || "Khách chưa gửi lời chúc."}</blockquote></div>
                <label className="guest-status-control">Cập nhật trạng thái<select value={guest.status} onChange={(event) => changeStatus(guest, event.target.value)}><option value="attending">Sẽ tham dự</option><option value="declined">Không tham dự</option><option value="pending">Chưa xác nhận</option></select></label>
              </article>)}
            </div>
          )}
          <div className="admin-pagination"><span>Trang {page} / {pages}</span><div><button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Trước</button><button disabled={page >= pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>Tiếp</button></div></div>
        </div>
        <p className="admin-footer-note">Thông tin được lưu riêng tư trong cơ sở dữ liệu của bạn.</p>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return <article className="admin-stat-card"><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span><strong>{value}</strong></article>;
}
