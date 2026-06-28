import { useState, useEffect, useRef } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

let highlighterPromise: Promise<import('shiki').Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['github-dark'],
        langs: ['typescript', 'javascript', 'tsx', 'jsx', 'bash', 'json', 'css'],
      })
    )
  }
  return highlighterPromise
}

export function CodeBlock({ code, language = 'typescript', className }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getHighlighter().then(hl => {
      const out = hl.codeToHtml(code.trim(), {
        lang: language,
        theme: 'github-dark',
      })
      setHtml(out)
    })
  }, [code, language])

  function copy() {
    navigator.clipboard.writeText(code.trim())
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative group rounded-lg overflow-hidden border border-border/40', className)}>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 text-white border-0"
        onClick={copy}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span className="sr-only">{copied ? 'Copied' : 'Copy'}</span>
      </Button>

      {html ? (
        <div
          className="[&>pre]:!m-0 [&>pre]:!rounded-none [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="bg-[#0d1117] p-4 text-sm leading-relaxed overflow-x-auto">
          <code className="text-[#e6edf3] font-mono">{code.trim()}</code>
        </pre>
      )}
    </div>
  )
}
