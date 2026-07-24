import { AnimatePresence, motion } from "framer-motion";
import ZoomBtn from "./zoomBtn";
import html2canvas from "html2canvas";

interface renderInterface{
    selections:any;
    zoom: number;
    setZoom(zoom:number): void
}

export default function RenderViewer({selections, setZoom, zoom}:renderInterface){

    const handleDownload = async () => {
    const el = document.querySelector("#watch-viewer") as HTMLElement;
    if (!el) return;

    const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        onclone: (clonedDocument) => {
        const allElements = clonedDocument.querySelectorAll('*');
        allElements.forEach((node) => {
            const htmlNode = node as HTMLElement;
            const style = window.getComputedStyle(htmlNode);
            const colorProps = ['backgroundColor', 'color', 'borderColor', 'outlineColor'];
            colorProps.forEach(prop => {
            // @ts-ignore
            if (style[prop] && style[prop].includes('oklab')) {
                if (prop === 'color') htmlNode.style.color = '#000000';
                else htmlNode.style[prop as any] = 'transparent';
            }
            });
            if (style.boxShadow.includes('oklab')) {
            htmlNode.style.boxShadow = 'none';
            }
        });
        }
    });

    const link = document.createElement("a");
    link.download = `Bastille.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    };

    return(
        <div
        id="watch-viewer"
        className="relative mx-auto aspect-square w-full max-w-70 sm:max-w-105 md:max-w-155 rounded-4xl md:rounded-[3rem] border border-white/10 bg-surface/15 overflow-hidden shadow-2xl shadow-black/50"
        >
      <div className="relative h-full w-full transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
        <img
          src="/fondConfigurateur.webp"
          alt="Fond du configurateur"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
        />
        <AnimatePresence mode="popLayout">
          {(() => {
            const isC3 = selections.cases?.id === "c3";
            const renderLayers = isC3
              ? [selections.dials, selections.straps, selections.cases, selections.hands]
              : [selections.dials, selections.cases, selections.straps, selections.hands];

            return renderLayers.map((part) => (
              part?.thumbnail && (
                <motion.img
                  key={part.id}
                  src={part.thumbnail}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute scale-130 inset-0 top-7 md:top-12 w-full h-full object-contain pointer-events-none"
                />
              )
            ));
          })()}
        </AnimatePresence>
      </div>

      {/* Barre de contrôle discrète */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 md:px-6 py-2.5 md:py-4 bg-linear-to-t from-dark/90 to-transparent">
        <div className="flex items-center bg-surface/70 backdrop-blur-sm rounded-full border border-white/10 p-1">
          <ZoomBtn label="−" onClick={() => setZoom(z => Math.max(0.8, z - 0.5))} />
          <span className="px-2 md:px-3 text-[9px] md:text-[10px] uppercase tracking-widest text-ivory/80">
            Zoom {Math.round((zoom / 3) * 100)}%
          </span>
          <ZoomBtn label="+" onClick={() => setZoom(z => Math.min(5, z + 0.5))} />
        </div>
        <button
          onClick={handleDownload}
          className="text-[9px] md:text-[10px] uppercase tracking-widest bg-accent/90 text-white border border-primary/30 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full hover:bg-primary/10 transition backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Capture
        </button>
      </div>
    </div>
    )
    
};