import React, { useEffect, useState } from 'react';
import PageHeader from '../shared/PageHeader';
import { Plus } from 'lucide-react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '../../hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '../../redux/jobSlice';

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [dispatch, input]); //admin we added dispatch in input
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <PageHeader eyebrow="Recruiter">
            Jobs you’ve <b>posted</b>
          </PageHeader>
          <Button onClick={() => navigate('/admin/jobs/create')}>
            <Plus /> Post a job
          </Button>
        </div>
        <label htmlFor="job-filter" className="sr-only">
          Filter jobs by company or role
        </label>
        <Input
          id="job-filter"
          className="mb-4 sm:max-w-xs"
          placeholder="Filter by company or role"
          onChange={e => setInput(e.target.value)}
        />
        <AdminJobsTable />
      </main>
    </div>
  );
};

export default AdminJobs;
