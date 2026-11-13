import ChairIcon from '../ChairIcon';

const ROLES = [
  ['student', 'Job seeker', 'I’m looking for a seat'],
  ['recruiter', 'Recruiter', 'I have seats to fill'],
];

// Two radio cards for the account type; name="role" so the forms' change handler works as before.
const RolePicker = ({ value, onChange }) => (
  <fieldset>
    <legend className="mb-2 text-sm font-semibold text-ink">I am a</legend>
    <div className="grid grid-cols-2 gap-3">
      {ROLES.map(([role, label, hint]) => (
        <label key={role} className="relative cursor-pointer">
          <input
            type="radio"
            name="role"
            value={role}
            checked={value === role}
            onChange={onChange}
            className="peer sr-only"
          />
          <span className="flex flex-col gap-1 h-full p-3.5 rounded-xl border-[1.5px] border-[#e4e4e4] bg-white transition hover:border-brand-soft peer-checked:border-brand peer-checked:bg-tint peer-checked:shadow-[0_3px_0_#4c1d95] peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-focus-visible:outline-offset-2">
            <span className="flex items-center gap-2 font-bold text-ink">
              <ChairIcon open={value === role} className="w-4 h-[18px]" />
              {label}
            </span>
            <span className="text-xs text-ink-muted">{hint}</span>
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);

export default RolePicker;
