import { useState } from 'react'
import { useStore } from '../lib/store'
import type { Valence } from '../types'

type ValenceDimension = 'trust' | 'communication' | 'support' | 'respect' | 'alignment'

const defaultValence: Valence = {
    trust: 0,
    communication: 0,
    support: 0,
    respect: 0,
    alignment: 0,
    notes: ''
}

function ValenceEditorContent({ linkId, initialData }: { linkId: string; initialData: Valence }) {
    const { updateValence } = useStore()
    const [localValence, setLocalValence] = useState<Valence>(initialData)

    const handleChange = (field: keyof Valence, value: number | string) => {
        const newValence = { ...localValence, [field]: value }
        setLocalValence(newValence)
        updateValence(linkId, newValence)
    }

    const dimensions: Array<{ id: ValenceDimension; label: string }> = [
        { id: 'trust', label: 'Trust Level' },
        { id: 'communication', label: 'Communication Quality' },
        { id: 'support', label: 'Mutual Support' },
        { id: 'respect', label: 'Professional Respect' },
        { id: 'alignment', label: 'Goal Alignment' },
    ]

    return (
        <div className="p-4 mt-4 bg-white border rounded-lg shadow-sm border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Valence Assessment</h3>
            <div className="space-y-4">
                {dimensions.map((dim) => {
                    const value = localValence[dim.id]
                    return (
                        <div key={dim.id}>
                            <div className="flex justify-between mb-1">
                                <label className="text-sm font-medium text-slate-700">{dim.label}</label>
                                <span className="text-sm font-bold text-blue-600">
                                    {value > 0 ? '+' : ''}{value}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-5"
                                max="5"
                                step="1"
                                value={value}
                                onChange={(e) => handleChange(dim.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>-5 (Toxic)</span>
                                <span>0 (Neutral)</span>
                                <span>+5 (Vital)</span>
                            </div>
                        </div>
                    )
                })}

                <div>
                    <label className="block mb-1 text-sm font-medium text-slate-700">Notes</label>
                    <textarea
                        className="w-full px-3 py-2 text-sm border rounded-md border-slate-300 focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={localValence.notes || ''}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        placeholder="Observations..."
                    />
                </div>
            </div>
        </div>
    )
}

export function ValenceEditor() {
    const { selectedLinkId, valence } = useStore()

    if (!selectedLinkId) return null

    const initialData = valence[selectedLinkId] || defaultValence

    // key prop forces remount when selectedLinkId changes, resetting state automatically
    return <ValenceEditorContent key={selectedLinkId} linkId={selectedLinkId} initialData={initialData} />
}
