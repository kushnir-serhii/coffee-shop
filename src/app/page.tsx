import { Hero } from "@/components/home/Hero";
import { LaneSplit } from "@/components/home/LaneSplit";
import { FeaturedBeans } from "@/components/home/FeaturedBeans";
// import { HeroMachine } from "@/components/home/HeroMachine";
import { Sourcing } from "@/components/home/Sourcing";
import { EquipmentRow } from "@/components/home/EquipmentRow";
import { SubscriptionCta } from "@/components/home/SubscriptionCta";

/**
 * Homepage rhythm — alternating commercial and editorial sections, so the
 * page never reads as a wall of product grids:
 *
 *   Hero            editorial   · one message, one image
 *   LaneSplit       structural  · states the two-lane idea once
 *   FeaturedBeans   commercial  · lane A
 *   HeroMachine     showcase    · lane B + the 3D slot
 *   Sourcing        editorial   · brand story, breaks the grid cadence
 *   EquipmentRow    commercial  · lane B
 *   SubscriptionCta conversion  · highest-value action, last
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LaneSplit />
      <FeaturedBeans />
      {/* <HeroMachine /> */}
      <Sourcing />
      <EquipmentRow />
      <SubscriptionCta />
    </>
  );
}
