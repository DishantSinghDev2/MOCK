import { LiveMultiplayerSession } from "@/components/collab/live-multiplayer-session"

export default function CollaborativePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Collaborative Testing</h1>
          <p className="text-muted-foreground">Revolutionary real-time multiplayer API testing with AI predictions</p>
        </div>

        <LiveMultiplayerSession projectId={params.id} />
      </div>
    </div>
  )
}
