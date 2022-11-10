import { ReactNode } from "react"

const CardSwap = ({
  children
}: {
  children: ReactNode
}) => (
  <div className="shadow-right rounded-lg border-t border-slate-800 bg-zinc-900 bg-opacity-90 px-4 py-2 shadow-lg backdrop-blur-sm">
    {children}
  </div>
)

export default CardSwap
