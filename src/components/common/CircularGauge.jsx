import React from 'react';
import { levelOf, formatValue } from '../../utils/aqi';

export default function CircularGauge({ value, max = 5, size = 150 }) {
  const numVal = Number(value);
  const valid = Number.isFinite(numVal);
  const ratio = valid ? Math.min(Math.max((numVal - 1) / (max - 1), 0.08), 1) : 0.08;
  const level = levelOf(value);
  const color = level?.color ?? '#10b981';

  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 270 degree arc for gauge look
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * ratio);
  const center = size / 2;

  return (
    <div className="circular-gauge-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="circular-gauge-svg">
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer subtle ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="1"
        />

        {/* Background track arc (rotated so gap is at bottom) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
        />

        {/* Progress Arc with glow */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#gauge-glow)"
          transform={`rotate(135 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>

      <div className="circular-gauge-center">
        <span className="gauge-status-label" style={{ color }}>
          {level?.label ?? 'Modéré'}
        </span>
        <span className="gauge-value-number">
          {valid ? formatValue(value) : '1.0'}
        </span>
        <span className="gauge-scale-muted">sur 5</span>
      </div>
    </div>
  );
}
