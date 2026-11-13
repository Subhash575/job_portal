import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { FileText, Mail, Pen, Phone } from 'lucide-react';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { tileFor } from '@/lib/utils';

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const skills = user?.profile?.skills || [];
  const [tileBg, tileText] = tileFor(user?.fullname);

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16 flex flex-col gap-10">
        <section className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-line bg-white">
          <div className="flex flex-wrap items-start gap-4">
            {user?.profile?.profilePhoto ? (
              <img
                src={user.profile.profilePhoto}
                alt=""
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-line"
              />
            ) : (
              <span
                className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl grid place-items-center font-extrabold text-2xl"
                style={{ background: tileBg, color: tileText }}
              >
                {user?.fullname?.[0]?.toUpperCase() || '?'}
              </span>
            )}
            <div className="min-w-[11rem] flex-1">
              <p className="font-mono text-[13px] tracking-[.12em] uppercase text-brand">
                Your profile
              </p>
              <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-ink break-words">
                {user?.fullname}
              </h1>
              <p className="mt-1 text-ink-muted">
                {user?.profile?.bio ||
                  'Add a short bio so recruiters know you.'}
              </p>
            </div>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <Pen /> <span className="hidden sm:inline">Edit</span>
              <span className="sr-only sm:hidden">Edit profile</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-ink">
            <span className="flex items-center gap-2 min-w-0">
              <Mail aria-hidden="true" className="w-4 h-4 text-ink-muted" />
              <span className="truncate">{user?.email}</span>
            </span>
            {user?.phoneNumber && (
              <span className="flex items-center gap-2">
                <Phone aria-hidden="true" className="w-4 h-4 text-ink-muted" />
                {user.phoneNumber}
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-dashed border-[#e4e4e4]">
            <div>
              <h2 className="mb-2.5 font-mono text-xs tracking-[.1em] uppercase text-ink-muted">
                Skills
              </h2>
              {skills.length ? (
                <ul className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <li
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-tint text-sm text-brand-ink"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-muted">No skills added yet.</p>
              )}
            </div>
            <div>
              <h2 className="mb-2.5 font-mono text-xs tracking-[.1em] uppercase text-ink-muted">
                Resume
              </h2>
              {user?.profile?.resume ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={user.profile.resume}
                  className="keycap inline-flex items-center gap-2 max-w-full px-4 py-2 rounded-xl text-sm font-bold text-ink"
                >
                  <FileText
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 text-brand"
                  />
                  <span className="truncate">
                    {user.profile.resumeOriginalName || 'View resume'}
                  </span>
                </a>
              ) : (
                <p className="text-sm text-ink-muted">
                  No resume uploaded yet.
                </p>
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="applied-jobs">
          <p className="mb-2 font-mono text-[13px] tracking-[.12em] uppercase text-brand">
            Applications
          </p>
          <h2
            id="applied-jobs"
            className="mb-5 text-3xl font-light tracking-[-0.03em] text-ink"
          >
            Seats you’ve <b className="font-bold">asked for</b>
          </h2>
          <AppliedJobTable />
        </section>
      </main>
      <Footer />
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
