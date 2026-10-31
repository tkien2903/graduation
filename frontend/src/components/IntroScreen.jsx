
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function IntroScreen({ onOpen }) {
  const [typedText, setTypedText] = useState("");

  const message = "MỘT HÀNH TRÌNH KHÉP LẠI, MỘT CHƯƠNG MỚI BẮT ĐẦU...";

  useEffect(() => {
    let index = 0;

    const typing = setInterval(() => {
      index++;

      setTypedText(message.slice(0, index));

      if (index >= message.length) {
        clearInterval(typing);
      }
    }, 65);

    return () => clearInterval(typing);
  }, []);

  return (
    <motion.div
      className="intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <div className="intro-background"></div>

      <motion.div
        className="intro-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="intro-icon"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <Sparkles size={35} />
        </motion.div>

        <p className="intro-subtitle">
          MỘT DẤU MỐC ĐÁNG NHỚ
        </p>

        <h1 className="intro-title">
          LỜI MỜI
          <br />
          <span>TỐT NGHIỆP</span>
        </h1>

        <p className="intro-typing">
          {typedText}
          <span className="typing-cursor">|</span>
        </p>

        <p className="intro-description">
          Một ngày đặc biệt, một hành trình đáng nhớ.
          <br />
          Tôi muốn chia sẻ khoảnh khắc này cùng bạn.
        </p>

        <motion.button
          className="intro-button"
          onClick={onOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          MỞ THIỆP MỜI
          <ArrowRight size={18} />
        </motion.button>

        <p className="intro-footer">
          TRÂN TRỌNG KÍNH MỜI · NGUYỄN TRUNG KIÊN
        </p>
      </motion.div>
    </motion.div>
  );
}

export default IntroScreen;
