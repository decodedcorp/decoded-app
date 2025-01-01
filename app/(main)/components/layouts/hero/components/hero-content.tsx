export function HeroContent() {
  return (
    <div className="flex-1 min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-center space-x-4 font-mono text-xl text-primary">
        <span>Decoding</span>
        <span>&</span>
        <span>Request</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground whitespace-pre-line text-center max-w-3xl">
        {'미디어속에 나온 제품을\n여기에서 찾아보세요'}
      </h1>
      <a
        href="/request"
        className="inline-flex h-11 items-center justify-center rounded-none px-8 py-3 bg-primary font-mono font-bold text-black hover:bg-primary/90 transition-colors"
      >
        ITEM REQUEST
      </a>
    </div>
  );
}
