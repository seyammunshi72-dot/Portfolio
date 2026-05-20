import { useState, useEffect } from 'react';
import { useStore, SiteSettings } from '../lib/store';
import 'react-quill-new/dist/quill.core.css';
import 'react-quill-new/dist/quill.snow.css';

export default function MonitorScreen({ overrideSettings }: { overrideSettings?: SiteSettings }) {
  const { settings: globalSettings } = useStore();
  const settings = overrideSettings || globalSettings;
  const [typedHtml, setTypedHtml] = useState('');

  const fullText = settings.screenText;

  useEffect(() => {
    if (settings.enableTypingAnimation === false) {
      setTypedHtml(''); // Not used if disabled
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(fullText, 'text/html');
    
    const textNodes: Text[] = [];
    const walk = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);
    let n;
    while((n = walk.nextNode())) {
      textNodes.push(n as Text);
    }
    
    const nodeTexts = textNodes.map(node => node.textContent || '');
    const totalChars = nodeTexts.reduce((acc, text) => acc + text.length, 0);
    
    let i = 0;
    let isComplete = false;

    const renderStep = () => {
      const stepDoc = parser.parseFromString(fullText, 'text/html');
      const stepTextNodes: Text[] = [];
      const stepWalk = document.createTreeWalker(stepDoc.body, NodeFilter.SHOW_TEXT, null);
      let curr;
      while ((curr = stepWalk.nextNode())) {
         stepTextNodes.push(curr as Text);
      }

      let charsRemaining = i;
      let lastActiveNode: Node | null = stepDoc.body;
      let lastNodeFound = false;

      stepTextNodes.forEach((node, idx) => {
        const text = nodeTexts[idx];
        if (charsRemaining >= text.length) {
          node.textContent = text;
          charsRemaining -= text.length;
          if (text.length > 0 && !lastNodeFound) {
            lastActiveNode = node;
          }
        } else if (charsRemaining > 0) {
          node.textContent = text.substring(0, charsRemaining);
          charsRemaining = 0;
          lastActiveNode = node;
          lastNodeFound = true;
        } else {
          node.textContent = '';
        }
      });

      const cursorSpan = stepDoc.createElement('span');
      cursorSpan.className = 'typing-cursor font-bold';
      cursorSpan.textContent = '_';
      if (i >= totalChars) {
         cursorSpan.style.animation = 'blink 0.8s step-end infinite';
      }

      if (lastActiveNode && lastActiveNode.nodeType === Node.TEXT_NODE) {
         lastActiveNode.parentNode?.insertBefore(cursorSpan, lastActiveNode.nextSibling);
      } else {
         stepDoc.body.appendChild(cursorSpan);
      }
      
      setTypedHtml(stepDoc.body.innerHTML);
    };

    const interval = setInterval(() => {
      if (i < totalChars) {
        // Number of characters per tick to animate faster if text is huge
        const stepSize = totalChars > 150 ? 2 : 1; 
        i += stepSize;
        if (i > totalChars) i = totalChars;
        renderStep();
      } else {
        if (!isComplete) {
          isComplete = true;
          renderStep();
        }
        clearInterval(interval);
      }
    }, 25);
    
    renderStep();

    return () => clearInterval(interval);
  }, [fullText, settings.enableTypingAnimation]);

  const renderText = () => {
    if (settings.enableTypingAnimation === false) {
      // Direct raw HTML rendering
      return (
        <div 
          className="leading-tight font-bold w-full h-full ql-snow" 
          style={{ padding: 0 }}
        >
          <div className="ql-editor" style={{ 
            fontSize: `${settings.screenTextSize || 48}px`, 
            textShadow: `0 0 ${settings.screenGlowStrength ?? 15}px ${settings.screenTextColor || '#33FF33'}cc`,
            padding: 0
          }} dangerouslySetInnerHTML={{ __html: fullText }} />
        </div>
      );
    }

    return (
      <div 
        className="leading-tight font-bold w-full h-full ql-snow" 
        style={{ padding: 0 }}
      >
        <div className="ql-editor" style={{ 
          fontSize: `${settings.screenTextSize || 48}px`, 
          textShadow: `0 0 ${settings.screenGlowStrength ?? 15}px ${settings.screenTextColor || '#33FF33'}cc`,
          padding: 0
        }} dangerouslySetInnerHTML={{ __html: typedHtml }} />
      </div>
    );
  };

  const getImageUrl = (url: string) => {
    if (!url) return url;
    
    // Convert Google Drive view links to direct image links
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }
    
    return url;
  };

  return (
    <div 
      className="w-full h-full tracking-wider relative flex flex-col overflow-hidden select-none" 
      style={{ 
        color: settings.screenTextColor, 
        backgroundColor: settings.screenBgColor || '#030A03', 
        fontFamily: settings.screenFontFamily || 'monospace',
        boxShadow: `inset 0 0 60px 10px rgba(0,0,0,0.8), inset 0 0 15px ${settings.screenTextColor}22`
      }}
    >
      <div className="absolute inset-0 bg-black/10 mix-blend-darken pointer-events-none" style={{ borderRadius: 'inherit' }} />
      {/* Subtle scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none opacity-50" />
      
      {settings.screenPhotoUrl ? (
        <div className="z-30 relative w-full h-full flex items-center justify-center">
            <img src={getImageUrl(settings.screenPhotoUrl)} alt="Screen contents" className="w-full h-full object-cover opacity-90" style={{ filter: `contrast(${settings.screenImageContrast ?? 1.0}) brightness(${settings.screenImageBrightness ?? 1.0}) sepia(${settings.screenImageSepia ?? 0}) hue-rotate(${settings.screenImageHue ?? 0}deg) blur(${settings.screenImageBlur ?? 0}px)` }} />
        </div>
      ) : (
        <div className="z-30 relative w-full h-full flex flex-col items-start justify-start text-left" style={{ padding: `${settings.screenPaddingPx ?? 32}px` }}>
          {renderText()}
        </div>
      )}
    </div>
  );
}

