
import React, { useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import { useImage } from 'react-konva';
import htmlToImage from 'html-to-image';
import { v4 as uuidv4 } from 'uuid';

const panelTypes = {
  Wood: '/fence-panels/wood.png',
  Vinyl: '/fence-panels/vinyl.png',
  Aluminum: '/fence-panels/aluminum.png',
};

const DraggableFencePanel = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(shapeProps.src);

  React.useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={e => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
            scaleX: 1,
            scaleY: 1
          });
        }}
      />
      {isSelected && (
        <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => newBox} />
      )}
    </>
  );
};

export default function FenceVisualizerPro() {
  const stageRef = useRef();
  const [background, setBackground] = useState(null);
  const [image] = useImage(background?.src);
  const [panels, setPanels] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const fileInputRef = useRef();

  const addPanel = (type) => {
    const id = uuidv4();
    setPanels([...panels, {
      id,
      src: panelTypes[type],
      x: 50,
      y: 50,
      width: 100,
      height: 70,
      rotation: 0,
    }]);
  };

  const handleExport = async () => {
    const dataUrl = await htmlToImage.toPng(stageRef.current.container());
    const link = document.createElement('a');
    link.download = 'fence-design.png';
    link.href = dataUrl;
    link.click();
  };

  const estimateLength = () => {
    const length = panels.length * 8; // assuming each panel is approx. 8 feet
    return length;
  };

  const handlePanelChange = (newAttrs) => {
    const updated = panels.map(p => (p.id === newAttrs.id ? newAttrs : p));
    setPanels(updated);
  };

  return (
    <div className="bg-white rounded shadow-lg p-4 w-full max-w-5xl">
      <div className="flex flex-col gap-4">
        {!background && (
          <div className="text-center">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={e => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = () => {
                const img = new window.Image();
                img.src = reader.result;
                img.onload = () => setBackground(img);
              };
              reader.readAsDataURL(file);
            }} />
          </div>
        )}

        {background && (
          <>
            <Stage width={800} height={500} ref={stageRef} className="border shadow">
              <Layer>
                <KonvaImage image={background} x={0} y={0} width={800} height={500} />
                {panels.map((panel, i) => (
                  <DraggableFencePanel
                    key={i}
                    shapeProps={panel}
                    isSelected={panel.id === selectedId}
                    onSelect={() => setSelectedId(panel.id)}
                    onChange={(newAttrs) => handlePanelChange({ ...newAttrs, id: panel.id })}
                  />
                ))}
              </Layer>
            </Stage>

            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {Object.keys(panelTypes).map((type) => (
                <button key={type} onClick={() => addPanel(type)} className="bg-primary text-white px-4 py-2 rounded shadow">
                  Add {type} Fence
                </button>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-dark font-semibold">Estimated Fence Length: {estimateLength()} ft</p>
              <div className="flex justify-center gap-4 mt-2">
                <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded shadow">
                  Save Image
                </button>
                <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded shadow">
                  Start Over
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
