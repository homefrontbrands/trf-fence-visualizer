
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';

export default function FenceVisualizer() {
  const [image, setImage] = useState(null);
  const [fenceStyle, setFenceStyle] = useState('Wood');
  const [fencePositions, setFencePositions] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFencePlace = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFencePositions([...fencePositions, { x, y, style: fenceStyle }]);
  };

  const handleSubmitQuote = () => {
    alert('Your fence design has been submitted for a quote. Thank you!');
  };

  return (
    <div className="max-w-2xl w-full flex flex-col items-center gap-4">
      {!image ? (
        <div className="flex flex-col items-center gap-2">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      ) : (
        <div className="relative border rounded overflow-hidden" onClick={handleFencePlace}>
          <img src={image} alt="Uploaded Yard" className="max-h-96 object-contain" />
          {fencePositions.map((pos, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute"
              style={{ left: pos.x - 12, top: pos.y - 12 }}
            >
              <Ruler className="h-6 w-6 text-blue-600" />
            </motion.div>
          ))}
        </div>
      )}
      <select value={fenceStyle} onChange={(e) => setFenceStyle(e.target.value)} className="border rounded p-1">
        <option value="Wood">Wood</option>
        <option value="Vinyl">Vinyl</option>
        <option value="Aluminum">Aluminum</option>
        <option value="Chain Link">Chain Link</option>
      </select>
      <button onClick={handleSubmitQuote} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
        Request Quote Based on This Design
      </button>
    </div>
  );
}
