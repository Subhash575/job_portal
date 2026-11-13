import React, { useEffect } from 'react';
import PageHeader from '../shared/PageHeader';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector(store => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        dispatch(setAllApplicants(res.data.job));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllApplicants();
  }, []);
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <PageHeader eyebrow="Applicants" className="mb-2">
          People who want <b>this seat</b>
        </PageHeader>
        <p className="mb-6 font-mono text-xs text-ink-muted">
          {applicants?.applications?.length || 0} applied
          {applicants?.title && ` for ${applicants.title}`}
        </p>
        <ApplicantsTable />
      </main>
    </div>
  );
};

export default Applicants;
