import { navigate } from '../modules/router.js'
import { supabase } from '../modules/supabase.js'
import { tts, stt } from '../modules/tts.js'
import { parseIntent } from '../modules/intent.js'

const GREET = 'Olá! Sou a Lucca. Para onde você quer ir hoje?'

export function renderChat(el) {
  el.innerHTML = `
    <div class="chat-screen">
      <div class="chat-header">
        <button class="chat-back" onclick="history.back()">←</button>
        <div class="chat-avatar">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="#F5A623"/>
            <circle cx="14" cy="14" r="4" fill="#fff"/>
          </svg>
        </div>
        <div class="chat-title-block">
          <span class="chat-name">Lucca</span>
          <span class="chat-status">Assistente de mobilidade</span>
        </div>
        <button class="chat-more" title="Mais opções">⋮</button>
      </div>

      <div class="chat-messages" id="chat-messages">
        <div class="chat-bubble lucca">${GREET}</div>
      </div>

      <div class="chat-input-bar">
        <div class="chat-field-wrap">
          <input class="chat-field" id="chat-field"
            placeholder="Pergunte à Lucca..."
            autocomplete="off">
        </div>
        <button class="chat-mic" id="chat-mic" title="Voz">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
          </svg>
        </button>
        <button class="chat-send" id="chat-send" title="Enviar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `

  const field    = el.querySelector('#chat-field')
  const sendBtn  = el.querySelector('#chat-send')
  const micBtn   = el.querySelector('#chat-mic')
  const messages = el.querySelector('#chat-messages')

  setTimeout(() => tts.speak(GREET), 400)

  const send = () => {
    const text = field.value.trim()
    if (!text) return
    field.value = ''
    addBubble(messages, text, 'user')
    processMessage(messages, text)
  }

  sendBtn.addEventListener('click', send)
  field.addEventListener('keydown', e => { if (e.key === 'Enter') send() })

  let listening = false
  micBtn.addEventListener('click', () => {
    if (listening) { stt.stop(); return }
    listening = true
    micBtn.classList.add('listening')
    stt.start(
      (text) => {
        field.value = text
        listening = false
        micBtn.classList.remove('listening')
        send()
      },
      () => {
        listening = false
        micBtn.classList.remove('listening')
      }
    )
  })
}

function addBubble(container, text, who) {
  const div = document.createElement('div')
  div.className = `chat-bubble ${who}`
  div.textContent = text
  container.appendChild(div)
  container.scrollTop = container.scrollHeight
  return div
}

function addTyping(container) {
  const div = document.createElement('div')
  div.className = 'chat-bubble lucca typing'
  div.innerHTML = '<span></span><span></span><span></span>'
  container.appendChild(div)
  container.scrollTop = container.scrollHeight
  return div
}

async function processMessage(container, text) {
  const typing = addTyping(container)
  const intent = parseIntent(text)

  const reply = await buildReply(intent, text)
  typing.remove()
  addBubble(container, reply, 'lucca')
  tts.speak(reply)
}

const chatHistory = []

async function buildReply(intent, rawText) {
  // Tenta Haiku primeiro
  try {
    const res = await fetch(`${__SUPABASE_URL__}/functions/v1/lucca-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${__SUPABASE_ANON_KEY__}`,
      },
      body: JSON.stringify({
        message: rawText,
        history: chatHistory.slice(-10),
      }),
    })
    if (res.ok) {
      const { reply } = await res.json()
      if (reply) {
        chatHistory.push({ role: 'user', content: rawText })
        chatHistory.push({ role: 'assistant', content: reply })
        return reply
      }
    }
  } catch { /* fallback abaixo */ }

  // Fallback determinístico
  switch (intent.intent) {
    case 'ROUTE':
      return `Para planejar a rota de ${intent.origin ?? 'sua origem'} para ${intent.destination ?? 'seu destino'}, use a tela de rotas.`
    case 'FARE':
      return 'A tarifa do metrô e CPTM em São Paulo é R$ 5,00 (bilhete único). Integração com ônibus no mesmo ticket por até 3 horas.'
    case 'DISRUPTION': {
      try {
        const { data } = await supabase
          .from('metro_disruptions')
          .select('title, severity')
          .is('ends_at', null)
          .limit(3)
        if (data?.length) {
          return `Há ${data.length} ocorrência(s) ativa(s): ${data.map(d => d.title).join('; ')}.`
        }
      } catch { /* ignore */ }
      return 'Não há ocorrências ativas no momento. Todas as linhas operando normalmente.'
    }
    case 'GREET':
      return 'Olá! Posso ajudar com rotas, tarifas ou o que está acontecendo no metrô agora.'
    default:
      return 'Posso ajudar com rotas, tarifas e informações sobre o transporte público de São Paulo.'
  }
}

export const chatCSS = `
.chat-screen { display: flex; flex-direction: column; height: 100vh; background: #fff; }

.chat-header {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
  background: #fff; flex-shrink: 0;
}
.chat-back { background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #0f172a; }
.chat-avatar {
  width: 40px; height: 40px; background: #0f2d52;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.chat-title-block { flex: 1; display: flex; flex-direction: column; }
.chat-name { font-size: .95rem; font-weight: 700; color: #0f172a; }
.chat-status { font-size: .75rem; color: #64748b; }
.chat-more { background: none; border: none; font-size: 1.3rem; cursor: pointer; color: #64748b; }

.chat-messages {
  flex: 1; overflow-y: auto; padding: 20px 16px;
  display: flex; flex-direction: column; gap: 12px;
  background: #f8fafc;
}
.chat-bubble {
  max-width: 80%; padding: 12px 16px;
  border-radius: 18px; font-size: .9rem; line-height: 1.5;
  word-break: break-word;
}
.chat-bubble.lucca {
  background: #fff; color: #0f172a;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
  align-self: flex-start;
}
.chat-bubble.user {
  background: #0f2d52; color: #fff;
  border-bottom-right-radius: 4px;
  align-self: flex-end;
}
.chat-bubble.typing {
  display: flex; align-items: center; gap: 5px;
  padding: 14px 18px;
}
.chat-bubble.typing span {
  width: 7px; height: 7px; border-radius: 50%;
  background: #94a3b8; animation: dot-bounce 1.2s infinite ease-in-out;
}
.chat-bubble.typing span:nth-child(2) { animation-delay: .2s; }
.chat-bubble.typing span:nth-child(3) { animation-delay: .4s; }
@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(1); opacity: .6; }
  40%            { transform: scale(1.3); opacity: 1; }
}

.chat-input-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; padding-bottom: max(12px, env(safe-area-inset-bottom));
  background: #fff; border-top: 1px solid #f1f5f9; flex-shrink: 0;
}
.chat-field-wrap { flex: 1; }
.chat-field {
  width: 100%; box-sizing: border-box;
  border: 1.5px solid #e2e8f0; border-radius: 24px;
  padding: 11px 18px; font-size: .9rem;
  outline: none; transition: border-color .15s;
}
.chat-field:focus { border-color: #0f2d52; }
.chat-mic, .chat-send {
  width: 42px; height: 42px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: background .15s;
}
.chat-mic { background: #f1f5f9; color: #0f2d52; }
.chat-mic.listening { background: #fee2e2; color: #ef4444; animation: mic-pulse 1s infinite; }
.chat-send { background: #0f2d52; color: #fff; }
.chat-send:hover { background: #1a3f6f; }
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,.4); }
  50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
}
`
