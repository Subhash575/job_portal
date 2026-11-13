import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
  'FullStack Developer',
  'Frontend Developer',
  'Finance & Banking',
  'Telecommunications',
  'Consulting',
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = query => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <section
      aria-labelledby="browse-role"
      className="max-w-6xl mx-auto px-4 sm:px-6 pb-12"
    >
      <h2
        id="browse-role"
        className="mb-3.5 font-mono text-[13px] font-medium tracking-[.12em] uppercase text-brand"
      >
        Browse by role
      </h2>
      <div className="flex flex-wrap gap-3">
        {category.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => searchJobHandler(cat)}
            className="keycap min-h-12 px-4 rounded-xl font-semibold text-[15px] text-ink"
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryCarousel;
