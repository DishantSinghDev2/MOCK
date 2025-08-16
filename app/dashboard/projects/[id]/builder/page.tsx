import { DragDropBuilder } from "@/components/mocks/drag-drop-builder"

export default function BuilderPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Builder</h1>
        <p className="text-muted-foreground">
          Build and customize your mock API endpoints with drag-and-drop simplicity
        </p>
      </div>

      <DragDropBuilder projectId={params.id} />
    </div>
  )
}
