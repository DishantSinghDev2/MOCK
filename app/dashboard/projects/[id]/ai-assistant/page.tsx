"use client"

import { AIChatAssistant } from "@/components/ai/ai-chat-assistant"

export default function AIAssistantPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Backend Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized help with backend development, API design, and database modeling
        </p>
      </div>

      <AIChatAssistant projectId={params.id} />
    </div>
  )
}
