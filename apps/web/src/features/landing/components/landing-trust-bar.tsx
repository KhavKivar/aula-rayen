import { Check } from "lucide-react";

export function LandingTrustBar() {
  return (
    <section className="border-b border-[#dfe6df] bg-[#f7f4ec] py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
        {[
          "Formación con fundamento",
          "Dinámicas paso a paso",
          "Material editable",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center justify-center gap-3 text-center text-sm font-semibold text-[#35544e]"
          >
            <Check aria-hidden="true" className="text-[#c66f51]" size={18} />
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
