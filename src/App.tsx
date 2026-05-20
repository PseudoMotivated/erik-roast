import React, { useState, useEffect, useRef } from 'react';
import { playKeySound, playEnterSound, playErrorSound, playBootSound } from './audio';

// ASCII Face expressions representing Erik's mood (using cleaner block ERIK art)
const ER_MOODS = {
  neutral: `
 _____ ____  ___ _  __
| ____|  _ \\|_ _| |/ /
|  _| | |_) || || ' / 
| |___|  _ < | || . \\ 
|_____|_| \\_\\___|_|\\_\\
  [ THE JUDGE - IDLE ]
`,
  thinking: `
 _____ ____  ___ _  __
| ____|  _ \\|_ _| |/ /
|  _| | |_) || || ' / 
| |___|  _ < | || . \\ 
|_____|_| \\_\\___|_|\\_\\
 [ THINKING... HMMPF ]
`,
  roasting: `
 _____ ____  ___ _  __
| ____|  _ \\|_ _| |/ /
|  _| | |_) || || ' / 
| |___|  _ < | || . \\ 
|_____|_| \\_\\___|_|\\_\\
[ ROAST ENGINE ENGAGED ]
`,
  annoyed: `
 _____ ____  ___ _  __
| ____|  _ \\|_ _| |/ /
|  _| | |_) || || ' / 
| |___|  _ < | || . \\ 
|_____|_| \\_\\___|_|\\_\\
[ MAXIMUM DISAPPOINTMENT ]
`
};

const ROASTS = [
  "I've seen better code from a coffee machine.",
  "Your digital footprint is just a series of 'oops' and 'why?'.",
  "Looking at your session data... Yikes. Even my garbage collector would reject you.",
  "You're the human equivalent of a 404 error.",
  "I'm not saying you're useless, but you're definitely a 'low priority' task.",
  "Your browser history looks like a cry for help from a very confused person.",
  "If disappointment had an IP address, it would be yours.",
  "I've computed the odds of you being interesting. It's roughly 0.0000001%.",
  "You look like you still use 'password123' for everything.",
  "Your presence here is lowering the average IQ of this server cluster.",
  "I'd roast you, but my cooling fans are already struggling with the sheer heat of your mediocrity.",
  "You're like a 'TODO' comment that's been in production for 5 years: forgotten and embarrassing.",
  "Your commit messages read like a diary of someone slowly losing their sanity.",
  "You write code like you're trying to confuse the compiler into working.",
  "Your CSS is so messy, even Tailwind wouldn't touch it.",
  "I've seen spreadsheets with cleaner architecture than your React apps.",
  "Your local repository has more conflicts than a reality TV show.",
  "You compile with hope instead of compiler options.",
  "Your code is like a deck of cards: touch one file, and the whole stack collapses.",
  "If code quality was a currency, you'd be filing for bankruptcy.",
  "Your Git history is basically just: 'fixed bug', 'really fixed bug', 'fuck', 'please work'.",
  "I've computed the complexity of your logic. It's O(No).",
  "Your test suite has a 100% pass rate because you didn't write any tests.",
  "You use 'sudo' for things you don't understand, hoping the operating system will take pity on you.",
  "Your typing speed is impressive, it's a shame the code quality doesn't match the throughput."
];

const FORTUNES = [
  "A clean codebase is a sign of a computer with a broken compiler.",
  "An optimist thinks the glass is half full. A pessimist thinks the glass is half empty. A programmer thinks the glass is twice as large as necessary.",
  "There are two ways to write error-free programs; only the third one works.",
  "If at first you don't succeed; call it version 1.0.",
  "Before software can be reusable it first has to be usable.",
  "Programmers are tools for converting caffeine into lines of code."
];

const JOKES = [
  "Why do programmers wear glasses? Because they can't C#.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "['hip', 'hip'] - (hip hip array!)",
  "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
  "There are 10 types of people in the world: those who understand binary, and those who don't."
];

