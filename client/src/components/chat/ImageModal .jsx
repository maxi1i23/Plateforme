import { useState } from "react"
import { Download, X } from "lucide-react"

const ImageModal = ({ src, alt, onClose }) => {
  if (!src) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}>
      <div className="absolute top-2 right-2 text-lg font-bold rounded flex gap-2 items-center cursor-pointer">
        <a
          href={src}
          download={alt}
          className="  text-white ">
          <Download />
        </a>

        <button
          onClick={onClose}
          className=" text-white px-2 py-1">
          <X/>
        </button>
      </div>


      <div className="relative p-4 bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[80vh] max-w-[80vw]" />
      </div>
    </div>
  )
}

export default ImageModal