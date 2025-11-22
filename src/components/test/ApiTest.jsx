import { useEffect, useState } from 'react';
import { testApiConnection } from '../../services/api';

export default function ApiTest() {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testApiConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    // Test connection when component mounts
    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <span className="font-medium">API Base URL:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded">
            {import.meta.env.VITE_API_URL || 'https://api.iwacu250.com'}
          </code>
        </div>

        <button
          onClick={testConnection}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Connection'}
        </button>

        {testResult && (
          <div className={`p-3 rounded ${
            testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-medium">
              {testResult.success ? '✅ Success!' : '❌ Error'}
            </p>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
