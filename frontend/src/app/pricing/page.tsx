import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function Pricing() {
   const plans = [
    {
        name: 'Free',
        price: '$0 / mo',
        desc: 'Per Student',
        features: [
            'Class Notes Access',
            'Syllabus-Aligned Content',
            'RAG Answers From Taught Materials Only',
            '10 Requests per Hour',
            'Basic Question Answering'
        ],
        buttonVariant: 'neutral'
    },
    {
        name: 'Pro',
        price: '$4.99 / mo',
        desc: 'Per Student',
        features: [
            'Everything in Free',
            'Past Question Database Access',
            'RAG Answers Using Notes + Past Questions',
            'Teacher-Certified Answers',
            'Smart Exam-Focused Insights',
            'Important Topic Highlighting',
            '100 Requests per Hour',
            'Revision-Friendly Answer Summaries',
            'Standard Security'
        ],
        buttonVariant: 'default'
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        desc: 'Per Institution',
        features: [
            'Everything in Pro',
            'University-Wide Deployment',
            'Custom Knowledge Base Integration',
            'Institution-Provided Notes & Syllabus',
            'Private RAG Infrastructure',
            'Admin Dashboard',
            'Student Usage Analytics',
            'Priority Support',
            'Advanced Security & Compliance',
            'Dedicated Onboarding'
        ],
        buttonVariant: 'neutral'
    }
];


    return (
        <div className="bg-muted relative py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        Pricing that scales with your business
                    </h2>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-balance text-lg">
                        Choose the perfect plan for your needs and start optimizing your workflow today
                    </p>
                </div>

                {/* Horizontal cards container */}
                <div className="mt-12 md:mt-20 grid gap-6 md:grid-cols-3">
                    {plans.map((plan, idx) => (
                        <Card key={idx} className="flex flex-col">
                            <CardHeader className="p-8">
                                <CardTitle className="font-medium">{plan.name}</CardTitle>
                                <span className="mb-0.5 mt-2 block text-2xl font-semibold">{plan.price}</span>
                                <CardDescription className="text-sm">{plan.desc}</CardDescription>
                            </CardHeader>
                            <div className="border-y px-8 py-4">
                                <Button
                                    asChild
                                    className="w-full"
                                    variant={plan.buttonVariant}
                                >
                                    <Link href="#">Get Started</Link>
                                </Button>
                            </div>
                            <ul role="list" className="space-y-3 p-8">
                                {plan.features.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="text-primary size-3" strokeWidth={3.5} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}