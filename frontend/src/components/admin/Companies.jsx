import React, { useEffect, useState } from 'react';
import PageHeader from '../shared/PageHeader';
import { Plus } from 'lucide-react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <PageHeader eyebrow="Recruiter">
            Your <b>companies</b>
          </PageHeader>
          <Button onClick={() => navigate('/admin/companies/create')}>
            <Plus /> New company
          </Button>
        </div>
        <label htmlFor="company-filter" className="sr-only">
          Filter companies by name
        </label>
        <Input
          id="company-filter"
          className="mb-4 sm:max-w-xs"
          placeholder="Filter by name"
          onChange={e => setInput(e.target.value)}
        />
        <CompaniesTable />
      </main>
    </div>
  );
};

export default Companies;
