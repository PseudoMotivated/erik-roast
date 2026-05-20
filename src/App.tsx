import React, { useState, useEffect, useRef } from 'react';

const ERIK_ASCII = `
   ______   ______   __   __  ___
  / __/ /  / __/ /  / /  / / / /
 / _// _ \\/ _// _ \\/ /__/ /_/ / 
/___/_//_/___/_//_/____/\\____/  
      [ THE JUDGE ]
`;

const ROASTS = [
  "I've seen better code from a coffee machine.",
  "Your digital footprint is just a series of 'oops' and 'why?'.",
  "Looking at your session data... Yikes. Even my garbage collector would reject you.",
  "You're the human equivalent of a 404 error.",
  "I'm not saying you're useless, but you're definitely a 'low priority' task.",
  "Your browser history looks like a cry for help from a very confused person.",
  "If disappointment had a IP address, it would be yours.",
  "I've computed the odds of you being interesting. It's roughly 0.0000001%.",
  "You look like you still use 'password123' for everything.",
  "Your presence here is lowering the average IQ of this server cluster.",
  "I'd roast you, but my cooling fans are already struggling with the sheer heat of your mediocrity.",
  "You're like a 'TODO' comment that's been in production for 5 years. Forgotten and embarrassing."
];

function App() {
  const [history, setHistory] = useState<string[]>(["Initializing Erik OS...", "System scan complete.", "Visitor detected.", "Warning: Aesthetic standards not met."]);
  const [input, setInput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `> ${input}`];

    if (cmd === 'clear') {
      setHistory([]);
    } else if (cmd === 'help') {
      setHistory([...newHistory, "Available commands: roast, scan, status, clear, help"]);
    } else if (cmd === 'roast') {
      const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
      setHistory([...newHistory, "Erik is thinking...", "...", roast]);
    } else if (cmd === 'scan') {
      setHistory([...newHistory, "Scanning visitor...", "Checking for soul...", "Result: Not found.", "Checking for personality...", "Result: Generic. Exceptionally generic."]);
    } else if (cmd === 'status') {
      setHistory([...newHistory, "Erik: Online & Disappointed", "Visitor: Low impact", "World: Still better off without your input"]);
    } else {
      setHistory([...newHistory, `Erik doesn't recognize '${cmd}'. Erik thinks you're illiterate.`]);
    }

    setInput("");
  };

  return (
    <div className="terminal">
      <div className="header">ERIK_OS v1.0.0</div>
      <div className="erik-face">
        <pre>{ERIK_ASCII}</pre>
      </div>
      <div className="output" ref={outputRef}>
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('>') ? 'user-input' : ''}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="input-area">
        <span className="prompt">visitor@erik_os:~$</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck="false"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default App;
