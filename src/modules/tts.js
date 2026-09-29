// Web Speech API — TTS + STT (pt-BR, Chrome Android)

export const tts = {
  supported: 'speechSynthesis' in window,

  speak(text, { rate = 1, pitch = 1 } = {}) {
    if (!this.supported) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang  = 'pt-BR'
    utt.rate  = rate
    utt.pitch = pitch
    const voices = window.speechSynthesis.getVoices()
    const ptBR = voices.find(v => v.lang === 'pt-BR')
    if (ptBR) utt.voice = ptBR
    window.speechSynthesis.speak(utt)
    return utt
  },

  stop() {
    if (this.supported) window.speechSynthesis.cancel()
  },
}

export const stt = {
  supported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  _rec: null,

  start(onResult, onEnd) {
    if (!this.supported) { onEnd?.('unsupported'); return }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    this._rec = new SR()
    this._rec.lang          = 'pt-BR'
    this._rec.continuous    = false
    this._rec.interimResults = false
    this._rec.onresult = e => {
      const transcript = e.results[0][0].transcript
      onResult(transcript)
    }
    this._rec.onend = () => onEnd?.('end')
    this._rec.onerror = e => onEnd?.(e.error)
    this._rec.start()
  },

  stop() {
    this._rec?.stop()
  },
}
