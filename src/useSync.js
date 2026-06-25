/**
 * useSync — hook de sincronização em tempo real via Supabase
 *
 * Uso:
 *   const [statuses, setStatuses] = useSync('statuses', {});
 *
 * - Carrega o valor inicial do banco ao montar
 * - Salva no banco com debounce de 800ms a cada mudança local
 * - Escuta mudanças remotas em tempo real e atualiza o estado local
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient';

export function useSync(key, defaultValue) {
  const [value, setValueLocal] = useState(defaultValue);
  const debounceRef = useRef(null);
  const lastRemote  = useRef(null); // evita loop: remote→local→remote

  // 1. Carregar valor inicial do banco
  useEffect(() => {
    supabase
      .from('painel_estados')
      .select('dados')
      .eq('id', key)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          const parsed = typeof data.dados === 'string'
            ? JSON.parse(data.dados)
            : data.dados;
          lastRemote.current = JSON.stringify(parsed);
          setValueLocal(parsed);
        }
      });
  }, [key]);

  // 2. Escutar mudanças remotas em tempo real
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${key}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'painel_estados', filter: `id=eq.${key}` },
        (payload) => {
          const raw = payload.new?.dados;
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          const serialized = JSON.stringify(parsed);
          // Ignora se for a nossa própria escrita
          if (serialized === lastRemote.current) return;
          lastRemote.current = serialized;
          setValueLocal(parsed);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [key]);

  // 3. Setter com debounce para salvar no banco
  const setValue = useCallback((updater) => {
    setValueLocal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // Debounce: espera 800ms sem alterações antes de salvar
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const serialized = JSON.stringify(next);
        lastRemote.current = serialized;
        supabase
          .from('painel_estados')
          .upsert({ id: key, dados: next, atualizado_em: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.error(`[useSync] Erro ao salvar "${key}":`, error.message);
          });
      }, 800);
      return next;
    });
  }, [key]);

  return [value, setValue];
}
