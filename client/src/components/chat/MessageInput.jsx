import { useRef, useEffect } from "react";
import { Paperclip, SendHorizonal, X } from "lucide-react";

const MessageInput = ({
  newMessage,
  setNewMessage,
  selectedFiles,
  setSelectedFiles, // Ajoute ceci dans les props parent
  handleSendMessage,
}) => {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize du textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() || selectedFiles.length > 0) {
        handleSendMessage();
      }
    }
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = null; // Reset input
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canSend = newMessage.trim() || selectedFiles.length > 0;

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      {/* Aperçu des fichiers sélectionnés */}
      {selectedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : null;

            return (
              <div
                key={index}
                className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {isImage ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-32">
                      {file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Supprimer le fichier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Zone de saisie */}
      <div className="flex items-end gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-600 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all pb-1 pr-1">
        {/* Bouton pièce jointe */}
        <button
          type="button"
          aria-label="Joindre un fichier"
          className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFilesChange}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip"
        />

        {/* Champ texte */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez un message..."
          className="flex-1 min-h-12 max-h-32 py-3 px-1 text-sm bg-transparent resize-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          style={{ scrollbarWidth: "thin" }}
        />

        {/* Bouton envoyer */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!canSend}
          aria-label="Envoyer le message"
          className={`p-3 rounded-full transition-all ${canSend
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              : "bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>

      {/* Info Enter */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Appuyez sur <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Entrée</kbd> pour envoyer •{" "}
        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Shift + Entrée</kbd> pour un saut de ligne
      </p>
    </div>
  );
};

export default MessageInput;