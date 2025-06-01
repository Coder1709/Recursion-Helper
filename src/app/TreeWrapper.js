// components/TreeWrapper.jsx

import React from 'react';
import { Tree } from 'react-d3-tree'; // Correctly import the Tree component

const renderCustomNode = ({ nodeDatum }) => {
  const rectPadding = 6;
  const maxLabelLength = 40; // truncate if too long

  let label = nodeDatum.name;
  if (label && label.length > maxLabelLength) { // Added check for label existence
    label = `${label.substring(0, maxLabelLength - 3)}...`;
  } else if (!label) {
    label = 'N/A'; // Fallback if name is empty/null
  }

  const rectWidth = 160;
  const rectHeight = 50;

  return (
    <g>
      <rect
        x={-rectWidth / 2}
        y={-rectHeight / 2}
        width={rectWidth}
        height={rectHeight}
        rx={10}
        ry={10}
        fill="#EEF2FF"
        stroke="#6366F1"
        strokeWidth={2}
      />
      <text
        fill="#4F46E5"
        fontSize={12}
        fontWeight={300}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </g>
  );
};

const TreeWrapper = ({ treeData }) => {
  // If treeData is null/undefined/empty, return a placeholder
  if (!treeData || (Array.isArray(treeData) && treeData.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]"> {/* Added min-h for consistent height */}
        <p className="text-gray-600 text-center text-lg">
          No valid recursion tree data available or parsing failed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] overflow-hidden border rounded-lg bg-white shadow-inner p-4"> {/* Use overflow-hidden to allow Tree to manage its own scroll/zoom */}
      {/* THIS IS THE CRITICAL FIX: Changed <div> to <Tree> */}
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 300, y: 50 }} // Adjusted translate for better initial view
        nodeSize={{ x: 220, y: 100 }}  // More spacing between nodes
        pathFunc="step" // Smooth connection lines
        separation={{ siblings: 1.5, nonSiblings: 2 }}  // Further spacing between sibling and non-sibling nodes
        renderCustomNodeElement={renderCustomNode}
        zoomable // Allow zooming
        scaleExtent={{ min: 0.2, max: 2 }} // Zoom limits
        // Other common props you might need:
        // draggable // Allow dragging the tree
        // nodeSvgShape={{ shape: 'circle', shapeProps: { r: 10, fill: 'lightblue' } }} // Default node shape if not using custom render
      />
    </div>
  );
};

export default TreeWrapper;