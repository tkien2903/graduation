
import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  MapPin,
  CalendarDays,
  Clock,
  ArrowDown,
  Heart,
  Menu,
  X,
} from "lucide-react";

import IntroScreen from "./components/IntroScreen";
import AdminPage from "./components/AdminPage";
import PhotoImage from "./components/PhotoImage";
import { MEMORY_PHOTOS, PROFILE_PHOTO } from "./config/images";
import "./App.css";

// ===================================
// THÔNG TIN CÁ NHÂN - CHỈNH TẠI ĐÂY
// ===================================

const PROFILE = {
  name: "KIÊN",
  fullName: "Nguyễn Trung Kiên",
  university: "HỌC VIỆN HÀNG KHÔNG VIỆT NAM",
  major: "Công Nghệ Thông Tin",
  graduationDate: "2027-06-30T08:00:00+07:00",
  ceremonyDate: "30.06.2027",
  ceremonyTime: "08:00",
  location:
    "Cơ sở 2, 18A Cộng Hòa, Quận Tân Bình, TP. Hồ Chí Minh",
};

// ===================================
// ĐẾM NGƯỢC NGÀY TỐT NGHIỆP
// ===================================

function Countdown() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(PROFILE.graduationDate).getTime();

    const updateCountdown = () => {
      const distance = target - Date.now();

      if (distance <= 0) {
        setTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: "NGÀY", value: time.days },
    { label: "GIỜ", value: time.hours },
    { label: "PHÚT", value: time.minutes },
    { label: "GIÂY", value: time.seconds },
  ];

  return (
    <div className="countdown">
      {items.map((item) => (
        <div className="countdown-item" key={item.label}>
          <span>{String(item.value).padStart(2, "0")}</span>
          <small>{item.label}</small>
        </div>
      ))}
    </div>
  );
}

