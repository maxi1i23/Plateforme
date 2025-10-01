import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"

const MessageList = ({ messages, user, selectedGroupe, getMessage, getGroupeMessage }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-400 italic">
            {selectedGroupe ? "Aucun message dans ce groupe" : "Commencez la conversation"}
          </p>
        </div>
      ) : (
        messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isOwn={msg.idutilisateurexpediteur === user.idutilisateur
            }
            getMessage={getMessage}
            getGroupeMessage={getGroupeMessage}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList