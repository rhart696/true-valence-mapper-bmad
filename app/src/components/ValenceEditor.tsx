import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import type { Valence } from '../lib/store'

export function ValenceEditor() {
    const { selectedLinkId, valence, updateValence } = useStore()
    const [localValence, setLocalValence] = useState<Valence>({
        trust: 0,
        communication: 0,
        support: 0,
        respect: 0,
        alignment: 0,
        notes: ''
    })

    useEffect(() => {
        if (selectedLinkId && valence[selectedLinkId]) {
            setLocalValence(valence[selectedLinkId])
        } else {
            // Reset to defaults if no data exists yet
            setLocalValence({
                trust: 0,
                communication: 0,
                support: 0,
                respect: 0,
                alignment: 0,
                notes: ''
            })
        }
    }, [selectedLinkId, valence])

    if (!selectedLinkId) return null

    const handleChange = (field: keyof Valence, value: number | string) => {
        const newValence = { ...localValence, [field]: value }
        setLocalValence(newValence)
        updateValence(selectedLinkId, newValence)
    }

    const dimensions = [
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
                {dimensions.map((dim) => (
                    <div key={dim.id}>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-slate-700">{dim.label}</label>
                            <span className="text-sm font-bold text-blue-600">
                                {(localValence as any)[dim.id] > 0 ? '+' : ''}{(localValence as any)[dim.id]}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-5"
                            max="5"
                            step="1"
                            value={(localValence as any)[dim.id]}
                            onChange={(e) => handleChange(dim.id as keyof Valence, parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>-5 (Toxic)</span>
                            <span>0 (Neutral)</span>
                            <span>+5 (Vital)</span>
                        </div>
                    </div>
                ))}

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
