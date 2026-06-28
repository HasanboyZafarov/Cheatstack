export function InlineText({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/)

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  )
}
