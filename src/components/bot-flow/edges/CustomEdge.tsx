"use client";

import { useState, useRef, useEffect } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useReactFlow, type EdgeProps } from "@xyflow/react";
import { Trash2 } from "lucide-react";

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected = false,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const pathRef = useRef<SVGPathElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  const isActive = isHovered || selected;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (e.buttons !== 0) {
      setIsHovered(false);
      return;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const nextTarget = e.relatedTarget as Node | null;
    if (nextTarget) {
      const isStillOnPath = pathRef.current && (pathRef.current === nextTarget || pathRef.current.contains(nextTarget));
      const isStillOnLabel = labelRef.current && (labelRef.current === nextTarget || labelRef.current.contains(nextTarget));
      if (isStillOnPath || isStillOnLabel) {
        // Smooth transition between path and button - do not hide!
        return;
      }
    }
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 0) {
      setIsHovered(false);
      return;
    }
    if (!isHovered) {
      setIsHovered(true);
    }
  };

  // Listen for global mousedown / pointerdown to hide hover state if user clicks/drags elsewhere
  useEffect(() => {
    const handleGlobalDown = (e: MouseEvent) => {
      // Exempt clicks directly on the delete button container so deletion succeeds
      if (labelRef.current && labelRef.current.contains(e.target as Node)) {
        return;
      }
      if (e.buttons !== 0) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousedown", handleGlobalDown, true);
    window.addEventListener("pointerdown", handleGlobalDown, true);

    return () => {
      window.removeEventListener("mousedown", handleGlobalDown, true);
      window.removeEventListener("pointerdown", handleGlobalDown, true);
    };
  }, []);

  const onEdgeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      {/* Interaction Path (Wider and invisible for easy hover/selection) */}
      <path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="react-flow__edge-interaction nodrag nopan"
        style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
      />

      {/* Visual Path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isActive ? 3.5 : 3,
          stroke: isActive ? "#6366f1" : "var(--violet-600)",
          transition: 'stroke 0.2s, stroke-width 0.2s',
          pointerEvents: 'none'
        }}
      />

      <EdgeLabelRenderer>
        <div
          ref={labelRef}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: isActive ? 'auto' : 'none',
            opacity: isActive ? 1 : 0,
            transformOrigin: 'center center',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            zIndex: 1000,
          }}
          className="nodrag nopan"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <button
            type="button"
            className="group flex h-7 w-7 items-center justify-center rounded-full border border-violet-200 bg-white text-gray-500 shadow-md transition-all hover:scale-110 hover:border-red-400 hover:bg-red-500 hover:text-white dark:bg-dark-gray dark:border-dark-accent dark:text-gray-300 dark:hover:bg-red-600 dark:hover:border-red-500 active:scale-95 cursor-pointer"
            onClick={onEdgeClick}
            onMouseDown={(e) => e.stopPropagation()}
            title="Delete connection"
          >
            <Trash2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
