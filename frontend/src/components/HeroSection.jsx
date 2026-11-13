import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import SeatIllustration from './SeatIllustration';
import ChairIcon from './ChairIcon';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = e => {
    e.preventDefault();
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 flex flex-wrap items-center gap-10">
      <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-5">
        <h1 className="text-5xl sm:text-6xl leading-[1.05] font-light tracking-[-0.035em] text-ink">
          There’s a <span className="font-bold text-brand">seat</span>
          <br />
          for you.
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-ink-muted">
          Teams across India are hiring. Every purple chair is an open
          position. Find yours and apply in one click.
        </p>

        <form
          role="search"
          onSubmit={searchJobHandler}
          className="flex flex-wrap gap-2.5 max-w-xl"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search jobs
          </label>
          <div className="flex-[1_1_260px] flex items-center gap-2.5 pl-4 pr-3 min-h-14 border-[1.5px] border-ink rounded-xl bg-white shadow-[0_4px_0_#141414]">
            <Search aria-hidden="true" className="w-5 h-5 text-ink-muted" />
            <input
              id="hero-search"
              type="text"
              value={query}
              placeholder="Job title, skill or company"
              onChange={e => setQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent outline-none text-base text-ink"
            />
          </div>
          <button
            type="submit"
            className="keycap-brand min-h-14 px-6 rounded-xl text-base font-bold"
          >
            Find my seat
          </button>
        </form>

        <p className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          <ChairIcon open className="w-[18px] h-[18px]" />
          purple chair = open position
        </p>
      </div>

      <div className="flex-[1_1_480px] min-w-0 relative">
        <SeatIllustration />
        <p
          aria-hidden="true"
          className="hidden sm:block absolute right-[2%] bottom-[2%] font-hand text-2xl text-brand -rotate-[4deg]"
        >
          ← this one’s yours?
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
