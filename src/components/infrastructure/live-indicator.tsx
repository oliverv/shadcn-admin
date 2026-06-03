import { cn } from '@/lib/utils'

interface LiveIndicatorProps {
  isLive: boolean
  className?: string
}

export function LiveIndicator({ isLive, className }: LiveIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex h-2 w-2">
        {isLive && (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </>
        )}
        {!isLive && <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>}
      </div>
      <span className="text-xs text-muted-foreground">{isLive ? 'Live' : 'Offline'}</span>
    </div>
  )
}
