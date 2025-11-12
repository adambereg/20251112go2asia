'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логирование ошибки в production
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Что-то пошло не так</h1>
      <p className="text-lg text-gray-600 mb-8">
        Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте снова.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
      {error.digest && (
        <p className="mt-4 text-sm text-gray-500">
          Код ошибки: {error.digest}
        </p>
      )}
    </div>
  );
}

