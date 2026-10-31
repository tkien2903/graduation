// Đặt ảnh trong frontend/public/images rồi chỉnh tên file tại đây.
// Hỗ trợ các định dạng trình duyệt đọc được như .jpg, .png, .webp.
const imagePath = (filename) => `${import.meta.env.BASE_URL}images/${encodeURIComponent(filename)}`;

export const PROFILE_PHOTO = imagePath("ava.jpg");

export const MEMORY_PHOTOS = [
  { src: imagePath("2024.jpg"), alt: "Tập thể lớp trong năm 2024" },
  { src: imagePath("IMG_2103.JPG"), alt: "Cùng bạn bè học tập trên giảng đường" },
  { src: imagePath("clb.jpg"), alt: "Kỷ niệm cùng câu lạc bộ cầu lông" },
  { src: imagePath("lhvh.jpg"), alt: "Một buổi sinh hoạt câu lạc bộ" },
  { src: imagePath("lhvh2.jpg"), alt: "Tập thể câu lạc bộ cầu lông" },
  { src: imagePath("gdtien.jpg"), alt: "Khoảnh khắc thi đấu cầu lông" },
  { src: imagePath("giải.jpg"), alt: "Trên sân đấu tại một giải cầu lông" },
  { src: imagePath("hc3.jpg"), alt: "Niềm vui sau khi nhận huy chương" },
  { src: imagePath("hihi.jpg"), alt: "Kỷ niệm tại nhà thi đấu" },
  { src: imagePath("smash.jpg"), alt: "Một pha cầu trên sân" },
  { src: imagePath("tn tmh.jpg"), alt: "Khoảnh khắc nhận giấy chứng nhận cùng bạn" },
  { src: imagePath("with tmh.jpg"), alt: "Niềm vui cùng đồng đội sau giải đấu" },
  { src: imagePath("pcn.jpg"), alt: "Dấu mốc trong nhiệm kỳ câu lạc bộ" },
  { src: imagePath("đhdb.jpg"), alt: "Tập thể bạn bè thời sinh viên" },
  { src: imagePath("dtrai.jpg"), alt: "Một khoảnh khắc đời thường thời sinh viên" },
];
