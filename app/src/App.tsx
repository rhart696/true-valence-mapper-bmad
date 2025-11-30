import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Auth } from './components/Auth'
import { GraphCanvas } from './components/GraphCanvas'
import { ValenceEditor } from './components/ValenceEditor'
import { useStore } from './lib/store'

function App() {
  const [session, setSession] = useState<any>(null)
  const { addNode, addLink, selectedNodeId, selectedLinkId } = useStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load session data when user is authenticated
  useEffect(() => {
    if (session?.user) {
      const loadData = async () => {
        const { data } = await supabase
          .from('sessions')
          .select('data')
          .eq('user_id', session.user.id)
          .single()

        if (data?.data) {
          useStore.getState().loadSession(data.data)
        }
      }
      loadData()
    }
  }, [session])

  if (!session) {
    return <Auth />
  }

  const handleAddNode = () => {
    const name = prompt("Enter person's name:")
    if (!name) return
    const id = crypto.randomUUID()
    addNode({ id, name, role: 'Peer' })
    addLink({ source: 'me', target: id, type: 'Collaboration' })
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="ProActive" className="h-8" />
          <h1 className="text-xl font-bold text-slate-800">True Valence Mapper</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 p-4 overflow-y-auto bg-white border-r border-slate-200">
          <div className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-slate-500 uppercase">Actions</h2>
            <button
              onClick={handleAddNode}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              + Add Person
            </button>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-slate-500 uppercase">Selection</h2>
            {selectedNodeId ? (
              <div className="p-3 text-sm rounded bg-slate-50">
                Selected Node: <span className="font-bold">{selectedNodeId}</span>
              </div>
            ) : selectedLinkId ? (
              <div className="p-3 text-sm rounded bg-slate-50">
                Selected Relationship: <span className="font-bold">{selectedLinkId}</span>
                <ValenceEditor />
              </div>
            ) : (
              <p className="text-sm text-slate-400">Select a node or line to edit.</p>
            )}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 p-4 bg-slate-50">
          <GraphCanvas />
        </div>
      </main>
    </div>
  )
}

export default App
