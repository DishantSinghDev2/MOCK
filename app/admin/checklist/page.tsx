import { CompletionChecklist } from "@/components/admin/completion-checklist"

export default function ChecklistPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Platform Completion Checklist</h1>
        <p className="text-muted-foreground mt-2">
          Verify that all features and functionality are complete and production-ready
        </p>
      </div>
      <CompletionChecklist />
    </div>
  )
}
