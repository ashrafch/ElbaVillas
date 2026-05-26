import Image from "next/image"

const moments = ["mare al mattino", "pranzi all'aperto", "sentieri tra i profumi", "privacy di famiglia"]

export function LifestyleSection() {
  return (
    <section className="bg-[#172522] py-24 text-white md:py-32">
      <div className="container-premium">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Lifestyle</p>
            <h2 className="mt-5 font-heading text-4xl font-medium md:text-6xl">Una casa per abitare l&apos;isola, non solo guardarla.</h2>
            <p className="mt-6 text-lg leading-8 text-white/65">
              Qui il lusso e avere spazio, ombra, mare vicino e una soglia privata dove rientrare. Barca, trekking, tramonti e giornate lente diventano parte naturale dell&apos;uso della casa.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {moments.map((moment) => (
                <span key={moment} className="border border-white/18 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/70">{moment}</span>
              ))}
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src="/images/gallery/elba-coastline.svg" alt="Costa e mare dell'Isola d'Elba" fill className="object-cover opacity-85" sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  )
}
