import React from 'react';
import { motion } from 'framer-motion';

interface CanvasToolbarProps {
    currentColor: string;
    currentWidth: number;
    currentTool: 'pen' | 'eraser';
    onColorChange: (color: string) => void;
    onWidthChange: (width: number) => void;
    onToolChange: (tool: 'pen' | 'eraser') => void;
    onClear: () => void;
    onUndo: () => void;
    disabled?: boolean;
}

const COLORS = [
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Black', value: '#000000' },
];

const BRUSH_SIZES = [
    { name: 'Thin', value: 2 },
    { name: 'Medium', value: 4 },
    { name: 'Thick', value: 8 },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
    currentColor,
    currentWidth,
    currentTool,
    onColorChange,
    onWidthChange,
    onToolChange,
    onClear,
    onUndo,
    disabled = false,
}) => {
    return (
        <div className="p-3 bg-white/5 border-b border-white/10 flex flex-wrap items-center gap-3">
            {/* Colors */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 hidden md:inline">Color:</span>
                <div className="flex gap-1.5">
                    {COLORS.map((color) => (
                        <motion.button
                            key={color.value}
                            onClick={() => onColorChange(color.value)}
                            disabled={disabled}
                            whileHover={!disabled ? { scale: 1.1 } : {}}
                            whileTap={!disabled ? { scale: 0.9 } : {}}
                            className={`
                w-7 h-7 rounded-full border-2 transition-all
                ${currentColor === color.value
                                    ? 'border-white scale-110'
                                    : 'border-transparent opacity-70 hover:opacity-100'
                                }
                ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
              `}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20 hidden md:block" />

            {/* Brush sizes */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 hidden md:inline">Size:</span>
                <div className="flex gap-1.5">
                    {BRUSH_SIZES.map((size) => (
                        <motion.button
                            key={size.value}
                            onClick={() => onWidthChange(size.value)}
                            disabled={disabled}
                            whileHover={!disabled ? { scale: 1.05 } : {}}
                            whileTap={!disabled ? { scale: 0.95 } : {}}
                            className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${currentWidth === size.value
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }
                ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
              `}
                            title={size.name}
                        >
                            {size.name}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20 hidden md:block" />

            {/* Tools */}
            <div className="flex gap-1.5">
                <motion.button
                    onClick={() => onToolChange('pen')}
                    disabled={disabled}
                    whileHover={!disabled ? { scale: 1.05 } : {}}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    className={`
            p-2 rounded-lg transition-all
            ${currentTool === 'pen'
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }
            ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
          `}
                    title="Pen"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </motion.button>

                <motion.button
                    onClick={() => onToolChange('eraser')}
                    disabled={disabled}
                    whileHover={!disabled ? { scale: 1.05 } : {}}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    className={`
            p-2 rounded-lg transition-all
            ${currentTool === 'eraser'
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }
            ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
          `}
                    title="Eraser"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </motion.button>
            </div>

            {/* Actions */}
            <div className="flex-1" />
            <div className="flex gap-1.5">
                <motion.button
                    onClick={onUndo}
                    disabled={disabled}
                    whileHover={!disabled ? { scale: 1.05 } : {}}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white
            ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
          `}
                    title="Undo"
                >
                    Undo
                </motion.button>

                <motion.button
                    onClick={onClear}
                    disabled={disabled}
                    whileHover={!disabled ? { scale: 1.05 } : {}}
                    whileTap={!disabled ? { scale: 0.95 } : {}}
                    className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400
            ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
          `}
                    title="Clear Canvas"
                >
                    Clear
                </motion.button>
            </div>
        </div>
    );
};
