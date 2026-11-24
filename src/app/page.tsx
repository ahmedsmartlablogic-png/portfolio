import { CaseFooter, CaseHeader } from "@/components/mystery/chrome";
import { DeskLampHero } from "@/components/mystery/desk-lamp-hero";
import { DossierSection } from "@/components/mystery/dossier-section";
import { EvidenceBoard } from "@/components/mystery/evidence-board";
import { MagnifierCursor } from "@/components/mystery/magnifier-cursor";
import { StampCta } from "@/components/mystery/stamp-cta";

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-noir">
      <MagnifierCursor />
      <CaseHeader />
      <main className="flex-1">
        <DeskLampHero />
        <DossierSection />
        <EvidenceBoard />
        <StampCta />
      </main>
      <CaseFooter />
    </div>
  );
}
