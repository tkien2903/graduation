import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export default function PhotoImage({ src, alt, fallback, className = "", onError }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`photo-fallback ${className}`} role="img" aria-label={alt}>
        <ImageIcon size={25} strokeWidth={1.2} />
        <span>{fallback}</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => { setFailed(true); onError?.(); }} />;
}
