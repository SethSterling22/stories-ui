import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiSave, FiCpu, FiX, FiRefreshCw } from 'react-icons/fi';
import Modal from '../../../../components/Modal/Modal';
import { TranscriptionSegment } from '../../../../types/transcription';


// 🌐 n8n Webhook URL for Agent
// (If running with the test webhook, the workflow must be set to Listen manually)
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;


interface AnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  segment: TranscriptionSegment | null;
  onSave: (annotation: string) => void;
  access_token: string | null;
}

const ExtractionModal: React.FC<AnnotationModalProps> = ({
  isOpen,
  onClose,
  segment,
  onSave,
  access_token,
}) => {
  const [annotation, setAnnotation] = useState('');
  // State to handle the charge during the Agent call
  const [isLoading, setIsLoading] = useState(false);
  // State to handle extraction errors
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (segment) {
      setAnnotation(segment.annotation || '');
      setError(null); // Error cleaning
    }
  }, [segment]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /* /////////// Logic to call for Location Extraction /////////// */
  const extractLocations = async () => {
    if (!segment || !segment.text) return;

    // 🛑 REFUERZO: Verifica que la variable existe Y que no es una cadena vacía.
    if (!access_token || access_token.trim() === '') {
      setError("Authorization token is missing or empty. Cannot contact n8n.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Send Access Token
          'Authorization': `Bearer ${access_token}`, 
        },
        // Send segment text
        body: JSON.stringify({ 
          texto: segment.text.trim()
        }),
      });

      if (!response.ok) {
        // Mejorar la gestión de errores HTTP:
        // Intentar leer el cuerpo como JSON primero (si n8n devuelve un error 401/500 estructurado)
        // y si falla, usar el texto plano.
        let errorMessage = `HTTP Error ${response.status}: `;
        try {
            const errorJson = await response.json();
            // Asumimos que el error JSON tiene un campo 'message' o 'error'
            errorMessage += errorJson.error || errorJson.message || 'Server returned an unhandled error.';
        } catch {
            // Si falla el parseo de JSON (cuerpo vacío o HTML/texto), usamos el texto crudo.
            const errorText = await response.text();
            errorMessage += errorText.substring(0, 100) + '...';
        }
        
        throw new Error(errorMessage);
      }

      // Receive JSON from the Agent
      const data = await response.json(); 

      // Update the Text field with the returned JSON
      setAnnotation(JSON.stringify(data, null, 2)); 

    } catch (err: any) {
      console.error('Error extracting locations:', err);
      // Show errors in UI
      setError(err.message || 'An unknown error occurred during extraction.');
      
    } finally {
      setIsLoading(false);
    }
  };


  const handleSave = () => {
    // Validation Logic (TO-DO)
    onSave(annotation.trim());
    onClose();
  };

  const handleCancel = () => {
    setAnnotation(segment?.annotation || '');
    onClose();
  };


  if (!segment) return null;

  const footer = (
    <div className="flex justify-end space-x-3">
      
      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FiX className="w-4 h-4 mr-2 inline" />
        Cancel
      </button>

      {/* Extract Locations Button (Call Agent) */}
      <button
        onClick={extractLocations}
        disabled={isLoading || !segment.text} // Disable during charging or if there's no text
        className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <FiRefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
        ) : (
          <FiCpu className="w-4 h-4 mr-2 inline" />
        )}
        {isLoading ? 'Extracting...' : 'Extract Locations'}
      </button>

      {/* Button Save Annotation */}
      <button
        onClick={handleSave}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <FiSave className="w-4 h-4 mr-2 inline" />
        Save Annotation
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Add Annotation"
      size="lg"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Segment Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          {/* ... (Segment details section remains unchanged) ... */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FiMessageSquare className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Segment Details</h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="font-medium">{segment.speaker}</span>
              <span>
                {formatTime(segment.timestamp[0])} - {formatTime(segment.timestamp[1])}
              </span>
            </div>
          </div>
          
          {/* Read-only segment text */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segment Text (Read-only)
            </label>
            <div className="w-full p-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 min-h-[100px] overflow-y-auto">
              {segment.text}
            </div>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                Error from n8n: {error}
            </div>
        )}

        {/* Annotation Input */}
        <div>
          <label htmlFor="annotation" className="block text-sm font-medium text-gray-700 mb-2">
            Annotations
          </label>
          <textarea
            id="annotation"
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
            placeholder="Add your annotation for this segment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y"
            rows={6}
          />
          <p className="mt-2 text-sm text-gray-500">
            Add notes, observations, or any relevant information about this transcription segment.
            (The extracted locations may contain errors and should be reviewed.)
            {isLoading ? 
            <>
              <br></br>
              <br></br> 
            <span className="text-sm text-yellow-600 font-medium">
              The extraction process can take up to 30 seconds...</span> 
            </>: ''}
          </p>
        </div>

        {/* Character count */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{annotation.length} characters</span>
          {segment.annotation && annotation !== segment.annotation && (
            <span className="text-orange-600 font-medium">* Unsaved changes</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExtractionModal;