function SkeletonBox({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[#1F2D24]/8 rounded-lg ${className}`} />
  )
}

export function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#1F2D24]/8 overflow-hidden">
      <SkeletonBox className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-3 w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <SkeletonBox className="h-5 w-24" />
          <SkeletonBox className="h-7 w-16" />
        </div>
      </div>
    </div>
  )
}

export function TableCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#1F2D24]/8 overflow-hidden">
      <div className="flex items-center justify-center p-6 border-b border-[#1F2D24]/8">
        <SkeletonBox className="w-32 h-32 rounded-lg" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <SkeletonBox className="h-5 w-20" />
          <SkeletonBox className="h-5 w-16 rounded-full" />
        </div>
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-8 w-full mt-3" />
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#1F2D24]/8 p-5">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex gap-2">
            <SkeletonBox className="h-4 w-32" />
            <SkeletonBox className="h-4 w-20 rounded-full" />
          </div>
          <div className="flex gap-2">
            <SkeletonBox className="h-6 w-24 rounded-lg" />
            <SkeletonBox className="h-6 w-24 rounded-lg" />
          </div>
          <SkeletonBox className="h-5 w-28" />
        </div>
        <SkeletonBox className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#1F2D24]/8 p-5">
      <SkeletonBox className="w-9 h-9 rounded-lg mb-3" />
      <SkeletonBox className="h-3 w-24 mb-2" />
      <SkeletonBox className="h-7 w-32" />
    </div>
  )
}