// ===================================
// THANH ĐIỀU HƯỚNG
// ===================================

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    ["TRANG CHỦ", "#home"],
    ["GIỚI THIỆU", "#about"],
    ["HÀNH TRÌNH", "#journey"],
    ["KỶ NIỆM", "#memories"],
    ["BUỔI LỄ", "#ceremony"],
    ["XÁC NHẬN", "#rsvp"],
  ];

  return (
    <nav className="navbar">
      <a href="#home" className="nav-logo">
        <GraduationCap size={25} />
        <span>TỐT NGHIỆP<span className="gold">.</span></span>
      </a>

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Mở hoặc đóng menu"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        {links.map(([label, href]) => (
          <a
            href={href}
            key={label}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ===================================
// TIÊU ĐỀ CÁC PHẦN
// ===================================

function SectionTitle({ subtitle, title }) {
  return (
    <div className="section-title">
      <p>{subtitle}</p>
      <h2>{title}</h2>
      <div className="title-line"></div>
    </div>
  );
}

// ===================================
// GIAO DIỆN WEBSITE CHÍNH
// ===================================

function MainWebsite() {
  const [failedMemoryPhotos, setFailedMemoryPhotos] = useState(() => new Set());

  return (
    <motion.div
      className="website"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <Navbar />

      {/* TRANG CHỦ */}
      <section className="hero" id="home">
        <div className="hero-background"></div>

        <div className="hero-content">
          <motion.p
            className="hero-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            KHỞI ĐẦU MỘT HÀNH TRÌNH MỚI
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            MỘT CHƯƠNG
            <br />
            <span>MỚI BẮT ĐẦU.</span>
          </motion.h1>

          <p className="hero-name">{PROFILE.fullName}</p>

          <p className="hero-major">
            {PROFILE.major} · KHÓA 2023 - 2027
          </p>

          <div className="hero-actions">
            <a href="#ceremony" className="gold-button">
              KHÁM PHÁ THIỆP MỜI
            </a>

            <a href="#about" className="text-button">
              TÌM HIỂU VỀ TÔI <ArrowDown size={15} />
            </a>
          </div>
        </div>

        <div className="hero-side-text">
          DẤU MỐC 2027 · HÀNH TRÌNH ĐÁNG NHỚ
        </div>

        <div className="hero-bottom">
          <span>CUỘN XUỐNG ĐỂ KHÁM PHÁ</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* ĐẾM NGƯỢC */}
      <section className="countdown-section">
        <p className="section-eyebrow">
          KHOẢNH KHẮC ĐANG ĐẾN GẦN
        </p>

        <h2>ĐẾM NGƯỢC ĐẾN NGÀY TỐT NGHIỆP</h2>

        <Countdown />
      </section>

      {/* GIỚI THIỆU */}
      <section className="about section" id="about">
        <div className="about-image">
          <div className="image-frame">
            <PhotoImage
              src={PROFILE_PHOTO}
              alt={`Ảnh chân dung ${PROFILE.fullName}`}
              fallback="THÊM ẢNH CHÂN DUNG"
            />
          </div>

          <span className="image-caption">
            MỘT KHOẢNH KHẮC TRONG HÀNH TRÌNH · 2026
          </span>
        </div>

        <div className="about-content">
          <SectionTitle
            subtitle="ĐÔI LỜI GIỚI THIỆU"
            title="VỀ TÔI."
          />

          <p className="about-name">{PROFILE.fullName}</p>

          <p className="about-description">
            Từ niềm đam mê đến những dấu ấn đáng nhớ, cầu lông đã trở thành một phần không thể thiếu trong hành trình sinh viên của tôi. Đây là nơi lưu giữ những trận đấu, những thành tích, những người đồng đội và cả những trải nghiệm quý giá trong suốt thời gian đồng hành cùng Câu lạc bộ Cầu lông Học viện Hàng không Việt Nam.
          </p>

          <div className="about-info">
            <div>
              <span>TRƯỜNG ĐẠI HỌC</span>
              <strong>{PROFILE.university}</strong>
            </div>

            <div>
              <span>CHUYÊN NGÀNH</span>
              <strong>{PROFILE.major}</strong>
            </div>

            <div>
              <span>NĂM TỐT NGHIỆP</span>
              <strong>2027</strong>
            </div>
          </div>
        </div>
      </section>

      {/* HÀNH TRÌNH */}
      <section className="journey section" id="journey">
        <SectionTitle
          subtitle="MỖI BƯỚC ĐI ĐỀU CÓ Ý NGHĨA"
          title="HÀNH TRÌNH CỦA TÔI."
        />

        <div className="timeline">
          {[
            [
              "2023",
              "NHỮNG BƯỚC ĐẦU TIÊN TRÊN GIẢNG ĐƯỜNG ĐẠI HỌC",
              "Bắt đầu với một chặng đường mới với nhiều điều để khám phá và học hỏi, tham gia câu lạc bộ cầu lông và tạo nên những kỷ niệm đáng nhớ.",
            ],
            [
              "2024",
              "TIẾP TỤC HÀNH TRÌNH",
              "Những trải nghiệm mới, tình bạn đẹp và cả những giải đấu cầu lông đầy thử thách, giúp tôi trưởng thành hơn trong học tập và cuộc sống.",
            ],
            [
              "2025",
              "PHÁT TRIỂN BẢN THÂN",
              "Không ngừng học hỏi, phát triển bản thân và tạo nên những kỷ niệm đáng nhớ trong hành trình đại học, từ những buổi học đến những trận đấu cầu lông đầy tiếng cười .",
            ],
            [
              "2026",
              "TRƯỞNG THÀNH HƠN VÀ SẴN SÀNG CHO TƯƠNG LAI",
              "Dừng bước tại VBC, truyền cảm hứng cho thế hệ sau.",
            ],
            [
              "2027",
              "CHƯƠNG MỚI BẮT ĐẦU",
              "Khép lại những năm tháng đại học và sẵn sàng cho tương lai.",
            ],
          ].map(([year, title, description], index) => (
            <motion.div
              className="timeline-item"
              key={year}
              initial={{ opacity: 0, x: index % 2 ? 35 : -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="timeline-year">{year}</span>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* KỶ NIỆM */}
      <section className="memories section" id="memories">
        <SectionTitle
          subtitle="LƯU GIỮ NHỮNG KHOẢNH KHẮC"
          title="KỶ NIỆM."
        />

        <div className="gallery">
          {MEMORY_PHOTOS.filter((photo) => !failedMemoryPhotos.has(photo.src)).map((photo, index) => (
              <motion.div
                className="gallery-item"
                key={photo.src}
                whileHover={{ scale: 1.035 }}
              >
                <PhotoImage
                  src={photo.src}
                  alt={photo.alt}
                  fallback=""
                  onError={() => setFailedMemoryPhotos((failed) => new Set(failed).add(photo.src))}
                />
                <span>{photo.caption || `KỶ NIỆM 0${index + 1}`}</span>
              </motion.div>
          ))}
        </div>
      </section>

      {/* THÔNG TIN BUỔI LỄ */}
      <section className="ceremony section" id="ceremony">
        <SectionTitle
          subtitle="HÃY LƯU LẠI NGÀY ĐẶC BIỆT NÀY"
          title="LỄ TỐT NGHIỆP."
        />

        <div className="ceremony-card">
          <GraduationCap size={42} className="ceremony-icon" />

          <p className="ceremony-date">{PROFILE.ceremonyDate}</p>

          <h3>LỄ TỐT NGHIỆP CỦA TÔI</h3>

          <div className="ceremony-details">
            <div>
              <CalendarDays />
              <span>{PROFILE.ceremonyDate}</span>
            </div>

            <div>
              <Clock />
              <span>{PROFILE.ceremonyTime}</span>
            </div>

            <div>
              <MapPin />
              <span>{PROFILE.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* XÁC NHẬN THAM DỰ */}
      <section className="rsvp section" id="rsvp">
        <SectionTitle
          subtitle="TRÂN TRỌNG KÍNH MỜI"
          title="HẸN GẶP BẠN NHÉ."
        />

        <p className="rsvp-description">
          Sự hiện diện của bạn sẽ khiến ngày đặc biệt này
          của tôi trở nên ý nghĩa và đáng nhớ hơn rất nhiều.
        </p>

        <RSVPForm />
      </section>

      {/* CHÂN TRANG */}
      <footer className="footer">
        <Heart size={17} />
        <p>ĐƯỢC TẠO BẰNG TẤT CẢ YÊU THƯƠNG · {PROFILE.fullName}</p>
        <span>LỄ TỐT NGHIỆP 2027</span>
      </footer>
    </motion.div>
  );
}

// ===================================
// BIỂU MẪU XÁC NHẬN - CHƯA KẾT NỐI DATABASE
// ===================================

function RSVPForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("attending");
  const [wish, setWish] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const { data: result } = await axios.post("/api/rsvp", {
        name: name.trim(),
        status,
        message: wish.trim(),
      });
      setResult(result);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Không thể kết nối máy chủ. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return <RSVPResult result={result} status={status} />;
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <label htmlFor="guest-name">HỌ VÀ TÊN CỦA BẠN</label>

      <input
        id="guest-name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setMessage("");
        }}
        placeholder="Nhập họ và tên của bạn..."
      />

      <label htmlFor="guest-wish">LỜI CHÚC GỬI ĐẾN KIÊN <span>(KHÔNG BẮT BUỘC)</span></label>

      <textarea
        id="guest-wish"
        value={wish}
        maxLength={500}
        onChange={(event) => {
          setWish(event.target.value);
          setMessage("");
        }}
        placeholder="Viết vài lời chúc cho ngày đặc biệt này..."
        rows={4}
      />
      <small className="wish-counter">{wish.length}/500</small>

      <label>BẠN CÓ THỂ THAM DỰ KHÔNG?</label>

      <div className="rsvp-options">
        <button
          type="button"
          className={status === "attending" ? "selected" : ""}
          onClick={() => {
            setStatus("attending");
            setMessage("");
          }}
        >
          CÓ, TÔI SẼ THAM DỰ
        </button>

        <button
          type="button"
          className={status === "declined" ? "selected" : ""}
          onClick={() => {
            setStatus("declined");
            setMessage("");
          }}
        >
          RẤT TIẾC, TÔI KHÔNG THỂ
        </button>
      </div>

      <button type="submit" className="gold-button submit-button" disabled={submitting}>
        {submitting ? "ĐANG GỬI..." : "XÁC NHẬN THAM DỰ"}
      </button>

      {message && <p className="rsvp-message">{message}</p>}
    </form>
  );
}

