import Image from "next/image"

const moments = ["mare al mattino", "pranzi all'aperto", "sentieri tra i profumi", "privacy di famiglia"]

export function LifestyleSection() {
  return (
    <section className="bg-[#172522] py-20 text-white sm:py-24 md:py-32">
      <div className="container-premium">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Lifestyle</p>
            <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Una casa per abitare l&apos;isola, non solo guardarla.</h2>
            <p className="mt-6 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              Qui il lusso e avere spazio, ombra, mare vicino e una soglia privata dove rientrare. Barca, trekking, tramonti e giornate lente diventano parte naturale dell&apos;uso della casa.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              {moments.map((moment) => (
                <span key={moment} className="border border-white/18 px-3 py-2 text-[0.68rem] uppercase tracking-[0.14em] text-white/70 sm:text-xs sm:tracking-[0.18em]">{moment}</span>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
            <Image src="/images/gallery/elba-coastline.svg" alt="Costa e mare dell'Isola d'Elba" fill className="object-cover opacity-85" sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  )
}
