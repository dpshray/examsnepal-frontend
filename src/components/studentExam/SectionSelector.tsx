import { CheckCircle2, Clock, Trophy, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SectionSelector({ 
  sections, 
  submittedSections,
  isStartingExam,
  onSectionSelect,
  limitAttempts
}: { 
  sections: any[]
  submittedSections: Set<string>
  isStartingExam: boolean
  onSectionSelect: (slug: string) => void
  limitAttempts: number | null
}) {
  const hasAttemptsLimit = limitAttempts !== null && limitAttempts !== undefined

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Select a Section to Begin
        </h2>
        {hasAttemptsLimit && (
          <p className="text-sm text-gray-600 mt-1">
            Maximum {limitAttempts} {limitAttempts === 1 ? 'attempt' : 'attempts'} per section
          </p>
        )}
        {!hasAttemptsLimit && (
          <p className="text-sm text-green-600 mt-1">
            Unlimited attempts available
          </p>
        )}
      </div>
      <div className="space-y-3">
        {sections.map((section: any, index: number) => {
          const isSubmitted = submittedSections.has(section.slug)
          const isCompleted = section.is_completed
          const attemptsCount = section.attempts_count || 0
          const hasReachedLimit = hasAttemptsLimit && attemptsCount >= limitAttempts
          const canRetake = !hasReachedLimit && !isSubmitted
          
          return (
            <button
              key={section.slug}
              onClick={() => onSectionSelect(section.slug)}
              disabled={isStartingExam || isSubmitted || hasReachedLimit}
              className={`w-full text-left p-4 border-2 rounded-lg transition-all disabled:cursor-not-allowed ${
                isSubmitted 
                  ? 'border-green-500 bg-green-50 opacity-75' 
                  : hasReachedLimit
                  ? 'border-red-300 bg-red-50 opacity-75'
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      {isCompleted && !isSubmitted && !hasReachedLimit && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {hasReachedLimit && !isSubmitted && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Limit Reached
                        </Badge>
                      )}
                      {isSubmitted && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Submitted
                        </Badge>
                      )}
                    </div>
                    {section.detail && (
                      <p className="text-sm text-gray-600 mb-2">{section.detail}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      {hasAttemptsLimit ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span className={attemptsCount >= limitAttempts ? 'text-red-600 font-medium' : 'text-gray-500'}>
                            {attemptsCount} / {limitAttempts} attempts
                          </span>
                        </div>
                      ) : attemptsCount > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{attemptsCount} {attemptsCount === 1 ? 'attempt' : 'attempts'}</span>
                        </div>
                      ) : null}
                      {canRetake && isCompleted && !hasAttemptsLimit && (
                        <span className="text-xs text-green-600 font-medium">
                          Can retake
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isSubmitted && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
                {hasReachedLimit && !isSubmitted && (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}