import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstituteHeroProps {
  bannerUrl?: string | null;
  logoUrl?: string | null;
  displayName: string;
  location?: string | null;
}

export default function InstituteHero({ bannerUrl, logoUrl, displayName, location }: InstituteHeroProps) {
  const initial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <div>
      <div className="relative z-0 w-full overflow-hidden bg-gradient-to-br from-green-700 via-green-800 to-emerald-900 h-40 sm:h-56 md:h-64">
        {bannerUrl && (
          <Image src={bannerUrl} alt={`${displayName} banner`} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="relative z-10 px-4">
        <div className="-mt-12 sm:-mt-14">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${displayName} logo`}
              width={112}
              height={112}
              className={cn(
                "rounded-full object-cover border-4 border-white bg-white shrink-0",
                "h-20 w-20 sm:h-28 sm:w-28"
              )}
            />
          ) : (
            <div className="flex items-center justify-center rounded-full bg-green-700 text-white font-bold shrink-0 border-4 border-white h-20 w-20 sm:h-28 sm:w-28 text-3xl">
              {initial}
            </div>
          )}
        </div>
        <div className="mt-3 pb-4">
          <h1 className="font-bold text-xl sm:text-3xl">{displayName}</h1>
          {location && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin size={14} /> {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
