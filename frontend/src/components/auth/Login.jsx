import React, { useEffect, useState } from 'react';
import AuthLayout from './AuthLayout';
import RolePicker from './RolePicker';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
    role: '',
  });

  const { loading, user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async e => {
    e.preventDefault();
    //Here we use formdata bcs we also send file from here.

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate('/');
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
    <AuthLayout eyebrow="Welcome back" title={<>Log in to your <b>seat</b></>}>
      <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>
          <RolePicker value={input.role} onChange={changeEventHandler} />
          {loading ? (
            <Button size="lg" className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" size="lg" className="w-full">
              Log in
            </Button>
          )}
          <p className="text-sm text-ink-muted">
            New here?{' '}
            <Link to="/signup" className="font-bold text-brand hover:underline">
              Create an account
            </Link>
          </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
