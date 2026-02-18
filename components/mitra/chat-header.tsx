"use client"

import Image from "next/image"

export function ChatHeader() {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-primary px-4 py-3"
      role="banner"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/20"
        aria-hidden="true"
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vWjoIi2hqu4Dplo2Yp2nYkSD7Fv8u3.png"
          alt="CARS24 logo"
          width={28}
          height={28}
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-base font-bold leading-tight text-primary-foreground">
          CARS24 Support
        </h1>
        <p className="text-xs leading-tight text-primary-foreground/70">
          Your Document Support Assistant
        </p>
      </div>
    </header>
  )
}
