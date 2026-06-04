import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Activity,
  Zap,
  Brain,
  MessageSquare,
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/voice/ara')({
  component: AraVoiceAgent,
})

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function AraVoiceAgent() {
  const [connected, setConnected] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [stats, setStats] = useState({
    connections: 0,
    totalTokens: 0,
    memoryOperations: 0,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const connect = () => {
    // Connect to Ara voice agent WebSocket
    const ws = new WebSocket('wss://ara-openmemory.collabmind.dev')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('✅ Connected to Ara')
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case 'ara.session':
            setSessionId(data.sessionId)
            addMessage('assistant', 'Hi! I\'m Ara, your OpenMemory voice assistant. How can I help you today?')
            break

          case 'ara.transcript':
            setTranscript((prev) => prev + data.delta)
            break

          case 'ara.response_done':
            if (transcript) {
              addMessage('assistant', transcript)
              setTranscript('')
            }
            if (data.usage) {
              setStats((prev) => ({
                ...prev,
                totalTokens: prev.totalTokens + (data.usage.total_tokens || 0),
              }))
            }
            break

          case 'ara.audio':
            // TODO: Decode and play audio
            // const pcm = atob(data.delta)
            break

          case 'ara.speech_started':
            console.log('🎙️ User started speaking')
            break

          case 'ara.error':
            console.error('❌ Ara error:', data.message)
            addMessage('assistant', `Error: ${data.message}`)
            break

          case 'ara.disconnected':
            setConnected(false)
            break
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }

    ws.onclose = () => {
      console.log('❌ Disconnected from Ara')
      setConnected(false)
      setSessionId(null)
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: new Date(),
      },
    ])
  }

  const sendText = () => {
    if (!wsRef.current || !inputText.trim()) return

    addMessage('user', inputText)

    wsRef.current.send(
      JSON.stringify({
        type: 'text',
        text: inputText,
      })
    )

    setInputText('')
  }

  const toggleRecording = () => {
    if (!connected) return

    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      // TODO: Stop microphone and send final audio
    } else {
      // Start recording
      setIsRecording(true)
      // TODO: Start microphone and stream audio
      console.log('🎙️ Recording started (microphone integration needed)')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
          <Mic className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Ara Voice Agent</h3>
          <p className="text-sm text-muted-foreground">
            XAI Grok voice assistant with OpenMemory integration
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection</CardTitle>
            <Activity className={connected ? 'h-4 w-4 text-green-500' : 'h-4 w-4 text-gray-400'} />
          </CardHeader>
          <CardContent>
            <Badge variant={connected ? 'default' : 'outline'}>
              {connected ? 'Connected' : 'Disconnected'}
            </Badge>
            {sessionId && (
              <p className="mt-2 text-xs text-muted-foreground">
                Session: {sessionId.substring(0, 8)}...
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total conversation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              {messages.filter((m) => m.role === 'user').length} sent,{' '}
              {messages.filter((m) => m.role === 'assistant').length} received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Conversation</CardTitle>
                <CardDescription>Chat with Ara using text or voice</CardDescription>
              </div>
              <div className="flex gap-2">
                {!connected ? (
                  <Button onClick={connect}>
                    <Activity className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                ) : (
                  <Button variant="outline" onClick={disconnect}>
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-[400px] space-y-3 overflow-y-auto rounded-lg border p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Current Transcript */}
            {transcript && (
              <div className="rounded-lg border border-purple-500/50 bg-purple-500/10 p-3">
                <p className="text-sm">
                  <span className="font-medium text-purple-600">Ara: </span>
                  {transcript}
                </p>
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="icon"
                onClick={toggleRecording}
                disabled={!connected}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendText()
                  }
                }}
                disabled={!connected}
              />
              <Button onClick={sendText} disabled={!connected || !inputText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls & Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Memory Tools
              </CardTitle>
              <CardDescription>MCP connector capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p className="font-medium">Available actions:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Store memories</li>
                  <li>• Query knowledge</li>
                  <li>• Retrieve information</li>
                  <li>• Web search</li>
                  <li>• X (Twitter) search</li>
                </ul>
              </div>

              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Try: "Remember that I prefer dark mode" or "What did I say about coffee?"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInputText("What's the current system status?")}
                disabled={!connected}
              >
                Check System Status
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInputText('Show me recent memories')}
                disabled={!connected}
              >
                Recent Memories
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setInputText('Store this: Infrastructure dashboard is running well')}
                disabled={!connected}
              >
                Store Test Memory
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audio Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Output</span>
                <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Format: PCM 24kHz</p>
                <p className="text-xs text-muted-foreground">Voice: Ara</p>
                <p className="text-xs text-muted-foreground">Model: grok-voice-latest</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
