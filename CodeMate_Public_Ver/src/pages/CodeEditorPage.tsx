
import React from 'react';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';

const CodeEditorPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <CodeEditor />
      </main>
    </div>
  );
};

export default CodeEditorPage;
