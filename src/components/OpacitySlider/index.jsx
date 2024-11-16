import React from 'react';
import './slider.css'; // update with correct path

const OpacitySlider = ({ overlayIndex, opacitySlider, imageData, handleSliderChange }) => {
  const handleSliderInputChange = (name) => (e) => {
    const newValue = parseFloat(e.target.value);
    handleSliderChange(name, newValue - imageData[name].opacity, overlayIndex);
  };

  const handleSliderClick = (e, name) => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    const newValue = percent * (1 - 0) + 0
    handleSliderChange(name, newValue - imageData[name].opacity, overlayIndex)
  }
  return (
    <div className="flex flex-wrap justify-center mb-2">
      {opacitySlider &&
        Object.keys(imageData).map((name, index) => (
          <div key={index} className="bg-white p-2 h-24 w-full max-w-xs">
            <label className="block mb-1 font-bold text-sm">
              {name.charAt(0).toUpperCase() + name.slice(1)} Opacity
            </label>
            <div className="flex justify-between items-center gap-2">
              <button
                onClick={handleSliderChange(name, -0.1, overlayIndex)}
                disabled={(imageData[name].opacity) <= 0}                className="bg-blue-500 text-white rounded-full w-8 h-5 flex justify-center items-center text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={imageData[name].opacity}
                onChange={handleSliderInputChange(name)}
                onClick={(e) => handleSliderClick(e, name)}
                className="w-full"
              />
              <button
                onClick={handleSliderChange(name, 0.1, overlayIndex)}
                disabled={imageData[name].opacity >= 1}
                className="bg-blue-500 text-white rounded-full w-8 h-5 flex justify-center items-center text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <label className="block mt-1 font-bold text-sm">
              Area: {imageData[name].area} km<sup>2</sup>
            </label>
          </div>
        ))}
    </div>
  );
};

export default OpacitySlider;
