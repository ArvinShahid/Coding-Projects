
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CodeDiffProps {
  originalCode: string;
  newCode: string;
  onApply: () => void;
  onReject: () => void;
}

const CodeDiff: React.FC<CodeDiffProps> = ({ originalCode, newCode, onApply, onReject }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [diffHtml, setDiffHtml] = useState<string>('');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(newCode);
    setCopied(true);
    
    toast({
      title: "Copied",
      description: "Generated code copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Generate the diff on component mount or when code changes
    generateDiff(originalCode, newCode);
  }, [originalCode, newCode]);

  const generateDiff = (oldCode: string, newCode: string) => {
    // Split both code samples into lines for comparison
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    
    // Prepare output
    let diffOutput = '';
    
    // Track function context for better diff display
    let inFunction = false;
    let currentFunctionName = '';
    
    // Identify and group functions in old code for better comparison
    const oldFunctions: Record<string, string[]> = {};
    let tempFunctionLines: string[] = [];
    
    // Extract all functions from old code
    for (let i = 0; i < oldLines.length; i++) {
      const line = oldLines[i];
      
      // Detect function start - match various function declaration patterns
      if ((line.includes('function') && line.includes('(')) || 
          line.match(/^\s*[a-zA-Z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*{/) || 
          line.match(/^\s*[a-zA-Z0-9_]+\s*\([^)]*\)\s*{/) ||
          (line.match(/^\s*\/\*\*/) && i + 1 < oldLines.length && oldLines[i+1].includes('function'))) {
        
        // Extract function name using regex
        let functionNameMatch;
        
        // Check for JSDoc comment followed by function
        if (line.match(/^\s*\/\*\*/)) {
          // Look ahead for the actual function declaration
          let j = i + 1;
          while (j < oldLines.length && !oldLines[j].includes('function') && !oldLines[j].match(/^\s*[a-zA-Z0-9_]+\s*\(/)) {
            j++;
          }
          
          if (j < oldLines.length) {
            functionNameMatch = oldLines[j].match(/function\s+([a-zA-Z0-9_]+)/) || 
                               oldLines[j].match(/([a-zA-Z0-9_]+)\s*=\s*\(/) ||
                               oldLines[j].match(/([a-zA-Z0-9_]+)\s*\(/);
                               
            // Start collecting from the JSDoc comment
            if (functionNameMatch) {
              inFunction = true;
              currentFunctionName = functionNameMatch[1];
              tempFunctionLines = oldLines.slice(i, j + 1);
              i = j; // Skip lines we've already processed
              continue;
            }
          }
        } else {
          functionNameMatch = line.match(/function\s+([a-zA-Z0-9_]+)/) || 
                             line.match(/([a-zA-Z0-9_]+)\s*=\s*\(/) ||
                             line.match(/([a-zA-Z0-9_]+)\s*\(/);
        }
        
        if (functionNameMatch) {
          inFunction = true;
          currentFunctionName = functionNameMatch[1];
          tempFunctionLines = [line];
        }
      } 
      // Add line to current function
      else if (inFunction) {
        tempFunctionLines.push(line);
        
        // Detect function end - count brackets to handle nested functions
        if (line.includes('}')) {
          const bracketsOpen = tempFunctionLines.join('').split('{').length - 1;
          const bracketsClose = tempFunctionLines.join('').split('}').length - 1;
          
          if (bracketsOpen === bracketsClose) {
            oldFunctions[currentFunctionName] = [...tempFunctionLines];
            inFunction = false;
            tempFunctionLines = [];
          }
        }
      }
    }
    
    // Process new code line by line
    const processedLines = new Set<number>();
    
    // Extract all exports
    const oldExports = extractExports(oldLines);
    const newExports = extractExports(newLines);
    
    // First pass: Functions and exports
    for (let i = 0; i < newLines.length; i++) {
      if (processedLines.has(i)) continue;
      
      const line = newLines[i];
      
      // Handle exports separately
      if (line.includes('module.exports') || line.includes('export ')) {
        const exportResult = handleExports(oldExports, newExports, newLines, i, processedLines);
        diffOutput += exportResult.html;
        i = exportResult.newIndex - 1; // Adjust i for the next iteration
        continue;
      }
      
      // Detect function start - match various function patterns
      if ((line.includes('function') && line.includes('(')) || 
          line.match(/^\s*[a-zA-Z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*{/) || 
          line.match(/^\s*[a-zA-Z0-9_]+\s*\([^)]*\)\s*{/) ||
          (line.match(/^\s*\/\*\*/) && i + 1 < newLines.length)) {
        
        // Extract function from the new code
        const functionResult = extractFunction(newLines, i);
        if (functionResult) {
          const { functionName, functionLines, endLine } = functionResult;
          
          // Process all extracted lines
          for (let j = i; j <= endLine; j++) {
            processedLines.add(j);
          }
          
          // Check if function exists in old code
          if (oldFunctions[functionName]) {
            const oldFunctionLines = oldFunctions[functionName];
            
            // Compare the two functions
            if (arraysEqual(oldFunctionLines, functionLines)) {
              // Function is identical - render unchanged
              diffOutput += `<div class="diff-section">`;
              for (const line of functionLines) {
                diffOutput += `<div class="diff-line">${applySyntaxHighlightingWithColor(line, 'unchanged')}</div>`;
              }
              diffOutput += `</div>`;
            } else {
              // Function is modified - show detailed diff
              diffOutput += `<div class="diff-section">`;
              diffOutput += `<div class="diff-section-header text-blue-400 text-xs mt-2 mb-1">Modified function: ${functionName}</div>`;
              
              // Create a line-by-line comparison
              diffOutput += renderLineDiff(oldFunctionLines, functionLines);
              
              diffOutput += `</div>`;
            }
          } else {
            // New function - highlight all lines in green
            diffOutput += `<div class="diff-section">`;
            diffOutput += `<div class="diff-section-header text-green-400 text-xs mt-2 mb-1">New function: ${functionName}</div>`;
            
            for (const line of functionLines) {
              diffOutput += `<div class="diff-line diff-added">${applySyntaxHighlightingWithColor(line, 'added')}</div>`;
            }
            
            diffOutput += `</div>`;
          }
          
          // Skip to the end of the function for the next iteration
          i = endLine;
          continue;
        }
      }
      
      // Non-function line that hasn't been processed yet
      if (!processedLines.has(i)) {
        if (oldLines.includes(line)) {
          // Line is unchanged
          diffOutput += `<div class="diff-line">${applySyntaxHighlightingWithColor(line, 'unchanged')}</div>`;
        } else {
          // Line is new
          diffOutput += `<div class="diff-line diff-added">${applySyntaxHighlightingWithColor(line, 'added')}</div>`;
        }
        processedLines.add(i);
      }
    }
    
    // Add completely removed functions
    const removedFunctions = Object.keys(oldFunctions).filter(functionName => 
      !newCode.includes(functionName) || 
      !newCode.includes(oldFunctions[functionName][0])
    );
    
    if (removedFunctions.length > 0) {
      diffOutput += `<div class="diff-section">`;
      diffOutput += `<div class="diff-section-header text-red-400 text-xs mt-2 mb-1">Removed functions:</div>`;
      
      for (const functionName of removedFunctions) {
        for (const line of oldFunctions[functionName]) {
          diffOutput += `<div class="diff-line diff-removed">${applySyntaxHighlightingWithColor(line, 'removed')}</div>`;
        }
      }
      
      diffOutput += `</div>`;
    }
    
    setDiffHtml(diffOutput);
  };

  // Helper: Extract exports from code
  const extractExports = (lines: string[]): string[] => {
    const exports: string[] = [];
    let collectingExports = false;
    let exportBlock: string[] = [];
    
    for (const line of lines) {
      if (line.includes('module.exports') || line.includes('export ')) {
        collectingExports = true;
        exportBlock = [line];
      } else if (collectingExports) {
        exportBlock.push(line);
        if (line.includes('};') || line.includes('};')) {
          collectingExports = false;
          exports.push(exportBlock.join('\n'));
          exportBlock = [];
        }
      }
    }
    
    return exports;
  };
  
  // Helper: Handle exports differences
  const handleExports = (oldExports: string[], newExports: string[], lines: string[], startIndex: number, processedLines: Set<number>): { html: string, newIndex: number } => {
    let html = '';
    let endIndex = startIndex;
    
    // Extract the full export block
    let exportBlock: string[] = [];
    let i = startIndex;
    
    while (i < lines.length) {
      const line = lines[i];
      exportBlock.push(line);
      processedLines.add(i);
      
      if (line.includes('};') || line.includes('};')) {
        endIndex = i + 1;
        break;
      }
      i++;
    }
    
    const newExportText = exportBlock.join('\n');
    
    // Check if this export block matches any old export
    const matchingOldExport = oldExports.find(exportText => {
      // Normalize whitespace for comparison
      const normalizedOld = exportText.replace(/\s+/g, ' ').trim();
      const normalizedNew = newExportText.replace(/\s+/g, ' ').trim();
      return normalizedOld === normalizedNew;
    });
    
    if (matchingOldExport) {
      // Export is unchanged
      for (const line of exportBlock) {
        html += `<div class="diff-line">${applySyntaxHighlightingWithColor(line, 'unchanged')}</div>`;
      }
    } else {
      // Export is modified - highlight differences
      html += `<div class="diff-section-header text-blue-400 text-xs mt-2 mb-1">Modified exports</div>`;
      
      // Extract export items for comparison
      const oldItems = extractExportItems(oldExports.join('\n'));
      const newItems = extractExportItems(newExportText);
      
      // Show added or modified exports
      for (const line of exportBlock) {
        const itemMatch = line.match(/\s*([a-zA-Z0-9_]+)(,|\s|$)/);
        if (itemMatch && newItems.has(itemMatch[1])) {
          if (oldItems.has(itemMatch[1])) {
            // Item exists in both exports - unchanged
            html += `<div class="diff-line">${applySyntaxHighlightingWithColor(line, 'unchanged')}</div>`;
          } else {
            // Item is new - highlight in green
            html += `<div class="diff-line diff-added">${applySyntaxHighlightingWithColor(line, 'added')}</div>`;
          }
        } else {
          // Other lines (brackets, etc.)
          html += `<div class="diff-line">${applySyntaxHighlightingWithColor(line, 'unchanged')}</div>`;
        }
      }
    }
    
    return { html, newIndex: endIndex };
  };
  
  // Helper: Extract export items from an export block
  const extractExportItems = (exportText: string): Set<string> => {
    const items = new Set<string>();
    const matches = exportText.match(/[a-zA-Z0-9_]+(?=\s*[:,])/g);
    
    if (matches) {
      for (const match of matches) {
        items.add(match);
      }
    }
    
    return items;
  };
  
  // Helper: Extract a complete function from code lines
  const extractFunction = (lines: string[], startIndex: number): { functionName: string, functionLines: string[], endLine: number } | null => {
    let functionLines: string[] = [];
    let currentLine = startIndex;
    let functionName = '';
    let foundFunction = false;
    let bracketCount = 0;
    
    // Handle JSDoc comments
    if (lines[currentLine].match(/^\s*\/\*\*/)) {
      do {
        functionLines.push(lines[currentLine]);
        currentLine++;
      } while (currentLine < lines.length && !lines[currentLine].includes('*/'));
      
      if (currentLine < lines.length) {
        functionLines.push(lines[currentLine]); // Add the closing comment line
        currentLine++;
      }
    }
    
    // Look for the actual function declaration
    while (currentLine < lines.length && !foundFunction) {
      const line = lines[currentLine];
      functionLines.push(line);
      
      const nameMatch = line.match(/function\s+([a-zA-Z0-9_]+)/) || 
                       line.match(/([a-zA-Z0-9_]+)\s*=\s*\(/) ||
                       line.match(/([a-zA-Z0-9_]+)\s*\(/);
                       
      if (nameMatch) {
        functionName = nameMatch[1];
        foundFunction = true;
        
        // Count opening brackets in this line
        bracketCount += (line.match(/{/g) || []).length;
      }
      
      currentLine++;
    }
    
    if (!foundFunction) {
      return null;
    }
    
    // Continue collecting lines until function end
    while (currentLine < lines.length) {
      const line = lines[currentLine];
      functionLines.push(line);
      
      // Count brackets
      bracketCount += (line.match(/{/g) || []).length;
      bracketCount -= (line.match(/}/g) || []).length;
      
      if (bracketCount === 0) {
        break;
      }
      
      currentLine++;
    }
    
    return {
      functionName,
      functionLines,
      endLine: currentLine
    };
  };
  
  // Helper: Render line-by-line diff between two blocks of code
  const renderLineDiff = (oldLines: string[], newLines: string[]): string => {
    let html = '';
    
    // Find common lines and changed lines
    const commonLines = new Set<string>();
    const oldSet = new Set(oldLines);
    const newSet = new Set(newLines);
    
    for (const line of oldLines) {
      if (newSet.has(line)) {
        commonLines.add(line);
      }
    }
    
    // Render new lines, marking additions
    for (const line of newLines) {
      if (commonLines.has(line)) {
        html += `<div class="diff-line">${applySyntaxHighlightingWithColor(line, 'unchanged')}</div>`;
      } else {
        html += `<div class="diff-line diff-added">${applySyntaxHighlightingWithColor(line, 'added')}</div>`;
      }
    }
    
    // Show removed lines
    const removedLines = oldLines.filter(line => !newSet.has(line));
    if (removedLines.length > 0) {
      html += `<div class="diff-section-header text-red-400 text-xs mt-2 mb-1">Removed lines:</div>`;
      for (const line of removedLines) {
        html += `<div class="diff-line diff-removed">${applySyntaxHighlightingWithColor(line, 'removed')}</div>`;
      }
    }
    
    return html;
  };
  
  // Helper: Check if two arrays have the same contents
  const arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // Apply syntax highlighting with color-coded changes
  const applySyntaxHighlightingWithColor = (code: string, changeType: 'added' | 'removed' | 'unchanged') => {
    // Base highlighting
    let highlightedCode = code
      .replace(/\/\/(.*)/g, '<span class="text-[#8E9196]">$&</span>') // Comments 
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-[#8E9196]">$&</span>') // Multiline comments
      .replace(/('.*?'|".*?")/g, '<span class="text-[#FEF7CD]">$&</span>') // Strings
      .replace(/\b(function|return|if|else|for|while|const|let|var)\b/g, '<span class="text-[#9b87f5]">$&</span>') // Keywords
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-[#D3E4FD]">$&</span>'); // Constants
      
    // Apply change type class
    if (changeType === 'added') {
      return `<span class="text-green-400">${highlightedCode}</span>`;
    } else if (changeType === 'removed') {
      return `<span class="text-red-400">${highlightedCode}</span>`;
    }
    
    return highlightedCode;
  };

  return (
    <div className="h-[500px] flex flex-col overflow-hidden bg-codemate-darker">
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="mb-3 text-xs text-gray-400 border-b border-white/10 pb-2 flex justify-between items-center">
          <span>AI-suggested implementation:</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            <span className="text-xs">{copied ? "Copied!" : "Copy Code"}</span>
          </Button>
        </div>
        <pre className="text-sm font-mono text-[#E5DEFF] whitespace-pre-wrap">
          <code dangerouslySetInnerHTML={{ __html: diffHtml }} />
        </pre>
      </div>
      <div className="p-4 flex gap-2 justify-end border-t border-white/10">
        <button 
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-gray-300 transition-colors"
          onClick={onReject}
        >
          Reject
        </button>
        <button 
          className="text-xs bg-codemate-purple hover:bg-codemate-purple/90 px-3 py-1.5 rounded-md text-white transition-colors"
          onClick={onApply}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default CodeDiff;
