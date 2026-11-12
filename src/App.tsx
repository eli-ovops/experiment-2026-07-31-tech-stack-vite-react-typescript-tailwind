import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_044635_8daabe05-1a5c-491c-920f-4b0bd8f04812.mp4'
const LOGO_URL =
  'https://polo-pecan-73837341.figma.site/_assets/v11/f73360d8fc2d33f2b5a4bfb1fa4935fca355946f.svg'
const AVATAR_URL =
  'https://polo-pecan-73837341.figma.site/_assets/v11/745de561b3ebfa8634a3483efc95f21feedd96c9.png'
const AGE_BACKGROUND_URL =
  'https://polo-pecan-73837341.figma.site/_assets/v11/d8d9bd498347ea96ca4d675a624c8d90e06786e7.png'
const INSIGHTS_URL =
  'https://polo-pecan-73837341.figma.site/_assets/v11/94903fdf21e145cd4ba873c15fc03251c0600ee5.png'
const ACTION_PLAN_URL =
  'https://polo-pecan-73837341.figma.site/_assets/v11/0c38fdb8a933b0da384a5a3f8b0d9986bb919838.png'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale'

interface AnimatedElementProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
}

function AnimatedElement({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const hiddenTransform: Record<Direction, string> = {
    up: 'translate3d(0, 40px, 0)',
    down: 'translate3d(0, -40px, 0)',
    left: 'translate3d(40px, 0, 0)',
    right: 'translate3d(-40px, 0, 0)',
    scale: 'scale(0.9)',
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransform[direction],
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function useBiologicalAge() {
  const [age, setAge] = useState(0)

  useEffect(() => {
    let countUpTimer: number | undefined
    let incrementTimer: number | undefined
    let step = 0

    countUpTimer = window.setInterval(() => {
      step += 1
      setAge(Math.round((28 * step) / 40))

      if (step >= 40) {
        window.clearInterval(countUpTimer)
        setAge(28)
        incrementTimer = window.setInterval(() => {
          setAge((current) => current + 1)
        }, 6000)
      }
    }, 45)

    return () => {
      window.clearInterval(countUpTimer)
      window.clearInterval(incrementTimer)
    }
  }, [])

  return age
}

function CircleIconButton({
  icon: Icon,
  dark = true,
  label,
}: {
  icon: LucideIcon
  dark?: boolean
  label: string
}) {
  return (
    <span
      aria-label={label}
      role="img"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
        dark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
    </span>
  )
}

function RulerTicker() {
  const ticks = Array.from({ length: 61 }, (_, index) => index)
  const tickerSet = (
    <div className="flex min-w-max items-end gap-[8px] sm:gap-[10px]">
      {ticks.map((tick) => (
        <span
          key={tick}
          className="block w-px rounded-full bg-[rgba(239,206,150,0.5)]"
          style={{ height: tick % 5 === 0 ? 26 : 18 }}
        />
      ))}
    </div>
  )

  return (
    <div
      aria-hidden="true"
      className="relative mt-2 h-10 w-full max-w-[620px] overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      <div className="animate-ticker absolute inset-y-0 left-0 flex w-max items-end">
        {tickerSet}
        {tickerSet}
      </div>
      <span className="absolute bottom-0 left-1/2 z-10 h-10 w-0.5 -translate-x-1/2 rounded-full bg-[#EFCE96]" />
    </div>
  )
}

function AgePanel() {
  const age = useBiologicalAge()

  return (
    <div className="w-full sm:w-[520px] lg:w-[620px]">
      <AnimatedElement delay={300} direction="left">
        <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-[24px] sm:h-[500px] sm:rounded-[32px] lg:h-[550px] lg:rounded-[40px]">
          <div
            className="animate-spin-bg absolute inset-[-5%] bg-cover bg-center"
            style={{ backgroundImage: `url(${AGE_BACKGROUND_URL})` }}
          />
          <div className="absolute inset-0 bg-black/5" />
          <div className="relative z-10 flex flex-col items-center text-center text-white">
            <AnimatedElement delay={600} direction="up">
              <p className="text-base font-medium leading-tight text-gray-200 sm:text-lg md:text-[22px]">
                Estimated
                <br />
                Biological Age
              </p>
            </AnimatedElement>
            <AnimatedElement delay={800} direction="scale">
              <div
                aria-live="polite"
                aria-label={`Estimated biological age ${age}`}
                className="mt-6 font-sans text-[72px] font-semibold leading-[0.85] tracking-tight tabular-nums sm:mt-8 sm:text-[100px] lg:text-[132px]"
              >
                {age}
              </div>
            </AnimatedElement>
          </div>
        </div>
      </AnimatedElement>

      <AnimatedElement
        className="mt-4 flex flex-col items-center sm:mt-5"
        delay={1000}
        direction="up"
      >
        <div className="rounded-full border border-[#EFCE96]/50 bg-[#EFCE96]/20 px-4 py-2 text-xs font-medium tracking-wide text-white sm:px-6 sm:text-sm">
          3 Years Younger
        </div>
        <RulerTicker />
      </AnimatedElement>
    </div>
  )
}

interface ImageInfoCardProps {
  backgroundImage: string
  delay: number
  detail: string
  title: string
}

function ImageInfoCard({
  backgroundImage,
  delay,
  detail,
  title,
}: ImageInfoCardProps) {
  return (
    <AnimatedElement
      className="w-full sm:flex-1 xl:w-[260px] xl:flex-none"
      delay={delay}
      direction="right"
    >
      <button
        type="button"
        className="group flex h-[130px] w-full flex-col justify-between rounded-[16px] bg-cover bg-center p-4 text-left shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-[filter,transform] duration-300 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-[144px] sm:rounded-[20px] sm:p-5"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <span className="text-base font-semibold text-white sm:text-lg">{title}</span>
        <span className="flex w-full items-center justify-between">
          <span className="flex h-6 items-center rounded-full bg-white px-3 text-[12px] font-medium text-black sm:h-7 sm:text-[14px]">
            {detail}
          </span>
          <CircleIconButton icon={ArrowRight} dark={false} label={`Open ${title}`} />
        </span>
      </button>
    </AnimatedElement>
  )
}

function UpcomingCard() {
  return (
    <AnimatedElement
      className="w-full sm:flex-1 xl:w-[260px] xl:flex-none"
      delay={500}
      direction="right"
    >
      <button
        type="button"
        className="flex h-[130px] w-full flex-col justify-between rounded-[16px] bg-[#2F2F2F]/60 p-4 text-left text-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-[52px] transition-colors duration-300 hover:bg-[#2F2F2F]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-[144px] sm:rounded-[20px] sm:p-5"
      >
        <span className="text-base font-semibold sm:text-lg">Upcoming Activities</span>
        <span className="flex w-full items-center justify-between">
          <span className="text-[11px] text-white/55 sm:text-[12px]">4 events</span>
          <CircleIconButton icon={ArrowRight} label="Open upcoming activities" />
        </span>
      </button>
    </AnimatedElement>
  )
}

function HealthSnapshotCard() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)')
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const expanded = isExpanded

  return (
    <AnimatedElement
      className="w-full sm:flex-1 xl:w-[260px] xl:flex-none"
      delay={800}
      direction="right"
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => {
          if (!isDesktop) setIsExpanded((current) => !current)
        }}
        onMouseEnter={() => {
          if (isDesktop) setIsExpanded(true)
        }}
        onMouseLeave={() => {
          if (isDesktop) setIsExpanded(false)
        }}
        className={`flex w-full flex-col rounded-[16px] p-4 text-left shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-[52px] transition-all duration-300 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:rounded-[20px] sm:p-5 ${
          expanded
            ? 'h-auto min-h-[244px] bg-white text-black sm:min-h-[280px] xl:h-[280px]'
            : 'h-[130px] justify-between bg-[#2F2F2F]/60 text-white hover:bg-[#2F2F2F]/70 sm:h-[144px]'
        }`}
      >
        <span className="text-base font-semibold sm:text-lg">Your Health Snapshot</span>

        {expanded ? (
          <span className="mt-5 flex flex-1 flex-col justify-between">
            <span className="text-[12px] font-normal leading-[1.55] text-black/70 sm:text-[13px]">
              With a biological age of 28, your body is performing like a young,
              energetic you. Keep fueling it with movement, nourishing food,
              quality rest, and a calm mind - so you can stay strong, sharp, and
              unstoppable.
            </span>
            <span className="mt-5 flex justify-end">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F0F0] text-black sm:h-10 sm:w-10">
                <ArrowDown aria-hidden="true" size={18} strokeWidth={1.7} />
              </span>
            </span>
          </span>
        ) : (
          <span className="flex w-full items-center justify-between">
            <span className="text-[11px] text-white/55 sm:text-[12px]">
              Recommendations
            </span>
            <CircleIconButton icon={ArrowUp} label="Expand recommendations" />
          </span>
        )}
      </button>
    </AnimatedElement>
  )
}

