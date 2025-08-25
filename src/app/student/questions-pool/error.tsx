"use client"

import {useState} from "react"
import {AlertCircle, Award, Check, Crown, Medal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

interface StudentScore {
    id?: string
    student_id: string
    score: number
    student: string
}

interface PricingTier {
    name: string
    price: string
    description: string
    features: string[]
    highlighted?: boolean
    buttonText: string
    onSelect: () => void
}

interface ErrorComponentProps {
    title: string
    message: string
    onViewScoreAction: () => void
    allStudentsScore: StudentScore[]
    isScoreLoading: boolean
    subscription: boolean
}

const StudentScoreCard = ({
                              student_id,
                              score,
                              student,
                              isTopThree,
                          }: {
    id?: string
    student_id: string
    score: number
    student: string
    isTopThree: boolean
}) => (
    <Card className={`transition-all ${isTopThree ? "border-amber-400 shadow-md" : ""}`}>
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isTopThree && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
                            {isTopThree && (
                                <>
                                    {student_id.endsWith("1") && <Crown className="w-4 h-4 text-amber-600"/>}
                                    {student_id.endsWith("2") && <Award className="w-4 h-4 text-amber-600"/>}
                                    {student_id.endsWith("3") && <Medal className="w-4 h-4 text-amber-600"/>}
                                </>
                            )}
                        </div>
                    )}
                    <div>
                        <p className="font-medium">{student}</p>
                        <p className="text-sm text-muted-foreground">ID: {student_id}</p>
                    </div>
                </div>
                <Badge
                    variant={isTopThree ? "default" : "outline"}
                    className={isTopThree ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                    {score} points
                </Badge>
            </div>
        </CardContent>
    </Card>
)

const PricingCard = ({tier}: { tier: PricingTier }) => (
    <Card className={`flex flex-col h-full ${tier.highlighted ? "border-green-500 shadow-lg relative" : ""}`}>
        {tier.highlighted && (
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-green-500 hover:bg-green-600">Most Popular</Badge>
            </div>
        )}
        <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription>{tier.description}</CardDescription>
            <div className="mt-4">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.price !== "Free" && <span className="text-muted-foreground">/month</span>}
            </div>
        </CardHeader>
        <CardContent className="flex-grow">
            <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5"/>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter>
            <Button
                onClick={tier.onSelect}
                className={`w-full ${tier.highlighted ? "bg-green-600 hover:bg-green-700" : ""}`}
                variant={tier.highlighted ? "default" : "outline"}
            >
                {tier.buttonText}
            </Button>
        </CardFooter>
    </Card>
)

const ErrorComponent = ({
                            title,
                            message,
                            onViewScoreAction,
                            allStudentsScore,
                            isScoreLoading,
                            subscription,
                        }: ErrorComponentProps) => {
    const [selectedTab, setSelectedTab] = useState<string>("scores")

    // Sample pricing tiers
    const pricingTiers: PricingTier[] = [
        {
            name: "Basic",
            price: "Free",
            description: "Essential features for students",
            features: ["View your own scores", "Basic performance metrics", "Limited access to resources", "Email support"],
            buttonText: "Get Started",
            onSelect: () => console.log("Selected Basic plan"),
        },
        {
            name: "Premium",
            price: "$9.99",
            description: "Advanced features for serious students",
            features: [
                "View all student scores",
                "Detailed performance analytics",
                "Unlimited access to resources",
                "Priority email support",
                "Performance history tracking",
            ],
            highlighted: true,
            buttonText: "Upgrade Now",
            onSelect: () => console.log("Selected Premium plan"),
        },
        {
            name: "Pro",
            price: "$19.99",
            description: "Complete solution for professionals",
            features: [
                "All Premium features",
                "Personalized learning path",
                "One-on-one tutoring sessions",
                "24/7 priority support",
                "Advanced analytics and insights",
                "Certification preparation",
            ],
            buttonText: "Go Pro",
            onSelect: () => console.log("Selected Pro plan"),
        },
    ]

    // Get top 3 students
    const topThreeStudents = [...allStudentsScore].sort((a, b) => b.score - a.score).slice(0, 3)

    return (
        <section className="max-w-7xl mx-auto font-poppins">
            <div className="w-full flex flex-col items-center justify-center my-10 p-4">
                <Alert variant="destructive" className="max-w-2xl">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>{title}</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>

                <Button className="bg-green-600 hover:bg-green-700 mt-6" onClick={onViewScoreAction}
                        disabled={isScoreLoading}>
                    {isScoreLoading ? "Loading..." : "View Score"}
                </Button>

                {allStudentsScore.length > 0 && (
                    <Tabs
                        defaultValue="scores"
                        className="w-full max-w-4xl mt-10"
                        value={selectedTab}
                        onValueChange={setSelectedTab}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="scores">Student Scores</TabsTrigger>
                            <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
                        </TabsList>

                        <TabsContent value="scores" className="mt-6">
                            {topThreeStudents.length > 0 && (
                                <div className="mb-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Crown className="h-5 w-5 text-amber-500"/>
                                                Top 3 Students
                                            </CardTitle>
                                            <CardDescription>The highest performing students in your
                                                class</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-4 md:grid-cols-3">
                                                {topThreeStudents.map((student, index) => (
                                                    <StudentScoreCard
                                                        key={student.id || index}
                                                        id={student.id}
                                                        student_id={student.student_id}
                                                        score={student.score}
                                                        student={student.student}
                                                        isTopThree={true}
                                                    />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            <div>
                                <h2 className="text-xl font-semibold mb-4">All Students&#39; Scores</h2>
                                <div className="space-y-3">
                                    {allStudentsScore.map((student, index) => (
                                        <StudentScoreCard
                                            key={student.id || index}
                                            id={student.id}
                                            student_id={student.student_id}
                                            score={student.score}
                                            student={student.student}
                                            isTopThree={index < 3}
                                        />
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="subscription" className="mt-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                {pricingTiers.map((tier, index) => (
                                    <PricingCard key={index} tier={tier}/>
                                ))}
                            </div>

                            {!subscription && (
                                <Alert className="mt-6">
                                    <AlertDescription>
                                        Upgrade your subscription to unlock all features and get detailed insights into
                                        student performance.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </section>
    )
}

export default ErrorComponent
