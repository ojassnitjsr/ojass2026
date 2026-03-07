import { ReactNode } from "react";

/**
 * Bare layout for the certificate view page.
 * Strips out OverlayLayout (navbar, coins, bot icon) and CursorEffect
 * so the certificate renders in a completely clean white page.
 */
export default function CertificateLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
