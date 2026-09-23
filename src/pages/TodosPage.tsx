import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Database, CheckCircle2, Plus, AlertCircle, RefreshCw, Server, ShieldCheck } from 'lucide-react';

interface Todo {
  id: string | number;
  name?: string;
  title?: string;
  is_complete?: boolean;
  created_at?: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoName, setNewTodoName] = useState('');
  const [inserting, setInserting] = useState(false);

  async function getTodos() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from('todos').select('*');
      if (err) {
        setError(err.message);
      } else if (data) {
        setTodos(data);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error querying Supabase todos table';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodoName.trim()) return;
    setInserting(true);
    try {
      const { error: err } = await supabase.from('todos').insert([{ name: newTodoName.trim() }]);
      if (err) {
        // Fallback check if column is named title
        const { error: err2 } = await supabase.from('todos').insert([{ title: newTodoName.trim() }]);
        if (err2) {
          setError(err2.message || err.message);
        } else {
          setNewTodoName('');
          await getTodos();
        }
      } else {
        setNewTodoName('');
        await getTodos();
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to insert todo';
      setError(msg);
    } finally {
      setInserting(false);
    }
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bzxwthyqoscvlplvguit.supabase.co';

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-32 w-full flex-grow">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono mb-4">
            <Database size={13} />
            <span>Supabase Cloud Integration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white mb-2">
            Supabase Todos Database
          </h1>
          <p className="text-white/60 text-sm">
            Connected to project: <span className="font-mono text-emerald-400">{supabaseUrl}</span>
          </p>
        </div>

        {/* Database Status Card */}
        <div className="p-4 bg-[#121212] border border-white/10 rounded-sm mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-white/50 font-semibold font-mono">
                Client Status
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Supabase JS Client Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={getTodos}
            disabled={loading}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs rounded border border-white/15 flex items-center gap-2 transition-all cursor-pointer font-mono"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new task or shoot item..."
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              className="flex-1 bg-black/60 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-white/40 rounded-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={inserting || !newTodoName.trim()}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={14} />
              <span>{inserting ? 'Adding...' : 'Add Todo'}</span>
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-sm mb-6 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-400 mb-0.5">Table Query Notice</div>
              <div>{error}</div>
              <p className="mt-1.5 text-white/50 text-[11px]">
                Note: If the `todos` table is not yet created in your Supabase project, go to your Supabase Dashboard &gt; Table Editor &gt; Create a new table named <code className="text-emerald-300">todos</code> with columns <code className="text-emerald-300">id</code> (int8/uuid) and <code className="text-emerald-300">name</code> (text).
              </p>
            </div>
          </div>
        )}

        {/* Todos List */}
        <div className="bg-[#101010] border border-white/10 rounded-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-white/50">
              Query Results (todos.select())
            </span>
            <span className="text-xs font-mono text-emerald-400">
              {todos.length} record{todos.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-white/40 text-xs flex items-center justify-center gap-2">
              <RefreshCw size={14} className="animate-spin text-emerald-400" />
              <span>Querying Supabase database...</span>
            </div>
          ) : todos.length === 0 ? (
            <div className="p-10 text-center text-white/40 text-xs">
              <Server size={24} className="mx-auto mb-2 text-white/20" />
              <p>No todos found in Supabase.</p>
              <p className="text-[11px] text-white/30 mt-1">
                Insert a task above or through your Supabase SQL editor to see real-time records.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {todos.map((todo, idx) => (
                <li key={todo.id || idx} className="px-5 py-3 text-sm flex items-center gap-3 hover:bg-white/[0.02]">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-white/90 font-medium">
                    {todo.name || todo.title || `Item #${todo.id}`}
                  </span>
                  {todo.created_at && (
                    <span className="ml-auto text-[11px] font-mono text-white/30">
                      {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
