import React from 'react';
import { Link } from 'react-router-dom';
import ChairIcon from './ChairIcon';

// Pastel tile + dark letter (contrast-safe), picked from the company name so it stays the same everywhere.
const TILES = [
  ['#ffd8c2', '#9a3412'],
  ['#c9f0dc', '#166534'],
  ['#cfe3ff', '#1e40af'],
  ['#fdeaa7', '#854d0e'],
  ['#fbd3e6', '#9d174d'],
  ['#e4dcff', '#5b21b6'],
];
const tileFor = name =>
  TILES[[...(name || '')].reduce((n, c) => n + c.charCodeAt(0), 0) % TILES.length];

const LatestJobCards = ({ job }) => {
  const seats = Math.max(0, Number(job?.position) || 0);
  const [tileBg, tileText] = tileFor(job?.company?.name);
  return (
    <Link
      to={`/description/${job._id}`}
      className="flex flex-col gap-3.5 p-5 rounded-2xl border border-line bg-white text-ink transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(20,20,20,.35)]"
    >
      <div className="flex items-center gap-3">
        {job?.company?.logo ? (
          <img
            src={job.company.logo}
            alt=""
            className="w-11 h-11 rounded-xl object-cover border border-line"
          />
        ) : (
          <span
            className="w-11 h-11 shrink-0 rounded-xl grid place-items-center font-extrabold text-lg"
            style={{ background: tileBg, color: tileText }}
          >
            {job?.company?.name?.[0]?.toUpperCase() || '?'}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-bold text-[15px] truncate">{job?.company?.name}</p>
          <p className="font-mono text-xs text-ink-muted truncate">
            {job?.location}
          </p>
        </div>
        <span className="ml-auto shrink-0 px-2.5 py-1 rounded-lg bg-tint text-brand-ink font-mono text-xs font-medium">
          ₹{job?.salary} LPA
        </span>
      </div>

      <div>
        <h3 className="font-extrabold text-xl tracking-tight">{job?.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted line-clamp-2">
          {job?.description}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-3 border-t border-dashed border-[#e4e4e4]">
        <div aria-hidden="true" className="flex gap-1">
          {/* shortcut: draw at most 5 chairs; the text below still shows the real count */}
          {Array.from({ length: Math.min(seats, 5) }, (_, i) => (
            <ChairIcon key={i} open />
          ))}
        </div>
        <span className="font-mono text-xs text-ink-muted">
          {seats} open {seats === 1 ? 'position' : 'positions'} · {job?.jobType}
        </span>
      </div>
    </Link>
  );
};

export default LatestJobCards;