function Navigation() {
  return (
    <header className="relative z-10 flex items-start justify-between px-5 pt-6 sm:px-8 sm:pt-8 lg:px-12">
      <AnimatedElement delay={100} direction="down">
        <img
          src={LOGO_URL}
          alt="Health company"
          className="h-10 w-40 object-contain object-left"
        />
      </AnimatedElement>

      <AnimatedElement
        className="absolute left-1/2 top-8 -translate-x-1/2 sm:top-10"
        delay={150}
        direction="down"
      >
        <button
          type="button"
          aria-label="Help"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-10 sm:w-10"
        >
          <HelpCircle aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>
      </AnimatedElement>

      <AnimatedElement delay={200} direction="down">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
          <p className="hidden max-w-[360px] text-right text-xl font-bold leading-[0.95] tracking-[-0.035em] text-white md:block sm:text-3xl lg:text-[42px]">
            Benjamin Carter
          </p>
          <img
            src={AVATAR_URL}
            alt="Benjamin Carter"
            className="h-11 w-11 rounded-full object-cover shadow-lg sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]"
          />
        </div>
      </AnimatedElement>
    </header>
  )
}

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-900 text-white">
      <video
        className="animate-video-in absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/10" />

      <Navigation />

      <section className="relative z-10 flex flex-col gap-10 px-5 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-20 lg:px-12 lg:pb-12 xl:absolute xl:inset-x-0 xl:bottom-0 xl:flex-row xl:items-end xl:justify-between xl:gap-8 xl:pt-0">
        <AgePanel />

        <div className="flex w-full flex-col gap-4 sm:gap-5 xl:w-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            <UpcomingCard />
            <ImageInfoCard
              title="Your Insights"
              detail="8 Risks"
              backgroundImage={INSIGHTS_URL}
              delay={650}
            />
          </div>
          <div className="flex flex-col items-end gap-4 sm:flex-row sm:gap-5">
            <HealthSnapshotCard />
            <ImageInfoCard
              title="Action Plan"
              detail="Details"
              backgroundImage={ACTION_PLAN_URL}
              delay={950}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
