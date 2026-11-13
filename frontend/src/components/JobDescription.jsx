import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import ChairIcon from './ChairIcon';
import { tileFor } from '@/lib/utils';

const formatDate = iso =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const JobDescription = () => {
  const { singleJob, allJobs } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  // Show the job from the list straight away; the fetch below fills in details (and covers direct links).
  const job =
    singleJob?._id === jobId
      ? singleJob
      : allJobs?.find(j => j._id === jobId);

  const isIntiallyApplied =
    job?.applications?.some(
      application => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Could not apply. Please try again.');
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              application => application.applicant === user?._id
            )
          ); // Ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user]);

  const seats = Math.max(0, Number(job?.position) || 0);
  const [tileBg, tileText] = tileFor(job?.company?.name);

  const facts = [
    ['Location', job?.location, '#fff1e8'],
    ['Experience', `${job?.experienceLevel ?? 0} yrs`, '#ecfdf3'],
    ['Salary', `₹${job?.salary} LPA`, '#eef5ff'],
    ['Applicants', job?.applications?.length ?? 0, '#fdf2f8'],
    ['Posted', formatDate(job?.createdAt), '#f5f3ff'],
  ];

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Link
          to="/jobs"
          className="inline-block mb-6 font-mono text-xs text-ink-muted hover:text-brand"
        >
          ← All jobs
        </Link>

        {!job ? (
          <div className="flex flex-col items-start gap-4 p-8 rounded-2xl border border-line">
            <ChairIcon open className="w-10 h-11" />
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">
              Log in to see this job
            </h1>
            <p className="text-ink-muted">
              Job details are for members. It only takes a minute to join.
            </p>
            <div className="flex gap-3">
              <Link to="/login" className="keycap-brand px-5 py-2.5 rounded-xl font-bold">
                Log in
              </Link>
              <Link to="/signup" className="keycap px-5 py-2.5 rounded-xl font-bold text-ink">
                Sign up
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-3xl border border-line bg-white">
              <div className="flex items-center gap-3">
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-line"
                  />
                ) : (
                  <span
                    className="w-12 h-12 shrink-0 rounded-xl grid place-items-center font-extrabold text-xl"
                    style={{ background: tileBg, color: tileText }}
                  >
                    {job.company?.name?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-ink truncate">{job.company?.name}</p>
                  <p className="font-mono text-xs text-ink-muted">{job.location}</p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-tint font-mono text-xs text-brand-ink">
                  <ChairIcon open className="w-4 h-[18px]" />
                  {seats} open {seats === 1 ? 'position' : 'positions'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#ecfdf3] font-mono text-xs text-[#166534]">
                  {job.jobType}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#fff1e8] font-mono text-xs text-[#9a3412]">
                  ₹{job.salary} LPA
                </span>
              </div>

              <div>
                {!user ? (
                  <Link
                    to="/login"
                    className="keycap-brand inline-flex items-center min-h-12 px-6 rounded-xl font-bold"
                  >
                    Log in to apply
                  </Link>
                ) : isApplied ? (
                  <span className="inline-flex items-center gap-2 min-h-12 px-6 rounded-xl border-[1.5px] border-[#16a34a] bg-[#ecfdf3] font-bold text-[#166534]">
                    ✓ Applied. Your seat is saved.
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={applyJobHandler}
                    className="keycap-brand min-h-12 px-6 rounded-xl font-bold"
                  >
                    Apply now
                  </button>
                )}
              </div>
            </section>

            <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {facts.map(([label, value, bg]) => (
                <div key={label} className="p-4 rounded-2xl" style={{ background: bg }}>
                  <dt className="font-mono text-[11px] tracking-[.1em] uppercase text-ink-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-10">
              <h2 className="mb-3 font-mono text-[13px] tracking-[.12em] uppercase text-brand">
                About the role
              </h2>
              <p className="text-lg leading-relaxed text-ink whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {job.requirements?.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 font-mono text-[13px] tracking-[.12em] uppercase text-brand">
                  What you’ll need
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {job.requirements.map(r => (
                    <li
                      key={r}
                      className="px-3 py-1.5 rounded-full border border-line text-sm text-ink"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default JobDescription;
