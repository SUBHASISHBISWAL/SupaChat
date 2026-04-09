import { useState, useCallback } from 'react';

/**
 * Custom hook to manage chatbot interaction state.
 * @returns {{ messages: Array, sendMessage: (text: string) => Promise<void>, isLoading: boolean, error: string|null, clearError: () => void }}
 */
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Date.now().toString(36) + Math.random().toString(36).substring(2),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: data.id,
        role: 'assistant',
        content: data.summary_text,
        sql: data.generated_sql,
        data: data.data,
        chartConfig: data.chart_config,
        createdAt: data.created_at
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearError
  };
}
