import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import PageHeader from './shared/PageHeader';
import FilterCard from './FilterCard';
import LatestJobCards from './LatestJobCards';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
  useGetAllJobs(); // load jobs even when someone opens /jobs directly
  const dispatch = useDispatch();
  // Clear the chip filter on leave so it isn't saved and sent as a search next time.
  useEffect(() => () => dispatch(setSearchedQuery('')), [dispatch]);
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter(job => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <PageHeader eyebrow="All jobs" className="mb-8">
          Find your <b>seat</b>
        </PageHeader>
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          <aside className="lg:w-72 lg:shrink-0">
            <FilterCard />
          </aside>
          <section aria-label="Job results" className="flex-1 min-w-0">
            <p className="mb-4 font-mono text-xs text-ink-muted">
              {filterJobs.length} {filterJobs.length === 1 ? 'job' : 'jobs'}
              {searchedQuery && ` for “${searchedQuery.trim()}”`}
            </p>
            {filterJobs.length <= 0 ? (
              <p className="p-10 rounded-2xl border border-dashed border-[#e4e4e4] text-center text-ink-muted">
                No seats match this filter yet. Try another one.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filterJobs.map(job => (
                  <LatestJobCards key={job?._id} job={job} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
