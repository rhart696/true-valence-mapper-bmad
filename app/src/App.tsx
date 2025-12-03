import { useAuthStore, useStore } from './lib/store'
import { LoginPage } from './components/auth/LoginPage'
import { GraphCanvas } from './components/GraphCanvas'
import { ValenceEditor } from './components/ValenceEditor'

function App() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { addNode, addLink, selectedNodeId, selectedLinkId } = useStore()

  if (!isAuthenticated) {
    return <LoginPage />
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
          <span className="text-sm text-slate-500">{user?.email}</span>
          <button
            onClick={logout}
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
