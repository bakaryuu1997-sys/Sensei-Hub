import { StaticPage } from "@/components/static-page"
import { termsDoc } from "@/lib/legal-content"

export default function TermsPage() {
  return <StaticPage doc={termsDoc} />
}
