import { useAuthStore } from '../../lib/store';
import { LogOut, Award } from 'lucide-react';

export const Dashboard = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">
                                True Valence Mapper
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                                <Award className="h-4 w-4 text-indigo-600" />
                                <span>{user?.name}</span>
                                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                                    Certified
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-400">
                        Relationship Mapping Canvas (Coming Soon)
                    </div>
                </div>
            </main>
        </div>
    );
};