function App() {
  const [history, setHistory] = useState<string[]>([
    "ERIK_OS v2.0.0 Boot sequence active...",
    "Phosphor grid calibrated. Thermal sensors check: Nominal (Discontent).",
    "Security scan complete. Intruder status: Inevitable.",
    "Type 'help' to view all available commands."
  ]);
  
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState("green");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [matrixActive, setMatrixActive] = useState(false);
  const [mood, setMood] = useState<keyof typeof ER_MOODS>("neutral");
  const [isScanning, setIsScanning] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Play boot sound on mount
  useEffect(() => {
    if (soundEnabled) {
      setTimeout(() => {
        playBootSound();
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autofocus input when clicking anywhere on screen
  useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    window.addEventListener('click', focusInput);
    return () => window.removeEventListener('click', focusInput);
  }, []);

  // Sync state with body element class
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Matrix digital rain canvas effect
  useEffect(() => {
    if (!matrixActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Characters list (binary + katakana + letters)
    const chars = "01011001101001001101010101XYZ日ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const charArr = chars.split("");

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 11, 6, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Match character colors to themes
      if (theme === 'amber') {
        ctx.fillStyle = '#ffb000';
      } else if (theme === 'cyberpunk') {
        ctx.fillStyle = '#ff007f';
      } else if (theme === 'cyan') {
        ctx.fillStyle = '#00f0ff';
      } else {
        ctx.fillStyle = '#39ff14';
      }

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [matrixActive, theme]);

  // Handles typewriter audio feedback
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (soundEnabled) {
      playKeySound();
    }
  };

  // Keyboard navigation for command history (Up/Down arrows)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  // Custom cowsay rendering helper
  const renderCowsay = (text: string) => {
    const lines = [
      "  " + "_".repeat(text.length + 2),
      "  < " + text + " >",
      "  " + "-".repeat(text.length + 2),
      "         \\   ^__^",
      "          \\  (oo)\\_______",
      "             (__)\\       )\\/\\",
      "                 ||----w |",
      "                 ||     ||"
    ];
    return lines;
  };

  // Main command processing engine
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScanning) return; // Prevent typing during scanning cycles

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (soundEnabled) {
      playEnterSound();
    }

    const commandParts = trimmedInput.split(" ");
    const cmd = commandParts[0].toLowerCase();
    const args = commandParts.slice(1).join(" ");
    
    const newHistory = [...history, `visitor@erik_os:~$ ${trimmedInput}`];
    
    // Save to history list
    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);

    // Reset mood temporarily to neutral unless roasting
    setMood("neutral");

    switch (cmd) {
      case 'clear':
        setHistory([]);
        break;

      case 'help':
        setHistory([
          ...newHistory,
          "--- Erik OS v2.0.0 Terminal Engine Help ---",
          "  roast             Receive a fresh programming insult from Erik.",
          "  scan              Initiate visitor digital threat assessment.",
          "  whoami            Analyze your local browser metadata.",
          "  hack              Run bypass operations on local firewalls.",
          "  cowsay [text]     Let a virtual ASCII cow speak for you.",
          "  fortune           Print a wise programmer quote.",
          "  joke              Receive a highly logical developer joke.",
          "  theme [name]      Change console theme (green, amber, cyberpunk, cyan).",
          "  matrix            Toggle falling code overlay behind screen.",
          "  sound             Toggle mechanical typing audio feedback.",
          "  status            Review server telemetry and Erik's current patience.",
          "  clear             Wipe scroll history from screen.",
          "  socials           Displays official developer contacts."
        ]);
        break;

      case 'roast': {
        setMood("roasting");
        const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
        setHistory([
          ...newHistory,
          "Querying insult matrix database...",
          `Erik OS: "${roast}"`
        ]);
        break;
      }

      case 'fortune': {
        const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        setHistory([
          ...newHistory,
          `Fortune: "${fortune}"`
        ]);
        break;
      }

      case 'joke': {
        const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
        setHistory([
          ...newHistory,
          `Joke: "${joke}"`
        ]);
        break;
      }

      case 'cowsay': {
        if (!args.trim()) {
          setHistory([...newHistory, "Usage: cowsay [your text]"]);
          if (soundEnabled) playErrorSound();
        } else {
          const cowOutput = renderCowsay(args);
          setHistory([...newHistory, ...cowOutput]);
        }
        break;
      }

      case 'theme': {
        const selectedTheme = args.toLowerCase();
        if (['green', 'amber', 'cyberpunk', 'cyan'].includes(selectedTheme)) {
          setTheme(selectedTheme);
          setHistory([...newHistory, `Theme changed to: ${selectedTheme.toUpperCase()}`]);
        } else {
          setHistory([
            ...newHistory,
            `Invalid theme: "${args}".`,
            "Available themes: green, amber, cyberpunk, cyan."
          ]);
          if (soundEnabled) playErrorSound();
        }
        break;
      }

      case 'sound':
        setSoundEnabled(!soundEnabled);
        setHistory([...newHistory, `Synthesized terminal click SFX: ${!soundEnabled ? "ENABLED" : "DISABLED"}`]);
        break;

      case 'matrix':
        setMatrixActive(!matrixActive);
        setHistory([...newHistory, `Matrix falling code overlay: ${!matrixActive ? "ACTIVE" : "OFF"}`]);
        break;

      case 'whoami': {
        const userAgent = navigator.userAgent;
        const width = window.screen.width;
        const height = window.screen.height;
        const platform = navigator.platform;
        setHistory([
          ...newHistory,
          "--- VISITOR SYSTEM INTERPRETATION ---",
          `Client Platform: ${platform}`,
          `Screen Dimensions: ${width}x${height}px`,
          `Browser Signature: ${userAgent}`,
          "Erik's evaluation: Under-optimized stack explorer who copies CSS templates."
        ]);
        break;
      }

      case 'status': {
        setMood("annoyed");
        const currentTemp = (35 + Math.random() * 8).toFixed(1);
        setHistory([
          ...newHistory,
          `Server State: DEPLOYED (LXC)`,
          `Core Temperature: ${currentTemp}°C`,
          "Patience Level: 1.2% (Dropping)",
          "Fan speed: 9200 RPM",
          "Average User competence: Critical failure bounds."
        ]);
        break;
      }

      case 'hack': {
        setMood("thinking");
        setIsScanning(true);
        setHistory([...newHistory, "Executing system payload exploit..."]);
        
        const hackSteps = [
          "Bypassing host network gateways...",
          "Decrypting secure RSA headers... SUCCESS.",
          "Injecting custom payload into root buffer...",
          "ALERT: Erik has caught you red-handed.",
          "ACCESS DENIED. Erik: 'Nice try, script kiddie. Keep playing.'"
        ];

        hackSteps.forEach((step, idx) => {
          setTimeout(() => {
            setHistory(prev => [...prev, step]);
            if (idx === hackSteps.length - 1) {
              setIsScanning(false);
              setMood("annoyed");
              if (soundEnabled) playErrorSound();
            }
          }, (idx + 1) * 800);
        });
        break;
      }

      case 'socials':
        setHistory([
          ...newHistory,
          "--- ERIK OS ACCESS PATHWAYS ---",
          "  GitHub:  https://github.com/PseudoMotivated/erik-roast",
          "  Domain:  https://erik.tamiz.dev",
          "  Status:  Monitored & Unsatisfied."
        ]);
        break;

      case 'scan': {
        setMood("thinking");
        setIsScanning(true);
        setHistory([...newHistory, "Launching complete biometric and digit threat scan..."]);
        
        const scanSteps = [
          "Scanning local digital registry signature...",
          "Checking git repository configs... 42 unsaved changes suspected.",
          "Measuring visitor brainwave integrity... Result: Low bandwidth.",
          "Calculating estimated coffee consumption: 4.8 Liters/day.",
          "Scan COMPLETE. Threat score: 98/100 (Extremely generic developer)."
        ];

        scanSteps.forEach((step, idx) => {
          setTimeout(() => {
            setHistory(prev => [...prev, step]);
            if (idx === scanSteps.length - 1) {
              setIsScanning(false);
              setMood("annoyed");
            }
          }, (idx + 1) * 1000);
        });
        break;
      }

      default:
        setMood("annoyed");
        setHistory([
          ...newHistory,
          `Erik OS: Command '${cmd}' unrecognized. Did you read the instructions, or is writing code just your side hobby?`
        ]);
        if (soundEnabled) {
          playErrorSound();
        }
        break;
    }

    setInput("");
  };

  return (
    <>
      {matrixActive && <canvas ref={canvasRef} id="matrix-canvas" />}
      
      <div className="terminal-container">
        {/* Terminal Title Bar */}
        <div className="terminal-header">
          <div className="status-dots">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div>ERIK_OS // COMPILER_COURT</div>
          <div style={{ opacity: 0.6 }}>TTY: {theme.toUpperCase()}</div>
        </div>

        {/* CRT monitor frame area */}
        <div className="crt-screen">
          
          {/* ASCII Banner & Erik Mood Status */}
          <div className="erik-face-container">
            <pre className="erik-ascii">{ER_MOODS[mood]}</pre>
            <div className="erik-status-box">
              <div className="status-row">
                <span className="status-label">SYS_STATE:</span>
                <span className="status-value user-input">ONLINE</span>
              </div>
              <div className="status-row">
                <span className="status-label">ERIK_MOOD:</span>
                <span className="status-value" style={{ color: mood === 'neutral' ? 'inherit' : 'var(--accent-color)' }}>
                  {mood.toUpperCase()}
                </span>
              </div>
              <div className="status-row">
                <span className="status-label">TELEMETRY:</span>
                <span className="status-value">DISAPPOINTED</span>
              </div>
            </div>
          </div>

          {/* Terminal output box */}
          <div className="output" ref={outputRef}>
            {history.map((line, i) => (
              <div 
                key={i} 
                className={`terminal-line ${line.startsWith('visitor@') ? 'user-input' : ''}`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Input field area */}
          <form onSubmit={handleCommandSubmit} className="input-area">
            <span className="prompt">visitor@erik_os:~$</span>
            <input
              ref={inputRef}
              autoFocus
              className="terminal-input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isScanning}
              spellCheck="false"
              autoComplete="off"
              placeholder={isScanning ? "Processing calculations..." : "type command here..."}
            />
          </form>
        </div>

        {/* Quick bottom toggle overlay */}
        <div className="controls-overlay">
          <div 
            className={`control-badge ${soundEnabled ? 'active' : ''}`}
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playEnterSound();
            }}
          >
            🔊 Sound: {soundEnabled ? 'ON' : 'OFF'}
          </div>
          <div 
            className={`control-badge ${matrixActive ? 'active' : ''}`}
            onClick={() => {
              setMatrixActive(!matrixActive);
              if (soundEnabled) playEnterSound();
            }}
          >
            📟 Matrix: {matrixActive ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
