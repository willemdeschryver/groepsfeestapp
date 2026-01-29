import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  createTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import './App.css'

const STEPS = [
  'Keuze groep',
  'Schrijven tekst',
  "Plaatsen cue's op tekst",
  'Stageplot',
  'Export',
]

const PLAYS = [
  { id: 'aspi-1', label: 'aspi #1' },
  { id: 'kapoentjes-meisjes', label: 'kapoentjes meisjes' },
  { id: 'aspi-2', label: 'aspi #2' },
  { id: 'kapoentjes-jongens', label: 'kapoentjes jongens' },
  { id: 'aspi-3', label: 'aspi #3' },
  { id: 'sloeber-meisjes', label: 'sloeber meisjes' },
  { id: 'aspi-4', label: 'aspi #4' },
  { id: 'sloeber-jongens', label: 'sloeber jongens' },
  { id: 'aspi-5', label: 'aspi #5' },
  { id: 'kwiks', label: 'kwiks' },
  { id: 'aspi-6', label: 'aspi #6' },
  { id: 'rakkers', label: 'rakkers' },
  { id: 'aspi-7', label: 'aspi #7' },
  { id: 'tippers', label: 'tippers' },
  { id: 'aspi-8', label: 'aspi #8' },
  { id: 'toppers', label: 'toppers' },
  { id: 'aspi-9', label: 'aspi #9' },
  { id: 'tiptiens-2', label: 'tiptiens' },
  { id: 'aspi-10', label: 'aspi #10' },
  { id: 'kerels', label: 'kerels' },
  { id: 'aspi-11', label: 'aspi #11' },
  { id: 'leidingsdans', label: 'leidingsdans' },
]

const SUMMARIES = {
  'aspi-1':
    'Twee reporters openen het groepsfeest, praten met weermannen over felle regen boven Avelgem en schakelen over naar livebeelden.',
  'kapoentjes-meisjes':
    'Het begint te regenen; binnen is saai. Ze spelen buiten, verzamelen zandzakken, emmers en dweilen en maken er een feestje van.',
  'aspi-2':
    'De reporters zijn terug met serieuze meteorologen: de buien worden historisch en stoppen niet snel. De kinderen zien de ernst niet in.',
  'kapoentjes-jongens':
    'De Schelde overstroomt. De kapoentjes maken een zwemfeestje in de Scheldemeersen en zelfs de koeien zwemmen mee.',
  'aspi-3':
    'Reporters waarschuwen dat spelen in de Schelde onveilig is. Een medewerker meldt dat Spikkerelle vol kinderen overstroomt; alarm en lichten vallen uit.',
  'sloeber-meisjes':
    'De brandweer probeert Spikkerelle leeg te pompen maar faalt. Ze vertrekken verslagen: de kinderen lijken niet te redden.',
  'aspi-4':
    'Nieuws: chirokinderen zitten vast in het cultureel centrum. Een expert zegt dat zo een vloedgolf eens per 1000 jaar voorkomt en er is geen oplossing.',
  'sloeber-jongens':
    'Spikkerelle loopt onder. Ze ontsnappen via een soort escape room en leren al zwemmend weg te raken.',
  'aspi-5':
    'Reporters melden dat de kinderen zelf zijn ontsnapt. Mensen vluchten naar de kerk; we schakelen naar de lokale reporter in de kerktoren.',
  kwiks:
    'De kerk dreigt onder te lopen. Ze zoeken het hoogste punt, vinden het geheim om het water te splitsen en trekken door het gespleten water.',
  'aspi-6':
    'Reporters zien vanuit de helicopter hoe kinderen oversteken, maar het water sluit weer. Het wordt donker met onderwatergeluid.',
  rakkers:
    'De rakkers worden wakker onder water en ontmoeten bekende onderwaterwezens, waardoor hun doel even vervaagt.',
  'aspi-7':
    'Twee reporters en specialisten houden een talkshow zonder nieuws en bespreken de situatie.',
  tippers:
    'De tippers zitten nog steeds onder water en ontmoeten zeemeerminnen.',
  'aspi-8':
    'Reporters vragen zich af of de kinderen nog leven; een drone ziet hen opduiken op een vlot.',
  toppers:
    'Op het vlot lijkt alles een droom door zuurstoftekort. Terug in de realiteit worden ze aangevallen door piraten, winnen en varen verder naar de Chiro.',
  'aspi-9':
    'Een klimaatactivist lijmt zich vast aan de tafel en wijst op opwarming van de aarde. De reporters reageren droog en schakelen over naar livebeelden.',
  'tiptiens-2':
    'De tiptiens spoelen aan op een plastic eiland, leren de plastic mensen recycleren en vertrekken wanneer het eiland is opgeruimd.',
  'aspi-10':
    'Twee reporters met een extra gast brengen een korte nieuws- of overgangsscene richting de finale.',
  kerels:
    'Een duif met takje wijst land. Op de berg van de Chiro wordt het survival: bushcraften, eten zoeken, een touw trekken en het water loopt weg.',
  'aspi-11':
    'Alle aspis dansen in een draaikolk: feest omdat Avelgem leeggelopen is.',
  leidingsdans: 'Leidingsdans.',
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c8bff' },
    background: {
      default: '#1a1a2e',
      paper: 'rgba(10, 12, 28, 0.7)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.75)',
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "'Manrope', system-ui, sans-serif",
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.1rem', fontWeight: 600 },
  },
})

