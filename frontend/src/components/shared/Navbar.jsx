import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { LogOut, User2 } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';

const initials = name =>
  (name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const navClass = ({ isActive }) =>
  `px-3.5 py-2.5 rounded-lg text-[15px] ${
    isActive ? 'bg-tint text-brand font-bold' : 'text-ink font-semibold hover:bg-gray-50'
  }`;

/*Popover show after the login. */
export const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const links =
    user && user.role === 'recruiter'
      ? [
          { to: '/admin/companies', label: 'Companies' },
          { to: '/admin/jobs', label: 'Jobs' },
        ]
      : [
          { to: '/', label: 'Home', end: true },
          { to: '/jobs', label: 'Jobs' },
          { to: '/browse', label: 'Browse' },
        ];

  return (
    <header className="bg-white border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-4 sm:gap-6">
        <Link to="/" className="flex items-center gap-2.5 text-ink">
          <span className="keycap relative w-9 h-9 rounded-lg grid place-items-center font-mono text-sm">
            jp
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-brand-soft" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Job<span className="text-brand">Portal</span>
          </span>
          {user?.role === 'recruiter' && (
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-ink text-white">
              recruiter
            </span>
          )}
        </Link>

        <nav
          aria-label="Main"
          className="order-last w-full sm:order-none sm:w-auto flex flex-wrap gap-1 sm:flex-1"
        >
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {!user ? (
          <div className="ml-auto flex items-center gap-2.5">
            <Link
              to="/login"
              className="keycap min-h-11 inline-flex items-center px-4 rounded-xl font-semibold text-[15px] text-ink"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="keycap-brand min-h-11 inline-flex items-center px-4 rounded-xl font-bold text-[15px]"
            >
              Sign up
            </Link>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Open account menu"
                className="ml-auto rounded-full"
              >
                <Avatar className="w-11 h-11 cursor-pointer">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="" />
                  <AvatarFallback className="bg-lilac text-brand-ink font-extrabold">
                    {initials(user?.fullname)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-2xl">
              <div className="flex gap-4">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="" />
                  <AvatarFallback className="bg-lilac text-brand-ink font-extrabold">
                    {initials(user?.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold">{user?.fullname}</h4>
                  <p className="text-sm text-ink-muted">{user?.profile?.bio}</p>
                </div>
              </div>
              <div className="flex flex-col mt-3 gap-1 text-ink">
                {user && user.role === 'student' && (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 min-h-11 px-2 rounded-lg hover:bg-tint"
                  >
                    <User2 className="w-4 h-4" /> View profile
                  </Link>
                )}
                <Button
                  onClick={logoutHandler}
                  variant="ghost"
                  className="justify-start gap-2 min-h-11 px-2 rounded-lg hover:bg-tint font-normal text-base"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
};

export default Navbar;
