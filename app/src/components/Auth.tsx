import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            alert(error.message)
        } else {
            setMessage('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="flex justify-center mb-6">
                    <img src="/logo.png" alt="ProActive Logo" className="h-16" />
                </div>
                <h1 className="mb-6 text-2xl font-bold text-center text-slate-900">True Valence Mapper</h1>
                <p className="mb-8 text-center text-slate-600">Enter your email to sign in via Magic Link</p>

                {message ? (
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                id="email"
                                className="w-full px-3 py-2 mt-1 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="email"
                                placeholder="coach@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Sending magic link...' : 'Send Magic Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
