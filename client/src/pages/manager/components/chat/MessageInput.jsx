import { useRef } from "react"
import { Paperclip, Send } from "lucide-react"

const MessageInput = ({ newMessage, setNewMessage, selectedFiles, handleFilesChange, handleSendMessage }) => {

  const fileInputRef = useRef(null)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage()
    }
  }

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        {/* Bouton fichiers */}
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          onClick={() => fileInputRef.current.click()}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />

        {/* Zone texte */}
        <textarea
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Écrire un message..."
          className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 
            px-4 py-2 text-sm bg-white dark:bg-gray-900 dark:text-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Envoyer */}
        <button
          onClick={handleSendMessage}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Fichiers sélectionnés */}
      {selectedFiles.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedFiles.map((file, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              {file.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessageInput