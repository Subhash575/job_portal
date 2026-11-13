import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
  const { allJobs } = useSelector(store => store.job);

  return (
    <section
      aria-labelledby="latest-jobs"
      className="bg-tint border-y border-lilac"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2
          id="latest-jobs"
          className="mb-6 text-3xl sm:text-4xl font-light tracking-[-0.03em] text-ink"
        >
          Seats open <b className="font-bold">this week</b>
        </h2>
        {allJobs.length <= 0 ? (
          <p className="text-ink-muted">No jobs available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allJobs.slice(0, 6).map(job => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
