import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Free Session",
        price: "Free",
        period: "single session",
        features: [
            "One 30-minute session with any mentor",
            "Access to all mentors on the platform",
            "Community Discord access",
            "Basic project feedback"
        ],
        mostPopular: false
    },
    {
        name: "Group Mentoring",
        price: "Free",
        period: "weekly",
        features: [
            "Weekly group session, up to 5 students",
            "Peer learning circle",
            "Project feedback every week",
            "Priority booking for open slots",
            "Access to shared resource library"
        ],
        mostPopular: true
    },
    {
        name: "Priority Mentor",
        price: "Free",
        period: "ongoing",
        features: [
            "Matched with one dedicated mentor",
            "Unlimited sessions",
            "1-on-1 code reviews",
            "Career and roadmap guidance"
        ],
        mostPopular: false
    }
];