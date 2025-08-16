"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Brain, Send, Code, Lightbulb, History, Settings } from "lucide-react"
import { storage } from "@/lib/storage"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  context?: ProjectContext
  codeSnippets?: CodeSnippet[]
  suggestions?: string[]
}

interface ProjectContext {
  projectId: string
  preferredLanguage: string
  framework: string
  database: string
  currentEndpoints: string[]
  recentChanges: string[]
  userPreferences: UserPreferences
}

interface UserPreferences {
  codingStyle: "functional" | "oop" | "mixed"
  testingFramework: string
  documentation: "minimal" | "detailed"
  errorHandling: "basic" | "comprehensive"
}

interface CodeSnippet {
  language: string
  code: string
  description: string
  filename?: string
}

export function AIChatAssistant({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [context, setContext] = useState<ProjectContext | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load project context and chat history
    loadProjectContext()
    loadChatHistory()
  }, [projectId])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadProjectContext = async () => {
    // Load or create project context with AI memory
    let projectContext = storage.getLocal<ProjectContext>(`ai_context_${projectId}`)

    if (!projectContext) {
      // Initialize context for new project
      projectContext = {
        projectId,
        preferredLanguage: "typescript",
        framework: "express",
        database: "postgresql",
        currentEndpoints: [],
        recentChanges: [],
        userPreferences: {
          codingStyle: "functional",
          testingFramework: "jest",
          documentation: "detailed",
          errorHandling: "comprehensive",
        },
      }

      // Auto-save context
      storage.setLocal(`ai_context_${projectId}`, projectContext)
    }

    setContext(projectContext)

    // Add welcome message if no chat history
    const existingMessages = storage.getLocal<ChatMessage[]>(`ai_chat_${projectId}`)
    if (!existingMessages || existingMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: `Hi! I'm your AI backend development assistant. I see you're working on a ${projectContext.preferredLanguage} project with ${projectContext.framework}. I remember our previous conversations and your preferences. How can I help you build your API today?`,
        timestamp: new Date(),
        context: projectContext,
        suggestions: [
          "Help me design a new API endpoint",
          "Generate authentication middleware",
          "Create database models",
          "Add error handling patterns",
          "Optimize existing endpoints",
        ],
      }
      setMessages([welcomeMessage])
      storage.setLocal(`ai_chat_${projectId}`, [welcomeMessage])
    }
  }

  const loadChatHistory = () => {
    const chatHistory = storage.getLocal<ChatMessage[]>(`ai_chat_${projectId}`)
    if (chatHistory) {
      setMessages(chatHistory)
    }
  }

  const updateContext = (updates: Partial<ProjectContext>) => {
    if (!context) return

    const updatedContext = { ...context, ...updates }
    setContext(updatedContext)
    storage.setLocal(`ai_context_${projectId}`, updatedContext)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      context,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    // Generate AI response with context awareness
    const aiResponse = await generateAIResponse(input.trim(), context, messages)
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      role: "assistant",
      content: aiResponse.content,
      timestamp: new Date(),
      context,
      codeSnippets: aiResponse.codeSnippets,
      suggestions: aiResponse.suggestions,
    }

    const finalMessages = [...updatedMessages, assistantMessage]
    setMessages(finalMessages)

    // Auto-save chat history and update context
    storage.setLocal(`ai_chat_${projectId}`, finalMessages)
    if (aiResponse.contextUpdates) {
      updateContext(aiResponse.contextUpdates)
    }

    setIsLoading(false)
  }

  const generateAIResponse = async (userInput: string, context: ProjectContext | null, chatHistory: ChatMessage[]) => {
    // Simulate AI processing with context awareness
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const lowerInput = userInput.toLowerCase()

    // Context-aware responses based on user's preferences and history
    if (lowerInput.includes("endpoint") || lowerInput.includes("api")) {
      return {
        content: `I'll help you create a new API endpoint using ${context?.preferredLanguage} and ${context?.framework}. Based on our previous conversations, I remember you prefer ${context?.userPreferences.codingStyle} programming style with ${context?.userPreferences.errorHandling} error handling.`,
        codeSnippets: [
          {
            language: context?.preferredLanguage || "typescript",
            code: generateEndpointCode(context),
            description: "RESTful API endpoint with validation and error handling",
            filename: "routes/api.ts",
          },
        ],
        suggestions: [
          "Add input validation",
          "Implement rate limiting",
          "Add authentication middleware",
          "Create unit tests",
        ],
        contextUpdates: {
          recentChanges: [...(context?.recentChanges || []), "Created new API endpoint"].slice(-10),
        },
      }
    }

    if (lowerInput.includes("database") || lowerInput.includes("model")) {
      return {
        content: `I'll help you create database models for your ${context?.database} database. I remember you're using ${context?.framework} framework.`,
        codeSnippets: [
          {
            language: context?.preferredLanguage || "typescript",
            code: generateDatabaseModel(context),
            description: "Database model with relationships and validation",
            filename: "models/User.ts",
          },
        ],
        suggestions: [
          "Add database migrations",
          "Create model relationships",
          "Add data validation",
          "Implement soft deletes",
        ],
        contextUpdates: {
          recentChanges: [...(context?.recentChanges || []), "Created database model"].slice(-10),
        },
      }
    }

    if (lowerInput.includes("auth") || lowerInput.includes("login")) {
      return {
        content: `I'll help you implement authentication. Based on your preferences for ${context?.userPreferences.errorHandling} error handling, here's a secure auth system:`,
        codeSnippets: [
          {
            language: context?.preferredLanguage || "typescript",
            code: generateAuthCode(context),
            description: "JWT-based authentication with refresh tokens",
            filename: "middleware/auth.ts",
          },
        ],
        suggestions: [
          "Add password hashing",
          "Implement refresh tokens",
          "Add role-based access",
          "Create logout functionality",
        ],
        contextUpdates: {
          recentChanges: [...(context?.recentChanges || []), "Implemented authentication"].slice(-10),
        },
      }
    }

    // Default contextual response
    return {
      content: `I understand you want help with "${userInput}". Based on our conversation history and your ${context?.preferredLanguage} project setup, I can assist you with backend development, API design, database modeling, authentication, testing, and deployment strategies.`,
      suggestions: ["Show me code examples", "Explain best practices", "Help with debugging", "Optimize performance"],
    }
  }

  const generateEndpointCode = (context: ProjectContext | null) => {
    const lang = context?.preferredLanguage || "typescript"
    const framework = context?.framework || "express"

    if (framework === "express") {
      return `import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// ${context?.userPreferences.codingStyle === "functional" ? "Functional" : "Class-based"} approach
export const createUser = [
  // Validation middleware
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 50 }),
  
  async (req: Request, res: Response) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, name } = req.body;
      
      // Your business logic here
      const user = await UserService.create({ email, name });
      
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
      
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
];`
    }

    return `// ${lang} endpoint code would be generated here`
  }

  const generateDatabaseModel = (context: ProjectContext | null) => {
    return `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual field for API responses
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}`
  }

  const generateAuthCode = (context: ProjectContext | null) => {
    return `import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
};

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};`
  }

  const clearChat = () => {
    setMessages([])
    storage.removeLocal(`ai_chat_${projectId}`)
    loadProjectContext() // This will add the welcome message back
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary animate-pulse-glow" />
            <CardTitle className="text-lg">AI Backend Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {context?.preferredLanguage} • {context?.framework}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          I remember our conversations and your preferences. Ask me anything about backend development!
        </CardDescription>
      </CardHeader>

      {showSettings && (
        <div className="px-6 pb-4 border-b">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium">Language:</label>
              <select
                value={context?.preferredLanguage}
                onChange={(e) => updateContext({ preferredLanguage: e.target.value })}
                className="w-full mt-1 p-1 border rounded"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
              </select>
            </div>
            <div>
              <label className="font-medium">Framework:</label>
              <select
                value={context?.framework}
                onChange={(e) => updateContext({ framework: e.target.value })}
                className="w-full mt-1 p-1 border rounded"
              >
                <option value="express">Express.js</option>
                <option value="nestjs">NestJS</option>
                <option value="fastify">Fastify</option>
                <option value="django">Django</option>
                <option value="flask">Flask</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {message.codeSnippets && message.codeSnippets.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.codeSnippets.map((snippet, index) => (
                        <div key={index} className="bg-background/50 rounded p-2">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              <Code className="mr-1 h-3 w-3" />
                              {snippet.language}
                            </Badge>
                            {snippet.filename && (
                              <span className="text-xs text-muted-foreground">{snippet.filename}</span>
                            )}
                          </div>
                          <pre className="text-xs overflow-x-auto">
                            <code>{snippet.code}</code>
                          </pre>
                          <p className="text-xs text-muted-foreground mt-1">{snippet.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 bg-transparent"
                            onClick={() => setInput(suggestion)}
                          >
                            <Lightbulb className="mr-1 h-3 w-3" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <Separator />

        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about backend development, API design, database modeling..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
