import React, { useState } from 'react';
import PageHeader from '../shared/PageHeader';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState();
  const dispatch = useDispatch();
  const registerNewCompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <PageHeader eyebrow="New company" className="mb-2">
          Name your <b>company</b>
        </PageHeader>
        <p className="mb-8 text-ink-muted">
          This is how job seekers will see you. You can change it later.
        </p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company-name">Company name</Label>
          <Input
            id="company-name"
            type="text"
            placeholder="JobHunt, Microsoft etc."
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/companies')}
          >
            Cancel
          </Button>
          <Button onClick={registerNewCompany}>Continue</Button>
        </div>
      </main>
    </div>
  );
};

export default CompanyCreate;
