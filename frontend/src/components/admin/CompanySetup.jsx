import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import PageHeader from '../shared/PageHeader';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    file: null,
  });
  const { singleCompany } = useSelector(store => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = e => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('description', input.description);
    formData.append('website', input.website);
    formData.append('location', input.location);
    if (input.file) {
      formData.append('file', input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/companies');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInput({
      name: singleCompany?.name || '',
      description: singleCompany?.description || '',
      website: singleCompany?.website || '',
      location: singleCompany?.location || '',
      file: singleCompany?.file || null,
    });
  }, [singleCompany]);

  return (
    <div>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/companies')}
          className="mb-4 -ml-2 font-mono text-xs text-ink-muted"
        >
          <ArrowLeft /> Companies
        </Button>
        <PageHeader eyebrow="Company setup" className="mb-8">
          Tell seekers about <b>your team</b>
        </PageHeader>
        <form
          onSubmit={submitHandler}
          className="p-6 sm:p-8 rounded-3xl border border-line bg-white"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="company-name">Company name</Label>
              <Input
                id="company-name"
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="company-location">Location</Label>
              <Input
                id="company-location"
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Bengaluru"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                type="url"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                placeholder="https://"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="company-description">Description</Label>
              <Input
                id="company-description"
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="What does your team build?"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="company-logo">Logo</Label>
              <Input
                id="company-logo"
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="cursor-pointer pt-2.5"
              />
            </div>
          </div>
          {loading ? (
            <Button size="lg" className="w-full mt-8" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" size="lg" className="w-full mt-8">
              Save company
            </Button>
          )}
        </form>
      </main>
    </div>
  );
};

export default CompanySetup;
