import TimelinePage from "@/components/timeline/Timeline";
import { headers } from "next/headers";

export default async function TimelineDialWrapper() {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = Boolean(
        userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
        ),
    );

    return <TimelinePage isMobile={isMobile} />;
}
