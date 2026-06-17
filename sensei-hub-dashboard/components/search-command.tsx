"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, GraduationCap } from "lucide-react"

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n"
import { useUserProgress } from "@/components/user-progress-provider"
import { filterSearchItems, type SearchItem } from "@/lib/search"

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const { subjects } = useUserProgress()
  const [query, setQuery] = useState("")
  const [lessonItems, setLessonItems] = useState<SearchItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const subjectItems: SearchItem[] = useMemo(
    () =>
      subjects.map((s) => ({
        id: `subject-${s.slug}`,
        type: "subject" as const,
        title: s.name,
        subtitle: s.tagline,
        href: `/subject/${s.slug}`,
      })),
    [subjects],
  )

  // Lazily load lesson titles for all subjects the first time the palette opens.
  useEffect(() => {
    if (!open || loaded) return
    let active = true
    Promise.all(
      subjects.map(async (s) => {
        try {
          const res = await fetch(`/api/subject/${s.slug}/lessons?lang=${lang}`)
          if (!res.ok) return [] as SearchItem[]
          const data = await res.json()
          return (data.lessons || []).map((l: { path: string; title: string }) => ({
            id: `lesson-${s.slug}-${l.path}`,
            type: "lesson" as const,
            title: l.title,
            subtitle: s.name,
            href: `/subject/${s.slug}/lesson/${l.path}`,
          })) as SearchItem[]
        } catch {
          return [] as SearchItem[]
        }
      }),
    ).then((results) => {
      if (!active) return
      setLessonItems(results.flat())
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [open, loaded, subjects, lang])

  const filtered = useMemo(
    () => filterSearchItems([...subjectItems, ...lessonItems], query),
    [subjectItems, lessonItems, query],
  )

  const filteredSubjects = filtered.filter((i) => i.type === "subject")
  const filteredLessons = filtered.filter((i) => i.type === "lesson").slice(0, 30)

  const go = (href: string) => {
    onOpenChange(false)
    setQuery("")
    router.push(href)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <DialogTitle className="sr-only">{t("search.placeholder")}</DialogTitle>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput placeholder={t("search.placeholder")} value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>{t("search.no_results")}</CommandEmpty>

        {filteredSubjects.length > 0 && (
          <CommandGroup heading={t("search.subjects")}>
            {filteredSubjects.map((item) => (
              <CommandItem key={item.id} value={item.id} onSelect={() => go(item.href)}>
                <GraduationCap className="h-4 w-4 text-cyan-300" />
                <span>{item.title}</span>
                {item.subtitle && <span className="ml-auto text-xs text-white/40">{item.subtitle}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredLessons.length > 0 && (
          <CommandGroup heading={t("search.lessons")}>
            {filteredLessons.map((item) => (
              <CommandItem key={item.id} value={item.id} onSelect={() => go(item.href)}>
                <BookOpen className="h-4 w-4 text-purple-300" />
                <span className="truncate">{item.title}</span>
                {item.subtitle && <span className="ml-auto text-xs text-white/40">{item.subtitle}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
