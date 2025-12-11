import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Create Your CV in Minutes with AI</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Upload your old CV, generate new sections, and export instantly. Let AI handle the heavy lifting.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Button size="lg" className="px-8">
              Create CV
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Login
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-card rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded"></div>
                  <div className="h-2 bg-muted rounded w-5/6"></div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="h-2 bg-primary/30 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