function App() {
  const [selectedPlay, setSelectedPlay] = useState(PLAYS[0].id)
  const [step, setStep] = useState(0)
  const [characters, setCharacters] = useState([
    { id: crypto.randomUUID(), name: 'Personage 1', person: '' },
  ])
  const [lines, setLines] = useState([
    { id: crypto.randomUUID(), characterId: '', text: '', type: 'tekst' },
  ])
  const [draggedLineId, setDraggedLineId] = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [cues, setCues] = useState([])
  const [cueType, setCueType] = useState('licht')
  const [cueDescription, setCueDescription] = useState('')
  const [cueModalOpen, setCueModalOpen] = useState(false)
  const [stagePlots, setStagePlots] = useState({})
  const [shapeModalOpen, setShapeModalOpen] = useState(false)
  const [shapeDraft, setShapeDraft] = useState({
    name: '',
    description: '',
    label: 'licht',
    kind: 'circle',
    size: 70,
  })
  const [activeSectionId, setActiveSectionId] = useState(null)
  const [editingShapeId, setEditingShapeId] = useState(null)
  const dragStateRef = useRef(null)

  const summary = useMemo(() => SUMMARIES[selectedPlay], [selectedPlay])
  const stageWidthMeters = 12
  const stageDepthMeters = 10
  const stageWidthTicks = useMemo(
    () => Array.from({ length: stageWidthMeters + 1 }, (_, index) => index - stageWidthMeters / 2),
    []
  )
  const stageDepthTicks = useMemo(
    () => Array.from({ length: stageDepthMeters + 1 }, (_, index) => index),
    []
  )
  const sections = useMemo(() => {
    let sectionCount = 0
    return lines
      .filter((line) => line.type === 'sectie')
      .map((line) => {
        sectionCount += 1
        return {
          id: line.id,
          title: line.text?.trim() || `Sectie ${sectionCount}`,
        }
      })
  }, [lines])

  const addCharacter = () => {
    setCharacters((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', person: '' },
    ])
  }

  const updateCharacter = (id, field, value) => {
    setCharacters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const removeCharacter = (id) => {
    setCharacters((prev) => prev.filter((item) => item.id !== id))
    setLines((prev) =>
      prev.map((line) =>
        line.characterId === id ? { ...line, characterId: '' } : line
      )
    )
  }

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: crypto.randomUUID(), characterId: '', text: '', type: 'tekst' },
    ])
  }

  const updateLine = (id, field, value) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line
        if (field === 'type' && value === 'sectie') {
          return { ...line, type: value, characterId: '' }
        }
        if (field === 'type' && value === 'actie') {
          return { ...line, type: value, characterId: '' }
        }
        return { ...line, [field]: value }
      })
    )
  }

  const removeLine = (id) => {
    setLines((prev) => prev.filter((line) => line.id !== id))
  }

  const moveLine = (fromId, toId) => {
    if (!fromId || fromId === toId) return
    setLines((prev) => {
      const fromIndex = prev.findIndex((line) => line.id === fromId)
      const toIndex = prev.findIndex((line) => line.id === toId)
      if (fromIndex === -1 || toIndex === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const exportJson = () => {
    const payload = {
      selectedPlay,
      characters,
      lines,
      cues,
      stagePlots,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `toneelstuk-export-${selectedPlay}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPdf = () => {
    const cueBadge = (numbers) =>
      numbers && numbers.length
        ? `<span class="badge">${numbers.join(',')}</span>`
        : ''

    const normalizeWord = (value) =>
      value
        ? value
            .toString()
            .toLowerCase()
            .replace(/[\p{P}\p{S}]+/gu, '')
            .trim()
        : ''

    const tokenizeText = (value) => {
      if (!value) return []
      const cleaned = value
        .toString()
        .replace(/[\s ]+/g, ' ')
        .trim()
      return cleaned ? cleaned.split(' ') : []
    }

    const pdfLineMarkers = new Map()
    const pdfWordMarkers = new Map()
    const lineWords = new Map(
      lines.map((line) => [
        line.id,
        tokenizeText(line.text),
      ])
    )

    sortedCues.forEach((cue, index) => {
      const wordIndex = cue?.target?.wordIndex
      const wordText = cue?.target?.wordText
      const isLineCue = wordIndex == null && !wordText
      const cueNumber = index + 1

      if (isLineCue) {
        const key = `${cue.target.lineId}:line`
        if (!pdfLineMarkers.has(key)) {
          pdfLineMarkers.set(key, { numbers: [], types: new Set() })
        }
        const entry = pdfLineMarkers.get(key)
        entry.numbers.push(cueNumber)
        entry.types.add(cue.type)
        return
      }

      const words = lineWords.get(cue.target.lineId) || []
      const normalizedWords = words.map((word) => normalizeWord(word))
      const normalizedTarget = normalizeWord(wordText)
      let targetIndex = null

      if (wordIndex != null && Number.isFinite(Number(wordIndex))) {
        const indexValue = Number(wordIndex)
        if (indexValue >= 0 && indexValue < words.length) {
          if (
            normalizedTarget &&
            normalizedWords[indexValue] &&
            normalizedWords[indexValue] !== normalizedTarget
          ) {
            targetIndex = null
          } else {
            targetIndex = indexValue
          }
        }
      }

      if (targetIndex == null && normalizedTarget) {
        const indexValue = normalizedWords.findIndex(
          (value) => value === normalizedTarget
        )
        if (indexValue !== -1) {
          targetIndex = indexValue
        }
      }

      if (targetIndex == null) {
        return
      }

      if (!pdfWordMarkers.has(cue.target.lineId)) {
        pdfWordMarkers.set(cue.target.lineId, [])
      }
      const markers = pdfWordMarkers.get(cue.target.lineId)
      if (!markers[targetIndex]) {
        markers[targetIndex] = { numbers: [], types: new Set() }
      }
      markers[targetIndex].numbers.push(cueNumber)
      markers[targetIndex].types.add(cue.type)
    })

    const markerColor = (types) => {
      if (!types || types.size === 0) return 'transparent'
      if (types.size > 1) return '#dfe6ff'
      const type = Array.from(types)[0]
      return {
        licht: '#cfe0ff',
        video: '#e0ccff',
        audio: '#c9f2e6',
        decor: '#f2d3b2',
      }[type]
    }

    const content = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Toneelstuk export</title>
          <style>
            @page { size: A4 portrait; margin: 16mm; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { font-family: Arial, sans-serif; padding: 0; background: #ffffff; color: #1b1c2b; font-size: 12px; }
            h1 { font-size: 17px; margin-bottom: 4px; color: #2a2b5f; }
            h2 { font-size: 10px; margin: 0 0 10px; color: #2a2b5f; text-transform: uppercase; letter-spacing: 0.1em; }
            .meta { font-size: 11px; color: #4b4c6b; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
            .panel { border: 1px solid #e6e8f3; border-radius: 12px; padding: 12px; background: #f9f9ff; }
            .line { display: grid; grid-template-columns: 32px 100px 1fr; gap: 8px; padding: 6px 6px; border-radius: 8px; margin: 3px 0; }
            .line--action .text { font-style: italic; color: #4b4c6b; }
            .index { font-weight: 700; color: #4a4d85; }
            .speaker { font-weight: 700; letter-spacing: 0.08em; color: #2e2f5c; font-size: 9px; }
            .text { line-height: 1.45; }
            .word { display: inline; padding: 0; margin-right: 0; white-space: nowrap; -webkit-box-decoration-break: clone; box-decoration-break: clone; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .badge { display: inline-block; margin-left: 5px; padding: 1px 6px; font-size: 9px; border-radius: 999px; background: #2a2b5f; color: #fff; }
            .line--section { display: block; font-weight: 700; color: #6b5dd3; width: 100%; }
            .cue-map { position: relative; min-height: ${Math.max(
              lines.length * 36 + 160,
              360,
              (cuePositions.at(-1)?.top ?? 0) + 160
            )}px; }
            .cue-card { position: absolute; left: 0; right: 0; border-radius: 12px; padding: 10px; border: 1px solid #e0e3f4; }
            .cue-title { font-size: 9px; letter-spacing: 0.08em; color: #4b4c6b; text-transform: uppercase; margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <h1>Export toneelstuk</h1>
          <div class="meta"><strong>Groep:</strong> ${selectedPlay}</div>
          <div class="grid">
            <div class="panel">
              <h2>Tekstlijnen</h2>
              ${lines
                .map((line, index) => {
                  if (line.type === 'sectie') {
                    return `<div class="line line--section">SECTIE: ${line.text || ''}</div>`
                  }
                  const character = characters.find((item) => item.id === line.characterId)
                  const speaker = character?.name ? character.name.toUpperCase() : 'ONBEKEND'
                  const lineKey = `${line.id}:line`
                  const lineMarker = pdfLineMarkers.get(lineKey)
                  const lineColor = markerColor(lineMarker?.types)
                  const indexCell = line.type === 'actie'
                    ? `<span class="index"></span>`
                    : `<span class="index" style="background:${lineColor}; border-radius:6px; padding:1px 4px;">
                        ${index + 1}${lineMarker ? cueBadge(lineMarker.numbers) : ''}
                      </span>`
                  const speakerCell = line.type === 'actie'
                    ? `<span class="speaker"></span>`
                    : `<span class="speaker">${speaker}</span>`
                  return `<div class="${line.type === 'actie' ? 'line line--action' : 'line'}">
                    ${indexCell}
                    ${speakerCell}
                    <span class="text">
                      ${
                        line.text
                          ? tokenizeText(line.text)
                              .map((word, wordIndex) => {
                                const markers = pdfWordMarkers.get(line.id) || []
                                const marker = markers[wordIndex]
                                const markerNumbers = marker?.numbers
                                const markerTypes = marker?.types
                                const color = markerColor(markerTypes)
                                const hasMarkers = markerNumbers && markerNumbers.length
                                const wordStyle = hasMarkers
                                  ? `background:${color}; border-radius:6px; padding:1px 4px; color:#1b1c2b; font-weight:700;`
                                  : 'background:transparent;'
                                return `<span class="word${hasMarkers ? ' word--marked' : ''}" style="${wordStyle}">${word}${hasMarkers ? cueBadge(markerNumbers) : ''}</span>`
                              })
                              .join(' ')
                          : '—'
                      }
                    </span>
                  </div>`
                })
                .join(' ')}
            </div>
            <div class="panel">
              <h2>Cues</h2>
              <div class="cue-map">
                ${cuePositions
                  .map((cue) => {
                    const bg = {
                      licht: '#d9e8ff',
                      video: '#ead9ff',
                      audio: '#d9fff1',
                      decor: '#ffe8d0',
                    }[cue.type]
                    return `<div class="cue-card" style="top:${cue.top + 16}px; background:${bg};">
                      <div class="cue-title">Cue ${cue.number} · ${cue.type.toUpperCase()}</div>
                      <div>${cue.description || 'Geen beschrijving.'}</div>
                    </div>`
                  })
                  .join(' ')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(content)
    win.document.close()
    win.onload = () => {
      win.focus()
      setTimeout(() => win.print(), 200)
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      if (data.selectedPlay) setSelectedPlay(data.selectedPlay)
      const importedLines = Array.isArray(data.lines) ? data.lines : null
      if (Array.isArray(data.characters)) setCharacters(data.characters)
      if (importedLines) setLines(importedLines)
      if (Array.isArray(data.cues)) {
        const lineMap = new Map(
          (importedLines || lines).map((line) => [line.id, line])
        )
        const normalized = data.cues.map((cue) => {
          const rawIndex = cue?.target?.wordIndex
          const parsedIndex =
            rawIndex === null || rawIndex === undefined || rawIndex === ''
              ? null
              : Number(rawIndex)
          let wordText = cue?.target?.wordText ?? null
          if (wordText == null && parsedIndex != null) {
            const line = lineMap.get(cue?.target?.lineId)
            const words = line?.text
              ? line.text.split(/\s+/).filter(Boolean)
              : []
            wordText = words[parsedIndex] ?? null
          }
          return {
            ...cue,
            target: {
              ...cue.target,
              lineIndex:
                cue?.target?.lineIndex === undefined
                  ? undefined
                  : Number(cue.target.lineIndex),
              wordIndex: Number.isFinite(parsedIndex) ? parsedIndex : null,
              wordText,
            },
          }
        })
        setCues(normalized)
      }
      if (data.stagePlots && typeof data.stagePlots === 'object') {
        const normalizedPlots = Object.fromEntries(
          Object.entries(data.stagePlots).map(([sectionId, plot]) => {
            const shapes = Array.isArray(plot?.shapes) ? plot.shapes : []
            return [
              sectionId,
              {
                enabled: plot?.enabled === true,
                shapes: shapes.map((shape) => ({
                  id: shape?.id ?? crypto.randomUUID(),
                  x: Number(shape?.x ?? 0),
                  y: Number(shape?.y ?? 0),
                  size: Number(shape?.size ?? 70),
                  kind: shape?.kind === 'square' ? 'square' : 'circle',
                  label: shape?.label === 'decor' ? 'decor' : 'licht',
                  name: shape?.name ?? '',
                  description: shape?.description ?? '',
                })),
              },
            ]
          })
        )
        setStagePlots(normalizedPlots)
      }
    } catch {
      // ignore invalid import
    }
  }

  const addCue = () => {
    if (!selectedTarget) return
    setCues((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: cueType,
        description: cueDescription.trim(),
        target: selectedTarget,
      },
    ])
    setCueDescription('')
    setCueModalOpen(false)
  }

  const sortedCues = useMemo(() => {
    const lineIndex = new Map(lines.map((line, index) => [line.id, index]))
    return [...cues].sort((a, b) => {
      const aLine = lineIndex.get(a.target.lineId) ?? 0
      const bLine = lineIndex.get(b.target.lineId) ?? 0
      if (aLine !== bLine) return aLine - bLine
      return (a.target.wordIndex ?? -1) - (b.target.wordIndex ?? -1)
    })
  }, [cues, lines])

  const cuePositions = useMemo(() => {
    const lineIndex = new Map(lines.map((line, index) => [line.id, index]))
    const lineHeight = 56
    const minGap = 120
    const maxShift = 200
    let lastTop = -Infinity
    return sortedCues.map((cue, index) => {
      const baseIndex = cue.target.lineIndex ?? lineIndex.get(cue.target.lineId) ?? 0
      const wordOffset = cue.target.wordIndex != null ? 0.18 : 0
      const desiredTop = (baseIndex + wordOffset) * lineHeight - 38
      let top = desiredTop
      if (top < lastTop + minGap) {
        top = Math.min(lastTop + minGap, desiredTop + maxShift)
      }
      lastTop = top
      return {
        ...cue,
        number: index + 1,
        top,
        lineHeight,
      }
    })
  }, [sortedCues, lines])

  const cueColors = {
    licht: 'rgba(148, 197, 255, 0.45)',
    video: 'rgba(186, 148, 255, 0.45)',
    audio: 'rgba(140, 255, 209, 0.45)',
    decor: 'rgba(255, 201, 140, 0.45)',
    multi: 'rgba(200, 210, 255, 0.45)',
  }

  const cueMarkers = useMemo(() => {
    const markers = new Map()
    sortedCues.forEach((cue, index) => {
      const key = `${cue.target.lineId}:${cue.target.wordIndex ?? 'line'}`
      if (!markers.has(key)) {
        markers.set(key, { numbers: [], types: new Set() })
      }
      const entry = markers.get(key)
      entry.numbers.push(index + 1)
      entry.types.add(cue.type)
    })
    return markers
  }, [sortedCues])


  useEffect(() => {
    setStagePlots((prev) => {
      let changed = false
      const next = {}
      sections.forEach((section) => {
        if (prev[section.id]) {
          next[section.id] = prev[section.id]
        } else {
          next[section.id] = { enabled: false, shapes: [] }
          changed = true
        }
      })
      if (Object.keys(prev).length !== sections.length) {
        changed = true
      }
      return changed ? next : prev
    })
  }, [sections])

  const enableStagePlot = (sectionId) => {
    setStagePlots((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        enabled: true,
        shapes: prev[sectionId]?.shapes ?? [],
      },
    }))
  }

  const disableStagePlot = (sectionId) => {
    setStagePlots((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        enabled: false,
        shapes: prev[sectionId]?.shapes ?? [],
      },
    }))
  }

  const openAddShapeModal = (sectionId, kind) => {
    setActiveSectionId(sectionId)
    setEditingShapeId(null)
    setShapeDraft({
      name: '',
      description: '',
      label: 'licht',
      kind,
      size: 70,
    })
    setShapeModalOpen(true)
  }

  const openEditShapeModal = (sectionId, shape) => {
    setActiveSectionId(sectionId)
    setEditingShapeId(shape.id)
    setShapeDraft({
      name: shape.name ?? '',
      description: shape.description ?? '',
      label: shape.label ?? 'licht',
      kind: shape.kind ?? 'circle',
      size: shape.size ?? 70,
    })
    setShapeModalOpen(true)
  }

  const removeShape = (sectionId, shapeId) => {
    setStagePlots((prev) => {
      const section = prev[sectionId]
      if (!section) return prev
      return {
        ...prev,
        [sectionId]: {
          ...section,
          shapes: section.shapes.filter((shape) => shape.id !== shapeId),
        },
      }
    })
  }

  const saveShape = () => {
    if (!activeSectionId) return
    const normalizedSize = Math.max(30, Number(shapeDraft.size) || 70)
    setStagePlots((prev) => {
      const section = prev[activeSectionId] || { enabled: true, shapes: [] }
      const shapes = [...section.shapes]
      if (editingShapeId) {
        const index = shapes.findIndex((shape) => shape.id === editingShapeId)
        if (index !== -1) {
          shapes[index] = {
            ...shapes[index],
            name: shapeDraft.name.trim(),
            description: shapeDraft.description.trim(),
            label: shapeDraft.label,
            kind: shapeDraft.kind,
            size: normalizedSize,
          }
        }
      } else {
        shapes.push({
          id: crypto.randomUUID(),
          x: 160,
          y: 120,
          size: normalizedSize,
          kind: shapeDraft.kind,
          label: shapeDraft.label,
          name: shapeDraft.name.trim() || 'Object',
          description: shapeDraft.description.trim(),
        })
      }
      return {
        ...prev,
        [activeSectionId]: {
          ...section,
          enabled: true,
          shapes,
        },
      }
    })
    setShapeModalOpen(false)
    setEditingShapeId(null)
  }

  const handleShapePointerMove = useCallback((event) => {
    const dragState = dragStateRef.current
    if (!dragState) return
    const { sectionId, shapeId, mode, offsetX, offsetY, rect, startX, startY, startSize } =
      dragState
    setStagePlots((prev) => {
      const section = prev[sectionId]
      if (!section) return prev
      const shapes = section.shapes.map((shape) => {
        if (shape.id !== shapeId) return shape
        if (mode === 'resize') {
          const delta = Math.max(event.clientX - startX, event.clientY - startY)
          let nextSize = Math.max(30, Math.min(360, startSize + delta))
          const maxSizeX = rect.width - shape.x
          const maxSizeY = rect.height - shape.y
          nextSize = Math.min(nextSize, maxSizeX, maxSizeY)
          return { ...shape, size: nextSize }
        }
        const rawX = event.clientX - rect.left - offsetX
        const rawY = event.clientY - rect.top - offsetY
        const maxX = Math.max(0, rect.width - shape.size)
        const maxY = Math.max(0, rect.height - shape.size)
        const x = Math.min(maxX, Math.max(0, rawX))
        const y = Math.min(maxY, Math.max(0, rawY))
        return { ...shape, x, y }
      })
      return {
        ...prev,
        [sectionId]: {
          ...section,
          shapes,
        },
      }
    })
  }, [])

  const endShapeDrag = useCallback(() => {
    dragStateRef.current = null
    window.removeEventListener('pointermove', handleShapePointerMove)
    window.removeEventListener('pointerup', endShapeDrag)
  }, [handleShapePointerMove])

  const startShapeMove = (event, sectionId, shape) => {
    if (event.button !== 0) return
    const canvas = event.currentTarget.closest('.plot-canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    event.preventDefault()
    event.stopPropagation()
    dragStateRef.current = {
      sectionId,
      shapeId: shape.id,
      mode: 'move',
      offsetX: event.clientX - rect.left - shape.x,
      offsetY: event.clientY - rect.top - shape.y,
      rect,
    }
    window.addEventListener('pointermove', handleShapePointerMove)
    window.addEventListener('pointerup', endShapeDrag)
  }

  const startShapeResize = (event, sectionId, shape) => {
    const canvas = event.currentTarget.closest('.plot-canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    event.preventDefault()
    event.stopPropagation()
    dragStateRef.current = {
      sectionId,
      shapeId: shape.id,
      mode: 'resize',
      rect,
      startX: event.clientX,
      startY: event.clientY,
      startSize: shape.size ?? 70,
    }
    window.addEventListener('pointermove', handleShapePointerMove)
    window.addEventListener('pointerup', endShapeDrag)
  }

  useEffect(() => () => {
    window.removeEventListener('pointermove', handleShapePointerMove)
    window.removeEventListener('pointerup', endShapeDrag)
  }, [handleShapePointerMove, endShapeDrag])


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="page">
        <Box className="page__bg" />

        {step === 0 && (
          <Box className="page__content">
            <Card className="card">
              <CardContent>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary">
                      Toneelmaker
                    </Typography>
                    <Typography variant="h1">Start je toneeltje</Typography>
                    <Typography color="text.secondary">
                      Kies je groep en ga daarna verder in de editor.
                    </Typography>
                  </Stack>

                  <Stepper activeStep={step} alternativeLabel>
                    {STEPS.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel id="play-label">Groep</InputLabel>
                      <Select
                        labelId="play-label"
                        id="play"
                        label="Groep"
                        value={selectedPlay}
                        onChange={(event) => setSelectedPlay(event.target.value)}
                        sx={{
                          backgroundColor: 'rgba(12, 14, 32, 0.95)',
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              backgroundColor: 'rgba(12, 14, 32, 0.98)',
                            },
                          },
                        }}
                      >
                        {PLAYS.map((play) => (
                          <MenuItem key={play.id} value={play.id}>
                            {play.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Card variant="outlined" className="summary">
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography variant="h2">Korte inhoud</Typography>
                          <Typography color="text.secondary">{summary}</Typography>
                        </Stack>
                      </CardContent>
                    </Card>

                    <Button variant="outlined" component="label" sx={{ alignSelf: 'flex-start' }}>
                      Importeer JSON
                      <input type="file" accept="application/json" hidden onChange={handleImport} />
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => setStep(1)}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Naar schrijven
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}

        {step >= 1 && (
          <Box className="workspace">
            <AppBar
              position="sticky"
              elevation={0}
              sx={{
                background: 'rgba(12, 14, 32, 0.92)',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1.5 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={1}
                >
                  <Typography variant="h6">Toneelmaker</Typography>
                </Stack>
                <Stepper activeStep={step} alternativeLabel>
                  {STEPS.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Toolbar>
            </AppBar>

            <Box className="workspace__content">
              {step === 1 && (
                <Box className="editor">
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h2">Main editor</Typography>
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                      <Typography variant="h2">Personages</Typography>
                      {characters.map((character) => (
                        <Stack
                          key={character.id}
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          sx={{ alignItems: { sm: 'center' } }}
                        >
                          <TextField
                            label="Personage"
                            value={character.name}
                            onChange={(event) =>
                              updateCharacter(
                                character.id,
                                'name',
                                event.target.value
                              )
                            }
                            sx={{ flexBasis: { sm: 180 }, flexGrow: 0 }}
                          />
                          <TextField
                            label="Gekoppelde persoon"
                            value={character.person}
                            onChange={(event) =>
                              updateCharacter(
                                character.id,
                                'person',
                                event.target.value
                              )
                            }
                            sx={{
                              flexBasis: { sm: 220 },
                              flexGrow: 0,
                              alignSelf: { sm: 'flex-start' },
                            }}
                          />
                          <IconButton
                            onClick={() => removeCharacter(character.id)}
                            sx={{
                              color: 'rgba(255,255,255,0.7)',
                              '&:hover': { color: '#ff5c70' },
                            }}
                            aria-label="Verwijder personage"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={addCharacter}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        Personage toevoegen
                      </Button>
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                      <Typography variant="h2">Tekstlijnen</Typography>
                      {lines.map((line, index) => (
                        <Stack
                          key={line.id}
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          sx={{
                            alignItems: { sm: 'center' },
                            position: 'relative',
                            borderRadius: 1.5,
                            transition: 'background-color 0.2s ease',
                            backgroundColor:
                              dropTargetId === line.id
                                ? 'rgba(124, 139, 255, 0.12)'
                                : 'transparent',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              top: -6,
                              height: 2,
                              borderRadius: 999,
                              background:
                                dropTargetId === line.id
                                  ? 'linear-gradient(90deg, transparent, rgba(124,139,255,0.9), transparent)'
                                  : 'transparent',
                              transition: 'opacity 0.2s ease',
                            },
                          }}
                          onDragOver={(event) => {
                            event.preventDefault()
                            setDropTargetId(line.id)
                          }}
                          onDrop={() => {
                            moveLine(draggedLineId, line.id)
                            setDraggedLineId(null)
                            setDropTargetId(null)
                          }}
                        >
                          <IconButton
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.effectAllowed = 'move'
                              setDraggedLineId(line.id)
                            }}
                            onDragEnd={() => {
                              setDraggedLineId(null)
                              setDropTargetId(null)
                            }}
                            sx={{
                              cursor: 'grab',
                              color: 'rgba(255,255,255,0.55)',
                              '&:hover': { color: '#ffffff' },
                            }}
                            aria-label="Versleep regel"
                          >
                            <DragIndicatorIcon />
                          </IconButton>
                          {line.type !== 'sectie' && (
                            <TextField
                              label=" "
                              value={index + 1}
                              InputProps={{ readOnly: true }}
                              inputProps={{ tabIndex: -1 }}
                              sx={{
                                width: { sm: 90 },
                                '& .MuiOutlinedInput-root': {
                                  pointerEvents: 'none',
                                  '& fieldset': {
                                    borderColor: 'transparent',
                                  },
                                },
                                '& .MuiInputBase-input': {
                                  textAlign: 'center',
                                  padding: '8px 0',
                                },
                              }}
                            />
                          )}
                          {line.type === 'tekst' ? (
                            <FormControl sx={{ minWidth: { sm: 180 } }}>
                              <InputLabel id={`character-${line.id}`}>Personage</InputLabel>
                              <Select
                                labelId={`character-${line.id}`}
                                label="Personage"
                                value={line.characterId}
                                onChange={(event) =>
                                  updateLine(
                                    line.id,
                                    'characterId',
                                    event.target.value
                                  )
                                }
                              >
                                <MenuItem value="">Geen</MenuItem>
                                {characters.map((character) => (
                                  <MenuItem key={character.id} value={character.id}>
                                    {character.name || 'Onbenoemd'}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Box sx={{ minWidth: { sm: 180 } }} />
                          )}
                          {line.type === 'sectie' ? (
                            <TextField
                              label="Sectienaam"
                              value={line.text}
                              onChange={(event) =>
                                updateLine(line.id, 'text', event.target.value)
                              }
                              placeholder="Bijv. Scène 2 - De bakkerij"
                              fullWidth
                            />
                          ) : (
                            <TextField
                              label="Tekst"
                              value={line.text}
                              onChange={(event) =>
                                updateLine(line.id, 'text', event.target.value)
                              }
                              multiline
                              minRows={1}
                              maxRows={6}
                              fullWidth
                              placeholder={
                                line.type === 'actie'
                                  ? 'Bijv. Dansers komen op, licht dimt...'
                                  : 'Dialoog of tekst...'
                              }
                            />
                          )}
                          <FormControl sx={{ minWidth: { sm: 140 } }}>
                            <InputLabel id={`type-${line.id}`}>Type</InputLabel>
                            <Select
                              labelId={`type-${line.id}`}
                              label="Type"
                              value={line.type}
                              onChange={(event) =>
                                updateLine(line.id, 'type', event.target.value)
                              }
                            >
                              <MenuItem value="tekst">Tekst</MenuItem>
                              <MenuItem value="actie">Actie</MenuItem>
                              <MenuItem value="sectie">Sectie</MenuItem>
                            </Select>
                          </FormControl>
                          <IconButton
                            onClick={() => removeLine(line.id)}
                            sx={{
                              color: 'rgba(255,255,255,0.7)',
                              '&:hover': { color: '#ff5c70' },
                            }}
                            aria-label="Verwijder regel"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      ))}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addLine}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Regel toevoegen
                    </Button>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Button variant="text" onClick={() => setStep(0)}>
                        Terug naar keuze groep
                      </Button>
                      <Button variant="contained" onClick={() => setStep(2)}>
                        Naar cues plaatsen
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            )}

              {step === 2 && (
                <Box className="editor editor--split">
                  <Box className="cue-left">
                    <Typography variant="h2">Tekst (read-only)</Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      {lines.map((line, index) => {
                        const character = characters.find(
                          (item) => item.id === line.characterId
                        )
                        const words = line.text
                          ? line.text.split(/\s+/).filter(Boolean)
                          : []

                        const lineKey = `${line.id}:line`
                        const lineMarker = cueMarkers.get(lineKey)
                        const lineMarkerColor =
                          lineMarker && lineMarker.types.size > 1
                            ? cueColors.multi
                            : lineMarker
                            ? cueColors[[...lineMarker.types][0]]
                            : 'transparent'
                        const isLineSelected =
                          selectedTarget?.lineId === line.id &&
                          selectedTarget?.wordIndex == null

                        if (line.type === 'sectie') {
                          return (
                            <Box key={line.id} className="cue-line cue-line--section">
                              <span className="cue-section">
                                {line.text || 'Sectie'}
                              </span>
                            </Box>
                          )
                        }

                        return (
                          <Box
                            key={line.id}
                            className="cue-line"
                            sx={{
                              backgroundColor: lineMarker ? lineMarkerColor : 'transparent',
                              borderRadius: 1.5,
                              paddingLeft: 1,
                              paddingRight: 1,
                            }}
                          >
                            {line.type === 'actie' ? (
                              <span className="cue-index cue-index--empty" />
                            ) : (
                              <button
                                type="button"
                                className={`cue-index ${
                                  isLineSelected ? 'cue-selected' : ''
                                }`}
                              onClick={() => {
                                setSelectedTarget({
                                  lineId: line.id,
                                  lineIndex: index,
                                  wordIndex: null,
                                  wordText: null,
                                })
                                setCueModalOpen(true)
                              }}
                            >
                                {index + 1}
                                {lineMarker && (
                                  <span className="cue-badge">
                                    {lineMarker.numbers.join(',')}
                                  </span>
                                )}
                              </button>
                            )}
                            {line.type === 'actie' ? (
                              <span className="cue-character cue-character--empty" />
                            ) : (
                              <span className="cue-character">
                                {character?.name?.toUpperCase() || 'ONBEKEND'}
                              </span>
                            )}
                            <span className="cue-text">
                              {words.length === 0
                                ? '—'
                                : words.map((word, wordIndex) => (
                                    (() => {
                                      const wordKey = `${line.id}:${wordIndex}`
                                      const marker = cueMarkers.get(wordKey)
                                      const color =
                                        marker && marker.types.size > 1
                                          ? cueColors.multi
                                          : marker
                                          ? cueColors[[...marker.types][0]]
                                          : 'transparent'
                                      const isWordSelected =
                                        selectedTarget?.lineId === line.id &&
                                        selectedTarget?.wordIndex === wordIndex
                                      return (
                                    <button
                                      key={`${line.id}-${wordIndex}`}
                                      type="button"
                                      className={`cue-word ${
                                        isWordSelected ? 'cue-selected' : ''
                                      }`}
                                      onClick={() => {
                                        setSelectedTarget({
                                          lineId: line.id,
                                          lineIndex: index,
                                          wordIndex,
                                          wordText: word,
                                        })
                                        setCueModalOpen(true)
                                      }}
                                      style={{
                                        backgroundColor: marker ? color : 'transparent',
                                      }}
                                    >
                                      {word}
                                      {marker && (
                                        <span className="cue-badge">
                                          {marker.numbers.join(',')}
                                        </span>
                                      )}
                                    </button>
                                      )
                                    })()
                                  ))}
                            </span>
                          </Box>
                        )
                      })}
                    </Stack>
                  </Box>
                  <Box className="cue-right">
                    <Typography variant="h2">Cues</Typography>
                    <Box
                      className="cue-map"
                      sx={{
                        minHeight: Math.max(
                          lines.length * 56 + 220,
                          360,
                          (cuePositions.at(-1)?.top ?? 0) + 160
                        ),
                      }}
                    >
                      {cuePositions.length === 0 && (
                        <Typography color="text.secondary">
                          Nog geen cues toegevoegd.
                        </Typography>
                      )}
                      {cuePositions.map((cue) => (
                        <Card
                          key={cue.id}
                          variant="outlined"
                          className="summary cue-card cue-card--floating"
                          sx={{
                            top: cue.top + 28,
                            backgroundColor:
                              cueColors[cue.type] || 'rgba(17, 20, 40, 0.8)',
                            borderColor: 'rgba(255, 255, 255, 0.18)',
                          }}
                        >
                          <CardContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              spacing={2}
                            >
                              <Stack spacing={0.5}>
                                <Typography variant="overline" color="text.secondary">
                                  Cue {cue.number} · {cue.type.toUpperCase()}
                                </Typography>
                                <Typography>
                                  {cue.description || 'Geen beschrijving.'}
                                </Typography>
                              </Stack>
                              <IconButton
                                onClick={() =>
                                  setCues((prev) =>
                                    prev.filter((item) => item.id !== cue.id)
                                  )
                                }
                                className="cue-delete"
                                aria-label="Verwijder cue"
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Button variant="text" onClick={() => setStep(1)}>
                        Terug naar schrijven
                      </Button>
                      <Button variant="contained" onClick={() => setStep(3)}>
                        Naar stageplot
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              )}

              {step === 3 && (
                <Box className="editor">
                  <Stack spacing={2}>
                    <Typography variant="h2">Stageplot per sectie</Typography>
                    <Typography color="text.secondary">
                      Maak per sectie een stageplot met vormen die je kan slepen en schalen.
                    </Typography>
                    {sections.length === 0 ? (
                      <Card variant="outlined" className="summary">
                        <CardContent>
                          <Typography color="text.secondary">
                            Voeg eerst secties toe in stap 2 (type = sectie) om hier plots te maken.
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : (
                      <Stack spacing={2}>
                        {sections.map((section, index) => {
                          const plot = stagePlots[section.id]
                          const enabled = plot?.enabled
                          const shapes = plot?.shapes ?? []
                          return (
                            <Card key={section.id} variant="outlined" className="plot-section">
                              <CardContent>
                                <Stack spacing={2}>
                                  {!enabled ? (
                                    <Box className="plot-disabled">
                                      <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        justifyContent="space-between"
                                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                                        spacing={1}
                                      >
                                        <Box>
                                          <Typography variant="overline" color="text.secondary">
                                            Sectie {index + 1}
                                          </Typography>
                                          <Typography variant="h2">{section.title}</Typography>
                                        </Box>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          onClick={() => enableStagePlot(section.id)}
                                        >
                                          Maak stageplot
                                        </Button>
                                      </Stack>
                                      <Typography color="text.secondary">
                                        Nog geen stageplot voor deze sectie.
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Box className="plot-layout">
                                      <Box className="plot-sidebar">
                                        <Typography variant="overline" color="text.secondary">
                                          Sectie {index + 1}
                                        </Typography>
                                        <Typography variant="h2">{section.title}</Typography>
                                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                                          <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Button
                                              size="small"
                                              variant="outlined"
                                              startIcon={<AddIcon />}
                                              onClick={() => openAddShapeModal(section.id, 'circle')}
                                            >
                                              Cirkel toevoegen
                                            </Button>
                                            <Button
                                              size="small"
                                              variant="outlined"
                                              startIcon={<AddIcon />}
                                              onClick={() => openAddShapeModal(section.id, 'square')}
                                            >
                                              Vierkant toevoegen
                                            </Button>
                                          </Stack>
                                          <Typography className="plot-help" color="text.secondary">
                                            Sleep vormen om te verplaatsen. Gebruik de hoek om te schalen.
                                          </Typography>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => disableStagePlot(section.id)}
                                            sx={{ alignSelf: 'flex-start' }}
                                          >
                                            Verberg plot
                                          </Button>
                                        </Stack>
                                      </Box>
                                      <Box className="plot-center">
                                        <Box
                                          className="plot-canvas"
                                          style={{
                                            '--plot-cols': stageWidthMeters + 1,
                                            '--plot-rows': stageDepthMeters + 1,
                                            '--plot-grid-cols': stageWidthMeters,
                                            '--plot-grid-rows': stageDepthMeters,
                                          }}
                                        >
                                          <div className="plot-axis plot-axis--top">
                                            {stageWidthTicks.map((tick) => (
                                              <span
                                                key={`top-${tick}`}
                                                className={`plot-axis__tick ${tick === 0 ? 'is-zero' : ''}`}
                                              >
                                                {tick}m
                                              </span>
                                            ))}
                                          </div>
                                          <div className="plot-axis plot-axis--bottom">
                                            {stageWidthTicks.map((tick) => (
                                              <span
                                                key={`bottom-${tick}`}
                                                className={`plot-axis__tick ${tick === 0 ? 'is-zero' : ''}`}
                                              >
                                                {tick}m
                                              </span>
                                            ))}
                                          </div>
                                          <div className="plot-axis plot-axis--left">
                                            {stageDepthTicks.map((tick) => (
                                              <span key={`left-${tick}`} className="plot-axis__tick">
                                                {tick}m
                                              </span>
                                            ))}
                                          </div>
                                          <div className="plot-canvas__label">PODIUM</div>
                                          <div className="plot-canvas__grid" />
                                          {shapes.map((shape) => (
                                            <div
                                              key={shape.id}
                                              className={`plot-shape plot-shape--${shape.kind} plot-shape--${shape.label}`}
                                              style={{
                                                left: shape.x,
                                                top: shape.y,
                                                width: shape.size,
                                                height: shape.size,
                                              }}
                                              onPointerDown={(event) =>
                                                startShapeMove(event, section.id, shape)
                                              }
                                              onDoubleClick={() =>
                                                openEditShapeModal(section.id, shape)
                                              }
                                            >
                                              <div className="plot-shape__title">
                                                {shape.name || 'Object'}
                                              </div>
                                              <div className="plot-shape__label">{shape.label}</div>
                                              <button
                                                type="button"
                                                className="plot-resize-handle"
                                                onPointerDown={(event) =>
                                                  startShapeResize(event, section.id, shape)
                                                }
                                                aria-label="Vorm schalen"
                                              />
                                            </div>
                                          ))}
                                        </Box>
                                        <div className="plot-canvas__audience">PUBLIEK</div>
                                      </Box>
                                      <Box className="plot-list-panel">
                                        <Typography variant="overline" color="text.secondary">
                                          Vormen
                                        </Typography>
                                        {shapes.length === 0 ? (
                                          <Typography color="text.secondary">
                                            Nog geen vormen geplaatst.
                                          </Typography>
                                        ) : (
                                          <Stack spacing={1.5} className="plot-list">
                                            {shapes.map((shape) => (
                                              <Box key={shape.id} className="plot-list-item">
                                                <Box className="plot-list-info">
                                                  <Typography className="plot-list-title">
                                                    {shape.name || 'Object'}
                                                  </Typography>
                                                  <Typography className="plot-list-desc" color="text.secondary">
                                                    {shape.description || '?'}
                                                  </Typography>
                                                  <Typography className="plot-list-meta" color="text.secondary">
                                                    {shape.label}
                                                  </Typography>
                                                </Box>
                                                <Stack direction="row" spacing={1} className="plot-list-actions">
                                                  <Button
                                                    size="small"
                                                    variant="text"
                                                    onClick={() => openEditShapeModal(section.id, shape)}
                                                  >
                                                    Bewerk
                                                  </Button>
                                                  <Button
                                                    size="small"
                                                    variant="text"
                                                    color="error"
                                                    onClick={() => removeShape(section.id, shape.id)}
                                                  >
                                                    Verwijder
                                                  </Button>
                                                </Stack>
                                              </Box>
                                            ))}
                                          </Stack>
                                        )}
                                      </Box>
                                    </Box>
                                  )}
                                </Stack>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </Stack>
                    )}
                    <Stack direction="row" spacing={2}>
                      <Button variant="text" onClick={() => setStep(2)}>
                        Terug naar cues
                      </Button>
                      <Button variant="contained" onClick={() => setStep(4)}>
                        Naar export
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )}

              {step === 4 && (
                <Box className="editor">
                  <Stack spacing={2}>
                    <Typography variant="h2">Export</Typography>
                    <Typography color="text.secondary">
                      Exporteer het volledige stuk als PDF of JSON.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" onClick={exportPdf}>
                        Exporteer PDF
                      </Button>
                      <Button variant="outlined" onClick={exportJson}>
                        Exporteer JSON
                      </Button>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Button variant="text" onClick={() => setStep(3)}>
                        Terug naar stageplot
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={shapeModalOpen}
        onClose={() => {
          setShapeModalOpen(false)
          setEditingShapeId(null)
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(10, 12, 28, 0.94)',
            border: '1px solid rgba(255,255,255,0.12)',
          },
        }}
      >
        <DialogTitle>
          {editingShapeId ? 'Vorm bewerken' : 'Vorm toevoegen'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="shape-kind">Vorm</InputLabel>
              <Select
                labelId="shape-kind"
                label="Vorm"
                value={shapeDraft.kind}
                onChange={(event) =>
                  setShapeDraft((prev) => ({
                    ...prev,
                    kind: event.target.value,
                  }))
                }
              >
                <MenuItem value="circle">Cirkel</MenuItem>
                <MenuItem value="square">Vierkant</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Naam"
              value={shapeDraft.name}
              onChange={(event) =>
                setShapeDraft((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
            <TextField
              label="Beschrijving"
              value={shapeDraft.description}
              onChange={(event) =>
                setShapeDraft((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              multiline
              minRows={3}
            />
            <FormControl fullWidth>
              <InputLabel id="shape-label">Label</InputLabel>
              <Select
                labelId="shape-label"
                label="Label"
                value={shapeDraft.label}
                onChange={(event) =>
                  setShapeDraft((prev) => ({
                    ...prev,
                    label: event.target.value,
                  }))
                }
              >
                <MenuItem value="licht">Licht</MenuItem>
                <MenuItem value="decor">Decor</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          {editingShapeId && (
            <Button
              color="error"
              onClick={() => {
                if (activeSectionId) {
                  removeShape(activeSectionId, editingShapeId)
                }
                setShapeModalOpen(false)
                setEditingShapeId(null)
              }}
            >
              Verwijder
            </Button>
          )}
          <Button
            onClick={() => {
              setShapeModalOpen(false)
              setEditingShapeId(null)
            }}
          >
            Annuleer
          </Button>
          <Button variant="contained" onClick={saveShape}>
            {editingShapeId ? 'Opslaan' : 'Toevoegen'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={cueModalOpen}
        onClose={() => setCueModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(10, 12, 28, 0.94)',
            border: '1px solid rgba(255,255,255,0.12)',
          },
        }}
      >
        <DialogTitle>Cue toevoegen</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="cue-type">Cue type</InputLabel>
              <Select
                labelId="cue-type"
                label="Cue type"
                value={cueType}
                onChange={(event) => setCueType(event.target.value)}
              >
                <MenuItem value="licht">Licht</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="decor">Decor</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Beschrijving"
              value={cueDescription}
              onChange={(event) => setCueDescription(event.target.value)}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCueModalOpen(false)}>Annuleer</Button>
          <Button variant="contained" onClick={addCue} disabled={!selectedTarget}>
            Cue toevoegen
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}

export default App

