import React, { useEffect, useState } from 'react';
import AuthLayout from './AuthLayout';
import RolePicker from './RolePicker';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    file: '',
  });

  const { loading, user } = useSelector(store => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = e => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async e => {
    e.preventDefault();
    if (
      !input.fullname.trim() ||
      !input.email.trim() ||
      !input.phoneNumber.trim() ||
      !input.password.trim() ||
      !input.role.trim()
    ) {
      toast.error('Please fill all required fields!');
      return;
    }
    //Here we use formdata bcs we also send file from here.
    const formData = new FormData(); //formdata object
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('role', input.role);
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    dispatch(setLoading(false)); // Reset loading state on mount to prevent spinner bleed-over
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  return (
    <AuthLayout eyebrow="Join JobPortal" title={<>Pull up a <b>chair</b></>}>
      <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-name">Full name</Label>
            <Input
              id="signup-name"
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="Asha Rao"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-phone">Phone number</Label>
            <Input
              id="signup-phone"
              type="tel"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="98765 43210"
              autoComplete="tel"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Choose a password"
              autoComplete="new-password"
            />
          </div>
          <RolePicker value={input.role} onChange={changeEventHandler} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-photo">
              Profile photo <span className="font-normal text-ink-muted">(optional)</span>
            </Label>
            <Input
              id="signup-photo"
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
              className="cursor-pointer pt-2.5"
            />
          </div>
          {loading ? (
            <Button size="lg" className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" size="lg" className="w-full">
              Create account
            </Button>
          )}
          <p className="text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand hover:underline">
              Log in
            </Link>
          </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
