import { CheckCircle2, Clock, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SectionSelector({ 
  sections, 
  submittedSections,
  isStartingExam,
  onSectionSelect 
}: { 
  sections: any[]
  submittedSections: Set<string>
  isStartingExam: boolean
  onSectionSelect: (slug: string) => void 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Select a Section to Begin
      </h2>
      <div className="space-y-3">
        {sections.map((section: any, index: number) => {
          const isSubmitted = submittedSections.has(section.slug)
          const isCompleted = section.is_completed
          const attemptsCount = section.attempts_count || 0
          
          return (
            <button
              key={section.slug}
              onClick={() => onSectionSelect(section.slug)}
              disabled={isStartingExam || isSubmitted}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all disabled:cursor-not-allowed ${
                isSubmitted 
                  ? 'border-green-500 bg-green-50 opacity-75' 
                  : isCompleted
                  ? 'border-blue-200 bg-blue-50 hover:border-blue-400'
                  : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      {isCompleted && !isSubmitted && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    {section.detail && (
                      <p className="text-sm text-gray-600 mb-2">{section.detail}</p>
                    )}
                    {attemptsCount > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{attemptsCount} {attemptsCount === 1 ? 'attempt' : 'attempts'}</span>
                      </div>
                    )}
                  </div>
                </div>
                {isSubmitted && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}