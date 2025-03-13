import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4 mt-3" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="pt-2">
                <Skeleton className="h-48 w-full rounded-lg mb-4 bg-gradient-to-r from-muted/70 via-muted to-muted/70 animate-pulse" />
                <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

