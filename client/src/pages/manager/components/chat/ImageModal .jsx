import { useState } from "react"
import { Download } from "lucide-react"

const ImageModal = ({ src, alt, onClose }) => {
  if (!src) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}>
      <div className="relative p-4 bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[80vh] max-w-[80vw]" />
        <a
          href={src}
          download={alt}
          className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          <Download />
        </a>
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-white text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default ImageModal
