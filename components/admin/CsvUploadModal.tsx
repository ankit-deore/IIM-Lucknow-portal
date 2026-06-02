'use client';

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { X, UploadCloud, AlertCircle, CheckCircle, FileWarning } from 'lucide-react';
import { generateCsvTemplate } from '@/lib/csv-utils';
import { PROGRAMMES } from '@/constants/programmes';
import { toastError } from '@/lib/toast';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedRow {
  name: string;
  email: string;
  programme: string;
  batch: string;
  dob: string;
  currentRole?: string;
  company?: string;
  industry?: string;
  workExperience?: string;
  _validation?: {
    isValid: boolean;
    errors: string[];
    isWarning?: boolean;
  };
}

export function CsvUploadModal({ isOpen, onClose, onSuccess }: CsvUploadModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; skipped: number; errors: any[] } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateRow = (row: any): ParsedRow['_validation'] => {
    const errors: string[] = [];
    
    if (!row.name || !row.name.trim()) errors.push('Name is required');
    if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push('Invalid email');
    if (!row.programme || !PROGRAMMES.includes(row.programme.trim().toUpperCase() as any)) {
      errors.push(`Programme must be one of: ${PROGRAMMES.join(', ')}`);
    }
    if (!row.batch || !row.batch.toString().trim()) errors.push('Batch is required');
    
    // basic date validation
    if (!row.dob || isNaN(Date.parse(row.dob))) errors.push('Invalid DOB format (use YYYY-MM-DD)');

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleFileUpload = (file: File) => {
    setIsParsing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(), // normalise headers
      complete: (results) => {
        const data = results.data as any[];
        
        // Map common variations to standard keys
        const rows: ParsedRow[] = data.map(row => {
          const standardRow = {
            name: row.name || row['full name'] || '',
            email: row.email || row['email address'] || '',
            programme: (row.programme || '').trim().toUpperCase(),
            batch: row.batch || '',
            dob: row.dob || row['date of birth'] || '',
            currentRole: row.currentrole || row['current role'] || '',
            company: row.company || '',
            industry: row.industry || '',
            workExperience: row.workexperience || row['work experience'] || '',
          };
          
          return {
            ...standardRow,
            _validation: validateRow(standardRow)
          };
        });
        
        setParsedRows(rows);
        setIsParsing(false);
        setStep(2);
      },
      error: (error) => {
        toastError('Failed to parse CSV: ' + error.message);
        setIsParsing(false);
      }
    });
  };

  const handleImport = async () => {
    const validRows = parsedRows.filter(r => r._validation?.isValid);
    if (validRows.length === 0) return;

    setImporting(true);
    setStep(3);
    
    try {
      const res = await fetch('/api/admin/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students: validRows.map(r => {
          const { _validation, ...rest } = r;
          return rest;
        })}),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Bulk import failed');
      
      setImportResult(data.data);
    } catch (error: any) {
      toastError(error.message);
      setStep(2);
    } finally {
      setImporting(false);
    }
  };

  const resetState = () => {
    setStep(1);
    setParsedRows([]);
    setImportResult(null);
  };

  const validCount = parsedRows.filter(r => r._validation?.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Upload Student Roster</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex border-b border-border bg-surface/30">
          {[1, 2, 3].map(i => (
            <div key={i} className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${step === i ? 'border-primary text-primary' : step > i ? 'border-green-500 text-green-600' : 'border-transparent text-text-secondary'}`}>
              Step {i}: {i === 1 ? 'Upload' : i === 2 ? 'Validate' : 'Import'}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-surface/10">
          
          {step === 1 && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div 
                className="w-full max-w-lg border-2 border-dashed border-border rounded-lg p-12 text-center bg-white hover:bg-surface/30 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">Upload CSV File</h3>
                <p className="text-sm text-text-secondary mb-6">Drag and drop your .csv file here, or click to browse.</p>
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                {isParsing && <p className="text-sm text-accent mt-2 font-medium animate-pulse">Parsing file...</p>}
              </div>
              <button 
                onClick={generateCsvTemplate}
                className="mt-8 text-sm text-primary hover:underline font-medium"
              >
                Download CSV Template
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1 bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">{validCount} rows ready to import</p>
                  </div>
                </div>
                {invalidCount > 0 && (
                  <div className="flex-1 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-3">
                    <FileWarning className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">{invalidCount} rows have errors</p>
                      <p className="text-xs text-red-600">These will be skipped.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface text-text-secondary uppercase">
                      <tr>
                        <th className="px-4 py-3 w-8"></th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Prog</th>
                        <th className="px-4 py-3">Batch</th>
                        <th className="px-4 py-3">Errors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {parsedRows.slice(0, 100).map((row, i) => (
                        <tr key={i} className={row._validation?.isValid ? '' : 'bg-red-50/50'}>
                          <td className="px-4 py-3">
                            {row._validation?.isValid ? 
                              <CheckCircle className="w-4 h-4 text-green-500" /> : 
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            }
                          </td>
                          <td className="px-4 py-3 font-medium">{row.name}</td>
                          <td className="px-4 py-3">{row.email}</td>
                          <td className="px-4 py-3">{row.programme}</td>
                          <td className="px-4 py-3">{row.batch}</td>
                          <td className="px-4 py-3 text-red-600 text-xs">
                            {!row._validation?.isValid && row._validation?.errors.join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedRows.length > 100 && (
                  <div className="p-3 text-center text-xs text-text-secondary border-t border-border bg-surface">
                    Showing first 100 rows...
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              {importing ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-text-primary">Importing Students...</h3>
                  <p className="text-sm text-text-secondary mt-1">Please do not close this window.</p>
                </div>
              ) : importResult ? (
                <div className="w-full max-w-lg space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-800">Import Complete!</h3>
                    <p className="text-green-700 mt-1">{importResult.created} students created and invite emails sent.</p>
                  </div>
                  
                  {importResult.skipped > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-800">{importResult.skipped} rows skipped</p>
                        <p className="text-sm text-amber-700 mt-1">These emails are already registered in the system.</p>
                      </div>
                    </div>
                  )}

                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="font-semibold text-red-800 mb-2">{importResult.errors.length} rows failed</p>
                      <ul className="text-sm text-red-700 list-disc pl-5">
                        {importResult.errors.map((e, i) => (
                          <li key={i}>{e.email}: {e.error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end gap-3 bg-surface">
          {step === 1 && (
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-md bg-white hover:bg-surface/50 transition-colors">
              Cancel
            </button>
          )}
          {step === 2 && (
            <>
              <button onClick={resetState} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-md bg-white hover:bg-surface/50 transition-colors">
                Start Over
              </button>
              <button 
                onClick={handleImport}
                disabled={validCount === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Proceed to Import ({validCount})
              </button>
            </>
          )}
          {step === 3 && !importing && (
            <button 
              onClick={() => { onClose(); onSuccess(); }}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