function RSVPResult({ result, status }) {
  useEffect(() => {
    document.getElementById("rsvp-result")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const confirmedAt = result.respondedAt
    ? new Date(result.respondedAt).toLocaleString("vi-VN", { dateStyle: "long", timeStyle: "short" })
    : "Vừa xong";

  return (
    <motion.div
      id="rsvp-result"
      className="rsvp-result"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
    >
      <div className="result-mark"><Heart size={24} /></div>
      <p className="result-eyebrow">XÁC NHẬN ĐÃ ĐƯỢC GHI NHẬN</p>
      <h3>{status === "attending" ? "HẸN GẶP BẠN NHÉ." : "CẢM ƠN BẠN ĐÃ PHẢN HỒI."}</h3>
      <p className="result-thanks">Cảm ơn <strong>{result.name}</strong> đã dành thời gian gửi lời hồi đáp và lời chúc đến Kiên.</p>

      <div className="result-details">
        <div><span>TRẠNG THÁI</span><strong>{status === "attending" ? "SẼ THAM DỰ" : "KHÔNG THỂ THAM DỰ"}</strong></div>
        <div><span>THỜI GIAN XÁC NHẬN</span><strong>{confirmedAt}</strong></div>
        <div><span>THỜI GIAN BUỔI LỄ</span><strong>{PROFILE.ceremonyDate} · {PROFILE.ceremonyTime}</strong></div>
        <div><span>ĐỊA ĐIỂM</span><strong>{PROFILE.location}</strong></div>
      </div>

      <p className="result-closing">Sự quan tâm của bạn là món quà ý nghĩa với Kiên. Hẹn gặp bạn trong ngày tốt nghiệp!</p>
      <a className="gold-button result-home" href="#home">QUAY LẠI THIỆP MỜI</a>
    </motion.div>
  );
}

// ===================================
// APP ROOT
// ===================================

export default function App() {
  const [opened, setOpened] = useState(false);

  if (window.location.pathname.startsWith("/admin")) {
    return <AdminPage />;
  }

  return (
    <AnimatePresence mode="wait">
      {!opened ? (
        <IntroScreen
          key="intro"
          onOpen={() => setOpened(true)}
        />
      ) : (
        <MainWebsite key="website" />
      )}
    </AnimatePresence>
  );
}
