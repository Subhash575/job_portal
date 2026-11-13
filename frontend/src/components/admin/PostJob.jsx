import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import PageHeader from '../shared/PageHeader';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PostJob = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 0,
    companyId: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector(store => store.company);
  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = value => {
    const selectedCompany = companies.find(
      company => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <PageHeader eyebrow="Post a job" className="mb-8">
          Add a <b>purple chair</b>
        </PageHeader>
        <form
          onSubmit={submitHandler}
          className="p-6 sm:p-8 rounded-3xl border border-line bg-white"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="job-title">Title</Label>
              <Input
                id="job-title"
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                placeholder="Frontend Developer"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="job-description">Description</Label>
              <textarea
                id="job-description"
                name="description"
                rows={4}
                value={input.description}
                onChange={changeEventHandler}
                placeholder="What will this person do?"
                className="w-full rounded-xl border-[1.5px] border-[#e4e4e4] bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted-foreground focus-visible:border-ink focus-visible:shadow-[0_3px_0_#141414] focus-visible:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="job-requirements">Requirements</Label>
              <Input
                id="job-requirements"
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="React, Node.js, SQL (comma separated)"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="job-salary">Salary (LPA)</Label>
              <Input
                id="job-salary"
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="12"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="job-location">Location</Label>
              <Input
                id="job-location"
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Bengaluru"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="job-type">Job type</Label>
              <Input
                id="job-type"
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="Full-time"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="job-experience">Experience (years)</Label>
              <Input
                id="job-experience"
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="2"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="job-position">Open positions</Label>
              <Input
                id="job-position"
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                min="1"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="job-company">Company</Label>
              {companies.length > 0 ? (
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger
                    id="job-company"
                    className="w-full h-11 rounded-xl border-[1.5px] border-[#e4e4e4]"
                  >
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map(company => (
                        <SelectItem
                          key={company._id}
                          value={company?.name?.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-ink-muted">
                  Register a company first, then post jobs for it.
                </p>
              )}
            </div>
          </div>
          {loading ? (
            <Button size="lg" className="w-full mt-8" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" size="lg" className="w-full mt-8">
              Post job
            </Button>
          )}
        </form>
      </main>
    </div>
  );
};

export default PostJob;
