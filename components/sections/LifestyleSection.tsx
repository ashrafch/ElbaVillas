import Image from "next/image"

import { FadeIn } from "@/components/motion/FadeIn"

const moments = ["mare al mattino", "pranzi all'aperto", "sentieri tra i profumi", "privacy di famiglia"]

export function LifestyleSection() {
  return (
    <section className="bg-[#172522] py-20 text-white sm:py-24 md:py-32">
      <div className="container-premium">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Copy */}
          <FadeIn direction="right" className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Lifestyle</p>
            <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">
              Una casa per abitare l&apos;isola, non solo guardarla.
            </h2>
            <p className="mt-6 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              Qui il lusso è avere spazio, ombra, mare vicino e una soglia privata dove rientrare. Barca, trekking, tramonti e giornate lente diventano parte naturale dell&apos;uso della casa.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              {moments.map((moment) => (
                <span
                  key={moment}
                  className="border border-white/18 px-3 py-2 text-[0.68rem] uppercase tracking-[0.14em] text-white/65 sm:text-xs sm:tracking-[0.18em]"
                >
                  {moment}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Image mosaic */}
          <FadeIn direction="left" delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {/* Tall left image spanning 2 rows */}
              <div className="relative row-span-2 aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/gallery/elba-coastline.svg"
                  alt="Costa dell'Isola d'Elba al tramonto"
                  fill
                  className="object-cover opacity-85 transition duration-700 hover:scale-105"
                  sizes="(min-width: 1024px) 28vw, 45vw"
                />
              </div>
              {/* Top-right square */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/images/gallery/living-light.svg"
                  alt="Spazio living con luce naturale"
                  fill
                  className="object-cover opacity-85 transition duration-700 hover:scale-105"
                  sizes="(min-width: 1024px) 14vw, 22vw"
                />
              </div>
              {/* Bottom-right square */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/images/gallery/private-pool.svg"
                  alt="Piscina privata con vista"
                  fill
                  className="object-cover opacity-85 transition duration-700 hover:scale-105"
                  sizes="(min-width: 1024px) 14vw, 22vw"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
