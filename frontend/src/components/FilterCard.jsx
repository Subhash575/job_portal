import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { SALARY_RANGES } from '@/lib/utils';

const fitlerData = [
  {
    fitlerType: 'Location',
    array: [
      'Delhi NCR',
      'Bangalore',
      'Hyderabad',
      'Pune',
      'Mumbai',
      'Gurugram',
      'Chennai',
      'Noida',
      'Kolkata',
      'Ahmedabad',
      'Jaipur',
      'Chandigarh',
      'Indore',
      'Kochi',
      'Lucknow',
    ],
  },
  {
    fitlerType: 'Industry',
    array: [
      'Frontend Developer',
      'Backend Developer',
      'FullStack Developer',
      'Information Technology (IT)',
      'Finance & Banking',
      'Healthcare & Pharmaceuticals',
      'Education & Training',
      'E-commerce & Retail',
      'Manufacturing',
      'Telecommunications',
      'Media & Entertainment',
      'Marketing & Advertising',
      'Consulting',
    ],
  },
  {
    fitlerType: 'Salary',
    array: Object.keys(SALARY_RANGES),
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [dispatch, selectedValue]);
  return (
    <div className="w-full flex flex-col gap-5 p-5 rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-lg text-ink">Filter jobs</h2>
        {selectedValue && (
          <button
            type="button"
            onClick={() => setSelectedValue('')}
            className="font-mono text-xs text-brand hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {fitlerData.map(data => (
        <fieldset key={data.fitlerType} className="min-w-0">
          <legend className="mb-2.5 font-mono text-xs tracking-[.1em] uppercase text-ink-muted">
            {data.fitlerType}
          </legend>
          {/* One scrolling row per group on phones, wrapped chips on wide screens */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
            {data.array.map(item => (
              <label key={item} className="relative shrink-0 cursor-pointer">
                <input
                  type="radio"
                  name="job-filter"
                  value={item}
                  checked={selectedValue === item}
                  onChange={() => setSelectedValue(item)}
                  className="peer sr-only"
                />
                <span className="block px-3 py-1.5 rounded-full border border-line text-sm text-ink whitespace-nowrap transition hover:border-brand-soft peer-checked:bg-brand peer-checked:border-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-focus-visible:outline-offset-2">
                  {item.trim()}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
};

export default FilterCard;
