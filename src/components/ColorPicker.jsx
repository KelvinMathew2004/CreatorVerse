import React, { useState, useEffect, useLayoutEffect } from 'react';
import './ColorPicker.css';

const ColorPicker = () => {
    const PICO_COLORS = [
        'lime', 'green', 'jade', 'cyan', 'slate', 'azure', 'blue', 'indigo', 'violet',
        // 'grey', 'zinc', 'sand',
        'purple', 'fuchsia', 'pink', 'red', 'orange', 'pumpkin', 'amber', 'yellow',
    ];

    const PICO_COLOR_VALUES = {
        red: '#C53021', pink: '#D82762', fuchsia: '#C1218B', purple: '#9236A4', violet: '#7540BF',
        indigo: '#524ED1', blue: '#2160DF', azure: '#0072AD', cyan: '#057878', jade: '#007A50',
        green: '#398713', lime: '#A5D603', yellow: '#F2DF0D', amber: '#FFBF00', pumpkin: '#FF9500',
        orange: '#D24317', sand: '#CCC6B4', grey: '#ABABAB', zinc: '#646B79', slate: '#515F7A'
    };

    const getInitialColor = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pico-color-theme') || 'indigo';
        }
        return 'indigo';
    };

    const [activeColor, setActiveColor] = useState(getInitialColor);

    useLayoutEffect(() => {
        const existingLink = document.getElementById('pico-theme-link');
        if (existingLink) {
            existingLink.remove();
        }

        const isDefaultTheme = activeColor === 'azure';
        const stylesheetUrl = isDefaultTheme
            ? `https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css`
            : `https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.${activeColor}.min.css`;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = stylesheetUrl;
        link.id = 'pico-theme-link';

        document.head.appendChild(link);
        localStorage.setItem('pico-color-theme', activeColor);

    }, [activeColor]);

    useEffect(() => {
        PICO_COLORS.forEach(color => {
            if (color === activeColor) return; 

            const isDefault = color === 'azure';
            const stylesheetUrl = isDefault
                ? `https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css`
                : `https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.${color}.min.css`;
            
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = stylesheetUrl;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }, []);

    return (
        <div className="color-picker-container">
            <div className="color-swatches">
                {PICO_COLORS.map(color => (
                    <button
                        key={color}
                        className={`color-swatch ${activeColor === color ? 'active' : ''}`}
                        aria-label={`Switch to ${color} theme`}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                        onClick={() => setActiveColor(color)}
                        style={{ backgroundColor: PICO_COLOR_VALUES[color] }}
                    >
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;