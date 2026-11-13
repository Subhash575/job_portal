import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import PageHeader from './shared/PageHeader';
import LatestJobCards from './LatestJobCards';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(''));
    };
  }, [dispatch]);
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <PageHeader eyebrow="Search results" className="mb-2">
          {searchedQuery ? (
            <>
              Seats for <b>{searchedQuery}</b>
            </>
          ) : (
            <>
              Every open <b>seat</b>
            </>
          )}
        </PageHeader>
        <p className="mb-8 font-mono text-xs text-ink-muted">
          {allJobs.length} {allJobs.length === 1 ? 'job' : 'jobs'} found
        </p>
        {allJobs.length === 0 ? (
          <p className="p-10 rounded-2xl border border-dashed border-[#e4e4e4] text-center text-ink-muted">
            No seats match your search yet. Try a different role or skill.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map(job => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Browse;
